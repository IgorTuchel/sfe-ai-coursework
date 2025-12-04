import { Link } from "react-router";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { LuMail } from "react-icons/lu";
import { sendResetPassword } from "../services/sendResetPasswordService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email) === false) {
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
    <>
      <Toaster />
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card w-full max-w-md rounded-4xl">
          <div className="card-body text-primary">
            <img
              src="../../public/logo-icon.png"
              alt="History.Ai Logo"
              className="mx-auto h-16"
            />
            <h2 className="card-title text-primary-500 text-2xl  text-center justify-center mb-2">
              Reset Password
            </h2>
            <p className="text-center text-white mb-6">
              Enter your email to reset your password, we'll send you a link.
            </p>

            <form className="space-y-4">
              <div className="form-control">
                <div className="w-full justify-between flex">
                  <label className="input input-bordered w-full rounded-2xl mt-2 flex items-center gap-2 focus-within:input-primary">
                    <LuMail className="h-[1em] opacity-75" />
                    <input
                      placeholder="me@proton.me"
                      required
                      className="grow text-white placeholder:text-gray-500 bg-transparent outline-none border-none"
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      aria-label="Email Input"
                      type="email"
                    />
                  </label>
                </div>
              </div>

              <div className="form-control mt-6">
                <button
                  className="btn btn-primary bg-primary rounded-2xl text-primary-100 border-0 w-full text-lg shadow-lg shadow-primary/20"
                  onClick={handleSubmit}
                  disabled={loading}
                  aria-label="Reset Button">
                  Reset
                </button>
              </div>
            </form>

            <div className="divider divider-primary text-white my-6">
              Return
            </div>

            <div className="text-center">
              <Link
                to="/login"
                className="link link-primary mx-5 font-semibold">
                Login
              </Link>
              <Link to="/" className="link link-primary mx-5 font-semibold">
                Home Page
              </Link>
              <Link
                to="/signup"
                className="link link-primary mx-5 font-semibold">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
