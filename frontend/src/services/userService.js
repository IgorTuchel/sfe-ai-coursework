/**
 * @file userService.js
 * @description Service for user-related operations such as fetching current user data,
 * updating user profile, and logging in users with optional MFA support.
 * @module services/userService
 */

import api from "../lib/api";

export const getCurrentUser = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const updateUserProfile = async (userData) => {
  const response = await api.put("/users/profile", userData);
  return response.data;
};

export const loginUser = async (email, password, mfaCode = null) => {
  const response = await api.post("/users/login", { email, password, mfaCode });
  return response;
};
