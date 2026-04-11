'use client';

import { Card } from '@/components/atoms';
import { Info } from 'lucide-react';
import { ReactNode } from 'react';

interface GlobalKPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  info?: string;
  className?: string;
}

export const GlobalKPICard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  info,
  className = '',
}: GlobalKPICardProps) => {
  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {icon && <div className="text-primary-600">{icon}</div>}
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            {info && (
              <div className="group relative">
                <Info className="h-4 w-4 text-gray-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  {info}
                </div>
              </div>
            )}
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            <span>{trend.isPositive ? '↗' : '↘'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </Card>
  );
};
