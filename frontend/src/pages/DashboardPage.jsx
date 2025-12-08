import {
  BrowserRouter,
  Outlet,
  Router,
  Routes,
  useNavigate,
} from "react-router";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(true);
  const { isAuthenticated, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error("Please log in to access the dashboard.");
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, loading]);

  if (loading && !isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div
        className={`flex flex-col w-screen md:w-72 ${
          isOpen ? "block" : "hidden"
        }`}>
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      <div className="flex flex-col w-full">
        <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="flex-1 overflow-hidden my-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
