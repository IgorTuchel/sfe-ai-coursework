import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { signUp } from "../services/signUpUserService";
import EmailInput from "../components/forms/EmailInput.jsx";
import PasswordInput from "../components/forms/PasswordInput.jsx";
import { validateEmail } from "../utils/validation.js";
import UsernameInput from "../components/forms/UsernameInput.jsx";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);

  const { loading, isAuthenticated, setIsAuthenticated, setLoading, setUser } =
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

    setLoading(true);
    const res = await signUp(username, email, password);
    if (!res.success) {
      toast.error(res.message || "Signup failed. Please try again.");
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
    toast.success(`Successfully Signed Up! ${res.data.username}`);
    navigate("/dashboard", { replace: true });
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
            Hello There!
          </h2>
          <p className="text-center text-white mb-6">
            Create your History.ai account below.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <UsernameInput
              value={username}
              onChange={setUsername}
              disabled={loading}
            />

            <EmailInput value={email} onChange={setEmail} disabled={loading} />

            <PasswordInput
              value={password}
              onChange={setPassword}
              disabled={loading}
              showRequirements
              onValidityChange={setValidPassword}
              autoComplete="new-password"
            />

            <div className="form-control mt-6">
              <button
                className="btn btn-primary bg-primary rounded-2xl text-base-100 hover:bg-primary-600 border-0 w-full text-lg shadow-lg shadow-primary/20"
                type="submit"
                disabled={loading}
                aria-label="Sign up Button">
                Sign Up
              </button>
            </div>
          </form>

          <div className="divider divider-primary text-white my-6">OR</div>

          <div className="text-center space-x-2">
            <span className="text-base-content/70">
              Already have an account?
            </span>
            <Link to="/login" className="link link-primary font-semibold">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
