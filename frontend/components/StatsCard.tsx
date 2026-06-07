import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  color?: 'green' | 'emerald' | 'amber' | 'blue';
}

const colorMap = {
  green: {
    bg: 'bg-[#EAF8F0]',
    text: 'text-primary',
    icon: 'text-primary',
    border: 'border-primary/10',
  },
  emerald: {
    bg: 'bg-[#EAF8F0]',
    text: 'text-secondary',
    icon: 'text-secondary',
    border: 'border-secondary/20',
  },
  amber: {
    bg: 'bg-[#FFF8E7]',
    text: 'text-[#B45309]',
    icon: 'text-[#D97706]',
    border: 'border-[#D97706]/20',
  },
  blue: {
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#1D4ED8]',
    icon: 'text-[#3B82F6]',
    border: 'border-[#3B82F6]/20',
  },
};

export default function StatsCard({ title, value, subtitle, icon: Icon, trend, color = 'green' }: StatsCardProps) {
  const c = colorMap[color];

  return (
    <div className="bg-surface rounded-md shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 p-lg flex flex-col gap-md">
      <div className="flex items-center justify-between">
        <p className="font-sans text-label-md text-outline font-semibold uppercase tracking-wider">{title}</p>
        <div className={`w-10 h-10 rounded-md ${c.bg} flex items-center justify-center border ${c.border}`}>
          <Icon size={20} className={c.icon} />
        </div>
      </div>

      <div>
        <p className={`font-sans text-[32px] font-bold tracking-tight ${c.text}`}>{value}</p>
        {subtitle && (
          <p className="font-sans text-[13px] text-outline mt-[2px]">{subtitle}</p>
        )}
      </div>

      {trend && (
        <div className="flex items-center gap-xs mt-auto pt-sm border-t border-[#ebefed]">
          <span className={`text-[12px] font-bold ${trend.value >= 0 ? 'text-secondary' : 'text-error'}`}>
            {trend.value >= 0 ? '▲' : '▼'} {Math.abs(trend.value)}%
          </span>
          <span className="text-[12px] text-outline">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
