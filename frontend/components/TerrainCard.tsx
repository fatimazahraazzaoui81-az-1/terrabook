import Link from 'next/link';
import Image from 'next/image';
import { Terrain } from '../lib/api';

interface TerrainCardProps {
  terrain: Terrain;
}

export default function TerrainCard({ terrain }: TerrainCardProps) {
  // Find morning and evening prices
  const priceMatin = terrain.prix.find((p) => p.moment === 'matin')?.montant ?? 0;
  const priceSoir = terrain.prix.find((p) => p.moment === 'soir')?.montant ?? 0;

  return (
    <div className="bg-surface rounded-md shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Terrain Image Area */}
      <div className="relative h-[220px] w-full bg-[#ebefed]">
        <Image
          src={terrain.image_url}
          alt={terrain.nom}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Pricing Chips (Top Right, Deep Forest Green container, white text) */}
        <div className="absolute top-[12px] right-[12px] flex flex-col gap-[6px] items-end">
          <span className="bg-primary text-white text-label-sm font-bold px-[10px] py-[4px] rounded-full shadow-[0px_2px_8px_rgba(26,71,49,0.2)]">
            M: {Number(priceMatin).toFixed(0)}€
          </span>
          <span className="bg-primary text-white text-label-sm font-bold px-[10px] py-[4px] rounded-full shadow-[0px_2px_8px_rgba(26,71,49,0.2)]">
            S: {Number(priceSoir).toFixed(0)}€
          </span>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-lg flex flex-col flex-grow justify-between gap-md">
        <div>
          {/* Tag & Availability Row */}
          <div className="flex items-center justify-between mb-sm">
            <span className="bg-[#ebefed] text-primary text-[12px] font-bold px-[12px] py-[3px] rounded-full uppercase tracking-wider">
              {terrain.type}
            </span>
            {terrain.disponible ? (
              <span className="bg-[#EAF8F0] text-secondary text-[12px] font-bold px-[12px] py-[3px] rounded-full">
                Disponible
              </span>
            ) : (
              <span className="bg-[#1C1C1E]/10 text-charcoal text-[12px] font-bold px-[12px] py-[3px] rounded-full">
                Non disponible
              </span>
            )}
          </div>

          {/* Terrain Title & Description */}
          <h3 className="font-sans text-[20px] font-bold text-primary mb-xs tracking-tight">
            {terrain.nom}
          </h3>
          <p className="font-sans text-body-md text-outline leading-relaxed line-clamp-2">
            {terrain.description}
          </p>
        </div>

        {/* Action Button */}
        <div>
          <Link
            href={`/terrains/${terrain.id}`}
            className={`block w-full text-center py-sm px-md rounded-md font-bold transition-all duration-200 ${
              terrain.disponible
                ? 'bg-secondary hover:bg-[#27ae60] text-white'
                : 'bg-charcoal/10 text-charcoal/40 cursor-not-allowed pointer-events-none'
            }`}
          >
            {terrain.disponible ? 'Réserver Maintenant' : 'Non disponible'}
          </Link>
        </div>
      </div>
    </div>
  );
}
