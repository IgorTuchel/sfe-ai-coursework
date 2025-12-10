import { hashPassword, comparePassword } from "../utils/hashedPass.js";

describe("Bcrypt Password Utilities", () => {
  const rawPassword = "MySecurePassword123!";

  // Test - hashing
  test("hashPassword should return a valid bcrypt hash string", async () => {
    const hash = await hashPassword(rawPassword);
    expect(typeof hash).toBe("string"); // Check that it's a string
    expect(hash).not.toBe(rawPassword); // Check that it's not the same as the raw password
    expect(hash).toMatch(/^\$2[abxy]\$.{56}$/); // Basic bcrypt hash format check
  });

  // Test - success for comparison
  test("comparePassword should return true for correct password", async () => {
    const hash = await hashPassword(rawPassword);
    const isMatch = await comparePassword(rawPassword, hash);

    expect(isMatch).toBe(true);
  });

  //  Test - failure for comparison
  test("comparePassword should return false for incorrect password", async () => {
    const hash = await hashPassword(rawPassword);
    const wrongPassword = "WrongPassword123";

    const isMatch = await comparePassword(wrongPassword, hash);
    expect(isMatch).toBe(false);
  });
});
