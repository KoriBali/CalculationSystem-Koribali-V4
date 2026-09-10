import { Component } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

/**
 * Catches render/lifecycle errors in its subtree so a single broken component
 * shows a recoverable message instead of blanking the whole app (React
 * unmounts the entire tree on an uncaught error).
 *
 * `resetKey` — when this prop changes (e.g. the route path), the boundary
 * clears its error state and retries rendering its children. Lets navigating
 * away from a broken page recover without a full reload.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidUpdate(prevProps) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info?.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-7 w-7 text-red-500" />
        </div>
        <h2 className="mb-1 text-lg font-bold text-slate-800">
          Something went wrong on this page
        </h2>
        <p className="mb-6 max-w-md text-sm text-slate-500">
          The page hit an unexpected error. Your saved inputs are still there —
          reload to try again.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#0d3b66] to-[#3399cc] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110"
          >
            <RotateCcw className="h-4 w-4" />
            Reload page
          </button>
          <button
            onClick={() => this.setState({ error: null })}
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
          >
            Try again
          </button>
        </div>
        {import.meta.env.DEV && (
          <pre className="mt-6 max-w-full overflow-x-auto rounded-lg bg-slate-100 p-4 text-left text-xs text-red-600">
            {String(this.state.error?.stack || this.state.error)}
          </pre>
        )}
      </div>
    );
  }
}
