import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export function useToast() {
    return useContext(ToastContext);
}

let toastIdCounter = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = "success", duration = 3000) => {
        const id = ++toastIdCounter;
        setToasts(prev => [...prev, { id, message, type, duration }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    const success = useCallback((msg) => addToast(msg, "success"), [addToast]);
    const error = useCallback((msg) => addToast(msg, "error", 4000), [addToast]);
    const info = useCallback((msg) => addToast(msg, "info"), [addToast]);

    return (
        <ToastContext.Provider value={{ success, error, info }}>
            {children}
            <div className="toast-container">
                {toasts.map(t => (
                    <div key={t.id} className={`toast toast-${t.type}`}>
                        <span className="toast-icon">
                            {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}
                        </span>
                        <span className="toast-message">{t.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export default ToastProvider;