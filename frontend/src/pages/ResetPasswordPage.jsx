import { resetPassword } from "../services/resetPasswordService";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import { LuEye, LuEyeClosed, LuKeyRound } from "react-icons/lu";
import { PasswordRequirements } from "../components/PasswordRequirements.jsx";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (password !== confirmPassword) {
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
              New Password
            </h2>
            <p className="text-center text-white mb-6">
              Enter your new password below to reset your password.
            </p>

            <form className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-primary">
                    Password
                  </span>
                </label>
                <div className="w-full justify-between flex">
                  <label className="input input-bordered w-full rounded-2xl mt-2 flex items-center gap-2 focus-within:input-primary bg-base-700">
                    <LuKeyRound className="h-[1em] opacity-75" />
                    <input
                      placeholder="••••••••"
                      required
                      className="grow text-white placeholder:text-gray-500 bg-transparent outline-none border-none"
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      aria-label="Password Input"
                      type={showPassword ? "text" : "password"}
                    />
                    <div
                      onClick={() => setShowPassword(!showPassword)}
                      className="cursor-pointer">
                      {showPassword ? (
                        <LuEyeClosed
                          className="opacity-75 h-[1em]"
                          aria-label="Show Password"
                        />
                      ) : (
                        <LuEye
                          className="opacity-75 h-[1em]"
                          aria-label="Hide Password"
                        />
                      )}
                    </div>
                  </label>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-primary">
                    Confirm Password
                  </span>
                </label>
                <div className="w-full justify-between flex">
                  <label className="input input-bordered w-full rounded-2xl mt-2 flex items-center gap-2 focus-within:input-primary bg-base-700">
                    <LuKeyRound className="h-[1em] opacity-75" />
                    <input
                      placeholder="••••••••"
                      required
                      className="grow text-white placeholder:text-gray-500 bg-transparent outline-none border-none"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      aria-label="Confirm Password Input"
                      type={showConfirmPassword ? "text" : "password"}
                    />
                    <div
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="cursor-pointer">
                      {showConfirmPassword ? (
                        <LuEyeClosed
                          className="opacity-75 h-[1em]"
                          aria-label="Show Confirmed Password"
                        />
                      ) : (
                        <LuEye
                          className="opacity-75 h-[1em]"
                          aria-label="Hide Confirmed Password"
                        />
                      )}
                    </div>
                  </label>
                </div>
                <PasswordRequirements
                  password={password}
                  setValidPassword={setValidPassword}
                />
              </div>

              <div className="form-control mt-6">
                <button
                  className="btn btn-primary bg-primary rounded-2xl text-primary-100 border-0 w-full text-lg shadow-lg shadow-primary/20"
                  onClick={handleSubmit}
                  disabled={loading}
                  aria-label="Reset Button">
                  Reset Password
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
