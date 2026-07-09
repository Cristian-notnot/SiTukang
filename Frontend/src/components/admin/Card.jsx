import { motion } from "framer-motion";

export function Card({ children, className = "", padding = true, hover = true, ...props }) {
    return (
        <motion.div
            className={`card ${padding ? "card-padded" : ""} ${hover ? "card-hover" : ""} ${className}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            whileHover={hover ? { y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" } : undefined}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function PageState({ loading, error, empty, onRetry, emptyMessage = "Tidak ada data", errorMessage = "Terjadi kesalahan" }) {
    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Memuat data...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="page-state error-state">
                <div className="page-state-icon">!</div>
                <h3>Oops!</h3>
                <p>{typeof error === "string" ? error : errorMessage}</p>
                {onRetry && <button className="btn btn-primary" onClick={onRetry}>Coba Lagi</button>}
            </div>
        );
    }
    if (empty) {
        return (
            <div className="page-state empty-state">
                <div className="page-state-icon empty-icon">📭</div>
                <h3>Kosong</h3>
                <p>{emptyMessage}</p>
            </div>
        );
    }
    return null;
}

export function StatCardSkeleton({ count = 6 }) {
    return (
        <div className="stat-skeleton-grid">
            {Array.from({ length: count }, (_, i) => (
                <div key={i} className="stat-skeleton"><div className="skeleton-pulse"></div></div>
            ))}
        </div>
    );
}

export function TableSkeleton({ rows = 5 }) {
    return (
        <div className="table-skeleton">
            {Array.from({ length: rows }, (_, i) => (
                <div key={i} className="skeleton-row"><div className="skeleton-cell"></div></div>
            ))}
        </div>
    );
}