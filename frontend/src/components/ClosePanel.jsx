import { LuPanelLeftOpen, LuPanelLeftClose } from "react-icons/lu";

export default function PanelToggle({ isOpen, setIsOpen }) {
  return (
    <button
      type="button"
      className="btn btn-ghost btn-circle btn-sm input-bordered hover:bg-base-50/20 hover:p-1 focus-within:border-primary focus:border-primary focus:border-2 focus:p-1  focus:outline-none"
      onClick={() => setIsOpen(!isOpen)}>
      {isOpen ? (
        <LuPanelLeftClose className="w-6 h-6" />
      ) : (
        <LuPanelLeftOpen className="w-6 h-6" />
      )}
    </button>
  );
}
