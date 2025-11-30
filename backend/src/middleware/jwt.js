import pkg from "jsonwebtoken";
import cfg from "../config/config.js";

const { sign, verify } = pkg;

export async function makeJWT(userId) {
  const token = sign(
    {
      iss: cfg.jwtIss,
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + parseInt(cfg.jwtExpiresIn),
    },
    cfg.jwtSecret,
    { algorithm: "HS256" }
  );
  return token;
}

export async function verifyJWT(token) {
  let decoded;
  try {
    decoded = verify(token, cfg.jwtSecret, { algorithms: ["HS256"] });
  } catch (err) {
    return { success: false, error: "Invalid token" };
  }
  if (decoded.iss !== cfg.jwtIss) {
    return { success: false, error: "Invalid issuer" };
  }
  if (decoded.expresIn < Math.floor(Date.now() / 1000)) {
    return { success: false, error: "Token has expired" };
  }
  if (!decoded.sub) {
    return { success: false, error: "Invalid subject" };
  }
  return { success: true, userID: decoded.sub };
}
