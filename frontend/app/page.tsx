'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Map, Calendar, TrendingUp, CheckCircle, Eye, Plus, ArrowRight } from 'lucide-react';
import { getDashboardStats, getReservations, DashboardStats, Reservation } from '../lib/api';
import StatsCard from '../components/StatsCard';
import FicheModal from '../components/FicheModal';
import NewReservationModal from '../components/NewReservationModal';
import TerrainFormModal from '../components/TerrainFormModal';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function SkeletonCard() {
  return (
    <div className="bg-surface rounded-md shadow-card p-lg animate-pulse space-y-md">
      <div className="flex justify-between">
        <div className="h-4 bg-[#ebefed] rounded w-1/3" />
        <div className="w-10 h-10 rounded-md bg-[#ebefed]" />
      </div>
      <div className="h-8 bg-[#ebefed] rounded w-1/2" />
      <div className="h-3 bg-[#ebefed] rounded w-2/3" />
    </div>
  );
}

const SPORT_COLORS: Record<string, string> = {
  Foot: '#1A4731',
  Tennis: '#2ECC71',
  Padel: '#27ae60',
  Autre: '#717972',
};

const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return dateStr; }
};

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [latestReservations, setLatestReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showNewReservation, setShowNewReservation] = useState(false);
  const [showNewTerrain, setShowNewTerrain] = useState(false);

  // RBAC state
  const [userRole, setUserRole] = useState<string>('ADMIN');
  const [userId, setUserId] = useState<string>('admin_1');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('tb_role') || 'CLIENT';
      const uid = localStorage.getItem('tb_user_id') || 'admin_1';
      setUserRole(role);
      setUserId(uid);
      if (role === 'CLIENT') {
        router.push('/terrains');
      }
    }
  }, [router]);

  const load = async () => {
    try {
      const [s, reservations] = await Promise.all([getDashboardStats(), getReservations()]);
      setStats(s);
      setLatestReservations(reservations.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (userRole === 'CLIENT') {
    return null;
  }

  const getUserDisplayName = () => {
    if (userId === 'owner_1') return 'Jean (Propriétaire)';
    if (userId === 'owner_2') return 'Pierre (Propriétaire)';
    return 'Administrateur';
  };

  const getUserInitials = () => {
    if (userId === 'owner_1') return 'JE';
    if (userId === 'owner_2') return 'PI';
    return 'AD';
  };

  return (
    <div className="space-y-xxl">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-md border-b border-[#ebefed]">
        <div>
          <h1 className="font-sans text-[28px] font-bold text-primary tracking-tight">Tableau de bord</h1>
          <p className="text-outline text-[14px] mt-[2px]">Vue d'ensemble de TerraBook</p>
        </div>
        <div className="flex items-center gap-sm">
          <span className="text-label-md font-bold text-primary hidden sm:inline">{getUserDisplayName()}</span>
          <div className="w-[40px] h-[40px] rounded-full border-2 border-primary bg-[#EAF8F0] flex items-center justify-center font-extrabold text-primary text-sm">
            {getUserInitials()}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-surface rounded-md shadow-card p-lg">
        <div className="flex items-center justify-between mb-lg">
          <div>
            <h2 className="font-sans text-[18px] font-bold text-primary tracking-tight">Actions rapides</h2>
            <p className="text-outline text-[13px] mt-[2px]">Raccourcis vers les opérations fréquentes</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
          {/* New Reservation */}
          <button
            onClick={() => setShowNewReservation(true)}
            className="group flex items-center gap-md p-md bg-secondary hover:bg-[#27ae60] text-white rounded-md transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="w-10 h-10 rounded-md bg-white/20 flex items-center justify-center flex-shrink-0">
              <Plus size={20} />
            </div>
            <div className="text-left">
              <p className="font-bold text-[14px]">Nouvelle réservation</p>
              <p className="text-white/75 text-[12px]">Réserver un terrain</p>
            </div>
            <ArrowRight size={16} className="ml-auto opacity-70 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* New Terrain */}
          <button
            onClick={() => setShowNewTerrain(true)}
            className="group flex items-center gap-md p-md bg-primary hover:bg-primary-dark text-white rounded-md transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="w-10 h-10 rounded-md bg-white/20 flex items-center justify-center flex-shrink-0">
              <Map size={20} />
            </div>
            <div className="text-left">
              <p className="font-bold text-[14px]">Nouveau terrain</p>
              <p className="text-white/75 text-[12px]">Ajouter un terrain</p>
            </div>
            <ArrowRight size={16} className="ml-auto opacity-70 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Go to Terrains */}
          <Link
            href="/terrains"
            className="group flex items-center gap-md p-md bg-[#EAF8F0] hover:bg-[#D4F0E4] text-primary rounded-md transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className="w-10 h-10 rounded-md bg-secondary/20 flex items-center justify-center flex-shrink-0">
              <Map size={20} className="text-secondary" />
            </div>
            <div className="text-left">
              <p className="font-bold text-[14px] text-primary">Gérer terrains</p>
              <p className="text-outline text-[12px]">Voir la liste complète</p>
            </div>
            <ArrowRight size={16} className="ml-auto text-outline group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>

          {/* Go to Historique */}
          <Link
            href="/historique"
            className="group flex items-center gap-md p-md bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1D4ED8] rounded-md transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className="w-10 h-10 rounded-md bg-[#3B82F6]/20 flex items-center justify-center flex-shrink-0">
              <Calendar size={20} className="text-[#3B82F6]" />
            </div>
            <div className="text-left">
              <p className="font-bold text-[14px]">Historique</p>
              <p className="text-[#3B82F6]/70 text-[12px]">Toutes les réservations</p>
            </div>
            <ArrowRight size={16} className="ml-auto opacity-70 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div>
        <h2 className="font-sans text-[18px] font-bold text-primary mb-lg tracking-tight">Statistiques générales</h2>
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-lg">
            {[1, 2, 3, 4].map((n) => <SkeletonCard key={n} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-lg">
            <StatsCard
              title="Total Terrains"
              value={stats?.totalTerrains ?? 0}
              subtitle={`${stats?.terrainsDisponibles ?? 0} disponibles`}
              icon={Map}
              color="green"
            />
            <StatsCard
              title="Réservations"
              value={stats?.totalReservations ?? 0}
              subtitle="Toutes périodes"
              icon={Calendar}
              color="blue"
            />
            <StatsCard
              title="Revenu Total"
              value={`${Number(stats?.revenuTotal ?? 0).toFixed(0)} €`}
              subtitle="Cumul de toutes réservations"
              icon={TrendingUp}
              color="amber"
            />
            <StatsCard
              title="Disponibles"
              value={stats?.terrainsDisponibles ?? 0}
              subtitle={`sur ${stats?.totalTerrains ?? 0} terrains`}
              icon={CheckCircle}
              color="emerald"
            />
          </div>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        {/* Bar Chart — Reservations by sport */}
        <div className="bg-surface rounded-md shadow-card p-lg space-y-md">
          <div>
            <h3 className="font-sans text-[18px] font-bold text-primary tracking-tight">Réservations par sport</h3>
            <p className="text-outline text-[13px]">Répartition par type de terrain</p>
          </div>
          <div className="h-[220px]">
            {loading ? (
              <div className="h-full bg-[#F7FAF8] rounded-md animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.reservationsParSport ?? []} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#ebefed" vertical={false} />
                  <XAxis
                    dataKey="sport"
                    tick={{ fontFamily: 'var(--font-plus-jakarta)', fontSize: 12, fill: '#717972', fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontFamily: 'var(--font-plus-jakarta)', fontSize: 12, fill: '#717972' }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0px 8px 32px rgba(26,71,49,0.10)',
                      fontFamily: 'var(--font-plus-jakarta)',
                      fontSize: '13px',
                    }}
                    formatter={(value: any) => [`${value} réservation${Number(value) > 1 ? 's' : ''}`, '']}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {(stats?.reservationsParSport ?? []).map((entry) => (
                      <Cell key={entry.sport} fill={SPORT_COLORS[entry.sport] || '#1A4731'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          {/* Legend */}
          {!loading && (
            <div className="flex flex-wrap gap-sm">
              {(stats?.reservationsParSport ?? []).map((entry) => (
                <div key={entry.sport} className="flex items-center gap-xs">
                  <div className="w-3 h-3 rounded-full" style={{ background: SPORT_COLORS[entry.sport] || '#1A4731' }} />
                  <span className="text-[12px] font-semibold text-outline">{entry.sport}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Line Chart — Revenue per day */}
        <div className="bg-surface rounded-md shadow-card p-lg space-y-md">
          <div>
            <h3 className="font-sans text-[18px] font-bold text-primary tracking-tight">Revenus — 7 derniers jours</h3>
            <p className="text-outline text-[13px]">Revenu journalier en €</p>
          </div>
          <div className="h-[220px]">
            {loading ? (
              <div className="h-full bg-[#F7FAF8] rounded-md animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats?.revenusParJour ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ebefed" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontFamily: 'var(--font-plus-jakarta)', fontSize: 11, fill: '#717972', fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontFamily: 'var(--font-plus-jakarta)', fontSize: 12, fill: '#717972' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}€`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0px 8px 32px rgba(26,71,49,0.10)',
                      fontFamily: 'var(--font-plus-jakarta)',
                      fontSize: '13px',
                    }}
                    formatter={(value: any) => [`${Number(value).toFixed(2)} €`, 'Revenu']}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenu"
                    stroke="#2ECC71"
                    strokeWidth={2.5}
                    dot={{ fill: '#1A4731', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#2ECC71' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Latest Reservations */}
      <div className="bg-surface rounded-md shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-lg py-md border-b border-[#ebefed]">
          <div>
            <h3 className="font-sans text-[18px] font-bold text-primary tracking-tight">Dernières réservations</h3>
            <p className="text-outline text-[13px]">Les 5 réservations les plus récentes</p>
          </div>
          <Link
            href="/historique"
            className="text-label-sm font-bold text-secondary hover:text-primary transition-colors"
          >
            Voir tout →
          </Link>
        </div>

        {loading ? (
          <div className="p-lg space-y-sm">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-14 bg-[#F7FAF8] rounded-md animate-pulse" />
            ))}
          </div>
        ) : latestReservations.length === 0 ? (
          <div className="p-xl text-center text-outline text-body-md">Aucune réservation enregistrée.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F7FAF8]">
                  {['Client', 'Terrain', 'Date', 'Moment', 'Prix', 'Action'].map((h) => (
                    <th key={h} className="px-lg py-sm font-sans text-label-sm font-bold text-outline uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {latestReservations.map((r, idx) => (
                  <tr
                    key={r.id}
                    className={`hover:bg-[#EAF8F0]/30 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F7FAF8]'}`}
                  >
                    <td className="px-lg py-sm font-sans text-body-md font-bold text-charcoal">{r.nom_client}</td>
                    <td className="px-lg py-sm font-sans text-body-md text-primary font-semibold">
                      {r.terrain?.nom || `Terrain #${r.terrain_id}`}
                    </td>
                    <td className="px-lg py-sm font-sans text-body-md text-charcoal">{formatDate(r.date_reservation)}</td>
                    <td className="px-lg py-sm">
                      <span className={`text-[11px] font-bold px-sm py-[3px] rounded-full uppercase ${r.moment === 'matin'
                          ? 'bg-[#FFF8E7] text-[#B45309]'
                          : 'bg-[#EEF2FF] text-[#4338CA]'
                        }`}>
                        {r.moment}
                      </span>
                    </td>
                    <td className="px-lg py-sm font-sans text-body-md text-secondary font-bold">
                      {Number(r.prix_total).toFixed(2)} €
                    </td>
                    <td className="px-lg py-sm">
                      <button
                        onClick={() => setSelectedReservation(r)}
                        className="p-[8px] rounded-full bg-[#EAF8F0] hover:bg-secondary text-secondary hover:text-white transition-colors shadow-sm"
                        title="Voir la fiche"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedReservation && (
        <FicheModal
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
        />
      )}

      {/* Quick action modals */}
      {showNewReservation && (
        <NewReservationModal
          onClose={() => setShowNewReservation(false)}
          onCreated={(res) => {
            setLatestReservations((prev) => [res, ...prev].slice(0, 5));
            setShowNewReservation(false);
            load(); // refresh stats
          }}
        />
      )}
      {showNewTerrain && (
        <TerrainFormModal
          onClose={() => setShowNewTerrain(false)}
          onSaved={() => {
            setShowNewTerrain(false);
            load(); // refresh stats after new terrain
          }}
        />
      )}
    </div>
  );
}

