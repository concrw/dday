import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-4 px-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-error-bg flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="1.8">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-text">문제가 발생했습니다</h2>
          <p className="text-sm text-text-secondary max-w-xs">
            일시적인 오류입니다. 페이지를 새로고침 해주세요.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="min-h-11 px-6 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-dark transition-all duration-200 hover:scale-105 active:scale-[0.97]"
          >
            새로고침
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
