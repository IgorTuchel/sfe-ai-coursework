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

export const getCharactersAdmin = async () => {
  try {
    const res = await api.get("/characters/all");
    return {
      success: true,
      data: res.data.characters,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.error ||
        "An error occurred while fetching characters.",
    };
  }
};
