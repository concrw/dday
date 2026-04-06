interface CountdownBlockProps {
  value: number;
  label: string;
}

export function CountdownBlock({ value, label }: CountdownBlockProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center bg-primary-dark">
        <span className="text-3xl md:text-4xl font-bold text-white tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs font-medium uppercase tracking-widest text-text-muted">
        {label}
      </span>
    </div>
  );
}
