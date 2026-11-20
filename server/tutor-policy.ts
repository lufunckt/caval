export const EDUCATOR_EMAIL = "ericocavalheiro.psico@gmail.com";
export function educator(token: { email?: string; email_verified?: boolean }) {
  return token.email_verified === true && token.email === EDUCATOR_EMAIL;
}
export function canJoin(
  token: { uid: string; email?: string; email_verified?: boolean },
  tutorId: string,
  session: {
    tutorId: string;
    startsAt: number;
    duration: number;
    status: string;
  },
  now = Date.now(),
) {
  return (
    token.email_verified === true &&
    (token.uid === tutorId || educator(token)) &&
    session.tutorId === tutorId &&
    session.status === "scheduled" &&
    Number.isFinite(session.startsAt) &&
    session.duration >= 15 &&
    session.duration <= 120 &&
    now >= session.startsAt - 15 * 60000 &&
    now <= session.startsAt + (session.duration + 30) * 60000
  );
}
export function safePhoto(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 260000) return false;
  const m = value.match(
    /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+=*)$/,
  );
  if (!m) return false;
  const data = Buffer.from(m[2], "base64");
  return (
    (m[1] === "jpeg" &&
      data[0] === 255 &&
      data[1] === 216 &&
      data[2] === 255) ||
    (m[1] === "png" &&
      data
        .subarray(0, 8)
        .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) ||
    (m[1] === "webp" &&
      data.toString("ascii", 0, 4) === "RIFF" &&
      data.toString("ascii", 8, 12) === "WEBP")
  );
}
