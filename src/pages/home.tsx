import { Plus, Receipt } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BillCard } from '@/components/bill-card';
import { MonthSummary } from '@/components/month-summary';
import { EmptyState } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { useBills } from '@/context/bills-context';

export function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bills, isLoading, markAsPaid, markAsUnpaid } = useBills();

  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const paidAmount = bills.filter((b) => b.isPaid).reduce((sum, b) => sum + b.amount, 0);
  const paidCount = bills.filter((b) => b.isPaid).length;

  const sortedBills = [...bills].sort((a, b) => {
    if (a.isPaid !== b.isPaid) return a.isPaid ? 1 : -1;
    return a.dueDay - b.dueDay;
  });

  const handleTogglePaid = async (billId: string, shouldBePaid: boolean) => {
    if (shouldBePaid) {
      await markAsPaid(billId);
    } else {
      await markAsUnpaid(billId);
    }
  };

  const handleAddBill = () => {
    navigate('/bill/new', { state: { backgroundLocation: location } });
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="relative flex flex-col h-full bg-bg">
      <div className="px-lg pt-lg pb-md flex-shrink-0">
        <h1 className="text-xxl font-bold text-text">Contas</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-lg pb-[88px]">
        <MonthSummary
          totalAmount={totalAmount}
          paidAmount={paidAmount}
          paidCount={paidCount}
          totalCount={bills.length}
        />

        {bills.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="Nenhuma conta ainda"
            description="Adicione sua primeira conta para começar a rastrear"
          />
        ) : (
          <div>
            <p className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-md">
              Este mês
            </p>
            {sortedBills.map((bill) => (
              <BillCard
                key={bill.id}
                bill={bill}
                onTogglePaid={handleTogglePaid}
              />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={handleAddBill}
        className="fixed bottom-[76px] right-lg w-14 h-14 rounded-full bg-accent flex items-center justify-center shadow-lg transition-transform active:scale-95"
        style={{ boxShadow: '0 4px 24px rgba(99,102,241,0.35)' }}
        aria-label="Adicionar conta"
      >
        <Plus size={28} className="text-white" />
      </button>
    </div>
  );
}
