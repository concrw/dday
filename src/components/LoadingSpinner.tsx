interface LoadingSpinnerProps {
  text?: string;
}

export function LoadingSpinner({ text }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      {text && <p className="text-sm text-text-secondary">{text}</p>}
    </div>
  );
}
