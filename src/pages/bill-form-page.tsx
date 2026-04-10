import { useParams, useNavigate } from 'react-router-dom';
import { useBills } from '@/context/bills-context';
import { BillForm } from '@/components/bill-form';
import { Modal } from '@/components/ui/modal';
import { BillFormData } from '@/lib/types';

export function BillFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBillById, addBill, updateBill, deleteBill } = useBills();

  const isNew = id === 'new' || id === undefined;
  const bill = isNew ? undefined : getBillById(id!);

  const handleSubmit = async (data: BillFormData) => {
    if (isNew) {
      await addBill(data);
    } else {
      await updateBill(id!, data);
    }
    navigate(-1);
  };

  const handleDelete = () => {
    if (window.confirm(`Excluir "${bill?.name}"? Esta ação não pode ser desfeita.`)) {
      deleteBill(id!);
      navigate('/', { replace: true });
    }
  };

  return (
    <Modal title={isNew ? 'Nova conta' : 'Editar conta'}>
      <BillForm
        bill={bill}
        onSubmit={handleSubmit}
        onDelete={!isNew ? handleDelete : undefined}
      />
    </Modal>
  );
}
