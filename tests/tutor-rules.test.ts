import { before, after, beforeEach, test } from "node:test";
import { readFileSync } from "node:fs";
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
let env: RulesTestEnvironment;
const profile = (uid: string, authorized = false) => ({
  uid,
  name: uid,
  dogName: "Biscoito",
  dogBreed: "SRD",
  dogAge: "2 anos",
  focusArea: "",
  nextConsult: "",
  consultProgress: 0,
  xpPoints: 0,
  streakCount: 0,
  unlockedBadges: [],
  isAuthorized: authorized,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});
const client = (uid: string, verified = true, email = `${uid}@example.com`) =>
  env
    .authenticatedContext(uid, { email, email_verified: verified })
    .firestore();
before(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-tutor-portal",
    firestore: {
      rules: readFileSync("firestore.rules", "utf8"),
      host: "127.0.0.1",
      port: 8080,
    },
  });
});
after(async () => {
  await env.cleanup();
});
beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (ctx) => {
    for (const uid of ["alice", "bob", "erico"])
      await setDoc(doc(ctx.firestore(), "users", uid), profile(uid));
  });
});
test("free registration works, self-granted individual access is rejected", async () => {
  await assertSucceeds(
    setDoc(doc(client("newbie", false), "users", "newbie"), profile("newbie")),
  );
  await assertFails(
    setDoc(
      doc(client("intruder"), "users", "intruder"),
      profile("intruder", true),
    ),
  );
  await assertFails(
    updateDoc(doc(client("alice"), "users", "alice"), {
      isAuthorized: true,
      updatedAt: serverTimestamp(),
    }),
  );
  await assertSucceeds(
    updateDoc(doc(client("alice"), "users", "alice"), {
      dogName: "Nina",
      updatedAt: serverTimestamp(),
    }),
  );
});
test("private profiles, consultations and diaries are isolated", async () => {
  await env.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), "users/alice/consultations/one"), {
      tutorId: "alice",
    });
  });
  await assertFails(getDoc(doc(client("bob"), "users", "alice")));
  await assertFails(
    getDoc(doc(client("bob"), "users/alice/consultations/one")),
  );
  await assertSucceeds(
    getDoc(doc(client("alice"), "users/alice/consultations/one")),
  );
  await assertFails(
    setDoc(doc(client("alice"), "users/alice/consultations/self"), {
      tutorId: "alice",
    }),
  );
  const log = {
    id: "today",
    userId: "alice",
    date: "2026-11-20",
    emotion: "calmo",
    notes: "Pequena conquista.",
    createdAt: serverTimestamp(),
  };
  await assertSucceeds(
    setDoc(doc(client("alice"), "users/alice/logs/today"), log),
  );
  await assertFails(getDoc(doc(client("bob"), "users/alice/logs/today")));
});
test("free tutors can post and comment, unverified accounts and forged identities cannot", async () => {
  const post = {
    id: "one",
    authorId: "alice",
    author: "alice",
    dog: "Biscoito",
    topic: "passeios",
    content: "Nosso passeio hoje.",
    likes: 0,
    createdAt: serverTimestamp(),
  };
  await assertSucceeds(setDoc(doc(client("alice"), "forum_posts/one"), post));
  await assertSucceeds(getDoc(doc(client("bob"), "forum_posts/one")));
  await assertFails(
    setDoc(doc(client("bob"), "forum_posts/forged"), { ...post, id: "forged" }),
  );
  await assertFails(
    setDoc(doc(client("bob", false), "forum_posts/unverified"), {
      ...post,
      id: "unverified",
      authorId: "bob",
      author: "bob",
    }),
  );
  await assertSucceeds(
    setDoc(doc(client("bob"), "forum_posts/one/comments/a"), {
      authorId: "bob",
      author: "bob",
      text: "Que bom!",
      createdAt: serverTimestamp(),
    }),
  );
  await assertSucceeds(
    setDoc(doc(client("bob"), "forum_posts/one/likes/bob"), {
      uid: "bob",
      createdAt: serverTimestamp(),
    }),
  );
  await assertFails(
    setDoc(doc(client("bob"), "forum_posts/one/likes/alice"), {
      uid: "alice",
      createdAt: serverTimestamp(),
    }),
  );
});
test("private chat is gated by individual tutoring; educator role cannot be forged", async () => {
  const message = {
    id: "a",
    authorId: "alice",
    author: "alice",
    sender: "tutor",
    text: "Olá!",
    createdAt: serverTimestamp(),
  };
  await assertFails(
    setDoc(doc(client("alice"), "users/alice/messages/a"), message),
  );
  await assertSucceeds(
    updateDoc(
      doc(
        client("erico", true, "ericocavalheiro.psico@gmail.com"),
        "users/alice",
      ),
      { isAuthorized: true, updatedAt: serverTimestamp() },
    ),
  );
  await assertSucceeds(
    setDoc(doc(client("alice"), "users/alice/messages/a"), message),
  );
  await assertFails(
    setDoc(doc(client("alice"), "users/alice/messages/b"), {
      ...message,
      id: "b",
      sender: "erico",
    }),
  );
  await assertFails(getDoc(doc(client("bob"), "users/alice/messages/a")));
});
test("shared forums are open to verified tutors; avatar quota is server-only", async () => {
  const message = {
    id: "a",
    authorId: "alice",
    author: "alice",
    text: "Passeio tranquilo.",
    createdAt: serverTimestamp(),
  };
  await assertSucceeds(
    setDoc(doc(client("alice"), "tutor_rooms/passeios/messages/a"), message),
  );
  await assertFails(
    setDoc(doc(client("alice"), "tutor_rooms/secret/messages/a"), message),
  );
  await assertFails(
    setDoc(doc(client("alice"), "_avatar_quotas/alice_2026-11"), { used: 0 }),
  );
});
