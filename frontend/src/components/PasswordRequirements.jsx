import React from "react";
import { LuCheck } from "react-icons/lu";

export const PasswordRequirements = ({ password, setValidPassword }) => {
  const rules = [
    { label: "One uppercase letter", passed: /[A-Z]/.test(password) },
    { label: "One lowercase letter", passed: /[a-z]/.test(password) },
    { label: "One number", passed: /[0-9]/.test(password) },
    {
      label: "One special char (!@#...)",
      passed: /[!@#$%^&*(),.?:{}|<>]/.test(password),
    },
    { label: "No spaces", passed: !/\s/.test(password) && password.length > 0 },
  ];
  const passedCount = rules.filter((r) => r.passed).length;
  const isComplete = passedCount === rules.length;

  if (isComplete) {
    setValidPassword(true);
  }

  if (!password || password.length === 0) {
    setValidPassword(false);
    return null;
  }

  return (
    <div className="mt-2 p-3 bg-base rounded-lg text-xs transition-all duration-200 ease-in-out">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-white/70">Password Strength</span>
        <span className={isComplete ? "text-success font-bold" : "text-white"}>
          {passedCount} / {rules.length}
        </span>
      </div>
      <div className="w-full h-1 bg-white/75 rounded-full mb-3 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            isComplete ? "bg-success" : "bg-success/50"
          }`}
          style={{ width: `${(passedCount / rules.length) * 100}%` }}
        />
      </div>

      <ul className="space-y-1">
        {rules.map((rule, index) => (
          <li
            key={index}
            className={`flex items-center gap-2 transition-colors ${
              rule.passed ? "text-success" : "text-white/70"
            }`}>
            {rule.passed ? (
              <LuCheck className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <div className="w-3.5 h-3.5 rounded-full border border-white/70 shrink-0" />
            )}

            <span className={rule.passed ? "line-through opacity-70" : ""}>
              {rule.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
