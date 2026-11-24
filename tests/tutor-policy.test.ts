import test from "node:test";
import assert from "node:assert/strict";
import { canJoin, educator, safePhoto } from "../server/tutor-policy";
const start = Date.UTC(2026, 11, 2, 15);
const session = {
  tutorId: "alice",
  startsAt: start,
  duration: 60,
  status: "scheduled",
};
const tutor = {
  uid: "alice",
  email: "alice@example.com",
  email_verified: true,
};
test("only a verified educator gets admin permissions", () => {
  assert.equal(
    educator({
      email: "ericocavalheiro.psico@gmail.com",
      isAdmin: true,
      email_verified: false,
    }),
    false,
  );
  assert.equal(
    educator({
      email: "ericocavalheiro.psico@gmail.com",
      isAdmin: true,
      email_verified: true,
    }),
    true,
  );
});
test("an email alone never grants administrator privileges", () => {
  assert.equal(educator({ email: "ericocavalheiro.psico@gmail.com", email_verified: true }), false);
});

test("consultation access binds participant, status, verification and time window", () => {
  assert.equal(canJoin(tutor, "alice", session, start), true);
  assert.equal(
    canJoin({ ...tutor, uid: "mallory" }, "alice", session, start),
    false,
  );
  assert.equal(
    canJoin({ ...tutor, email_verified: false }, "alice", session, start),
    false,
  );
  assert.equal(
    canJoin(tutor, "alice", { ...session, tutorId: "bob" }, start),
    false,
  );
  assert.equal(
    canJoin(tutor, "alice", { ...session, status: "cancelled" }, start),
    false,
  );
  assert.equal(canJoin(tutor, "alice", session, start - 15 * 60000 - 1), false);
  assert.equal(canJoin(tutor, "alice", session, start - 15 * 60000), true);
  assert.equal(canJoin(tutor, "alice", session, start + 90 * 60000 + 1), false);
  assert.equal(
    canJoin(
      {
        uid: "educator",
        email: "ericocavalheiro.psico@gmail.com",
      isAdmin: true,
        email_verified: true,
      },
      "alice",
      session,
      start,
    ),
    true,
  );
});
test("photo input rejects spoofed MIME, active content and oversized data", () => {
  assert.equal(safePhoto("data:image/jpeg;base64,/9j/AA=="), true);
  assert.equal(safePhoto("data:image/jpeg;base64,PHNjcmlwdD4="), false);
  assert.equal(safePhoto("data:image/svg+xml;base64,PHN2Zz4="), false);
  assert.equal(safePhoto("https://example.com/dog.png"), false);
  assert.equal(
    safePhoto("data:image/jpeg;base64," + "A".repeat(260000)),
    false,
  );
});
