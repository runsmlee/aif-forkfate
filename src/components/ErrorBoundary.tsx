import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('[ErrorBoundary] React rendering error:', error);
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
    window.aif?.track('error_boundary', {
      message: error.message,
      componentStack: errorInfo.componentStack?.slice(0, 500),
    });
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      return (
        <div role="alert" className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-gray-950">
          <div className="max-w-md w-full text-center">
            <div className="text-4xl mb-4" aria-hidden="true">⚠️</div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Something went wrong</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              The application encountered an unexpected error. Please try again.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-mono bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-6 break-all max-h-32 overflow-auto text-left">
              {this.state.error.message}
            </p>
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-white font-semibold text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ backgroundColor: '#B91C1C' }}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
