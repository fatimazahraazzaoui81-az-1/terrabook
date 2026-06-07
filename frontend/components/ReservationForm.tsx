'use client';

import React, { useState } from 'react';
import { Terrain, createReservation, Reservation } from '../lib/api';

interface ReservationFormProps {
  terrain: Terrain;
  onSuccess: (reservation: Reservation) => void;
}

export default function ReservationForm({ terrain, onSuccess }: ReservationFormProps) {
  const [nomClient, setNomClient] = useState('');
  const [telephone, setTelephone] = useState('');
  const [dateReservation, setDateReservation] = useState('');
  const [moment, setMoment] = useState<'matin' | 'soir'>('matin');
  const [heure, setHeure] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Prices from props
  const priceMatin = terrain.prix.find((p) => p.moment === 'matin')?.montant ?? 0;
  const priceSoir = terrain.prix.find((p) => p.moment === 'soir')?.montant ?? 0;
  const activePrice = moment === 'matin' ? priceMatin : priceSoir;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic client side validation
    if (!nomClient.trim()) {
      setError('Veuillez saisir votre nom complet.');
      return;
    }
    if (!telephone.trim()) {
      setError('Veuillez saisir votre numéro de téléphone.');
      return;
    }
    if (!dateReservation) {
      setError('Veuillez choisir une date de réservation.');
      return;
    }
    if (!heure) {
      setError('Veuillez choisir une heure.');
      return;
    }

    setLoading(true);
    try {
      // Create the reservation. FastAPI router expects time in "HH:MM:SS" or "HH:MM"
      const res = await createReservation({
        terrain_id: terrain.id,
        nom_client: nomClient,
        telephone: telephone,
        moment: moment,
        heure: heure,
        date_reservation: dateReservation,
      });
      onSuccess(res);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la réservation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface rounded-md shadow-card p-lg border-r-0 max-w-md w-full">
      <h2 className="font-sans text-[24px] font-bold text-primary mb-[20px] tracking-tight">
        Détails de Réservation
      </h2>

      {error && (
        <div className="mb-md p-md bg-[#FDF2F2] border-l-4 border-error rounded-md text-error text-label-sm font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-md">
        {/* Nom complet */}
        <div>
          <label className="block font-sans text-label-sm text-charcoal mb-[6px]">
            Nom complet
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Jean Dupont"
            value={nomClient}
            onChange={(e) => setNomClient(e.target.value)}
            className="w-full bg-white border border-[#c1c9c1] rounded-md px-md py-sm font-sans text-body-md text-charcoal transition-all duration-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-secondary/15"
          />
        </div>

        {/* Numéro de téléphone */}
        <div>
          <label className="block font-sans text-label-sm text-charcoal mb-[6px]">
            Numéro de téléphone
          </label>
          <input
            type="tel"
            required
            placeholder="Ex: +33 6 12 34 56 78"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            className="w-full bg-white border border-[#c1c9c1] rounded-md px-md py-sm font-sans text-body-md text-charcoal transition-all duration-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-secondary/15"
          />
        </div>

        {/* Date picker & Hour input */}
        <div className="grid grid-cols-2 gap-md">
          <div>
            <label className="block font-sans text-label-sm text-charcoal mb-[6px]">
              Date de réservation
            </label>
            <input
              type="date"
              required
              value={dateReservation}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDateReservation(e.target.value)}
              className="w-full bg-white border border-[#c1c9c1] rounded-md px-md py-sm font-sans text-body-md text-charcoal transition-all duration-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-secondary/15"
            />
          </div>

          <div>
            <label className="block font-sans text-label-sm text-charcoal mb-[6px]">
              Heure
            </label>
            <input
              type="time"
              required
              value={heure}
              onChange={(e) => setHeure(e.target.value)}
              className="w-full bg-white border border-[#c1c9c1] rounded-md px-md py-sm font-sans text-body-md text-charcoal transition-all duration-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-secondary/15"
            />
          </div>
        </div>

        {/* Moment Toggle pills (Matin / Soir) */}
        <div>
          <label className="block font-sans text-label-sm text-charcoal mb-[6px]">
            Moment de la journée
          </label>
          <div className="flex gap-sm bg-[#F7FAF8] p-[4px] rounded-md border border-[#ebefed]">
            <button
              type="button"
              onClick={() => setMoment('matin')}
              className={`flex-1 py-[8px] px-md rounded-md font-bold text-label-md transition-all duration-200 ${
                moment === 'matin'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-transparent text-charcoal hover:bg-[#ebefed]'
              }`}
            >
              Matin (08:00 - 14:00)
            </button>
            <button
              type="button"
              onClick={() => setMoment('soir')}
              className={`flex-1 py-[8px] px-md rounded-md font-bold text-label-md transition-all duration-200 ${
                moment === 'soir'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-transparent text-charcoal hover:bg-[#ebefed]'
              }`}
            >
              Soir (14:00 - 22:00)
            </button>
          </div>
        </div>

        {/* Price summary panel */}
        <div className="bg-[#F7FAF8] p-lg rounded-md space-y-[8px] border border-[#ebefed]">
          <div className="flex justify-between font-sans text-[14px] text-outline font-semibold">
            <span>Tarif Matin</span>
            <span>{Number(priceMatin).toFixed(2)} €</span>
          </div>
          <div className="flex justify-between font-sans text-[14px] text-outline font-semibold">
            <span>Tarif Soir</span>
            <span>{Number(priceSoir).toFixed(2)} €</span>
          </div>
          <hr className="border-[#ebefed]" />
          <div className="flex justify-between items-center font-sans text-[20px] font-bold text-primary">
            <span>Total à payer</span>
            <span className="text-secondary font-extrabold text-[24px]">
              {Number(activePrice).toFixed(2)} €
            </span>
          </div>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={loading || !terrain.disponible}
          className="w-full bg-secondary hover:bg-[#27ae60] text-white font-bold py-md px-lg rounded-md shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-secondary/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Traitement en cours...' : 'Confirmer la Réservation'}
        </button>
      </form>
    </div>
  );
}
