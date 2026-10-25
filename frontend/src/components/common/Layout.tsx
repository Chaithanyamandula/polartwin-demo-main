import React, { useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Navbar } from './Navbar';
import { useStationStore } from '../../store/stationStore';
import { useTelemetryStore } from '../../store/telemetryStore';
import { useWebSocket } from '../../hooks/useWebSocket';
import { telemetryApi } from '../../api/client';
import { 
  Activity, 
  Grid3X3, 
  Box, 
  Truck, 
  Zap, 
  BrainCircuit 
} from 'lucide-react';

export const Layout: React.FC = () => {
  const { selectedStationId } = useStationStore();
  const updateLiveWeather = useTelemetryStore((s) => s.updateLiveWeather);
  const location = useLocation();

  // Ensure any previous light mode attributes and storage are cleared
  useEffect(() => {
    document.documentElement.removeAttribute('data-theme');
    try {
      localStorage.removeItem('polartwin-theme');
    } catch {
      // ignore
    }
  }, []);

  // Maintain active WebSocket connection to the currently selected station
  useWebSocket(selectedStationId);

  // Global live weather sync for both Maitri and Bharati across the entire digital twin
  useEffect(() => {
    let isMounted = true;
    const syncWeather = async () => {
      try {
        const [maitriWeather, bharatiWeather] = await Promise.all([
          telemetryApi.getWeather('maitri'),
          telemetryApi.getWeather('bharati'),
        ]);
        if (isMounted) {
          if (maitriWeather) updateLiveWeather('maitri', maitriWeather);
          if (bharatiWeather) updateLiveWeather('bharati', bharatiWeather);
        }
      } catch (err) {
        console.warn('Live weather multi-station sync error:', err);
      }
    };

    // Immediate sync on load
    syncWeather();

    // 4-second interval ensuring seamless real-time syncing across all project pages
    const timer = setInterval(syncWeather, 4000);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [updateLiveWeather]);

  const navItems = [
    {
      label: 'Cockpit',
      path: `/station/${selectedStationId}`,
      icon: Activity,
      exact: true,
    },
    {
      label: 'Domains',
      path: `/station/${selectedStationId}/domains`,
      icon: Grid3X3,
    },
    {
      label: '3D Twin',
      path: `/station/${selectedStationId}/twin3d`,
      icon: Box,
    },
    {
      label: 'Logistics',
      path: `/station/${selectedStationId}/logistics`,
      icon: Truck,
    },
    {
      label: 'Energy',
      path: `/station/${selectedStationId}/energy-fuel`,
      icon: Zap,
    },
    {
      label: 'Decision',
      path: `/station/${selectedStationId}/decision`,
      icon: BrainCircuit,
    },
  ];

  return (
    <div
      className="h-screen w-screen text-[var(--text-primary)] flex flex-col font-ui overflow-hidden"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      <Navbar />
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        <main
          className="flex-1 w-full overflow-y-auto px-2.5 py-3 sm:px-4 sm:py-5 md:p-6 pb-20 md:pb-6 relative scroll-smooth"
          style={{ backgroundColor: 'var(--bg-base)' }}
        >
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar - optimized for thumb reach on mobile screens */}
      <nav 
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border-subtle)] bg-[var(--bg-card)]/95 backdrop-blur-md px-1 py-1.5 shadow-[0_-8px_20px_rgba(0,0,0,0.4)] safe-area-bottom"
      >
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact 
              ? (location.pathname === item.path || location.pathname === `${item.path}/dashboard`)
              : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-all text-center min-w-[52px] ${
                  isActive
                    ? 'text-[var(--accent-cyan)] font-semibold scale-105'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] active:scale-95'
                }`}
              >
                <div className={`p-1 rounded-md transition-colors ${isActive ? 'bg-[var(--accent-cyan)]/15 shadow-[0_0_10px_rgba(0,229,255,0.3)]' : ''}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

