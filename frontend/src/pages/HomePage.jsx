import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuArrowRight, LuSparkles, LuLayoutDashboard } from "react-icons/lu";
import { AuthContext } from "../context/AuthContext";

export default function LandingPage() {
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const handleNavigation = (path) => {
    setIsNavigating(true);
    navigate(path);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-base-100">
      <div className="max-w-2xl w-full flex flex-col items-center gap-8">
        <div
          className={`flex flex-col items-center gap-4 transition-opacity duration-300 ${
            isNavigating ? "opacity-0" : "opacity-100"
          }`}>
          <div className="w-24 md:w-28 ">
            <img
              src="https://bournemouth-uni-software-engineering-coursework.s3.eu-north-1.amazonaws.com/logo-icon.png"
              alt="History AI logo"
            />
          </div>

          <div className="flex flex-col items-center gap-2">
            <h2 className="text-sm md:text-base font-bold tracking-[0.3em] uppercase text-base-content">
              History AI
            </h2>
            <p className="text-xs text-base-content/60">
              Talk with the minds that shaped our world
            </p>
          </div>
        </div>

        <h1 className="text-2xl md:text-4xl font-bold text-center leading-tight">
          Turn history into
          <span className="text-primary"> living conversations</span>
        </h1>

        <div className="w-full max-w-md">
          <ul className="space-y-3" role="list">
            <li className="flex items-start gap-3 text-sm md:text-base">
              <LuSparkles
                className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span className="text-base-content/80">
                Chat with curated historical personas, not generic bots
              </span>
            </li>
            <li className="flex items-start gap-3 text-sm md:text-base">
              <LuSparkles
                className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span className="text-base-content/80">
                Ask complex questions and get context-aware answers
              </span>
            </li>
            <li className="flex items-start gap-3 text-sm md:text-base">
              <LuSparkles
                className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span className="text-base-content/80">
                Built for curious minds and tech enthusiasts alike
              </span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-center gap-4 w-full max-w-md">
          {isAuthenticated ? (
            // Single Dashboard Button for Authenticated Users
            <button
              onClick={() => handleNavigation("/dashboard")}
              className="btn btn-primary btn-lg w-full max-w-xs gap-2 group bg-primary-700 border-primary-700 hover:bg-primary-800 hover:border-primary-800"
              aria-label="Go to dashboard">
              <LuLayoutDashboard className="w-5 h-5" aria-hidden="true" />
              Go to Dashboard
              <LuArrowRight
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </button>
          ) : (
            // Sign Up / Login Buttons for Unauthenticated Users
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={() => handleNavigation("/signup")}
                className="btn btn-primary flex-1 gap-2 group text-base-100"
                aria-label="Sign up for History AI">
                Start now
                <LuArrowRight
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </button>

              <button
                onClick={() => handleNavigation("/login")}
                className="btn btn-ghost flex-1 border border-base-content/20 hover:border-primary hover:bg-primary/10 "
                aria-label="Log in to your account">
                I have an account
              </button>
            </div>
          )}

          <p className="text-xs text-center text-base-content/50 max-w-sm">
            Made by Group 10
          </p>
        </div>
      </div>
    </div>
  );
}
