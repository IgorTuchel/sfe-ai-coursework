import PanelToggle from "../ClosePanel";

export default function SidebarHeader({ isOpen, setIsOpen }) {
  return (
    <>
      <div className="flex flex-row items-center justify-between p-4">
        <div className="flex flex-row items-center gap-3">
          <img
            src="https://bournemouth-uni-software-engineering-coursework.s3.eu-north-1.amazonaws.com/logo-icon.png"
            alt="History.Ai Logo"
            className="object-contain w-12 h-12"
          />
          <div className="flex flex-col">
            <h2 className="font-bold text-2xl leading-tight">History.ai</h2>
            <span className="text-xs opacity-70">
              Talk to historical legends
            </span>
          </div>
        </div>
        <div className="flex items-center md:hidden">
          <PanelToggle isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </div>
      <hr className="mb-4 w-full border-white/10" aria-hidden="true" />
    </>
  );
}
