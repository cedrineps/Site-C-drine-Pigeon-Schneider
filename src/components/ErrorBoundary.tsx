import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Portfolio render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#F5EBDD] px-6 text-center text-[#252525]">
          <p className="font-display text-3xl font-bold">PIGEON-SCHNEIDER</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[#252525]/80">
            Une erreur d&rsquo;affichage temporaire est survenue lors du chargement de la page.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-full bg-[#252525] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#383838] cursor-pointer"
          >
            Recharger la page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
