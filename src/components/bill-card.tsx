import { motion } from 'framer-motion';
import { Check, ChevronRight, RefreshCw, Receipt, TrendingUp, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bill } from '@/lib/types';
import { formatBRL } from '@/lib/money';

interface BillCardProps {
  bill: Bill;
  onTogglePaid: (billId: string, isPaid: boolean) => void;
  isReadOnly?: boolean;
}

export function BillCard({ bill, onTogglePaid, isReadOnly = false }: BillCardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const today = new Date().getDate();
  const isOverdue = !bill.isPaid && bill.dueDay < today;
  const isDueSoon = !bill.isPaid && !isOverdue && bill.dueDay - today <= 3 && bill.dueDay >= today;
  const needsAmountUpdate = bill.isVariableAmount && bill.amount === 0 && !bill.isPaid;
  const displayAmount = isReadOnly && bill.isVariableAmount ? 0 : bill.amount;

  const statusColorClass = isReadOnly
    ? 'text-text-secondary'
    : bill.isPaid
    ? 'text-paid'
    : isOverdue
    ? 'text-overdue'
    : isDueSoon
    ? 'text-unpaid'
    : 'text-text-secondary';

  const statusBgClass = isReadOnly
    ? 'bg-surface-elevated'
    : bill.isPaid
    ? 'bg-paid-bg'
    : isOverdue
    ? 'bg-overdue-bg'
    : isDueSoon
    ? 'bg-unpaid-bg'
    : 'bg-surface-elevated';

  const statusText = bill.isPaid
    ? 'Pago'
    : isOverdue
    ? 'Vencido'
    : isDueSoon
    ? 'Vence em breve'
    : `Vence dia ${bill.dueDay}`;

  const handleCardClick = () => {
    if (isReadOnly) return;
    navigate(`/bill/${bill.id}`, { state: { backgroundLocation: location } });
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTogglePaid(bill.id, !bill.isPaid);
  };

  return (
    <div
      className={`flex items-center gap-md bg-surface rounded-md border border-border p-md mb-sm transition-opacity ${
        isReadOnly ? '' : 'cursor-pointer active:opacity-80'
      }`}
      style={bill.color ? { borderLeft: `4px solid ${bill.color}` } : undefined}
      onClick={handleCardClick}
    >
      {/* Checkbox */}
      {!isReadOnly && (
        <motion.button
          className={`w-6 h-6 rounded-sm border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
            bill.isPaid ? 'bg-paid border-paid' : 'border-text-muted'
          }`}
          whileTap={{ scale: 0.75 }}
          onClick={handleToggle}
          aria-label={bill.isPaid ? 'Marcar como não pago' : 'Marcar como pago'}
        >
          {bill.isPaid && <Check size={14} className="text-bg" />}
        </motion.button>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col gap-xs min-w-0">
        {/* Top row */}
        <div className="flex items-center gap-sm">
          <span className="text-lg leading-none flex-shrink-0">{bill.emoji || '📄'}</span>
          <span
            className={`text-md font-semibold flex-1 truncate ${
              bill.isPaid ? 'text-text-secondary line-through' : 'text-text'
            }`}
          >
            {bill.name}
          </span>
          {!isReadOnly && needsAmountUpdate ? (
            <span className="flex items-center gap-1 bg-unpaid-bg px-sm py-[2px] rounded-sm flex-shrink-0">
              <AlertCircle size={14} className="text-unpaid" />
              <span className="text-xs font-semibold text-unpaid">Definir valor</span>
            </span>
          ) : (
            <span
              className={`text-md font-bold flex-shrink-0 ${
                bill.isPaid ? 'text-text-secondary' : 'text-text'
              }`}
            >
              {formatBRL(displayAmount)}
            </span>
          )}
        </div>

        {/* Bottom row */}
        <div className="flex items-center gap-sm flex-wrap">
          <span className={`text-xs font-semibold px-sm py-[2px] rounded-sm ${statusBgClass} ${statusColorClass}`}>
            {statusText}
          </span>
          <span className="flex items-center gap-1 text-text-muted">
            {bill.isRecurring ? <RefreshCw size={12} /> : <Receipt size={12} />}
            <span className="text-xs">{bill.isRecurring ? 'Mensal' : 'Avulso'}</span>
          </span>
          {bill.isVariableAmount && (
            <span className="flex items-center gap-1 text-text-muted">
              <TrendingUp size={12} />
              <span className="text-xs">Variável</span>
            </span>
          )}
          {bill.category && (
            <span className="text-xs text-text-muted">{bill.category}</span>
          )}
        </div>
      </div>

      {!isReadOnly && <ChevronRight size={20} className="text-text-muted flex-shrink-0" />}
    </div>
  );
}
