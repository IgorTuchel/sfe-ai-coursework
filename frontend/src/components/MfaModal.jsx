import { useState } from "react";

const MfaModal = ({ showMfaModal, onSubmit, loading, closeMfaModal }) => {
  const [mfaCode, setMfaCode] = useState("");

  if (!showMfaModal) return null;

  const handleSubmit = async () => {
    await onSubmit(mfaCode);
  };

  return (
    <div className="fixed inset-0 bg-base-100 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
        <h2 className="text-2xl font-bold mb-2 text-primary text-center">
          Enter 2FA Code
        </h2>
        <p className="text-sm mt-4 text-white/80 mb-4">
          An email with your 2FA code has been sent. Please enter the 6-digit
          code below to continue.
        </p>

        <input
          type="text"
          value={mfaCode}
          onChange={(e) =>
            setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          maxLength={6}
          className="input focus:input-primary input-bordered w-full text-center text-2xl tracking-widest mb-8 rounded-2xl"
          placeholder="000000"
          disabled={loading}
          aria-label="Enter 6-digit code"
        />

        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={loading || mfaCode.length !== 6}
            className="btn btn-primary flex-1">
            {loading ? "Submitting..." : "Verify"}
          </button>
          <button
            onClick={closeMfaModal}
            className="btn hover:bg-error/10 btn-outline flex-1">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MfaModal;
