import api from "../lib/api.js";
export const getCharacter = async (characterID) => {
  try {
    const res = await api.get(`/characters/${characterID}`);
    return {
      success: true,
      data: res.data.character,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const getCharacterAdmin = async (characterID) => {
  try {
    const res = await api.get(`/characters/all/${characterID}`);
    return {
      success: true,
      data: res.data.character,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    };
  }
};
