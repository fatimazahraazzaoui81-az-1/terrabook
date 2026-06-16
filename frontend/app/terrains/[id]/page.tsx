'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Terrain, getTerrainById, Reservation } from '../../../lib/api';
import ReservationForm from '../../../components/ReservationForm';
import FicheModal from '../../../components/FicheModal';
import { Users, Tag, ChevronRight } from 'lucide-react';

export default function ReservationPage() {
  const params = useParams();
  const router = useRouter();
  const idStr = params.id as string;
  const id = parseInt(idStr, 10);

  const [terrain, setTerrain] = useState<Terrain | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookedReservation, setBookedReservation] = useState<Reservation | null>(null);
  const [userRole, setUserRole] = useState('CLIENT');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserRole(localStorage.getItem('tb_role') || 'CLIENT');
    }
  }, []);

  useEffect(() => {
    if (isNaN(id)) {
      setError('Identifiant de terrain invalide');
      setLoading(false);
      return;
    }

    async function loadTerrain() {
      try {
        const data = await getTerrainById(id);
        setTerrain(data);
      } catch (err: any) {
        setError(err.message || 'Le terrain demandé est introuvable.');
      } finally {
        setLoading(false);
      }
    }
    loadTerrain();
  }, [id]);

  const handleBookingSuccess = (reservation: Reservation) => {
    // Append the terrain entity to the receipt for display purposes
    if (terrain) {
      reservation.terrain = terrain;
    }
    setBookedReservation(reservation);
  };

  const handleCloseModal = () => {
    setBookedReservation(null);
    // Navigate straight to the reservations history
    router.push('/reservations');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-md">
        <div className="w-12 h-12 rounded-full border-4 border-[#ebefed] border-t-secondary animate-spin" />
        <p className="text-outline font-semibold font-sans">Chargement des données du terrain...</p>
      </div>
    );
  }

  if (error || !terrain) {
    return (
      <div className="text-center py-[64px] space-y-md">
        <h2 className="text-[24px] font-bold text-error">Terrain non disponible</h2>
        <p className="text-outline max-w-[400px] mx-auto">{error || 'Le terrain demandé est introuvable.'}</p>
        <Link
          href={userRole === 'CLIENT' ? "/terrains" : "/"}
          className="inline-block bg-primary hover:bg-primary/95 text-white font-bold py-sm px-md rounded-md transition-colors"
        >
          {userRole === 'CLIENT' ? "Retourner aux Terrains" : "Retourner au Dashboard"}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-lg">
      {/* Breadcrumbs Navigation */}
      <nav className="flex items-center gap-xs font-sans text-label-sm text-outline py-xs">
        {userRole !== 'CLIENT' && (
          <>
            <Link href="/" className="hover:text-primary transition-all duration-150">
              Dashboard
            </Link>
            <ChevronRight size={14} className="text-[#c1c9c1]" />
          </>
        )}
        <Link href="/terrains" className="hover:text-primary transition-all duration-150">
          Terrains
        </Link>
        <ChevronRight size={14} className="text-[#c1c9c1]" />
        <span className="text-primary font-bold">Réservez un Terrain</span>
      </nav>

      {/* Split Column Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[32px] items-start mt-[16px]">
        {/* Left Component: Product Details (7/12 layout) */}
        <div className="lg:col-span-7 space-y-md">
          {/* Main Hero Product Image */}
          <div className="relative h-[320px] md:h-[420px] w-full rounded-md overflow-hidden bg-[#ebefed] shadow-sm">
            <Image
              src={terrain.image_url}
              alt={terrain.nom}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </div>

          <div className="space-y-xs">
            {/* Terrain Name */}
            <h1 className="font-sans text-[32px] font-bold text-primary tracking-tight mb-xs">
              {terrain.nom}
            </h1>

            {/* Info Chips */}
            <div className="flex flex-wrap gap-sm">
              <span className="bg-[#EAF8F0] text-primary text-label-sm font-bold px-sm py-[4px] rounded-full flex items-center gap-xs">
                <Tag size={12} className="text-secondary" />
                <span>Sport : {terrain.type}</span>
              </span>

              <span className="bg-[#F7FAF8] border border-[#ebefed] text-charcoal text-label-sm font-bold px-sm py-[4px] rounded-full flex items-center gap-xs">
                <Users size={12} className="text-primary" />
                <span>Capacité : {terrain.capacite} joueurs</span>
              </span>

              {terrain.disponible ? (
                <span className="bg-secondary/10 text-secondary text-label-sm font-bold px-sm py-[4px] rounded-full">
                  Disponible
                </span>
              ) : (
                <span className="bg-charcoal/10 text-charcoal text-label-sm font-bold px-sm py-[4px] rounded-full">
                  Indisponible
                </span>
              )}
            </div>
          </div>

          {/* Description Block */}
          <div className="pt-sm space-y-xs border-t border-[#ebefed]">
            <h3 className="font-sans text-label-md font-bold text-primary">À propos de cet espace</h3>
            <p className="font-sans text-body-md text-outline leading-relaxed whitespace-pre-line">
              {terrain.description}
            </p>
          </div>
        </div>

        {/* Right Component: Float white booking card (5/12 layout) */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <ReservationForm terrain={terrain} onSuccess={handleBookingSuccess} />
        </div>
      </div>

      {/* Confirmation Modal Receipt */}
      <FicheModal reservation={bookedReservation} onClose={handleCloseModal} />
    </div>
  );
}
