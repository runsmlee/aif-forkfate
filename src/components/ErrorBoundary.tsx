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

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      return (
        <div role="alert" className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-xs text-gray-400 font-mono bg-gray-50 rounded-lg p-3 mb-6 break-all">
              {this.state.error.message}
            </p>
            <button onClick={() => this.setState({ hasError: false, error: null })} className="btn-primary">Try Again</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
