import { useState } from 'react';
import { Check, RefreshCw, Receipt, Lock, TrendingUp } from 'lucide-react';
import { formatDecimalBR, parseDecimalBR, sanitizeBRLInput } from '@/lib/money';
import { Bill, BILL_COLORS, BILL_EMOJIS, BillFormData, CATEGORIES } from '@/lib/types';

interface BillFormProps {
  bill?: Bill;
  onSubmit: (data: BillFormData) => void;
  onDelete?: () => void;
}

export function BillForm({ bill, onSubmit, onDelete }: BillFormProps) {
  const [name, setName] = useState(bill?.name ?? '');
  const [amount, setAmount] = useState(
    typeof bill?.amount === 'number' ? formatDecimalBR(bill.amount, { useGrouping: false }) : ''
  );
  const [dueDay, setDueDay] = useState(bill?.dueDay?.toString() ?? '');
  const [category, setCategory] = useState(bill?.category ?? '');
  const [isRecurring, setIsRecurring] = useState(bill?.isRecurring ?? true);
  const [isVariableAmount, setIsVariableAmount] = useState(bill?.isVariableAmount ?? false);
  const [emoji, setEmoji] = useState(bill?.emoji ?? '');
  const [color, setColor] = useState(bill?.color ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    const parsedAmount = parseDecimalBR(amount);
    if (!amount || isNaN(parsedAmount) || (!isVariableAmount && parsedAmount <= 0)) {
      newErrors.amount = isVariableAmount
        ? 'Informe um valor válido'
        : 'Informe um valor maior que zero';
    }

    const parsedDueDay = parseInt(dueDay, 10);
    if (!dueDay || isNaN(parsedDueDay) || parsedDueDay < 1 || parsedDueDay > 31) {
      newErrors.dueDay = 'Dia deve ser entre 1 e 31';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const parsedAmount = parseDecimalBR(amount);
    onSubmit({
      name: name.trim(),
      amount: Number.isFinite(parsedAmount) ? parsedAmount : 0,
      dueDay: parseInt(dueDay, 10),
      category: category || undefined,
      emoji: emoji || undefined,
      color: color || undefined,
      isRecurring,
      isVariableAmount: isRecurring ? isVariableAmount : false,
    });
  };

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="flex flex-col gap-lg p-lg pb-xl overflow-y-auto overflow-x-hidden">

        {/* Icon & Color */}
        <div className="flex flex-col gap-sm">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Ícone e Cor (opcional)
          </label>
          <div className="flex items-center gap-md">
            {/* Preview */}
            <div
              className="w-14 h-14 rounded-md border-2 flex items-center justify-center flex-shrink-0 text-2xl"
              style={
                color
                  ? { backgroundColor: color + '25', borderColor: color }
                  : { backgroundColor: '#1a1a1a', borderColor: '#2a2a2a' }
              }
            >
              {emoji || '📄'}
            </div>

            {/* Pickers */}
            <div className="flex-1 flex flex-col gap-sm min-w-0">
              {/* Emoji picker */}
              <div className="flex gap-xs overflow-x-auto">
                {BILL_EMOJIS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEmoji(emoji === e ? '' : e)}
                    className={`w-9 h-9 rounded-sm border flex-shrink-0 flex items-center justify-center text-lg transition-colors ${
                      emoji === e
                        ? 'bg-accent-bg border-accent'
                        : 'bg-surface border-border'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>

              {/* Color picker */}
              <div className="flex gap-xs overflow-x-auto">
                {BILL_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(color === c ? '' : c)}
                    className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center transition-transform active:scale-90"
                    style={{
                      backgroundColor: c,
                      outline: color === c ? `2px solid #f5f5f5` : 'none',
                      outlineOffset: '2px',
                    }}
                    aria-label={`Cor ${c}`}
                  >
                    {color === c && <Check size={14} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bill Name */}
        <div className="flex flex-col gap-sm">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Nome da conta
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ex: Conta de luz"
            autoFocus
            className={`bg-surface border rounded-md px-md py-md text-md text-text placeholder:text-text-muted outline-none focus:border-accent transition-colors ${
              errors.name ? 'border-overdue' : 'border-border'
            }`}
          />
          {errors.name && <p className="text-xs text-overdue">{errors.name}</p>}
        </div>

        {/* Bill Type */}
        <div className="flex flex-col gap-sm">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Tipo de conta
          </label>
          <div className="flex gap-sm">
            <button
              type="button"
              onClick={() => setIsRecurring(true)}
              className={`flex-1 flex flex-col items-center gap-xs p-md rounded-md border transition-colors ${
                isRecurring
                  ? 'bg-accent-bg border-accent'
                  : 'bg-surface border-border'
              }`}
            >
              <RefreshCw size={18} className={isRecurring ? 'text-accent' : 'text-text-muted'} />
              <span className={`text-sm font-semibold ${isRecurring ? 'text-accent' : 'text-text-secondary'}`}>
                Mensal
              </span>
              <span className="text-xs text-text-muted">Renova todo mês</span>
            </button>
            <button
              type="button"
              onClick={() => setIsRecurring(false)}
              className={`flex-1 flex flex-col items-center gap-xs p-md rounded-md border transition-colors ${
                !isRecurring
                  ? 'bg-accent-bg border-accent'
                  : 'bg-surface border-border'
              }`}
            >
              <Receipt size={18} className={!isRecurring ? 'text-accent' : 'text-text-muted'} />
              <span className={`text-sm font-semibold ${!isRecurring ? 'text-accent' : 'text-text-secondary'}`}>
                Avulso
              </span>
              <span className="text-xs text-text-muted">Pagamento único</span>
            </button>
          </div>
        </div>

        {/* Amount Type (only for recurring) */}
        {isRecurring && (
          <div className="flex flex-col gap-sm">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Tipo de valor
            </label>
            <div className="flex gap-sm">
              <button
                type="button"
                onClick={() => setIsVariableAmount(false)}
                className={`flex-1 flex flex-col items-center gap-xs p-md rounded-md border transition-colors ${
                  !isVariableAmount
                    ? 'bg-accent-bg border-accent'
                    : 'bg-surface border-border'
                }`}
              >
                <Lock size={18} className={!isVariableAmount ? 'text-accent' : 'text-text-muted'} />
                <span className={`text-sm font-semibold ${!isVariableAmount ? 'text-accent' : 'text-text-secondary'}`}>
                  Fixo
                </span>
                <span className="text-xs text-text-muted">Mesmo todo mês</span>
              </button>
              <button
                type="button"
                onClick={() => setIsVariableAmount(true)}
                className={`flex-1 flex flex-col items-center gap-xs p-md rounded-md border transition-colors ${
                  isVariableAmount
                    ? 'bg-accent-bg border-accent'
                    : 'bg-surface border-border'
                }`}
              >
                <TrendingUp size={18} className={isVariableAmount ? 'text-accent' : 'text-text-muted'} />
                <span className={`text-sm font-semibold ${isVariableAmount ? 'text-accent' : 'text-text-secondary'}`}>
                  Variável
                </span>
                <span className="text-xs text-text-muted">Muda todo mês</span>
              </button>
            </div>
          </div>
        )}

        {/* Amount + Due Day */}
        <div className="flex gap-md min-w-0">
          <div className="flex-1 min-w-0 flex flex-col gap-sm">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              {isVariableAmount && isRecurring ? 'Valor atual (R$)' : 'Valor (R$)'}
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(sanitizeBRLInput(e.target.value))}
              placeholder="0,00"
              className={`bg-surface border rounded-md px-md py-md text-md text-text placeholder:text-text-muted outline-none focus:border-accent transition-colors ${
                errors.amount ? 'border-overdue' : 'border-border'
              }`}
            />
            {errors.amount && <p className="text-xs text-overdue">{errors.amount}</p>}
          </div>

          <div className="flex-1 min-w-0 flex flex-col gap-sm">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Dia do vencimento
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={dueDay}
              onChange={(e) => setDueDay(e.target.value.replace(/\D/g, '').slice(0, 2))}
              placeholder="15"
              maxLength={2}
              className={`bg-surface border rounded-md px-md py-md text-md text-text placeholder:text-text-muted outline-none focus:border-accent transition-colors ${
                errors.dueDay ? 'border-overdue' : 'border-border'
              }`}
            />
            {errors.dueDay && <p className="text-xs text-overdue">{errors.dueDay}</p>}
          </div>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-sm">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Categoria (opcional)
          </label>
          <div className="flex gap-sm overflow-x-auto py-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(category === cat ? '' : cat)}
                className={`flex-shrink-0 px-md py-sm rounded-full border text-sm font-medium transition-colors ${
                  category === cat
                    ? 'bg-accent-bg border-accent text-accent'
                    : 'bg-surface border-border text-text-secondary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-md pt-lg border-t border-border">
          {bill && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="w-full py-md rounded-md bg-overdue-bg text-overdue text-md font-semibold transition-opacity active:opacity-80"
            >
              Excluir conta
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-md rounded-md bg-accent text-white text-md font-semibold transition-opacity active:opacity-80"
          >
            {bill ? 'Salvar alterações' : 'Adicionar conta'}
          </button>
        </div>
      </div>
    </div>
  );
}
