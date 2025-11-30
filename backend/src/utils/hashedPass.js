import bcrypt from "bcrypt";

export async function hashPassword(password) {
  const saltRounds = 13;
  const hashedPass = await bcrypt.hash(password, saltRounds);
  return hashedPass;
}

export async function comparePassword(password, hashedPass) {
  return await bcrypt.compare(password, hashedPass);
}
