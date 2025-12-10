import api from "../lib/api";

export const updateCharacterVectorData = async (
  characterID,
  dataVectorStoreId,
  newText
) => {
  try {
    const res = await api.put(
      `/characters/${characterID}/data/${dataVectorStoreId}`,
      {
        dataArray: [newText],
      }
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
