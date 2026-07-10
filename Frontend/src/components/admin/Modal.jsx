import { useEffect } from "react";

function Modal({ open, onClose, title, children, size = "md" }) {
    useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    if (!open) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className={`modal modal-${size}`} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
}

export function ConfirmModal({ open, onClose, onConfirm, title, message, loading }) {
    return (
        <Modal open={open} onClose={onClose} title={title || "Konfirmasi"} size="sm">
            <p className="modal-message">{message || "Apakah Anda yakin?"}</p>
            <div className="modal-actions">
                <button className="btn btn-secondary" onClick={onClose}>Batal</button>
                <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
                    {loading ? "Memproses..." : "Ya, Hapus"}
                </button>
            </div>
        </Modal>
    );
}

export default Modal;