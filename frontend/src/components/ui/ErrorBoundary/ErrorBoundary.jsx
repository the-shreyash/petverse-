import React from "react";

/**
 * ErrorBoundary
 *
 * Without this, a single unguarded property access anywhere in the tree
 * unmounts the entire app and renders a blank white page — which is exactly
 * how the Shop page failed. Containing the failure keeps navigation usable and
 * makes the problem visible instead of silent.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info?.componentStack);
  }

  handleReset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 p-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-2xl">
          ⚠️
        </div>
        <h2 className="text-lg font-bold text-slate-800">This section failed to load</h2>
        <p className="max-w-md text-sm text-slate-500">
          Something went wrong rendering this page. The rest of the app still works —
          you can go back or retry.
        </p>
        {import.meta.env.DEV && (
          <pre className="mt-2 max-w-lg overflow-x-auto rounded-xl bg-slate-900 p-3 text-left text-[11px] text-rose-300">
            {String(error?.message || error)}
          </pre>
        )}
        <div className="mt-2 flex gap-3">
          <button
            onClick={this.handleReset}
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-600 transition"
          >
            Try again
          </button>
          <button
            onClick={() => window.history.back()}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }
}
