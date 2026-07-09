import { forwardRef } from "react";

const VARIANT_MAP = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    danger: "btn-danger",
    success: "btn-success",
    warning: "btn-warning",
    ghost: "btn-ghost",
    outline: "btn-outline",
    "outline-primary": "btn-outline-primary",
    "outline-danger": "btn-outline-danger",
};

const Button = forwardRef(({ children, onClick, variant, size = "md", className = "", disabled = false, loading = false, ...props }, ref) => {
    const base = "btn";
    const sizeClass = size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";
    const variantClass = VARIANT_MAP[variant] || "";
    return (
        <button
            ref={ref}
            onClick={!disabled && !loading ? onClick : undefined}
            className={`${base} ${variantClass} ${sizeClass} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <span className="btn-spinner"></span>}
            <span className={loading ? "btn-text-hidden" : ""}>{children}</span>
        </button>
    );
});
Button.displayName = "Button";

export default Button;