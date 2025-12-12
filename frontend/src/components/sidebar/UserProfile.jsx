import { useContext } from "react";
import { LuSettings2, LuUser, LuLogOut } from "react-icons/lu";
import toast from "react-hot-toast";
import { logout } from "../../services/logoutService";
import { AuthContext } from "../../context/AuthContext";

export default function UserProfile() {
  const { setIsAuthenticated, user } = useContext(AuthContext);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      toast.success("Logged out successfully.");
      setIsAuthenticated(false);
      return;
    }
    toast.error(result.message || "Logging out...");
  };

  const closeDropdown = () => {
    const elem = document.activeElement;
    if (elem) elem.blur();
  };

  return (
    <div className="p-4 mt-auto border-t border-white/10" id="user-profile">
      <div className="dropdown dropdown-top w-full">
        <div
          tabIndex={0}
          role="button"
          className="flex flex-row space-x-3 items-center hover:bg-base-600/50 transition-colors cursor-pointer p-2 rounded-lg w-full"
          aria-label="User profile menu">
          <div className="avatar">
            <div className="w-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                src="https://img.daisyui.com/images/profile/demo/batperson@192.webp"
                alt="User avatar"
              />
            </div>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-medium text-sm truncate max-w-[120px]">
              {user?.username || "Guest"}
            </span>
            <span className="text-xs text-white/70">
              Member Since{" "}
              <span className="font-semibold text-primary">
                {user?.createdAt?.slice(0, 4) || "2024"}
              </span>
            </span>
          </div>
          <LuSettings2
            className="ml-auto w-5 h-5 text-primary opacity-80"
            aria-hidden="true"
          />
        </div>

        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow-xl bg-base-100 rounded-box w-full mb-2 border border-base-content/10">
          <li>
            <a
              href="/dashboard/profile"
              onClick={closeDropdown}
              className="gap-3">
              <LuUser className="w-4 h-4" aria-hidden="true" />
              User Settings
            </a>
          </li>
          <div className="divider my-1" aria-hidden="true"></div>
          <li>
            <button
              onClick={handleLogout}
              className="btn btn-error bg-transparent text-error hover:text-error hover:bg-error/10">
              <LuLogOut className="w-4 h-4" aria-hidden="true" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
