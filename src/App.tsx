import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { BillsProvider } from '@/context/bills-context';
import { BottomTabBar } from '@/components/ui/bottom-tab-bar';
import { HomePage } from '@/pages/home';
import { MonthlyPage } from '@/pages/monthly';
import { HistoryPage } from '@/pages/history';
import { BillFormPage } from '@/pages/bill-form-page';

function AppRoutes() {
  const location = useLocation();
  // The background location is set when navigating to a modal route
  const backgroundLocation = location.state?.backgroundLocation;

  return (
    <div className="flex flex-col h-full bg-bg text-text">
      <main className="flex-1 overflow-hidden">
        {/* Main tab routes — rendered at background location when a modal is open */}
        <Routes location={backgroundLocation ?? location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/monthly" element={<MonthlyPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <BottomTabBar />

      {/* Modal routes — only rendered when background location state is present */}
      {backgroundLocation && (
        <Routes>
          <Route path="/bill/:id" element={<BillFormPage />} />
        </Routes>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BillsProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </BillsProvider>
  );
}
