import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Banknote } from 'lucide-react';
import { BillCard } from '@/components/bill-card';
import { MonthSummary } from '@/components/month-summary';
import { PaymentHistoryItem } from '@/components/payment-history-item';
import { EmptyState } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { useBills } from '@/context/bills-context';
import { formatBRL } from '@/lib/money';
import { getCurrentMonthYear } from '@/lib/storage';

export function MonthlyPage() {
  const { payments, bills, isLoading } = useBills();
  const currentMonthYear = getCurrentMonthYear();
  const [selectedMonth, setSelectedMonth] = useState(currentMonthYear);

  const nextMonths = useMemo(() => {
    const months: string[] = [];
    const [year, month] = currentMonthYear.split('-').map(Number);
    for (let i = 1; i <= 12; i++) {
      const d = new Date(year, month - 1 + i, 1);
      months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    }
    return months;
  }, [currentMonthYear]);

  const availableMonths = useMemo(() => {
    const pastMonths = Array.from(new Set(payments.map((p) => p.monthYear)))
      .filter((m) => m < currentMonthYear)
      .sort()
      .reverse();
    return [currentMonthYear, ...nextMonths, ...pastMonths];
  }, [payments, currentMonthYear, nextMonths]);

  const isFutureMonth = selectedMonth > currentMonthYear;
  const isPastMonth = selectedMonth < currentMonthYear;
  const isCurrentMonth = selectedMonth === currentMonthYear;

  const filteredPayments = useMemo(
    () => payments.filter((p) => p.monthYear === selectedMonth),
    [payments, selectedMonth]
  );

  const recurringBills = useMemo(() => bills.filter((b) => b.isRecurring), [bills]);

  const monthStats = useMemo(() => {
    if (isCurrentMonth) {
      const totalAmount = bills.reduce((sum, b) => sum + b.amount, 0);
      const paidAmount = bills.filter((b) => b.isPaid).reduce((sum, b) => sum + b.amount, 0);
      const paidCount = bills.filter((b) => b.isPaid).length;
      return { totalAmount, paidAmount, paidCount, totalCount: bills.length };
    } else if (isFutureMonth) {
      const totalAmount = recurringBills.reduce(
        (sum, b) => sum + (b.isVariableAmount ? 0 : b.amount),
        0
      );
      return { totalAmount, paidAmount: 0, paidCount: 0, totalCount: recurringBills.length };
    } else {
      const paidAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
      return {
        totalAmount: paidAmount,
        paidAmount,
        paidCount: filteredPayments.length,
        totalCount: filteredPayments.length,
      };
    }
  }, [selectedMonth, bills, filteredPayments, recurringBills, isCurrentMonth, isFutureMonth]);

  const categoryBreakdown = useMemo(() => {
    const breakdown: Record<string, { amount: number; count: number }> = {};

    if (isFutureMonth) {
      recurringBills.forEach((b) => {
        const cat = b.category || 'Other';
        if (!breakdown[cat]) breakdown[cat] = { amount: 0, count: 0 };
        breakdown[cat].amount += b.isVariableAmount ? 0 : b.amount;
        breakdown[cat].count += 1;
      });
    } else {
      filteredPayments.forEach((p) => {
        const bill = bills.find((b) => b.id === p.billId);
        const cat = bill?.category || 'Other';
        if (!breakdown[cat]) breakdown[cat] = { amount: 0, count: 0 };
        breakdown[cat].amount += p.amount;
        breakdown[cat].count += 1;
      });
    }

    return Object.entries(breakdown).sort((a, b) => b[1].amount - a[1].amount);
  }, [filteredPayments, bills, recurringBills, isFutureMonth]);

  const formatMonthName = (my: string) => {
    const [year, month] = my.split('-');
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('pt-BR', {
      month: 'short',
    });
  };

  const formatYear = (my: string) => my.split('-')[0];

  if (isLoading) return <Spinner />;

  return (
    <div className="flex flex-col h-full bg-bg">
      <div className="px-lg pt-lg pb-md flex-shrink-0">
        <h1 className="text-xxl font-bold text-text">Mensal</h1>
      </div>

      {/* Month picker */}
      <div className="flex-shrink-0 border-b border-border">
        <div className="flex gap-md px-lg py-md overflow-x-auto">
          {availableMonths.map((month) => (
            <button
              key={month}
              onClick={() => setSelectedMonth(month)}
              className={`flex-shrink-0 flex flex-col items-center px-lg py-sm rounded-full border min-w-[72px] transition-all ${
                selectedMonth === month
                  ? 'bg-accent border-accent scale-105'
                  : 'bg-surface border-border'
              }`}
            >
              <span
                className={`text-md font-bold capitalize ${
                  selectedMonth === month ? 'text-white' : 'text-text'
                }`}
              >
                {formatMonthName(month)}
              </span>
              <span
                className={`text-xs ${
                  selectedMonth === month ? 'text-white/80' : 'text-text-secondary'
                }`}
              >
                {formatYear(month)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-lg pt-lg pb-lg">
        <MonthSummary
          monthYear={selectedMonth}
          totalAmount={monthStats.totalAmount}
          paidAmount={monthStats.paidAmount}
          paidCount={monthStats.paidCount}
          totalCount={monthStats.totalCount}
        />

        {/* Category breakdown */}
        {categoryBreakdown.length > 0 && (
          <div className="mb-xl">
            <p className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-md">
              {isFutureMonth ? 'Previsão por categoria' : 'Gastos por categoria'}
            </p>
            <div className="bg-surface rounded-lg border border-border p-lg flex flex-col gap-md">
              {categoryBreakdown.map(([cat, stats], idx) => {
                const totalForCalc = isFutureMonth ? monthStats.totalAmount : monthStats.paidAmount;
                const percentage = totalForCalc > 0 ? (stats.amount / totalForCalc) * 100 : 0;
                return (
                  <div key={cat} className="flex flex-col gap-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text font-medium">{cat}</span>
                      <span className="text-sm text-text-secondary font-semibold">
                        {formatBRL(stats.amount)}
                      </span>
                    </div>
                    <div className="h-[6px] bg-surface-elevated rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-accent rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.4, delay: idx * 0.05, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bills / Payments section */}
        <div className="mb-xl">
          <p className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-md">
            {isCurrentMonth
              ? 'Pagamentos até agora'
              : isFutureMonth
              ? 'Contas previstas'
              : 'Pagamentos realizados'}
          </p>

          {isFutureMonth ? (
            recurringBills.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="Nenhuma conta recorrente"
                description="Adicione contas mensais para ver a previsão"
              />
            ) : (
              recurringBills.map((bill) => (
                <BillCard
                  key={bill.id}
                  bill={{ ...bill, isPaid: false }}
                  onTogglePaid={() => {}}
                  isReadOnly
                />
              ))
            )
          ) : filteredPayments.length === 0 ? (
            <EmptyState
              icon={Banknote}
              title="Nenhum pagamento registrado"
              description={isPastMonth ? 'Não há registros para este mês' : 'Marque contas como pagas para vê-las aqui'}
            />
          ) : (
            filteredPayments.map((payment) => (
              <PaymentHistoryItem key={payment.id} payment={payment} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
