import { Button } from '@/components/atoms';
import { cn } from '@/shared/utils/merge-class';
import { AlertCircle, AlertTriangle, CheckCircle2, RefreshCcw } from 'lucide-react';
import { INusukCompatibility } from '../../domain/member';

interface NusukIndicatorProps {
  compatibility?: INusukCompatibility;
  onRetake: () => void;
  isWarningConfirmed: boolean;
  onWarningConfirm: (confirmed: boolean) => void;
}

export const NusukIndicator = ({
  compatibility,
  onRetake,
  isWarningConfirmed,
  onWarningConfirm,
}: NusukIndicatorProps) => {
  if (!compatibility) return null;

  const { score, status, message } = compatibility;

  const config = {
    SAFE: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      text: 'text-emerald-700',
      icon: <CheckCircle2 className="size-5 text-emerald-500" />,
      label: 'Pasti Lolos Nusuk! Lanjutkan.',
    },
    WARNING: {
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      text: 'text-amber-700',
      icon: <AlertTriangle className="size-5 text-amber-500" />,
      label: message,
    },
    REJECTED: {
      bg: 'bg-rose-50',
      border: 'border-rose-100',
      text: 'text-rose-700',
      icon: <AlertCircle className="size-5 text-rose-500" />,
      label: message,
    },
  }[status];

  return (
    <div
      className={cn(
        'mt-4 p-4 rounded-2xl border flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300',
        config.bg,
        config.border,
      )}
    >
      <div className="flex items-start gap-3">
        {config.icon}
        <div className="flex-1">
          <p className={cn('text-sm font-bold', config.text)}>{config.label}</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-1000',
                  status === 'SAFE'
                    ? 'bg-emerald-500'
                    : status === 'WARNING'
                    ? 'bg-amber-500'
                    : 'bg-rose-500',
                )}
                style={{ width: `${score}%` }}
              />
            </div>
            <span className={cn('text-xs font-mono font-bold', config.text)}>
              {Math.round(score)}%
            </span>
          </div>
        </div>
      </div>

      {status === 'REJECTED' && (
        <Button
          type="button"
          variant="primaryOutline"
          size="sm"
          className="w-full bg-white/50 hover:bg-white text-rose-600 border border-rose-100"
          onClick={onRetake}
        >
          <RefreshCcw className="size-4 mr-2" />
          Ambil Ulang Foto
        </Button>
      )}

      {status === 'WARNING' && !isWarningConfirmed && (
        <div className="flex items-center gap-2 mt-1">
          <input
            type="checkbox"
            id="confirm-warning"
            className="size-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
            checked={isWarningConfirmed}
            onChange={(e) => onWarningConfirm(e.target.checked)}
          />
          <label htmlFor="confirm-warning" className="text-xs font-medium text-amber-800 cursor-pointer">
            Saya sudah memeriksa data dan yakin benar
          </label>
        </div>
      )}
    </div>
  );
};
