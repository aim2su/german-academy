import { useState, useEffect, useMemo } from "react";
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

import { leadsApi } from "../../api/leads";
import LeadsTable from "../../components/admin/LeadsTable";
import LeadDetailsModal from "../../components/admin/LeadDetailsModal";
import Button from "../../components/ui/Button";

const LEVEL_ORDER = [
  "A1.1", "A1.2",
  "A2.1", "A2.2",
  "B1.1", "B1.2",
  "B2.1", "B2.2",
  "C1.1", "C1.2",
];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  const [updatingId, setUpdatingId] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);

  // Загрузка
  const loadLeads = async (targetPage = page) => {
    setLoading(true);
    try {
      const { data } = await leadsApi.getAll(targetPage, pageSize);
      setLeads(data.items);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
      setPage(data.page);
    } catch (err) {
      toast.error("Не удалось загрузить заявки");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Смена статуса
  const handleToggleStatus = async (lead) => {
    setUpdatingId(lead.id);
    try {
      const { data } = await leadsApi.updateStatus(lead.id, !lead.isProcessed);

      setLeads((prev) =>
        prev.map((l) =>
          l.id === data.id ? { ...l, isProcessed: data.isProcessed } : l
        )
      );

      // Обновляем открытую модалку, если она про эту заявку
      if (selectedLead?.id === data.id) {
        setSelectedLead({ ...selectedLead, isProcessed: data.isProcessed });
      }

      toast.success(
        data.isProcessed ? "Заявка обработана" : "Заявка возвращена в работу"
      );
    } catch (err) {
      toast.error("Не удалось изменить статус");
    } finally {
      setUpdatingId(null);
    }
  };

  // Клик по строке — открыть модалку
  const handleRowClick = (lead) => {
    setSelectedLead(lead);
  };

  // Закрыть модалку
  const handleCloseModal = () => {
    setSelectedLead(null);
  };

  // Сортировка
  const sortedLeads = useMemo(() => {
    const sorted = [...leads].sort((a, b) => {
      let cmp = 0;

      if (sortBy === "createdAt") {
        cmp = new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === "level") {
        cmp =
          (LEVEL_ORDER.indexOf(a.level) ?? 999) -
          (LEVEL_ORDER.indexOf(b.level) ?? 999);
      } else if (sortBy === "isProcessed") {
        cmp = (a.isProcessed ? 1 : 0) - (b.isProcessed ? 1 : 0);
      }

      return sortDir === "asc" ? cmp : -cmp;
    });

    return sorted;
  }, [leads, sortBy, sortDir]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDir(field === "createdAt" ? "desc" : "asc");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    loadLeads(newPage);
  };

  return (
    <div>
      {/* Заголовок */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Заявки</h1>
          <p className="mt-1 text-sm text-ink-500">
            Всего: {totalCount} · Страница {page} из {totalPages}
          </p>
        </div>
      </div>

      {/* Таблица */}
      {loading && leads.length === 0 ? (
        <div className="flex items-center justify-center rounded-xl border border-ink-100 bg-white py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-ink-200 border-t-brand-600" />
        </div>
      ) : (
        <LeadsTable
          leads={sortedLeads}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={handleSort}
          onToggleStatus={handleToggleStatus}
          onRowClick={handleRowClick}
          updatingId={updatingId}
        />
      )}

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-ink-500">
            Строки с {(page - 1) * pageSize + 1} по{" "}
            {Math.min(page * pageSize, totalCount)} из {totalCount}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1 || loading}
              className="cursor-pointer"
            >
              <ChevronLeft size={16} />
              Назад
            </Button>

            <div className="px-3 text-sm">
              {page} / {totalPages}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages || loading}
              className="cursor-pointer"
            >
              Вперёд
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Модалка деталей */}
      <LeadDetailsModal
        lead={selectedLead}
        isOpen={!!selectedLead}
        onClose={handleCloseModal}
        onToggleStatus={handleToggleStatus}
        updating={updatingId === selectedLead?.id}
      />
    </div>
  );
}















// import { useState, useEffect, useMemo } from "react";
// import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
// import toast from "react-hot-toast";

// import { leadsApi } from "../../api/leads";
// import LeadsTable from "../../components/admin/LeadsTable";
// import Button from "../../components/ui/Button";

// const LEVEL_ORDER = [
//   "A1.1", "A1.2",
//   "A2.1", "A2.2",
//   "B1.1", "B1.2",
//   "B2.1", "B2.2",
//   "C1.1", "C1.2",
// ];

