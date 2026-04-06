import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function DataTable({ columns, data, total, page, setPage, pageSize = 10 }) {
  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="glass-panel overflow-hidden border-t-2 border-t-primary shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-[#a3aac4]">
          <thead className="bg-surface/80 text-white uppercase text-xs border-b border-white/5 backdrop-blur-md">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="px-6 py-4 font-bold tracking-wider">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-black/40">
            {data.length > 0 ? (
              data.map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors group">
                  {columns.map((col, j) => (
                    <td key={j} className="px-6 py-4 whitespace-nowrap">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="border-t border-white/5 px-6 py-4 flex items-center justify-between bg-surface/80 backdrop-blur-md">
        <span className="text-sm">
          Showing <span className="text-white font-bold">{data.length ? (page - 1) * pageSize + 1 : 0}</span> to <span className="text-white font-bold">{Math.min(page * pageSize, total)}</span> of <span className="text-white font-bold">{total}</span> records
        </span>
        <div className="flex bg-[#141414] rounded-lg border border-white/10 overflow-hidden shadow-inner">
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            className="p-2 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-white"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors border-l border-white/5 text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors border-l border-white/5 text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className="p-2 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors border-l border-white/5 text-white"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
