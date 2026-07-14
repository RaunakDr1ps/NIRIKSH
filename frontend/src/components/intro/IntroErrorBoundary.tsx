import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onError: () => void;
}

interface State {
  hasError: boolean;
}

export default class IntroErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    console.warn('IntroAnimation crashed — unmounting safely:', error.message);
    this.props.onError();
  }

  render(): ReactNode {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
