import { NavLink } from 'react-router-dom';
import { Receipt, Calendar, Clock } from 'lucide-react';

const TABS = [
  { to: '/', icon: Receipt, label: 'Contas' },
  { to: '/monthly', icon: Calendar, label: 'Mensal' },
  { to: '/history', icon: Clock, label: 'Histórico' },
] as const;

export function BottomTabBar() {
  return (
    <nav
      className="flex-shrink-0 flex items-center justify-around h-[60px] pb-safe bg-tab-bar border-t border-border"
      aria-label="Navegação principal"
    >
      {TABS.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-[2px] px-6 py-1 text-xs font-medium transition-colors ${
              isActive ? 'text-accent' : 'text-text-muted'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 1.75} />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
