const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Prix {
  id: number;
  terrain_id: number;
  moment: 'matin' | 'soir';
  montant: number;
}

export interface Terrain {
  id: number;
  nom: string;
  description: string;
  type: string;
  capacite: number;
  image_url: string;
  disponible: boolean;
  created_at: string;
  prix: Prix[];
}

export interface Reservation {
  id: number;
  terrain_id: number;
  nom_client: string;
  telephone: string;
  moment: 'matin' | 'soir';
  heure: string;
  date_reservation: string;
  prix_total: number;
  created_at: string;
  terrain?: Terrain;
}

export interface CreateReservationInput {
  terrain_id: number;
  nom_client: string;
  telephone: string;
  moment: 'matin' | 'soir';
  heure: string;
  date_reservation: string;
}

export interface UpdateReservationInput {
  nom_client?: string;
  telephone?: string;
  moment?: 'matin' | 'soir';
  heure?: string;
  date_reservation?: string;
}

export interface CreateTerrainInput {
  nom: string;
  description: string;
  type: string;
  capacite: number;
  image_url: string;
  disponible: boolean;
}

export interface UpdateTerrainInput {
  nom?: string;
  description?: string;
  type?: string;
  capacite?: number;
  image_url?: string;
  disponible?: boolean;
}

export interface DashboardStats {
  totalTerrains: number;
  terrainsDisponibles: number;
  totalReservations: number;
  revenuTotal: number;
  reservationsParSport: { sport: string; count: number }[];
  revenusParJour: { date: string; revenu: number }[];
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Une erreur est survenue lors de la communication avec le serveur.');
  }
  if (response.status === 204) return null;
  return response.json();
}

// ─── TERRAINS ──────────────────────────────────────────────────────────────

export async function getTerrains(type?: string): Promise<Terrain[]> {
  const url = new URL(`${API_URL}/terrains`);
  if (type && type !== 'Tous') {
    url.searchParams.append('type', type);
  }
  const response = await fetch(url.toString(), { cache: 'no-store' });
  return handleResponse(response);
}

export async function getTerrainById(id: number): Promise<Terrain> {
  const response = await fetch(`${API_URL}/terrains/${id}`, { cache: 'no-store' });
  return handleResponse(response);
}

export async function createTerrain(input: CreateTerrainInput): Promise<Terrain> {
  const response = await fetch(`${API_URL}/terrains`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse(response);
}

export async function updateTerrain(id: number, input: UpdateTerrainInput): Promise<Terrain> {
  const response = await fetch(`${API_URL}/terrains/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse(response);
}

export async function deleteTerrain(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/terrains/${id}`, { method: 'DELETE' });
  return handleResponse(response);
}

export async function toggleTerrainAvailability(id: number): Promise<Terrain> {
  const response = await fetch(`${API_URL}/terrains/${id}/disponibilite`, {
    method: 'PATCH',
  });
  return handleResponse(response);
}

export async function getTerrainPrix(id: number): Promise<Prix[]> {
  const response = await fetch(`${API_URL}/terrains/${id}/prix`, { cache: 'no-store' });
  return handleResponse(response);
}

// ─── RESERVATIONS ──────────────────────────────────────────────────────────

export async function createReservation(input: CreateReservationInput): Promise<Reservation> {
  const response = await fetch(`${API_URL}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse(response);
}

export async function getReservations(): Promise<Reservation[]> {
  const response = await fetch(`${API_URL}/reservations`, { cache: 'no-store' });
  return handleResponse(response);
}

export async function getReservationById(id: number): Promise<Reservation> {
  const response = await fetch(`${API_URL}/reservations/${id}`, { cache: 'no-store' });
  return handleResponse(response);
}

export async function updateReservation(id: number, input: UpdateReservationInput): Promise<Reservation> {
  const response = await fetch(`${API_URL}/reservations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse(response);
}

export async function deleteReservation(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/reservations/${id}`, { method: 'DELETE' });
  return handleResponse(response);
}

// ─── DASHBOARD STATS (computed client-side) ────────────────────────────────

export async function getDashboardStats(): Promise<DashboardStats> {
  const [terrains, reservations] = await Promise.all([getTerrains(), getReservations()]);

  const totalTerrains = terrains.length;
  const terrainsDisponibles = terrains.filter((t) => t.disponible).length;
  const totalReservations = reservations.length;
  const revenuTotal = reservations.reduce((sum, r) => sum + Number(r.prix_total), 0);

  // Reservations by sport
  const sportMap: Record<string, number> = {};
  reservations.forEach((r) => {
    const sport = r.terrain?.type || 'Autre';
    sportMap[sport] = (sportMap[sport] || 0) + 1;
  });
  const reservationsParSport = Object.entries(sportMap).map(([sport, count]) => ({ sport, count }));

  // Revenue per day — last 7 days
  const now = new Date();
  const revenusParJour: { date: string; revenu: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
    const revenu = reservations
      .filter((r) => r.date_reservation === key)
      .reduce((sum, r) => sum + Number(r.prix_total), 0);
    revenusParJour.push({ date: label, revenu });
  }

  return { totalTerrains, terrainsDisponibles, totalReservations, revenuTotal, reservationsParSport, revenusParJour };
}
