import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import { resetPassword } from "../services/resetPasswordService";
import PasswordInput from "../components/forms/PasswordInput.jsx";
import { validatePasswordMatch } from "../utils/validation.js";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validPassword) {
      toast.error("Password does not meet the requirements.");
      return;
    }

    if (!validatePasswordMatch(password, confirmPassword)) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    const res = await resetPassword(token, password);
    if (!res.success) {
      toast.error(res.message || "Failed to reset password. Please try again.");
      setLoading(false);
      return;
    }
    setLoading(false);
    toast.success("Password has been reset successfully. You can now log in.");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md rounded-4xl">
        <div className="card-body text-primary">
          <img
            src="../../public/logo-icon.png"
            alt="History.Ai Logo"
            className="mx-auto h-16"
          />
          <h2 className="card-title text-primary-500 text-2xl text-center justify-center mb-2">
            New Password
          </h2>
          <p className="text-center text-white mb-6">
            Enter your new password below to reset your password.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <PasswordInput
              value={password}
              onChange={setPassword}
              disabled={loading}
              label="Password"
              showRequirements
              onValidityChange={setValidPassword}
              autoComplete="new-password"
            />

            <PasswordInput
              value={confirmPassword}
              onChange={setConfirmPassword}
              disabled={loading}
              label="Confirm Password"
              autoComplete="new-password"
            />

            <div className="form-control mt-6">
              <button
                className="btn btn-primary bg-primary rounded-2xl text-base-100 hover:bg-primary-600 border-0 w-full text-lg shadow-lg shadow-primary/20"
                type="submit"
                disabled={loading}
                aria-label="Reset Button">
                Reset Password
              </button>
            </div>
          </form>

          <div className="divider divider-primary text-white my-6">Return</div>

          <div className="text-center">
            <Link to="/login" className="link link-primary mx-5 font-semibold">
              Login
            </Link>
            <Link to="/" className="link link-primary mx-5 font-semibold">
              Home Page
            </Link>
            <Link to="/signup" className="link link-primary mx-5 font-semibold">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
