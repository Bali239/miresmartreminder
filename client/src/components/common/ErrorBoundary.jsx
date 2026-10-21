import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReload = () => window.location.reload();

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 text-center" style={{ background: '#08061A' }}>
          {/* Ambient orbs */}
          <div className="orb orb-purple" style={{ top: '-200px', left: '-200px', opacity: 0.15 }} />
          <div className="orb orb-indigo" style={{ bottom: '-150px', right: '-150px', opacity: 0.12 }} />

          <div
            className="relative z-10 max-w-md w-full p-8 rounded-3xl"
            style={{
              background: 'rgba(17, 14, 46, 0.9)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              boxShadow: '0 0 40px rgba(239, 68, 68, 0.1)',
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
            >
              <AlertTriangle className="w-7 h-7 text-red-400" />
            </div>
            <h1 className="text-2xl font-display font-bold text-white mb-3">
              Something went wrong
            </h1>
            <p className="text-sm text-white/40 mb-7 leading-relaxed">
              An unexpected error occurred. Refreshing the page usually fixes it right away.
            </p>
            <Button variant="primary" onClick={this.handleReload} icon={<RefreshCw className="w-4 h-4" />}>
              Reload Application
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
