import { useState, useEffect } from "react";
import { LuDatabase, LuPlus, LuTrash, LuSave, LuX } from "react-icons/lu";
import toast from "react-hot-toast";
import { getCharacterVectorData } from "../services/getCharacterVectorData";
import { createCharacterVectorData } from "../services/createCharacterVectorData";
import { updateCharacterVectorData } from "../services/UpdateCharacterVectorData";
import { deleteCharacterVectorData } from "../services/deleteCharacterVectorData";

export default function VectorStoreManager({ characterId }) {
  const [vectors, setVectors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newVectorText, setNewVectorText] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const MAX_CHARS = 512;

  useEffect(() => {
    if (!characterId) return;

    async function fetchData() {
      setLoading(true);
      try {
        const response = await getCharacterVectorData(characterId);
        console.log("Fetched vectors:", response);
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

  const handleDelete = async (id) => {
    const previousVectors = [...vectors];

    try {
      const res = await deleteCharacterVectorData(characterId, id);
      if (res.success) {
        setVectors(vectors.filter((v) => v._id !== id));
        toast.success("Memory deleted.");
        return;
      }
      toast.error("Could not delete memory: " + (res.error || "Unknown error"));
    } catch (error) {
      setVectors(previousVectors);
      toast.error("Could not delete memory: " + error.message);
    }
  };

  const handleAdd = async () => {
    if (!newVectorText.trim()) return;

    setIsAdding(true);
    try {
      const response = await createCharacterVectorData(characterId, [
        newVectorText,
      ]);

      if (response.success) {
        const newItems = response.data.data;
        setVectors((prev) => [...prev, ...newItems]);
        setNewVectorText("");
        toast.success("Memory added.");
      }
    } catch (error) {
      toast.error("Failed to add memory: " + error.message);
    }
    setIsAdding(false);
  };

  const startEditing = (vector) => {
    setEditingId(vector._id);
    setEditText(vector.text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    const previousVectors = [...vectors];
    setEditingId(null);
    setVectors(
      vectors.map((v) => (v._id === id ? { ...v, text: editText } : v))
    );
    try {
      const response = await updateCharacterVectorData(
        characterId,
        id,
        editText
      );
      if (response.success) {
        toast.success("Memory updated.");
      }
    } catch (error) {
      setVectors(previousVectors);
      toast.error("Failed to update memory." + error.message);
    }
  };

  return (
    <div className="card w-full bg-base-700 border border-base-600 shadow-lg mt-6">
      <div className="card-body p-6">
        <div className="flex items-center gap-2 mb-4">
          <LuDatabase className="w-6 h-6 text-secondary" />
          <h2 className="text-xl font-bold text-white">Knowledge Base (RAG)</h2>
        </div>

        <p className="text-sm text-base-content/70 mb-6">
          Add specific facts, history, or memories here. The AI will search
          these snippets to answer relevant questions accurately.
        </p>

        {/*ad new vector here */}
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              className="input input-bordered  input-primary bg-base-900 border-base-600 w-full focus:border-primary focus:outline-none caret-primary"
              placeholder="e.g. 'Han Xiao prefers mechanical style combat...'"
              value={newVectorText}
              onChange={(e) => setNewVectorText(e.target.value)}
              disabled={isAdding}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              maxLength={MAX_CHARS}
            />
            <button
              className="btn btn-primary bg-primary-700 sm:w-auto w-full"
              onClick={handleAdd}
              disabled={isAdding || !newVectorText.trim()}>
              {isAdding ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <LuPlus className="w-5 h-5" />
              )}
              Add Memory
            </button>
          </div>
          <div className="text-right text-xs text-base-content/40 px-1">
            {newVectorText.length}/{MAX_CHARS}
          </div>
        </div>

        {/* Vectors loaded here */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-dots loading-lg text-base-content/30"></span>
            </div>
          ) : vectors.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-base-600 rounded-xl text-base-content/40 italic">
              No memories found. Add some facts to get started.
            </div>
          ) : (
            vectors.map((vector) => (
              <div
                key={vector._id}
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-base-900 rounded-xl border border-transparent hover:border-base-600 transition-all">
                {editingId === vector._id ? (
                  // EDIT MODE
                  <div className="flex-1 w-full flex flex-col gap-2">
                    <div className="flex gap-2">
                      <input
                        className="input input-sm input-primary input-bordered w-full"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        autoFocus
                        maxLength={MAX_CHARS}
                      />
                      <button
                        onClick={() => saveEdit(vector._id)}
                        className="btn btn-sm btn-success btn-square">
                        <LuSave />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="btn btn-sm btn-ghost btn-square">
                        <LuX />
                      </button>
                    </div>
                    <div className="text-right text-xs text-base-content/40 px-1">
                      {editText.length}/{MAX_CHARS}
                    </div>
                  </div>
                ) : (
                  // VIEW MODE
                  <>
                    <div className="flex-1 text-sm text-base-content/90 font-medium break-words">
                      {vector.text}
                    </div>
                    <div className="flex items-center gap-2 opacity-100  group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEditing(vector)}
                        className="btn btn-ghost bg-transparent hover:border-primary btn-sm text-info">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(vector._id)}
                        className="btn btn-ghost bg-transparent hover:border-error btn-sm text-error">
                        <LuTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