// export default function AdminLeadsPage() {
//   const [leads, setLeads] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [pageSize] = useState(20);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);

//   const [sortBy, setSortBy] = useState("createdAt");
//   const [sortDir, setSortDir] = useState("desc");

//   const [updatingId, setUpdatingId] = useState(null);

//   const loadLeads = async (targetPage = page) => {
//     setLoading(true);
//     try {
//       const { data } = await leadsApi.getAll(targetPage, pageSize);
//       setLeads(data.items);
//       setTotalPages(data.totalPages);
//       setTotalCount(data.totalCount);
//       setPage(data.page);
//     } catch (err) {
//       toast.error("Не удалось загрузить заявки");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadLeads();
//   }, []);

//   const handleToggleStatus = async (lead) => {
//     setUpdatingId(lead.id);
//     try {
//       const { data } = await leadsApi.updateStatus(lead.id, !lead.isProcessed);

//       setLeads((prev) =>
//         prev.map((l) =>
//           l.id === data.id ? { ...l, isProcessed: data.isProcessed } : l
//         )
//       );

//       toast.success(
//         data.isProcessed ? "Заявка обработана" : "Заявка возвращена в работу"
//       );
//     } catch (err) {
//       toast.error("Не удалось изменить статус");
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   const handleRowClick = (lead) => {
//     toast(
//       `Заявка #${lead.id}\n${lead.name}\n${lead.phone}${
//         lead.email ? "\n" + lead.email : ""
//       }`,
//       { duration: 5000 }
//     );
//   };

//   const sortedLeads = useMemo(() => {
//     const sorted = [...leads].sort((a, b) => {
//       let cmp = 0;

//       if (sortBy === "createdAt") {
//         cmp = new Date(a.createdAt) - new Date(b.createdAt);
//       } else if (sortBy === "level") {
//         cmp =
//           (LEVEL_ORDER.indexOf(a.level) ?? 999) -
//           (LEVEL_ORDER.indexOf(b.level) ?? 999);
//       } else if (sortBy === "isProcessed") {
//         cmp = (a.isProcessed ? 1 : 0) - (b.isProcessed ? 1 : 0);
//       }

//       return sortDir === "asc" ? cmp : -cmp;
//     });

//     return sorted;
//   }, [leads, sortBy, sortDir]);

//   const handleSort = (field) => {
//     if (sortBy === field) {
//       setSortDir(sortDir === "asc" ? "desc" : "asc");
//     } else {
//       setSortBy(field);
//       setSortDir(field === "createdAt" ? "desc" : "asc");
//     }
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage < 1 || newPage > totalPages) return;
//     loadLeads(newPage);
//   };

//   return (
//     <div>
//       <div className="mb-6 flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold">Заявки</h1>
//           <p className="mt-1 text-sm text-ink-500">
//             Всего: {totalCount} · Страница {page} из {totalPages}
//           </p>
//         </div>

//         <Button
//           variant="outline"
//           onClick={() => loadLeads(page)}
//           disabled={loading}
//         >
//           <RefreshCw
//             size={16}
//             className={loading ? "animate-spin" : ""}
//           />
//           Обновить
//         </Button>
//       </div>

//       {loading && leads.length === 0 ? (
//         <div className="flex items-center justify-center rounded-xl border border-ink-100 bg-white py-20">
//           <div className="h-8 w-8 animate-spin rounded-full border-4 border-ink-200 border-t-brand-600" />
//         </div>
//       ) : (
//         <LeadsTable
//           leads={sortedLeads}
//           sortBy={sortBy}
//           sortDir={sortDir}
//           onSort={handleSort}
//           onToggleStatus={handleToggleStatus}
//           onRowClick={handleRowClick}
//           updatingId={updatingId}
//         />
//       )}

//       {totalPages > 1 && (
//         <div className="mt-6 flex items-center justify-between">
//           <div className="text-sm text-ink-500">
//             Строки с {(page - 1) * pageSize + 1} по{" "}
//             {Math.min(page * pageSize, totalCount)} из {totalCount}
//           </div>

//           <div className="flex items-center gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => handlePageChange(page - 1)}
//               disabled={page <= 1 || loading}
//             >
//               <ChevronLeft size={16} />
//               Назад
//             </Button>

//             <div className="px-3 text-sm">
//               {page} / {totalPages}
//             </div>

//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => handlePageChange(page + 1)}
//               disabled={page >= totalPages || loading}
//             >
//               Вперёд
//               <ChevronRight size={16} />
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }