import { useState } from "react";
import { LuDatabase, LuPlus, LuTrash, LuSave, LuX } from "react-icons/lu";
import { useVectorStore } from "../hooks/useVectorStore";

const MAX_CHARS = 512;

export default function VectorStoreManager({ characterId }) {
  const { vectors, loading, addVector, updateVector, deleteVector } =
    useVectorStore(characterId);

  const [isAdding, setIsAdding] = useState(false);
  const [newVectorText, setNewVectorText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const handleAdd = async () => {
    if (!newVectorText.trim()) return;

    setIsAdding(true);
    const success = await addVector(newVectorText);
    if (success) {
      setNewVectorText("");
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
    setEditingId(null);
    await updateVector(id, editText);
  };

  return (
    <div className="card w-full bg-base-700 border border-base-600 shadow-lg mt-6">
      <div className="card-body p-6">
        <div className="flex items-center gap-2 mb-4">
          <LuDatabase className="w-6 h-6 text-secondary" aria-hidden="true" />
          <h2 className="text-xl font-bold text-white">Knowledge Base (RAG)</h2>
        </div>

        <p className="text-sm text-base-content/70 mb-6">
          Add specific facts, history, or memories here. The AI will search
          these snippets to answer relevant questions accurately.
        </p>

        {/* Add new vector */}
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              className="input input-bordered input-primary bg-base-900 border-base-600 w-full focus:border-primary focus:outline-none caret-primary"
              placeholder="e.g. 'Han Xiao prefers mechanical style combat...'"
              value={newVectorText}
              onChange={(e) => setNewVectorText(e.target.value)}
              disabled={isAdding}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              maxLength={MAX_CHARS}
              aria-label="New memory text"
            />
            <button
              className="btn btn-primary bg-primary-700 sm:w-auto w-full"
              onClick={handleAdd}
              disabled={isAdding || !newVectorText.trim()}
              aria-label="Add memory">
              {isAdding ? (
                <span
                  className="loading loading-spinner loading-xs"
                  aria-hidden="true"></span>
              ) : (
                <LuPlus className="w-5 h-5" aria-hidden="true" />
              )}
              Add Memory
            </button>
          </div>
          <div
            className="text-right text-xs text-base-content/40 px-1"
            aria-live="polite">
            {newVectorText.length}/{MAX_CHARS}
          </div>
        </div>

        {/* Vectors list */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-8">
              <span
                className="loading loading-dots loading-lg text-base-content/30"
                aria-hidden="true"></span>
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
                        aria-label="Edit memory text"
                      />
                      <button
                        onClick={() => saveEdit(vector._id)}
                        className="btn btn-sm btn-success btn-square"
                        aria-label="Save changes">
                        <LuSave aria-hidden="true" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="btn btn-sm btn-ghost btn-square"
                        aria-label="Cancel editing">
                        <LuX aria-hidden="true" />
                      </button>
                    </div>
                    <div
                      className="text-right text-xs text-base-content/40 px-1"
                      aria-live="polite">
                      {editText.length}/{MAX_CHARS}
                    </div>
                  </div>
                ) : (
                  // VIEW MODE
                  <>
                    <div className="flex-1 text-sm text-base-content/90 font-medium break-words">
                      {vector.text}
                    </div>
                    <div className="flex items-center gap-2 opacity-100 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEditing(vector)}
                        className="btn btn-ghost bg-transparent hover:border-primary btn-sm text-info"
                        aria-label="Edit memory">
                        Edit
                      </button>
                      <button
                        onClick={() => deleteVector(vector._id)}
                        className="btn btn-ghost bg-transparent hover:border-error btn-sm text-error"
                        aria-label="Delete memory">
                        <LuTrash className="w-4 h-4" aria-hidden="true" />
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
