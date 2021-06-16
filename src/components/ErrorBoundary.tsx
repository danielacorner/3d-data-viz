import { Component } from "react";

/** Sentry exposes a Sentry.ErrorBoundary component as well, if we want to send bounded errors to Sentry
 * https://docs.sentry.io/platforms/javascript/guides/react/#add-react-error-boundary
 */
export class ErrorBoundary extends Component<{
  ignore?: boolean;
  component?: any;
}> {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: any, info: any) {
    if (!this.props.ignore) {
      console.log({ error, info });
    }
  }

  render() {
    if (this.state.hasError) {
      console.log("something went wrong!");
      return this.props.component || null;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
