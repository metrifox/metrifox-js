import '../../styles/components.css';

const Button = ({
                    children,
                    variant = 'primary',
                    size = 'medium',
                    disabled = false,
                    loading = false,
                    onClick,
                    ...props
                }) => {
    return (
        <button
            className={`btn btn-${variant} btn-${size}`}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading ? 'Loading...' : children}
        </button>
    );
};

export default Button;