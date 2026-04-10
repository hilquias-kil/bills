import { motion } from 'framer-motion';
import { formatBRL } from '@/lib/money';

interface MonthSummaryProps {
  totalAmount: number;
  paidAmount: number;
  paidCount: number;
  totalCount: number;
  monthYear?: string;
}

export function MonthSummary({ totalAmount, paidAmount, paidCount, totalCount, monthYear }: MonthSummaryProps) {
  const unpaidAmount = totalAmount - paidAmount;
  const progress = totalCount > 0 ? paidCount / totalCount : 0;

  const displayDate = monthYear
    ? (() => {
        const [year, month] = monthYear.split('-');
        return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('pt-BR', {
          month: 'long',
          year: 'numeric',
        });
      })()
    : new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-surface rounded-lg border border-border p-lg mb-lg">
      <p className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-md capitalize">
        {displayDate}
      </p>

      <div className="flex items-center mb-lg">
        <div className="flex-1">
          <p className="text-xl font-bold text-paid mb-xs">{formatBRL(paidAmount)}</p>
          <p className="text-sm text-text-secondary">Pago</p>
        </div>
        <div className="w-px h-10 bg-border mx-md" />
        <div className="flex-1">
          <p className={`text-xl font-bold mb-xs ${unpaidAmount > 0 ? 'text-unpaid' : 'text-paid'}`}>
            {formatBRL(unpaidAmount)}
          </p>
          <p className="text-sm text-text-secondary">Restante</p>
        </div>
      </div>

      <div className="flex flex-col gap-sm">
        <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-paid rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <p className="text-xs text-text-muted text-center">
          {paidCount} de {totalCount} contas pagas
        </p>
      </div>
    </div>
  );
}
