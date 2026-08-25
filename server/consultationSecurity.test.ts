import { describe, expect, it } from "vitest";
import { hashConsultationPassword, verifyConsultationPassword } from "./consultationSecurity";

describe("consultation password security", () => {
  it("stores only a salted hash and validates the original password", () => {
    const hash = hashConsultationPassword("consultation-1234");
    expect(hash).not.toContain("consultation-1234");
    expect(verifyConsultationPassword("consultation-1234", hash)).toBe(true);
    expect(verifyConsultationPassword("incorrect-password", hash)).toBe(false);
  });
});
