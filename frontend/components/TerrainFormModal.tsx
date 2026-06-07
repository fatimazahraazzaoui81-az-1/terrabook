'use client';

import React, { useState } from 'react';
import { Terrain, createTerrain, updateTerrain, CreateTerrainInput, UpdateTerrainInput } from '../lib/api';
import { X, Save, Loader2 } from 'lucide-react';

interface TerrainFormModalProps {
  terrain?: Terrain; // If provided → edit mode
  onClose: () => void;
  onSaved: (terrain: Terrain) => void;
}

const SPORT_TYPES = ['Foot', 'Tennis', 'Padel'];

export default function TerrainFormModal({ terrain, onClose, onSaved }: TerrainFormModalProps) {
  const isEdit = !!terrain;

  const [nom, setNom] = useState(terrain?.nom ?? '');
  const [description, setDescription] = useState(terrain?.description ?? '');
  const [type, setType] = useState(terrain?.type ?? 'Foot');
  const [capacite, setCapacite] = useState(terrain?.capacite?.toString() ?? '10');
  const [imageUrl, setImageUrl] = useState(terrain?.image_url ?? '');
  const [disponible, setDisponible] = useState(terrain?.disponible ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let result: Terrain;
      if (isEdit && terrain) {
        const payload: UpdateTerrainInput = { nom, description, type, capacite: Number(capacite), image_url: imageUrl, disponible };
        result = await updateTerrain(terrain.id, payload);
      } else {
        const payload: CreateTerrainInput = { nom, description, type, capacite: Number(capacite), image_url: imageUrl, disponible };
        result = await createTerrain(payload);
      }
      onSaved(result);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-charcoal/40 backdrop-blur-sm">
      <div className="bg-surface rounded-md shadow-card-hover w-full max-w-lg p-lg space-y-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-sans text-[22px] font-bold text-primary tracking-tight">
              {isEdit ? 'Modifier le terrain' : 'Nouveau terrain'}
            </h2>
            <p className="text-outline text-[13px] mt-[2px]">
              {isEdit ? `ID #${terrain?.id}` : 'Remplissez les informations du terrain'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-[#ebefed] transition-colors"
          >
            <X size={18} className="text-outline" />
          </button>
        </div>

        {error && (
          <div className="p-md bg-[#FDF2F2] border-l-4 border-error rounded-md text-error text-[13px] font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-md">
          <div>
            <label className="block text-label-sm text-charcoal mb-[6px] font-semibold">Nom du terrain *</label>
            <input
              type="text"
              required
              placeholder="Ex: Terrain Alpha"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full bg-white border border-[#c1c9c1] rounded-md px-md py-sm text-body-md focus:outline-none focus:border-primary focus:ring-4 focus:ring-secondary/15 transition-all"
            />
          </div>

          <div>
            <label className="block text-label-sm text-charcoal mb-[6px] font-semibold">Description</label>
            <textarea
              rows={3}
              placeholder="Description du terrain..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-[#c1c9c1] rounded-md px-md py-sm text-body-md focus:outline-none focus:border-primary focus:ring-4 focus:ring-secondary/15 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-md">
            <div>
              <label className="block text-label-sm text-charcoal mb-[6px] font-semibold">Type de sport *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-white border border-[#c1c9c1] rounded-md px-md py-sm text-body-md focus:outline-none focus:border-primary focus:ring-4 focus:ring-secondary/15 transition-all"
              >
                {SPORT_TYPES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-label-sm text-charcoal mb-[6px] font-semibold">Capacité (joueurs)</label>
              <input
                type="number"
                min={1}
                max={100}
                value={capacite}
                onChange={(e) => setCapacite(e.target.value)}
                className="w-full bg-white border border-[#c1c9c1] rounded-md px-md py-sm text-body-md focus:outline-none focus:border-primary focus:ring-4 focus:ring-secondary/15 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-label-sm text-charcoal mb-[6px] font-semibold">URL de l'image</label>
            <input
              type="text"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-white border border-[#c1c9c1] rounded-md px-md py-sm text-body-md focus:outline-none focus:border-primary focus:ring-4 focus:ring-secondary/15 transition-all"
            />
          </div>

          <div className="flex items-center gap-sm p-md bg-[#F7FAF8] rounded-md border border-[#ebefed]">
            <input
              id="disponible-toggle"
              type="checkbox"
              checked={disponible}
              onChange={(e) => setDisponible(e.target.checked)}
              className="w-4 h-4 accent-secondary rounded cursor-pointer"
            />
            <label htmlFor="disponible-toggle" className="text-label-md font-semibold text-charcoal cursor-pointer">
              Terrain disponible à la réservation
            </label>
          </div>

          <div className="flex gap-sm pt-sm">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-sm px-md bg-[#ebefed] hover:bg-[#d7dbd9] text-charcoal font-bold rounded-md transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-sm px-md bg-secondary hover:bg-[#27ae60] text-white font-bold rounded-md transition-colors flex items-center justify-center gap-xs disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {loading ? 'Sauvegarde...' : isEdit ? 'Mettre à jour' : 'Créer le terrain'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
