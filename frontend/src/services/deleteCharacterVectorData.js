import api from "../lib/api";

export const deleteCharacterVectorData = async (
  characterID,
  dataVectorStoreId
) => {
  try {
    const res = await api.delete(
      `/characters/${characterID}/data/${dataVectorStoreId}`
    );
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
