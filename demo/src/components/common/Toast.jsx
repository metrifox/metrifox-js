import '../../styles/components.css';

const Toast = ({ toast, onHide }) => {
    if (!toast) return null;

    return (
        <div className={`toast ${toast.type}`}>
            {toast.message}
        </div>
    );
};

export default Toast;