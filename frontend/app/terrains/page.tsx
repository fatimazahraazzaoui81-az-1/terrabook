'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Terrain, getTerrains, toggleTerrainAvailability, deleteTerrain
} from '../../lib/api';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Users, Search, Filter } from 'lucide-react';
import TerrainFormModal from '../../components/TerrainFormModal';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';

export default function TerrainsPage() {
  const [terrains, setTerrains] = useState<Terrain[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Tous');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editTerrain, setEditTerrain] = useState<Terrain | null>(null);
  const [deletingTerrain, setDeletingTerrain] = useState<Terrain | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getTerrains();
      setTerrains(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = terrains.filter((t) => {
    const nameMatch =
      t.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const typeMatch = filterType === 'Tous' || t.type.toLowerCase() === filterType.toLowerCase();
    return nameMatch && typeMatch;
  });

  const handleToggle = async (terrain: Terrain) => {
    setTogglingId(terrain.id);
    try {
      const updated = await toggleTerrainAvailability(terrain.id);
      setTerrains((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deletingTerrain) return;
    setDeleteLoading(true);
    try {
      await deleteTerrain(deletingTerrain.id);
      setTerrains((prev) => prev.filter((t) => t.id !== deletingTerrain.id));
      setDeletingTerrain(null);
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
          <h1 className="font-sans text-[28px] font-bold text-primary tracking-tight">Terrains</h1>
          <p className="text-outline text-[14px] mt-[2px]">
            {terrains.length} terrain{terrains.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-xs bg-secondary hover:bg-[#27ae60] text-white font-bold px-lg py-sm rounded-md transition-all duration-200 shadow-sm"
        >
          <Plus size={18} />
          Nouveau terrain
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-sm">
        <div className="relative flex-grow">
          <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 text-outline" size={18} />
          <input
            type="text"
            placeholder="Rechercher un terrain..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-[#c1c9c1] rounded-md pl-[38px] pr-md py-sm text-body-md focus:outline-none focus:border-primary focus:ring-4 focus:ring-secondary/15 transition-all"
          />
        </div>
        <div className="relative">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="appearance-none bg-white border border-[#c1c9c1] rounded-md pl-md pr-[36px] py-sm text-body-md font-semibold focus:outline-none focus:border-primary focus:ring-4 focus:ring-secondary/15 transition-all cursor-pointer"
          >
            {['Tous', 'Foot', 'Tennis', 'Padel'].map((s) => (
              <option key={s} value={s}>{s === 'Tous' ? 'Tous les sports' : s}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-[12px] top-1/2 -translate-y-1/2">
            <Filter size={16} className="text-outline" />
          </div>
        </div>
      </div>

      {/* Terrain Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-surface rounded-md shadow-card p-md h-[420px] animate-pulse space-y-md">
              <div className="bg-[#ebefed] h-[200px] w-full rounded-md" />
              <div className="h-6 bg-[#ebefed] w-2/3 rounded" />
              <div className="h-10 bg-[#ebefed] w-full rounded" />
              <div className="h-9 bg-[#ebefed] w-full rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface rounded-md shadow-card p-xl text-center text-outline text-body-md border border-[#ebefed]">
          Aucun terrain trouvé.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {filtered.map((terrain) => {
            const priceMatin = terrain.prix.find((p) => p.moment === 'matin')?.montant ?? 0;
            const priceSoir = terrain.prix.find((p) => p.moment === 'soir')?.montant ?? 0;
            const isToggling = togglingId === terrain.id;

            return (
              <div
                key={terrain.id}
                className="bg-surface rounded-md shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-[200px] bg-[#ebefed]">
                  {terrain.image_url ? (
                    <Image
                      src={terrain.image_url}
                      alt={terrain.nom}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-outline text-[40px]">🏟️</div>
                  )}
                  {/* Price chips */}
                  <div className="absolute top-[10px] right-[10px] flex flex-col gap-[4px] items-end">
                    <span className="bg-primary text-white text-[11px] font-bold px-[10px] py-[3px] rounded-full shadow-sm">
                      M: {Number(priceMatin).toFixed(0)}€
                    </span>
                    <span className="bg-primary text-white text-[11px] font-bold px-[10px] py-[3px] rounded-full shadow-sm">
                      S: {Number(priceSoir).toFixed(0)}€
                    </span>
                  </div>
                  {/* Status badge */}
                  <div className="absolute top-[10px] left-[10px]">
                    <span className={`text-[11px] font-bold px-sm py-[3px] rounded-full ${
                      terrain.disponible
                        ? 'bg-[#EAF8F0] text-secondary'
                        : 'bg-[#FDF2F2] text-error'
                    }`}>
                      {terrain.disponible ? '● Disponible' : '● Réservé'}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-lg flex flex-col flex-grow gap-md">
                  <div>
                    <div className="flex items-center justify-between mb-xs">
                      <span className="bg-[#ebefed] text-primary text-[11px] font-bold px-sm py-[3px] rounded-full uppercase tracking-wider">
                        {terrain.type}
                      </span>
                      <div className="flex items-center gap-xs text-outline text-[12px]">
                        <Users size={13} />
                        <span className="font-semibold">{terrain.capacite} joueurs</span>
                      </div>
                    </div>
                    <h3 className="font-sans text-[18px] font-bold text-primary tracking-tight mb-xs">{terrain.nom}</h3>
                    <p className="font-sans text-[14px] text-outline leading-relaxed line-clamp-2">{terrain.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-sm mt-auto">
                    {/* Réserver button */}
                    {terrain.disponible ? (
                      <Link
                        href={`/terrains/${terrain.id}`}
                        className="block w-full text-center py-sm px-md rounded-md font-bold bg-secondary hover:bg-[#27ae60] text-white transition-all duration-200 text-[14px]"
                      >
                        Réserver Maintenant
                      </Link>
                    ) : (
                      <button disabled className="w-full py-sm px-md rounded-md font-bold bg-charcoal/10 text-charcoal/40 cursor-not-allowed text-[14px]">
                        Non disponible
                      </button>
                    )}

                    {/* Admin actions row */}
                    <div className="flex items-center gap-sm">
                      {/* Toggle availability */}
                      <button
                        onClick={() => handleToggle(terrain)}
                        disabled={isToggling}
                        title={terrain.disponible ? 'Marquer comme réservé' : 'Marquer comme disponible'}
                        className={`flex-1 flex items-center justify-center gap-xs py-xs px-sm rounded-md font-bold text-[12px] transition-all ${
                          terrain.disponible
                            ? 'bg-[#EAF8F0] text-secondary hover:bg-secondary hover:text-white'
                            : 'bg-[#FDF2F2] text-error hover:bg-error hover:text-white'
                        } disabled:opacity-50`}
                      >
                        {isToggling ? (
                          <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : terrain.disponible ? (
                          <ToggleRight size={14} />
                        ) : (
                          <ToggleLeft size={14} />
                        )}
                        {terrain.disponible ? 'Libre' : 'Réservé'}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => setEditTerrain(terrain)}
                        title="Modifier le terrain"
                        className="flex items-center justify-center w-9 h-9 rounded-md bg-[#EFF6FF] hover:bg-[#3B82F6] text-[#3B82F6] hover:text-white transition-all"
                      >
                        <Edit2 size={15} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setDeletingTerrain(terrain)}
                        title="Supprimer le terrain"
                        className="flex items-center justify-center w-9 h-9 rounded-md bg-[#FDF2F2] hover:bg-error text-error hover:text-white transition-all"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <TerrainFormModal
          onClose={() => setShowCreateModal(false)}
          onSaved={(t) => { setTerrains((prev) => [...prev, t]); setShowCreateModal(false); }}
        />
      )}
      {editTerrain && (
        <TerrainFormModal
          terrain={editTerrain}
          onClose={() => setEditTerrain(null)}
          onSaved={(t) => { setTerrains((prev) => prev.map((x) => (x.id === t.id ? t : x))); setEditTerrain(null); }}
        />
      )}
      {deletingTerrain && (
        <DeleteConfirmModal
          title="Supprimer le terrain"
          message={`Êtes-vous sûr de vouloir supprimer "${deletingTerrain.nom}" ? Cette action est irréversible et supprimera toutes les réservations associées.`}
          confirmLabel="Supprimer le terrain"
          onConfirm={handleDelete}
          onCancel={() => setDeletingTerrain(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
