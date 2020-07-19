import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: '' };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error(error)

  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <div><h1>Something went wrong.</h1>
      
      </div>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary