const EMOJIS = [
  "🎂", "🎉", "🎊", "✈️", "🏆", "💍", "🎓", "🏠",
  "💼", "🎵", "🏋️", "🌏", "🐶", "❤️", "🎁", "🌸",
  "🍾", "🎯", "⚽", "🎮", "🌙", "⭐", "🦋", "🔥",
];

interface EmojiSelectorProps {
  selected: string;
  onChange: (e: string) => void;
}

export default function EmojiSelector({ selected, onChange }: EmojiSelectorProps) {
  return (
    <div className="grid grid-cols-8 gap-1 p-3 bg-slate-800 border border-slate-700 rounded-xl">
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onChange(emoji)}
          className={[
            "w-9 h-9 rounded-lg flex items-center justify-center text-xl transition-all duration-150",
            selected === emoji
              ? "bg-violet-600 ring-2 ring-violet-400"
              : "hover:bg-slate-700",
          ].join(" ")}
          aria-label={emoji}
          aria-pressed={selected === emoji}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
