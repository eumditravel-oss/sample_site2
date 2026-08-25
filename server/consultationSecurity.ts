/**
 * Password utilities for public, private consultation posts.
 * Passwords are stored only as salted scrypt hashes and are never returned to the client.
 */
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export function hashConsultationPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyConsultationPassword(password: string, encodedHash: string) {
  const [salt, savedHash] = encodedHash.split(":");
  if (!salt || !savedHash) return false;

  const candidateHash = scryptSync(password, salt, 64).toString("hex");
  const saved = Buffer.from(savedHash, "hex");
  const candidate = Buffer.from(candidateHash, "hex");
  return saved.length === candidate.length && timingSafeEqual(saved, candidate);
}
