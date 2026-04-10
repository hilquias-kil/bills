import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface ModalProps {
  title: string;
  children: ReactNode;
}

export function Modal({ title, children }: ModalProps) {
  const navigate = useNavigate();
  const close = () => navigate(-1);

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        className="fixed inset-0 bg-black/60 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={close}
      />
      <motion.div
        key="sheet"
        className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-xl max-h-[92dvh] flex flex-col pb-safe"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>
        {/* Header */}
        <div className="flex items-center justify-between px-lg py-md border-b border-border">
          <h2 className="text-md font-semibold text-text">{title}</h2>
          <button
            onClick={close}
            className="p-1 rounded-md text-text-muted hover:text-text transition-colors"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </motion.div>
    </AnimatePresence>
  );
}
