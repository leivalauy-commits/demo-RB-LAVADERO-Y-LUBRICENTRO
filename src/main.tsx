import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          backgroundColor: '#0B0B0C',
          color: '#F5F5F5',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          textAlign: 'center',
        }}>
          <div style={{
            maxWidth: '480px',
            backgroundColor: '#151617',
            border: '1px solid #252627',
            borderRadius: '16px',
            padding: '32px',
          }}>
            <h1 style={{ color: '#D71920', fontSize: '18px', fontWeight: 800, margin: '0 0 12px 0', letterSpacing: '0.05em' }}>
              R.B. LAVADERO &amp; LUBRICENTRO
            </h1>
            <p style={{ color: '#929497', fontSize: '13px', lineHeight: 1.5, margin: '0 0 24px 0' }}>
              Ocurrió un inconveniente al cargar el estado de la aplicación. Puede restablecer los datos locales para volver a iniciar.
            </p>
            <button
              onClick={this.handleReset}
              style={{
                backgroundColor: '#D71920',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Reiniciar Aplicación
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} else {
  console.error('No se encontró el contenedor #root para inicializar React.');
}

