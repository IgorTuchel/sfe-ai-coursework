import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getCharacterVectorData } from "../services/getCharacterVectorData";
import { createCharacterVectorData } from "../services/createCharacterVectorData";
import { updateCharacterVectorData } from "../services/updateCharacterVectorData";
import { deleteCharacterVectorData } from "../services/deleteCharacterVectorData";

export function useVectorStore(characterId) {
  const [vectors, setVectors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!characterId) return;

    async function fetchData() {
      setLoading(true);
      try {
        const response = await getCharacterVectorData(characterId);
        if (response.data) {
          setVectors(response.data);
        } else {
          toast.error(
            "Failed to load knowledge base: " +
              (response.error || "Unknown error")
          );
        }
      } catch (error) {
        toast.error("Failed to load knowledge base: " + error.message);
      }
      setLoading(false);
    }
    fetchData();
  }, [characterId]);

  const addVector = async (text) => {
    try {
      const response = await createCharacterVectorData(characterId, [text]);
      if (response.success) {
        setVectors((prev) => [...prev, ...response.data.data]);
        toast.success("Memory added.");
        return true;
      }
      return false;
    } catch (error) {
      toast.error("Failed to add memory: " + error.message);
      return false;
    }
  };

  const updateVector = async (id, text) => {
    const previousVectors = [...vectors];
    setVectors(vectors.map((v) => (v._id === id ? { ...v, text } : v)));

    try {
      const response = await updateCharacterVectorData(characterId, id, text);
      if (response.success) {
        toast.success("Memory updated.");
        return true;
      }
      setVectors(previousVectors);
      return false;
    } catch (error) {
      setVectors(previousVectors);
      toast.error("Failed to update memory: " + error.message);
      return false;
    }
  };

  const deleteVector = async (id) => {
    const previousVectors = [...vectors];
    setVectors(vectors.filter((v) => v._id !== id));

    try {
      const res = await deleteCharacterVectorData(characterId, id);
      if (res.success) {
        toast.success("Memory deleted.");
        return true;
      }
      setVectors(previousVectors);
      toast.error("Could not delete memory: " + (res.error || "Unknown error"));
      return false;
    } catch (error) {
      setVectors(previousVectors);
      toast.error("Could not delete memory: " + error.message);
      return false;
    }
  };

  return { vectors, loading, addVector, updateVector, deleteVector };
}
