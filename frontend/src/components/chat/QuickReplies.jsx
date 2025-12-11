export default function QuickReplies({ options, onSelect, disabled }) {
  if (!options || options.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-3 justify-end animate-fade-in-up">
      <span className="w-full text-right text-xs font-medium text-base-content/50 mb-1">
        Suggested Responses:
      </span>
      {options.map((option, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(option.nextNode)}
          disabled={disabled}
          className="btn btn-sm btn-outline rounded-xl transition-all shadow-sm border-2 font-normal normal-case 
                     border-(--theme-primary) text-(--theme-primary) 
                     hover:bg-(--theme-primary) hover:text-black
                     outline-none focus:ring-2 focus:ring-(--theme-primary)">
          {option.text}
        </button>
      ))}
    </div>
  );
}
