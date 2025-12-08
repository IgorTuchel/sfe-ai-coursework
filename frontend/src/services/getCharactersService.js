import api from "../lib/api.js";

export const getCharacters = async () => {
  try {
    const res = await api.get("/characters");
    return {
      success: true,
      data: res.data.characters,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
