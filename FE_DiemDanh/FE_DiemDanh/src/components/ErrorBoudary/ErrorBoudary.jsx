import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Cập nhật state để hiển thị giao diện dự phòng
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        // Bạn có thể ghi lại lỗi ở đây
        console.error('Error caught in ErrorBoundary:', error, info);
    }

    render() {
        if (this.state.hasError) {
            // Hiển thị giao diện dự phòng nếu có lỗi
            return <h1>Something went wrong.</h1>;
        }
        return this.props.children; 
    }
}
export default ErrorBoundary