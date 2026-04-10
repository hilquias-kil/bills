import { CheckCircle2 } from 'lucide-react';
import { PaymentRecord } from '@/lib/types';
import { formatBRL } from '@/lib/money';

interface PaymentHistoryItemProps {
  payment: PaymentRecord;
}

export function PaymentHistoryItem({ payment }: PaymentHistoryItemProps) {
  const date = new Date(payment.paidDate);
  const formattedDate = date.toLocaleDateString('pt-BR', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="flex items-center gap-md bg-surface rounded-md border border-border p-md mb-sm">
      <div className="w-10 h-10 rounded-full bg-paid-bg flex items-center justify-center flex-shrink-0">
        <CheckCircle2 size={24} className="text-paid" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-md font-semibold text-text truncate">{payment.billName}</p>
        <p className="text-sm text-text-secondary">{formattedDate}</p>
      </div>

      <span className="text-md font-bold text-paid flex-shrink-0">{formatBRL(payment.amount)}</span>
    </div>
  );
}
