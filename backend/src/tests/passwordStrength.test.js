import { evaulatePassword } from "../utils/passwordStrength.js";

describe("Password Evaluation Logic", () => {
  // Test - length check
  test("Should fail if password is too short", () => {
    const result = evaulatePassword("Ab1!def"); // 7 chars
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("Password must be at least 8 characters long.");
  });

  // Test - uppercase check
  test("Should fail if missing uppercase letter", () => {
    const result = evaulatePassword("abc1234!");
    expect(result.valid).toBe(false);
    expect(result.reason).toBe(
      "Password must contain at least one uppercase letter."
    );
  });

  // Test - lowercase check
  test("Should fail if missing lowercase letter", () => {
    const result = evaulatePassword("ABC1234!");
    expect(result.valid).toBe(false);
    expect(result.reason).toBe(
      "Password must contain at least one lowercase letter."
    );
  });

  // Test - digit check
  test("Should fail if missing a digit", () => {
    const result = evaulatePassword("Abcdefg!");
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("Password must contain at least one digit.");
  });

  // test - special character check
  test("Should fail if missing a special character", () => {
    const result = evaulatePassword("Abc12345");
    expect(result.valid).toBe(false);
    expect(result.reason).toBe(
      "Password must contain at least one special character."
    );
  });

  // test - valid passwords
  test("Should pass valid complex passwords", () => {
    const validPasswords = [
      "Abc1234!", // Minimal valid
      "SuperS3cret#", // Standard valid
      "P@ssw0rd123", // Standard valid
      "VeryL0ngP@ssw0rdThatIsSecure", // Very long
    ];

    validPasswords.forEach((pw) => {
      const result = evaulatePassword(pw);
      expect(result.valid).toBe(true);
      expect(result.reason).toBe("Password meets the criteria.");
    });
  });

  // test - order of operations
  test("Should check order of operations (Length usually fails first)", () => {
    // This password fails EVERYTHING (no caps, no special, no numbers), but it is also too short. Length should be the returned reason.
    const result = evaulatePassword("abc");
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("Password must be at least 8 characters long.");
  });
});
