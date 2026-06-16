'use client';

import React, { useEffect, useState } from 'react';
import {
  Terrain, Reservation,
  getTerrains, createReservation, CreateReservationInput
} from '../lib/api';
import { X, ChevronRight, ChevronLeft, Search, Users, Loader2, Check } from 'lucide-react';
import Image from 'next/image';

interface NewReservationModalProps {
  onClose: () => void;
  onCreated: (reservation: Reservation) => void;
  /** If provided, skips terrain selection and goes straight to the form */
  preselectedTerrain?: Terrain;
}

type Step = 'select_terrain' | 'fill_form' | 'success';

export default function NewReservationModal({ onClose, onCreated, preselectedTerrain }: NewReservationModalProps) {
  const [step, setStep] = useState<Step>(preselectedTerrain ? 'fill_form' : 'select_terrain');
  const [terrains, setTerrains] = useState<Terrain[]>([]);
  const [terrainsLoading, setTerrainsLoading] = useState(!preselectedTerrain);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTerrain, setSelectedTerrain] = useState<Terrain | null>(preselectedTerrain ?? null);

  // Form fields
  const [nomClient, setNomClient] = useState('');
  const [telephone, setTelephone] = useState('');
  const [dateReservation, setDateReservation] = useState('');
  const [moment, setMoment] = useState<'matin' | 'soir'>('matin');
  const [heure, setHeure] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [createdReservation, setCreatedReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('tb_role') || 'ADMIN';
      const userId = localStorage.getItem('tb_user_id') || 'admin_1';
      if (role === 'CLIENT') {
        if (userId === 'client_1') {
          setNomClient('Marie Dupont');
          setTelephone('0612345678');
        } else if (userId === 'client_2') {
          setNomClient('Jean Lemoine');
          setTelephone('0687654321');
        }
      }
    }
  }, []);

  // Load available terrains
  useEffect(() => {
    if (preselectedTerrain) return;
    async function load() {
      try {
        const data = await getTerrains();
        setTerrains(data.filter((t) => t.disponible));
      } catch (err) {
        console.error(err);
      } finally {
        setTerrainsLoading(false);
      }
    }
    load();
  }, [preselectedTerrain]);

  const filteredTerrains = terrains.filter(
    (t) =>
      t.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const priceMatin = selectedTerrain?.prix.find((p) => p.moment === 'matin')?.montant ?? 0;
  const priceSoir = selectedTerrain?.prix.find((p) => p.moment === 'soir')?.montant ?? 0;
  const activePrice = moment === 'matin' ? priceMatin : priceSoir;

  const handleSelectTerrain = (terrain: Terrain) => {
    setSelectedTerrain(terrain);
    setStep('fill_form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTerrain) return;
    setFormError(null);

    if (!nomClient.trim()) { setFormError('Veuillez saisir le nom du client.'); return; }
    if (!telephone.trim()) { setFormError('Veuillez saisir le numéro de téléphone.'); return; }
    if (!dateReservation) { setFormError('Veuillez choisir une date.'); return; }
    if (!heure) { setFormError('Veuillez choisir une heure.'); return; }

    setFormLoading(true);
    try {
      const payload: CreateReservationInput = {
        terrain_id: selectedTerrain.id,
        nom_client: nomClient,
        telephone,
        moment,
        heure,
        date_reservation: dateReservation,
      };
      const res = await createReservation(payload);
      res.terrain = selectedTerrain; // enrich for display
      setCreatedReservation(res);
      setStep('success');
      onCreated(res);
    } catch (err: any) {
      setFormError(err.message || 'Une erreur est survenue.');
    } finally {
      setFormLoading(false);
    }
  };

  const SPORT_EMOJI: Record<string, string> = { Foot: '⚽', Tennis: '🎾', Padel: '🏓' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-charcoal/40 backdrop-blur-sm">
      <div className="bg-surface rounded-md shadow-card-hover w-full max-w-lg max-h-[92vh] overflow-y-auto flex flex-col">

        {/* ─── STEP INDICATOR ─── */}
        {step !== 'success' && (
          <div className="flex items-center gap-0 border-b border-[#ebefed]">
            {[
              { key: 'select_terrain', label: '1. Terrain' },
              { key: 'fill_form', label: '2. Détails' },
            ].map(({ key, label }, i) => {
              const isActive = step === key;
              const isDone =
                (key === 'select_terrain' && step === 'fill_form');
              return (
                <div
                  key={key}
                  className={`flex-1 flex items-center justify-center gap-xs py-md text-[13px] font-bold transition-colors ${
                    isActive ? 'text-primary border-b-2 border-primary' : isDone ? 'text-secondary' : 'text-outline'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-extrabold ${
                    isActive ? 'bg-primary text-white' : isDone ? 'bg-secondary text-white' : 'bg-[#ebefed] text-outline'
                  }`}>
                    {isDone ? '✓' : i + 1}
                  </span>
                  {label}
                </div>
              );
            })}
          </div>
        )}

        {/* ─── HEADER ─── */}
        <div className="flex items-center justify-between p-lg pb-md">
          <div>
            <h2 className="font-sans text-[22px] font-bold text-primary tracking-tight">
              {step === 'select_terrain' && 'Choisir un terrain'}
              {step === 'fill_form' && `Réserver — ${selectedTerrain?.nom}`}
              {step === 'success' && 'Réservation confirmée !'}
            </h2>
            {step === 'fill_form' && (
              <p className="text-outline text-[13px] mt-[2px]">
                {SPORT_EMOJI[selectedTerrain?.type ?? ''] ?? '🏟️'} {selectedTerrain?.type} • {selectedTerrain?.capacite} joueurs
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-[#ebefed] transition-colors flex-shrink-0"
          >
            <X size={18} className="text-outline" />
          </button>
        </div>

        {/* ─── STEP 1: TERRAIN SELECTION ─── */}
        {step === 'select_terrain' && (
          <div className="px-lg pb-lg space-y-md flex-1">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 text-outline" size={16} />
              <input
                type="text"
                placeholder="Rechercher un terrain..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-[#c1c9c1] rounded-md pl-[36px] pr-md py-sm text-[14px] focus:outline-none focus:border-primary focus:ring-4 focus:ring-secondary/15 transition-all"
              />
            </div>

            {/* Terrain list */}
            {terrainsLoading ? (
              <div className="space-y-sm">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-[80px] bg-[#F7FAF8] rounded-md animate-pulse" />
                ))}
              </div>
            ) : filteredTerrains.length === 0 ? (
              <div className="text-center py-xl text-outline text-[14px]">
                Aucun terrain disponible.
              </div>
            ) : (
              <div className="space-y-sm">
                {filteredTerrains.map((terrain) => {
                  const pm = terrain.prix.find((p) => p.moment === 'matin')?.montant ?? 0;
                  const ps = terrain.prix.find((p) => p.moment === 'soir')?.montant ?? 0;
                  return (
                    <button
                      key={terrain.id}
                      onClick={() => handleSelectTerrain(terrain)}
                      className="w-full flex items-center gap-md p-md bg-white border border-[#ebefed] rounded-md hover:border-secondary hover:shadow-card transition-all duration-200 text-left group"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-[64px] h-[64px] rounded-md overflow-hidden bg-[#ebefed] flex-shrink-0">
                        {terrain.image_url ? (
                          <Image src={terrain.image_url} alt={terrain.nom} fill className="object-cover" sizes="64px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[24px]">
                            {SPORT_EMOJI[terrain.type] ?? '🏟️'}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-xs">
                          <span className="font-bold text-charcoal text-[15px] truncate">{terrain.nom}</span>
                          <span className="text-[11px] bg-[#ebefed] text-primary px-xs py-[2px] rounded-full font-bold uppercase flex-shrink-0">
                            {terrain.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-sm mt-[4px] text-[12px] text-outline">
                          <span className="flex items-center gap-[3px]"><Users size={11} /> {terrain.capacite}</span>
                          <span>M: <strong className="text-primary">{Number(pm).toFixed(0)}€</strong></span>
                          <span>S: <strong className="text-primary">{Number(ps).toFixed(0)}€</strong></span>
                        </div>
                      </div>

                      <ChevronRight size={18} className="text-outline group-hover:text-secondary transition-colors flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ─── STEP 2: BOOKING FORM ─── */}
        {step === 'fill_form' && selectedTerrain && (
          <form onSubmit={handleSubmit} className="px-lg pb-lg space-y-md">
            {/* Back button (skip if preselected) */}
            {!preselectedTerrain && (
              <button
                type="button"
                onClick={() => setStep('select_terrain')}
                className="flex items-center gap-xs text-[13px] font-semibold text-outline hover:text-primary transition-colors"
              >
                <ChevronLeft size={14} /> Changer de terrain
              </button>
            )}

            {formError && (
              <div className="p-md bg-[#FDF2F2] border-l-4 border-error rounded-md text-error text-[13px] font-semibold">
                {formError}
              </div>
            )}

            {/* Nom */}
            <div>
              <label className="block text-label-sm text-charcoal mb-[6px] font-semibold">Nom complet *</label>
              <input
                type="text" required placeholder="Ex: Jean Dupont"
                value={nomClient} onChange={(e) => setNomClient(e.target.value)}
                className="w-full bg-white border border-[#c1c9c1] rounded-md px-md py-sm text-[14px] focus:outline-none focus:border-primary focus:ring-4 focus:ring-secondary/15 transition-all"
              />
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-label-sm text-charcoal mb-[6px] font-semibold">Téléphone *</label>
              <input
                type="tel" required placeholder="Ex: +33 6 12 34 56 78"
                value={telephone} onChange={(e) => setTelephone(e.target.value)}
                className="w-full bg-white border border-[#c1c9c1] rounded-md px-md py-sm text-[14px] focus:outline-none focus:border-primary focus:ring-4 focus:ring-secondary/15 transition-all"
              />
            </div>

            {/* Date + Heure */}
            <div className="grid grid-cols-2 gap-md">
              <div>
                <label className="block text-label-sm text-charcoal mb-[6px] font-semibold">Date *</label>
                <input
                  type="date" required
                  min={new Date().toISOString().split('T')[0]}
                  value={dateReservation} onChange={(e) => setDateReservation(e.target.value)}
                  className="w-full bg-white border border-[#c1c9c1] rounded-md px-md py-sm text-[14px] focus:outline-none focus:border-primary focus:ring-4 focus:ring-secondary/15 transition-all"
                />
              </div>
              <div>
                <label className="block text-label-sm text-charcoal mb-[6px] font-semibold">Heure *</label>
                <input
                  type="time" required
                  value={heure} onChange={(e) => setHeure(e.target.value)}
                  className="w-full bg-white border border-[#c1c9c1] rounded-md px-md py-sm text-[14px] focus:outline-none focus:border-primary focus:ring-4 focus:ring-secondary/15 transition-all"
                />
              </div>
            </div>

            {/* Moment toggle */}
            <div>
              <label className="block text-label-sm text-charcoal mb-[6px] font-semibold">Moment de la journée</label>
              <div className="flex gap-sm bg-[#F7FAF8] p-[4px] rounded-md border border-[#ebefed]">
                {(['matin', 'soir'] as const).map((m) => (
                  <button
                    key={m} type="button" onClick={() => setMoment(m)}
                    className={`flex-1 py-[8px] px-md rounded-md font-bold text-[13px] transition-all duration-200 capitalize ${
                      moment === m ? 'bg-primary text-white shadow-sm' : 'text-charcoal hover:bg-[#ebefed]'
                    }`}
                  >
                    {m === 'matin' ? '🌅 Matin (08h–14h)' : '🌙 Soir (14h–22h)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Price summary */}
            <div className="bg-[#F7FAF8] p-md rounded-md border border-[#ebefed] flex items-center justify-between">
              <div className="space-y-[2px]">
                <p className="text-[12px] text-outline font-semibold">Tarif {moment === 'matin' ? 'Matin' : 'Soir'}</p>
                <p className="text-[11px] text-outline">
                  Matin: {Number(priceMatin).toFixed(0)}€ · Soir: {Number(priceSoir).toFixed(0)}€
                </p>
              </div>
              <div className="text-right">
                <p className="text-[12px] text-outline font-semibold">Total</p>
                <p className="text-[24px] font-extrabold text-secondary">{Number(activePrice).toFixed(2)} €</p>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={formLoading}
              className="w-full bg-secondary hover:bg-[#27ae60] text-white font-bold py-md px-lg rounded-md shadow-sm transition-all duration-200 flex items-center justify-center gap-xs disabled:opacity-60"
            >
              {formLoading ? <Loader2 size={18} className="animate-spin" /> : null}
              {formLoading ? 'Traitement...' : 'Confirmer la réservation'}
            </button>
          </form>
        )}

        {/* ─── STEP 3: SUCCESS ─── */}
        {step === 'success' && createdReservation && (
          <div className="px-lg pb-lg space-y-lg flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#EAF8F0] border-4 border-secondary flex items-center justify-center">
              <Check size={32} className="text-secondary stroke-[3]" />
            </div>
            <div>
              <h3 className="font-sans text-[20px] font-bold text-primary">Réservation #{ createdReservation.id}</h3>
              <p className="text-outline text-[14px] mt-xs">Confirmée avec succès pour <strong>{createdReservation.nom_client}</strong></p>
            </div>
            <div className="w-full bg-[#F7FAF8] rounded-md p-md space-y-sm text-left border border-[#ebefed]">
              {[
                ['Terrain', selectedTerrain?.nom ?? `#${createdReservation.terrain_id}`],
                ['Date', createdReservation.date_reservation],
                ['Heure', createdReservation.heure.substring(0, 5)],
                ['Moment', createdReservation.moment === 'matin' ? '🌅 Matin' : '🌙 Soir'],
                ['Montant', `${Number(createdReservation.prix_total).toFixed(2)} €`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-[14px]">
                  <span className="text-outline font-semibold">{label}</span>
                  <span className="font-bold text-charcoal">{value}</span>
                </div>
              ))}
            </div>
            <button
              onClick={onClose}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-sm px-lg rounded-md transition-colors"
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
