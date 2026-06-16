'use client';

import React, { useState } from 'react';
import { Reservation, deleteReservation } from '../lib/api';
import { Search, Eye, Filter, Edit2, Trash2, ChevronLeft, ChevronRight, Phone, Calendar } from 'lucide-react';
import ReservationEditModal from './ReservationEditModal';
import DeleteConfirmModal from './DeleteConfirmModal';

interface HistoriqueTableProps {
  reservations: Reservation[];
  onViewFiche: (reservation: Reservation) => void;
  onReservationUpdated: (updated: Reservation) => void;
  onReservationDeleted: (id: number) => void;
}

const ITEMS_PER_PAGE = 10;

const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return dateStr; }
};

export default function HistoriqueTable({
  reservations,
  onViewFiche,
  onReservationUpdated,
  onReservationDeleted,
}: HistoriqueTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Tous');
  const [currentPage, setCurrentPage] = useState(1);
  const [editTarget, setEditTarget] = useState<Reservation | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Reservation | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // RBAC state
  const [userRole, setUserRole] = useState('CLIENT');
  const [userId, setUserId] = useState('client_1');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserRole(localStorage.getItem('tb_role') || 'CLIENT');
      setUserId(localStorage.getItem('tb_user_id') || 'client_1');
    }
  }, []);

  const canManageReservation = (r: Reservation) => {
    if (userRole === 'ADMIN') return true;
    if (userRole === 'OWNER') return r.terrain?.owner_id === userId;
    if (userRole === 'CLIENT') return r.user_id === userId;
    return false;
  };

  // Filter
  const filteredReservations = reservations.filter((r) => {
    const q = searchTerm.toLowerCase();
    const clientName = r.nom_client.toLowerCase();
    const terrainName = (r.terrain?.nom ?? '').toLowerCase();
    const searchMatch = clientName.includes(q) || terrainName.includes(q) || r.telephone.includes(q);
    if (filterType === 'Tous') return searchMatch;
    return searchMatch && r.terrain?.type === filterType;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredReservations.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filteredReservations.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Reset to page 1 when filters change
  const handleSearch = (val: string) => { setSearchTerm(val); setCurrentPage(1); };
  const handleFilter = (val: string) => { setFilterType(val); setCurrentPage(1); };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteReservation(deleteTarget.id);
      onReservationDeleted(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const startItem = (safePage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(safePage * ITEMS_PER_PAGE, filteredReservations.length);

  return (
    <div className="space-y-lg">
      {/* Header + Search + Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-[24px]">
        <div>
          <h1 className="font-sans text-[28px] font-bold text-primary tracking-tight">Historique des Réservations</h1>
          <p className="text-body-md text-outline">Consultez, modifiez et gérez l'historique complet.</p>
        </div>
        <div className="flex items-center gap-sm w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-grow md:w-[260px]">
            <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 text-outline" size={18} />
            <input
              type="text"
              placeholder="Rechercher client, terrain..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-white border border-[#c1c9c1] rounded-md pl-[36px] pr-md py-sm font-sans text-body-md text-charcoal focus:outline-none focus:border-primary focus:ring-4 focus:ring-secondary/15 transition-all duration-200"
            />
          </div>
          {/* Filter */}
          <div className="relative flex-shrink-0">
            <select
              value={filterType}
              onChange={(e) => handleFilter(e.target.value)}
              className="appearance-none bg-white border border-[#c1c9c1] rounded-md pl-[16px] pr-[36px] py-sm font-sans text-body-md text-charcoal font-semibold focus:outline-none focus:border-primary focus:ring-4 focus:ring-secondary/15 transition-all duration-200 cursor-pointer"
            >
              <option value="Tous">Tous les sports</option>
              <option value="Foot">Football</option>
              <option value="Tennis">Tennis</option>
              <option value="Padel">Padel</option>
            </select>
            <div className="pointer-events-none absolute right-[12px] top-1/2 -translate-y-1/2 text-outline">
              <Filter size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-md shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary text-white sticky top-0 z-10">
                {['Date', 'Client', 'Terrain', 'Horaire', 'Prix', 'Actions'].map((h) => (
                  <th key={h} className="px-lg py-md font-sans text-label-md font-bold uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-lg py-xl text-center text-outline text-body-md bg-white">
                    Aucune réservation trouvée.
                  </td>
                </tr>
              ) : (
                paginated.map((r, idx) => (
                  <tr
                    key={r.id}
                    className={`transition-colors duration-150 hover:bg-[#EAF8F0]/30 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F7FAF8]'}`}
                  >
                    {/* Date */}
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-xs text-charcoal text-[14px]">
                        <Calendar size={13} className="text-outline flex-shrink-0" />
                        <span className="font-semibold">{formatDate(r.date_reservation)}</span>
                      </div>
                    </td>
                    {/* Client */}
                    <td className="px-lg py-md">
                      <div className="font-bold text-charcoal text-[14px]">{r.nom_client}</div>
                      <div className="flex items-center gap-[4px] text-[12px] text-outline">
                        <Phone size={11} />{r.telephone}
                      </div>
                    </td>
                    {/* Terrain */}
                    <td className="px-lg py-md font-sans text-body-md text-primary font-semibold">
                      <div>{r.terrain?.nom || `Terrain #${r.terrain_id}`}</div>
                      <span className="text-[11px] bg-[#ebefed] text-primary px-xs py-[2px] rounded-full font-bold uppercase">
                        {r.terrain?.type || '—'}
                      </span>
                    </td>
                    {/* Horaire */}
                    <td className="px-lg py-md">
                      <span className="font-bold text-charcoal text-[14px]">{r.heure.substring(0, 5)}</span>
                      <span className={`ml-xs text-[11px] font-bold px-xs py-[2px] rounded-full uppercase ${
                        r.moment === 'matin' ? 'bg-[#FFF8E7] text-[#B45309]' : 'bg-[#EEF2FF] text-[#4338CA]'
                      }`}>
                        {r.moment}
                      </span>
                    </td>
                    {/* Prix */}
                    <td className="px-lg py-md font-sans text-body-md text-secondary font-bold whitespace-nowrap">
                      {Number(r.prix_total).toFixed(2)} €
                    </td>
                    {/* Actions */}
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-xs">
                        <button
                          onClick={() => onViewFiche(r)}
                          title="Voir la fiche"
                          className="w-8 h-8 flex items-center justify-center rounded-md bg-[#EAF8F0] hover:bg-secondary text-secondary hover:text-white transition-all"
                        >
                          <Eye size={14} />
                        </button>
                        {canManageReservation(r) && (
                          <>
                            <button
                              onClick={() => setEditTarget(r)}
                              title="Modifier"
                              className="w-8 h-8 flex items-center justify-center rounded-md bg-[#EFF6FF] hover:bg-[#3B82F6] text-[#3B82F6] hover:text-white transition-all"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(r)}
                              title="Supprimer"
                              className="w-8 h-8 flex items-center justify-center rounded-md bg-[#FDF2F2] hover:bg-error text-error hover:text-white transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredReservations.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-[13px] text-outline font-semibold">
            {filteredReservations.length > 0 ? `Affichage ${startItem}–${endItem} sur ${filteredReservations.length}` : 'Aucun résultat'}
          </p>
          <div className="flex items-center gap-xs">
            <button
              onClick={() => handlePageChange(safePage - 1)}
              disabled={safePage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-[#c1c9c1] bg-white hover:bg-[#EAF8F0] hover:border-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} className="text-primary" />
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
              .reduce<(number | '...')[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-outline text-[13px]">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p as number)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md font-bold text-[13px] transition-all ${
                      p === safePage
                        ? 'bg-primary text-white'
                        : 'border border-[#c1c9c1] bg-white hover:bg-[#EAF8F0] text-charcoal'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

            <button
              onClick={() => handlePageChange(safePage + 1)}
              disabled={safePage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-[#c1c9c1] bg-white hover:bg-[#EAF8F0] hover:border-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={16} className="text-primary" />
            </button>
          </div>
        </div>
      )}

      {/* Edit / Delete Modals */}
      {editTarget && (
        <ReservationEditModal
          reservation={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={(updated) => { onReservationUpdated(updated); setEditTarget(null); }}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          title="Supprimer la réservation"
          message={`Supprimer la réservation de "${deleteTarget.nom_client}" du ${formatDate(deleteTarget.date_reservation)} ?`}
          confirmLabel="Supprimer"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
