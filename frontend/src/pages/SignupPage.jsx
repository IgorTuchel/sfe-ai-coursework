import { AuthContext } from "../context/AuthContext";
import { signUp } from "../services/signUpUserService";
import { useContext } from "react";
import { Link } from "react-router";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";
import { LuEye, LuEyeClosed, LuKeyRound, LuMail, LuUser } from "react-icons/lu";
import { PasswordRequirements } from "../components/PasswordRequirements.jsx";
import { useEffect } from "react";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
              Hello There!
            </h2>
            <p className="text-center text-white mb-6">
              Create your History.ai account below.
            </p>

            <form className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-primary">
                    Username
                  </span>
                </label>
                <div className="w-full justify-between flex">
                  <label className="input input-bordered w-full rounded-2xl mt-2 flex items-center gap-2 focus-within:input-primary bg-base-700">
                    <LuUser className="h-[1em] opacity-75" />
                    <input
                      placeholder="Your Username"
                      required
                      className="grow text-white placeholder:text-gray-500 bg-transparent outline-none border-none"
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={loading}
                      aria-label="Username Input"
                      type="text"
                    />
                  </label>
                </div>
              </div>
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
                  aria-label="Sign up Button">
                  Sign Up
                </button>
              </div>
            </form>

            <div className="divider divider-primary text-white my-6">OR</div>

            <div className="text-center">
              <span className="text-base-content/70">
                Already have an account?{" "}
              </span>
              <Link to="/login" className="link link-primary font-semibold">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
