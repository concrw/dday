import type { Recurring } from '@/types';

interface Props {
  value: Recurring;
  onChange: (v: Recurring) => void;
}

export function RecurringToggle({ value, onChange }: Props) {
  const isOn = value === 'yearly';
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-text">매년 반복</span>
        <span className="text-xs text-text-muted">생일, 기념일 등 매년 돌아오는 날</span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        onClick={() => onChange(isOn ? 'none' : 'yearly')}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          isOn ? 'bg-primary' : 'bg-border'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
            isOn ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
        <span className="sr-only">{isOn ? '매년 반복 켜짐' : '매년 반복 꺼짐'}</span>
      </button>
    </div>
  );
}
