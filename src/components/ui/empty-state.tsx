import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-xl gap-md text-center px-lg">
      <Icon size={64} className="text-text-muted" />
      <p className="text-lg font-semibold text-text">{title}</p>
      <p className="text-md text-text-secondary">{description}</p>
    </div>
  );
}
