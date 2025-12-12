import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext.jsx";
import MfaModel from "../components/MfaModal.jsx";
import toast from "react-hot-toast";
import { login } from "../services/loginUserService.js";
import EmailInput from "../components/forms/EmailInput.jsx";
import PasswordInput from "../components/forms/PasswordInput.jsx";
import { validateEmail } from "../utils/validation.js";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showMfaModal, setShowMfaModal] = useState(false);

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

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!validPassword) {
      toast.error(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }
    await loginFlow();
  };

  const loginFlow = async (code) => {
    setLoading(true);
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
          <h2 className="card-title text-primary text-2xl text-center justify-center mb-2">
            Welcome Back
          </h2>
          <p className="text-center text-white mb-6">
            Sign in to your History.ai account
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <EmailInput value={email} onChange={setEmail} disabled={loading} />

            <PasswordInput
              value={password}
              onChange={setPassword}
              disabled={loading}
              showRequirements
              onValidityChange={setValidPassword}
            />

            <div className="flex flex-row justify-between items-center w-full">
              <label className="label cursor-pointer flex items-center bg-base-700 gap-3 p-0">
                <input
                  type="checkbox"
                  className="checkbox bg-base-100 checkbox-sm"
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                  aria-label="Remember me"
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
  );
}
