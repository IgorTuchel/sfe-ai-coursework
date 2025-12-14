import { Link } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { sendResetPassword } from "../services/sendResetPasswordService";
import EmailInput from "../components/forms/EmailInput.jsx";
import { validateEmail } from "../utils/validation.js";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    const res = await sendResetPassword(email);
    if (!res.success) {
      toast.error(
        res.message || "Failed to send reset password email. Please try again."
      );
      setLoading(false);
      return;
    }
    toast.success(
      res.data.message || "Reset password email sent successfully!"
    );
    setLoading(false);
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
            Reset Password
          </h2>
          <p className="text-center text-white">
            Enter your email to reset your password, we'll send you a link.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <EmailInput value={email} onChange={setEmail} disabled={loading} />

            <div className="form-control mt-6">
              <button
                className="btn btn-primary bg-primary rounded-2xl text-base-100 hover:bg-primary-600 border-0 w-full text-lg shadow-lg shadow-primary/20"
                type="submit"
                disabled={loading}
                aria-label="Reset Button">
                Reset
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
