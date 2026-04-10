import { Clock } from 'lucide-react';
import { PaymentHistoryItem } from '@/components/payment-history-item';
import { EmptyState } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { useBills } from '@/context/bills-context';
import { formatBRL } from '@/lib/money';
import { PaymentRecord } from '@/lib/types';

type GroupedPayments = Record<string, PaymentRecord[]>;

function groupPaymentsByMonth(payments: PaymentRecord[]): GroupedPayments {
  return payments.reduce((groups, payment) => {
    const key = payment.monthYear;
    if (!groups[key]) groups[key] = [];
    groups[key].push(payment);
    return groups;
  }, {} as GroupedPayments);
}

function formatMonthYear(monthYear: string): string {
  const [year, month] = monthYear.split('-');
  return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });
}

function getMonthTotal(payments: PaymentRecord[]): number {
  return payments.reduce((sum, p) => sum + p.amount, 0);
}

export function HistoryPage() {
  const { payments, isLoading } = useBills();

  if (isLoading) return <Spinner />;

  const groupedPayments = groupPaymentsByMonth(payments);
  const sortedMonths = Object.keys(groupedPayments).sort().reverse();

  return (
    <div className="flex flex-col h-full bg-bg">
      <div className="px-lg pt-lg pb-md flex-shrink-0">
        <h1 className="text-xxl font-bold text-text">Histórico</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-lg pb-lg">
        {payments.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="Nenhum pagamento ainda"
            description="Marque contas como pagas para ver seu histórico"
          />
        ) : (
          sortedMonths.map((monthYear) => (
            <div key={monthYear} className="mb-lg">
              <div className="flex justify-between items-center mb-md">
                <span className="text-sm font-semibold text-text-secondary uppercase tracking-wider capitalize">
                  {formatMonthYear(monthYear)}
                </span>
                <span className="text-sm font-semibold text-paid">
                  {formatBRL(getMonthTotal(groupedPayments[monthYear]))}
                </span>
              </div>
              {groupedPayments[monthYear].map((payment) => (
                <PaymentHistoryItem key={payment.id} payment={payment} />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
