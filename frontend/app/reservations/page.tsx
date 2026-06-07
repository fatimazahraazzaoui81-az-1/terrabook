'use client';

import React, { useEffect, useState } from 'react';
import { Reservation, getReservations, deleteReservation } from '../../lib/api';
import { Search, Filter, Eye, Edit2, Trash2, Phone, Calendar, Clock, Plus } from 'lucide-react';
import FicheModal from '../../components/FicheModal';
import ReservationEditModal from '../../components/ReservationEditModal';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import NewReservationModal from '../../components/NewReservationModal';

const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return dateStr; }
};

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Tous');
  const [filterMoment, setFilterMoment] = useState('Tous');

  const [viewReservation, setViewReservation] = useState<Reservation | null>(null);
  const [editReservation, setEditReservation] = useState<Reservation | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Reservation | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showNewReservation, setShowNewReservation] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getReservations();
      setReservations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = reservations.filter((r) => {
    const q = searchTerm.toLowerCase();
    const nameMatch = r.nom_client.toLowerCase().includes(q) || r.telephone.includes(q);
    const terrainMatch = (r.terrain?.nom ?? '').toLowerCase().includes(q);
    const searchMatch = nameMatch || terrainMatch;
    const typeMatch = filterType === 'Tous' || r.terrain?.type === filterType;
    const momentMatch = filterMoment === 'Tous' || r.moment === filterMoment;
    return searchMatch && typeMatch && momentMatch;
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteReservation(deleteTarget.id);
      setReservations((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-md border-b border-[#ebefed]">
        <div>
          <h1 className="font-sans text-[28px] font-bold text-primary tracking-tight">Réservations</h1>
          <p className="text-outline text-[14px] mt-[2px]">
            {reservations.length} réservation{reservations.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        <div className="flex items-center gap-sm">
          <div className="bg-[#EAF8F0] px-lg py-sm rounded-md">
            <span className="font-bold text-secondary text-[15px]">{filtered.length}</span>
            <span className="text-outline text-[13px] ml-xs">affichée{filtered.length !== 1 ? 's' : ''}</span>
          </div>
          <button
            onClick={() => setShowNewReservation(true)}
            className="flex items-center gap-xs bg-secondary hover:bg-[#27ae60] text-white font-bold px-lg py-sm rounded-md transition-all duration-200 shadow-sm"
          >
            <Plus size={18} />
            Nouvelle réservation
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-sm">
        <div className="relative flex-grow">
          <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 text-outline" size={18} />
          <input
            type="text"
            placeholder="Rechercher client, téléphone, terrain..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-[#c1c9c1] rounded-md pl-[38px] pr-md py-sm text-body-md focus:outline-none focus:border-primary focus:ring-4 focus:ring-secondary/15 transition-all"
          />
        </div>
        <div className="flex gap-sm">
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none bg-white border border-[#c1c9c1] rounded-md pl-md pr-[32px] py-sm text-[14px] font-semibold focus:outline-none focus:border-primary transition-all cursor-pointer"
            >
              {['Tous', 'Foot', 'Tennis', 'Padel'].map((s) => (
                <option key={s} value={s}>{s === 'Tous' ? 'Tous les sports' : s}</option>
              ))}
            </select>
            <Filter size={14} className="pointer-events-none absolute right-[10px] top-1/2 -translate-y-1/2 text-outline" />
          </div>
          <div className="relative">
            <select
              value={filterMoment}
              onChange={(e) => setFilterMoment(e.target.value)}
              className="appearance-none bg-white border border-[#c1c9c1] rounded-md pl-md pr-[32px] py-sm text-[14px] font-semibold focus:outline-none focus:border-primary transition-all cursor-pointer"
            >
              <option value="Tous">Tout moment</option>
              <option value="matin">Matin</option>
              <option value="soir">Soir</option>
            </select>
            <Clock size={14} className="pointer-events-none absolute right-[10px] top-1/2 -translate-y-1/2 text-outline" />
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-surface rounded-md shadow-card p-lg space-y-sm animate-pulse">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="h-16 bg-[#F7FAF8] rounded-md" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface rounded-md shadow-card p-xl text-center text-outline">
          Aucune réservation trouvée.
        </div>
      ) : (
        <div className="bg-surface rounded-md shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary text-white">
                  {['#', 'Client', 'Terrain', 'Date', 'Horaire', 'Moment', 'Prix Total', 'Actions'].map((h) => (
                    <th key={h} className="px-lg py-md font-sans text-label-sm font-bold uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, idx) => (
                  <tr
                    key={r.id}
                    className={`hover:bg-[#EAF8F0]/40 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F7FAF8]'}`}
                  >
                    <td className="px-lg py-md text-[12px] font-bold text-outline">#{r.id}</td>
                    <td className="px-lg py-md">
                      <div className="font-bold text-charcoal text-[14px]">{r.nom_client}</div>
                      <div className="flex items-center gap-[4px] text-[12px] text-outline mt-[2px]">
                        <Phone size={11} />
                        {r.telephone}
                      </div>
                    </td>
                    <td className="px-lg py-md">
                      <div className="font-semibold text-primary text-[14px]">
                        {r.terrain?.nom || `Terrain #${r.terrain_id}`}
                      </div>
                      {r.terrain?.type && (
                        <span className="text-[11px] bg-[#ebefed] text-primary px-xs py-[2px] rounded-full font-bold uppercase">
                          {r.terrain.type}
                        </span>
                      )}
                    </td>
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-xs text-charcoal text-[14px]">
                        <Calendar size={13} className="text-outline" />
                        {formatDate(r.date_reservation)}
                      </div>
                    </td>
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-xs text-charcoal text-[14px]">
                        <Clock size={13} className="text-outline" />
                        {r.heure.substring(0, 5)}
                      </div>
                    </td>
                    <td className="px-lg py-md">
                      <span className={`text-[11px] font-bold px-sm py-[3px] rounded-full uppercase ${
                        r.moment === 'matin'
                          ? 'bg-[#FFF8E7] text-[#B45309]'
                          : 'bg-[#EEF2FF] text-[#4338CA]'
                      }`}>
                        {r.moment === 'matin' ? '🌅 Matin' : '🌙 Soir'}
                      </span>
                    </td>
                    <td className="px-lg py-md font-bold text-secondary text-[15px] whitespace-nowrap">
                      {Number(r.prix_total).toFixed(2)} €
                    </td>
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-xs">
                        <button
                          onClick={() => setViewReservation(r)}
                          title="Voir la fiche"
                          className="w-8 h-8 flex items-center justify-center rounded-md bg-[#EAF8F0] hover:bg-secondary text-secondary hover:text-white transition-all"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => setEditReservation(r)}
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {viewReservation && (
        <FicheModal reservation={viewReservation} onClose={() => setViewReservation(null)} />
      )}
      {editReservation && (
        <ReservationEditModal
          reservation={editReservation}
          onClose={() => setEditReservation(null)}
          onSaved={(updated) => {
            setReservations((prev) => prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r)));
            setEditReservation(null);
          }}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          title="Supprimer la réservation"
          message={`Êtes-vous sûr de vouloir supprimer la réservation de "${deleteTarget.nom_client}" ? Cette action est irréversible.`}
          confirmLabel="Supprimer"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
      {showNewReservation && (
        <NewReservationModal
          onClose={() => setShowNewReservation(false)}
          onCreated={(res) => {
            setReservations((prev) => [res, ...prev]);
            setShowNewReservation(false);
          }}
        />
      )}
    </div>
  );
}
