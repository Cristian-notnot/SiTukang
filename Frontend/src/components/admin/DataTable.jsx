import { useState, useMemo } from "react";

function DataTable({
    columns,
    data,
    loading,
    searchable = true,
    placeholder = "Cari...",
    pageSize = 10,
    actions,
    emptyMessage = "Tidak ada data"
}) {
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState("");
    const [sortDir, setSortDir] = useState("asc");
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        let result = data || [];

        if (search) {
            const q = search.toLowerCase();
            result = result.filter(row =>
                columns.some(col => {
                    const val = col.accessor ? row[col.accessor] : "";
                    return String(val).toLowerCase().includes(q);
                })
            );
        }

        if (sortKey) {
            result = [...result].sort((a, b) => {
                const va = a[sortKey];
                const vb = b[sortKey];
                if (va < vb) return sortDir === "asc" ? -1 : 1;
                if (va > vb) return sortDir === "asc" ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [data, search, sortKey, sortDir]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortDir(prev => prev === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
        setPage(1);
    };

    const sortArrow = (key) => {
        if (sortKey !== key) return "";
        return sortDir === "asc" ? " ▲" : " ▼";
    };

    if (loading) {
        return (
            <div className="data-table-wrap">
                <div className="table-skeleton">
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton-row"><div className="skeleton-cell"></div></div>)}
                </div>
            </div>
        );
    }

    return (
        <div className="data-table-wrap">
            {searchable && (
                <div className="table-toolbar">
                    <input
                        type="text"
                        className="search-input"
                        placeholder={placeholder}
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                    />
                    <span className="table-count">{filtered.length} item</span>
                </div>
            )}

            <div className="table-scroll">
                <table>
                    <thead>
                        <tr>
                            {columns.map(col => (
                                <th
                                key={col.accessor || col.header}
                                onClick={() => col.accessor && handleSort(col.accessor)}
                                className={col.accessor ? "sortable" : ""}
                            >
                                {col.header}
                                {col.accessor && sortArrow(col.accessor)}
                            </th>
                        ))}
                        {actions && actions.length > 0 && <th className="action-th">Aksi</th>}
                    </tr>
                </thead>
                <tbody>
                    {paginated.length === 0 ? (
                        <tr><td colSpan={columns.length + (actions ? 1 : 0)} className="empty-cell">{emptyMessage}</td></tr>
                    ) : paginated.map((row, i) => (
                        <tr key={row.id || i}>
                            {columns.map(col => {
                                const val = col.accessor ? row[col.accessor] : "-";
                                const badgeClass = col.badge ? col.badge(row) : "";
                                const wrapFn = col.format;
                                return (
                                    <td key={col.accessor || col.header}>
                                        <span className={badgeClass ? `badge badge-${badgeClass}` : ""}>
                                            {col.render ? col.render(row) : (wrapFn ? wrapFn(val, row) : val)}
                                        </span>
                                    </td>
                                );
                            })}
                            {actions && actions.length > 0 && (
                                <td className="action-cell" style={{ position: "relative" }}>
                                    <ActionDropdown actions={actions} row={row} />
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {totalPages > 1 && (
            <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let p;
                    if (totalPages <= 7) p = i + 1;
                    else if (page <= 4) p = i + 1;
                    else if (page >= totalPages - 3) p = totalPages - 6 + i;
                    else p = page - 3 + i;
                    return (
                    <button key={p} className={page === p ? "active" : ""} onClick={() => setPage(p)}>{p}</button>
                    );
                })}
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
        )}
    </div>
);
}

function ActionDropdown({ actions, row }) {
const [open, setOpen] = useState(false);

return (
    <div className="action-dropdown">
        <button className="action-dots" onClick={() => setOpen(!open)}>⋮</button>
        {open && (
            <>
                <div className="action-menu-backdrop" onClick={() => setOpen(false)} />
                <div className="action-menu">
                    {actions.map((action, i) => (
                        <button key={i} className={action.className || ""} onClick={() => { setOpen(false); action.onClick(row); }}>
                            {action.label}
                        </button>
                    ))}
                </div>
            </>
        )}
    </div>
);
}

export { ActionDropdown };
export default DataTable;