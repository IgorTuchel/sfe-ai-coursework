import api from "../lib/api";

export const createCharacterVectorData = async (characterID, dataArray) => {
  try {
    const res = await api.post(`/characters/${characterID}/data`, {
      dataArray,
    });
    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};
