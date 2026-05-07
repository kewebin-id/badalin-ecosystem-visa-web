import { Button, Image } from '@/components/atoms';
import { DialogDrawer } from '@/components/molecules/dialog-drawer';
import { INusukCompatibility } from '@/packages/pilgrim/management/domain/member';
import { cn } from '@/shared/utils/merge-class';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, Lightbulb } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export interface GuideBlockProps {
  hideExample?: boolean;
}

export const GuideBlock = ({ hideExample }: GuideBlockProps) => {
  const t = useTranslations('PilgrimManagement.nusuk');
  return (
    <div className="space-y-4 pt-2">
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="size-4 text-amber-600" />
          <h4 className="text-amber-800 font-bold text-sm m-0">{t('tipsTitle')}</h4>
        </div>
        <ul className="text-amber-700 text-xs space-y-2 list-disc pl-4 mb-0">
          <li>{t('tips.noBlur')}</li>
          <li>{t('tips.noGlare')}</li>
          <li>{t('tips.noWatermark')}</li>
          <li>{t('tips.goodLighting')}</li>
        </ul>
      </div>

      {!hideExample && (
        <div>
          <p className="font-bold text-sm mb-3 text-foreground">{t('exampleTitle')}</p>
          {process.env.NEXT_PUBLIC_DUMMY_PASSPORT_URL ? (
            <div className="aspect-4/3 relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
              <Image
                src={process.env.NEXT_PUBLIC_DUMMY_PASSPORT_URL}
                alt="Example"
                width={600}
                height={450}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-4/3 bg-gray-50 flex items-center justify-center rounded-xl border border-gray-100">
              <span className="text-xs text-gray-400">Example Not Available</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface NusukIndicatorProps {
  compatibility?: INusukCompatibility;
  onRetake: () => void;
  isWarningConfirmed: boolean;
  onWarningConfirm: (confirmed: boolean) => void;
  variant?: 'default' | 'compact';
}

export const NusukIndicator = ({
  compatibility,
  onRetake,
  isWarningConfirmed,
  onWarningConfirm,
  variant = 'default',
}: NusukIndicatorProps) => {
  const t = useTranslations('PilgrimManagement.nusuk');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (compatibility?.status === 'REJECTED') {
      setIsDialogOpen(true);
    }
  }, [compatibility?.status]);

  if (!compatibility) {
    if (variant === 'compact') return null;
    return (
      <div className="mt-4 p-5 rounded-3xl border border-gray-100 bg-white shadow-sm space-y-4 animate-in fade-in duration-500">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-primary-default/10 flex items-center justify-center">
            <Info className="size-4 text-primary-default" />
          </div>
          <div>
            <h3 className="text-sm font-bold m-0">{t('guideTitle')}</h3>
            <p className="text-[10px] text-muted-foreground m-0">{t('guideDesc')}</p>
          </div>
        </div>
        <GuideBlock />
      </div>
    );
  }

  const { score, status, message } = compatibility;

  const config = {
    SAFE: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      text: 'text-emerald-700',
      icon: <CheckCircle2 className="size-5 text-emerald-500" />,
      label: t('statusSafe'),
    },
    WARNING: {
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      text: 'text-amber-700',
      icon: <AlertTriangle className="size-5 text-amber-500" />,
      label: message || t('statusWarning'),
    },
    REJECTED: {
      bg: 'bg-rose-50',
      border: 'border-rose-100',
      text: 'text-rose-700',
      icon: <AlertCircle className="size-5 text-rose-500" />,
      label: message || t('statusRejected'),
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
          onClick={() => setIsDialogOpen(true)}
        >
          <Info className="size-4 mr-2" />
          {t('readTips')}
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
          <label
            htmlFor="confirm-warning"
            className="text-xs font-medium text-amber-800 cursor-pointer"
          >
            Saya sudah memeriksa data dan yakin benar
          </label>
        </div>
      )}

      <DialogDrawer
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        title={t('dialogTitle')}
        submitButton={t('dialogSubmit')}
        onCancel={() => setIsDialogOpen(false)}
        onSubmit={() => {
          setIsDialogOpen(false);
          onRetake();
        }}
        disabledSubmitButton={false}
      >
        <div className="space-y-4 pb-4">
          <p className="text-sm text-muted-foreground leading-relaxed">{t('rejectedDesc')}</p>
          <GuideBlock />
        </div>
      </DialogDrawer>
    </div>
  );
};
