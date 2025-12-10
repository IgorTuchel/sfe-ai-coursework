import { useContext } from "react";
import { Link } from "react-router";
import { AuthContext } from "../context/AuthContext.jsx";
import { useState } from "react";
import MfaModel from "../components/MfaModal.jsx";
import toast, { Toaster } from "react-hot-toast";
import { login } from "../services/loginUserService.js";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import {
  LuEye,
  LuEyeClosed,
  LuKeyRound,
  LuLock,
  LuMail,
  LuUser,
} from "react-icons/lu";
import { PasswordRequirements } from "../components/PasswordRequirements.jsx";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { loading, isAuthenticated, setIsAuthenticated, setUser, setLoading } =
    useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(email) === false) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (validPassword === false) {
      toast.error(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }
    await loginFlow();
  };

  const loginFlow = async (code) => {
    setLoading(true);
    console.log("Starting login flow...");
    const res = await login(email, password, rememberMe, code || "");
    if (res.mfaRequired) {
      toast.success("MFA code required. Please enter your code.");
      setShowMfaModal(true);
      setLoading(false);
      return;
    }
    if (!res.success) {
      toast.error(res.message || "Login failed. Please try again.");
      setLoading(false);
      return;
    }
    setLoading(false);
    setIsAuthenticated(true);
    setUser({
      userID: res.data.userID,
      email: res.data.email,
      username: res.data.username,
      mfaEnabled: res.data.mfaEnabled,
      role: res.data.role,
      createdAt: res.data.createdAt,
    });
    toast.success("Successfully logged in!");
    navigate("/dashboard", { replace: true });
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4">
        <MfaModel
          showMfaModal={showMfaModal}
          closeMfaModal={() => setShowMfaModal(false)}
          loading={loading}
          onSubmit={loginFlow}
          hidden={!showMfaModal}
        />
        <div className="card w-full max-w-md rounded-4xl">
          <div className="card-body text-primary">
            <img
              src="../../public/logo-icon.png"
              alt="History.Ai Logo"
              className="mx-auto h-16"
            />
            <h2 className="card-title text-primary text-2xl  text-center justify-center mb-2">
              Welcome Back
            </h2>
            <p className="text-center text-white mb-6">
              Sign in to your History.ai account
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-primary">
                    Email
                  </span>
                </label>
                <div className="w-full justify-between flex">
                  <label className="input input-bordered w-full rounded-2xl mt-2 flex items-center gap-2 focus-within:input-primary bg-base-700">
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

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-primary">
                    Password
                  </span>
                </label>
                <div className="w-full justify-between flex">
                  <label className="input input-bordered w-full bg-base-700 rounded-2xl mt-2 flex items-center gap-2 focus-within:input-primary">
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
                <PasswordRequirements
                  password={password}
                  setValidPassword={setValidPassword}
                />
              </div>
              <div className="flex flex-row justify-between items-center w-full">
                <label className="label cursor-pointer flex items-center bg-base-700 gap-3 p-0">
                  <input
                    type="checkbox"
                    className="checkbox bg-base-100 checkbox-sm"
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                    aria-label="Remember Me"
                  />
                  <span className="label-text text-primary font-light">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/reset-password"
                  className="link link-hover label-text-alt text-primary font-light">
                  Forgot password?
                </Link>
              </div>

              <div className="form-control mt-6">
                <button
                  className="btn btn-primary bg-primary rounded-2xl text-primary-100 border-0 w-full text-lg shadow-lg shadow-primary/20"
                  type="submit"
                  disabled={loading}
                  aria-label="Login Button">
                  Login
                </button>
              </div>
            </form>

            <div className="divider divider-primary text-white my-6">OR</div>

            <div className="text-center">
              <span className="text-base-content/70">
                Don't have an account?{" "}
              </span>
              <Link to="/signup" className="link link-primary font-semibold">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
