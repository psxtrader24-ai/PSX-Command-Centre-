import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Terminal runtime error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleResetData = () => {
    try {
      localStorage.clear();
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0e14] text-slate-100 flex items-center justify-center p-6 font-mono text-xs">
          <div className="max-w-xl w-full bg-[#111622] border border-rose-500/40 rounded p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-rose-500/20 pb-3">
              <div className="w-8 h-8 rounded bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-wider text-rose-400 uppercase">
                  METRICLY // Terminal Exception
                </h1>
                <p className="text-[11px] text-slate-400">
                  A client-side initialization anomaly occurred.
                </p>
              </div>
            </div>

            <div className="bg-black/50 p-3 rounded border border-slate-800 text-rose-300 font-mono text-[11px] overflow-auto max-h-48">
              {this.state.error?.toString() || 'Unknown initialization error'}
              {this.state.errorInfo && (
                <pre className="mt-2 text-[10px] text-slate-500 whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={this.handleReload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reload Terminal
              </button>
              <button
                onClick={this.handleResetData}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-[11px] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Cache & Data
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
