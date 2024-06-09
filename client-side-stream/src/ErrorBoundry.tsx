import React, { Component, ReactNode } from 'react';
import { redirect } from 'react-router-dom';



interface ErrorBoundaryProps {
    onError: (error: Error) => void;
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({ hasError: true });
        this.props.onError(error); // Pass error to parent component
    }

    render(): ReactNode {

        if (this.state.hasError) {
            redirect('/error')
            return null; // Return null when an error occurs
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
