import api from "../lib/api";

export const getCharacterVectorData = async (characterID) => {
  try {
    const response = await api.get(`/characters/${characterID}/data`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};
