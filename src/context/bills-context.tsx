import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import {
  getCurrentMonthYear,
  getLastResetMonth,
  getStoredBills,
  getStoredPayments,
  setLastResetMonth,
  setStoredBills,
  setStoredPayments,
} from '@/lib/storage';
import { Bill, PaymentRecord } from '@/lib/types';

interface BillsContextType {
  bills: Bill[];
  payments: PaymentRecord[];
  isLoading: boolean;
  addBill: (bill: Omit<Bill, 'id' | 'isPaid'>) => Promise<void>;
  updateBill: (id: string, updates: Partial<Bill>) => Promise<void>;
  deleteBill: (id: string) => Promise<void>;
  markAsPaid: (billId: string) => Promise<void>;
  markAsUnpaid: (billId: string) => Promise<void>;
  getBillById: (id: string) => Bill | undefined;
}

const BillsContext = createContext<BillsContextType | undefined>(undefined);

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function BillsProvider({ children }: { children: ReactNode }) {
  const [bills, setBills] = useState<Bill[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initialize() {
      try {
        const [storedBills, storedPayments, lastReset] = await Promise.all([
          getStoredBills<Bill>(),
          getStoredPayments<PaymentRecord>(),
          getLastResetMonth(),
        ]);

        const currentMonth = getCurrentMonthYear();

        if (lastReset !== currentMonth) {
          const resetBills = storedBills.map((bill) => ({
            ...bill,
            isPaid: bill.isRecurring ? false : bill.isPaid,
            amount: bill.isRecurring && bill.isVariableAmount ? 0 : bill.amount,
          }));
          await Promise.all([
            setStoredBills(resetBills),
            setLastResetMonth(currentMonth),
          ]);
          setBills(resetBills);
        } else {
          setBills(storedBills);
        }

        setPayments(storedPayments);
      } catch (error) {
        console.error('Error initializing bills:', error);
      } finally {
        setIsLoading(false);
      }
    }

    initialize();
  }, []);

  const addBill = useCallback(async (billData: Omit<Bill, 'id' | 'isPaid'>) => {
    const newBill: Bill = {
      ...billData,
      id: generateId(),
      isPaid: false,
      isRecurring: billData.isRecurring ?? true,
      isVariableAmount: billData.isVariableAmount ?? false,
    };

    setBills((prev) => {
      const updated = [...prev, newBill];
      setStoredBills(updated);
      return updated;
    });
  }, []);

  const updateBill = useCallback(async (id: string, updates: Partial<Bill>) => {
    setBills((prev) => {
      const updated = prev.map((bill) =>
        bill.id === id ? { ...bill, ...updates } : bill
      );
      setStoredBills(updated);
      return updated;
    });
  }, []);

  const deleteBill = useCallback(async (id: string) => {
    setBills((prev) => {
      const updated = prev.filter((bill) => bill.id !== id);
      setStoredBills(updated);
      return updated;
    });
  }, []);

  const markAsPaid = useCallback(async (billId: string) => {
    const bill = bills.find((b) => b.id === billId);
    if (!bill) return;

    const now = new Date();
    const paidDate = now.toISOString();
    const monthYear = getCurrentMonthYear();

    setBills((prev) => {
      const updated = prev.map((b) =>
        b.id === billId ? { ...b, isPaid: true, lastPaidDate: paidDate } : b
      );
      setStoredBills(updated);
      return updated;
    });

    const paymentRecord: PaymentRecord = {
      id: generateId(),
      billId,
      billName: bill.name,
      paidDate,
      amount: bill.amount,
      monthYear,
    };

    setPayments((prev) => {
      const updated = [paymentRecord, ...prev];
      setStoredPayments(updated);
      return updated;
    });
  }, [bills]);

  const markAsUnpaid = useCallback(async (billId: string) => {
    const monthYear = getCurrentMonthYear();

    setBills((prev) => {
      const updated = prev.map((b) =>
        b.id === billId ? { ...b, isPaid: false, lastPaidDate: undefined } : b
      );
      setStoredBills(updated);
      return updated;
    });

    setPayments((prev) => {
      const updated = prev.filter(
        (p) => !(p.billId === billId && p.monthYear === monthYear)
      );
      setStoredPayments(updated);
      return updated;
    });
  }, []);

  const getBillById = useCallback((id: string) => {
    return bills.find((bill) => bill.id === id);
  }, [bills]);

  return (
    <BillsContext.Provider
      value={{
        bills,
        payments,
        isLoading,
        addBill,
        updateBill,
        deleteBill,
        markAsPaid,
        markAsUnpaid,
        getBillById,
      }}
    >
      {children}
    </BillsContext.Provider>
  );
}

export function useBills() {
  const context = useContext(BillsContext);
  if (context === undefined) {
    throw new Error('useBills must be used within a BillsProvider');
  }
  return context;
}
