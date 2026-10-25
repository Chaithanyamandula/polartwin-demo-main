import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { useStationStore } from '../../store/stationStore';
import { useAuthStore } from '../../store/authStore';
import { useTelemetryStore } from '../../store/telemetryStore';
import {
  LayoutDashboard,
  Box,
  ShieldAlert,
  Shield,
  ArrowLeft,
  Menu,
  X,
  Truck,
  Zap,
  Droplet,
  CloudSnow,
  Building2,
  Users,
  Radio,
  Brain,
  Sliders,
  ChevronRight,
  Activity,
  Layers,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedStationId, selectStation, stations } = useStationStore();
  const { role } = useAuthStore();
  const { liveRisk } = useTelemetryStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentRisk = liveRisk[selectedStationId];

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleStationChange = (stId: string) => {
    selectStation(stId);
    const pathParts = location.pathname.split('/');
    if (pathParts[1] === 'station' && pathParts[2]) {
      const sub = pathParts.slice(3).join('/');
      navigate(`/station/${stId}${sub ? `/${sub}` : ''}`);
    } else {
      navigate(`/station/${stId}`);
    }
  };

  const getRiskBadgeStyle = (level?: string) => {
    switch (level) {
      case 'CRITICAL':
        return { bg: 'rgba(239,68,68,0.15)', text: '#f87171', border: 'rgba(239,68,68,0.4)' };
      case 'HIGH':
        return { bg: 'rgba(251,146,60,0.15)', text: '#fb923c', border: 'rgba(251,146,60,0.4)' };
      case 'MEDIUM':
        return { bg: 'rgba(250,204,21,0.15)', text: '#facc15', border: 'rgba(250,204,21,0.4)' };
      default:
        return { bg: 'rgba(16,185,129,0.15)', text: '#34d399', border: 'rgba(16,185,129,0.4)' };
    }
  };

  const riskStyle = getRiskBadgeStyle(currentRisk?.level);

  const navLinkClass = (isActive: boolean) =>
    `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer select-none ${
      isActive
        ? 'bg-blue-600/25 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
        : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
    }`;

  const navIconColor = (isActive: boolean) => (isActive ? '#22d3ee' : '#64748b');

  // Comprehensive mobile navigation items
  const allModules = [
    { name: 'Dashboard', path: `/station/${selectedStationId}`, icon: LayoutDashboard, color: '#06b6d4' },
    { name: '16 Domains Flow', path: `/station/${selectedStationId}/domains`, icon: Layers, color: '#38bdf8' },
    { name: '3D Spatial Twin', path: `/station/${selectedStationId}/twin3d`, icon: Box, color: '#a855f7' },
    { name: 'Logistics & Fleet', path: `/station/${selectedStationId}/logistics`, icon: Truck, color: '#f97316' },
    { name: 'Energy & Fuel', path: `/station/${selectedStationId}/energy`, icon: Zap, color: '#eab308' },
    { name: 'Water & RO Desal', path: `/station/${selectedStationId}/water`, icon: Droplet, color: '#0ea5e9' },
    { name: 'Weather & Blizzard', path: `/station/${selectedStationId}/environment`, icon: CloudSnow, color: '#22d3ee' },
    { name: 'Infrastructure', path: `/station/${selectedStationId}/infrastructure`, icon: Building2, color: '#10b981' },
    { name: 'Personnel & Medical', path: `/station/${selectedStationId}/personnel`, icon: Users, color: '#ec4899' },
    { name: 'Satcom & Radio', path: `/station/${selectedStationId}/communication`, icon: Radio, color: '#6366f1' },
    { name: 'Decision Suite', path: `/station/${selectedStationId}/decision`, icon: Brain, color: '#8b5cf6' },
    { name: 'What-If Sandbox', path: `/station/${selectedStationId}/whatif`, icon: Sliders, color: '#f43f5e' },
    { name: 'Admin Console', path: '/admin', icon: ShieldAlert, color: '#f59e0b' },
  ];

  return (
    <>
      <header
        className="h-14 sm:h-16 sticky top-0 z-50 flex items-center justify-between px-3 sm:px-5 select-none transition-all"
        style={{
          backgroundColor: 'var(--navbar-bg)',
          borderBottom: '1px solid var(--navbar-border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* ── Left: Back, Brand & Mobile/Desktop Station Switcher ── */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Universal Back Button */}
          <button
            onClick={() => {
              if (window.history.length > 1) navigate(-1);
              else navigate(`/station/${selectedStationId}`);
            }}
            className="flex items-center justify-center p-1.5 sm:p-2 rounded-lg text-xs font-semibold transition-all cursor-pointer group flex-shrink-0"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
            title="Back"
            aria-label="Back"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-0.5 transition-transform" style={{ color: 'var(--accent)' }} />
          </button>

          {/* Brand Logo + Title */}
          <div
            onClick={() => navigate(`/station/${selectedStationId}`)}
            className="cursor-pointer flex items-center gap-2 group min-w-0 flex-shrink-0"
            title="POLARTWIN Antarctic Digital Twin"
          >
            <div
              className="flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-xl p-0.5 sm:p-1 transition-all duration-200 group-hover:scale-105 flex-shrink-0"
              style={{
                background: 'rgba(6,182,212,0.15)',
                border: '1px solid rgba(6,182,212,0.4)',
              }}
            >
              <img
                src="/logo.png"
                alt="POLARTWIN Logo"
                className="h-full w-full object-contain rounded-lg"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span
                className="font-extrabold text-xs sm:text-sm tracking-wide leading-none truncate"
                style={{ color: 'var(--text-primary)' }}
              >
                POLARTWIN
              </span>
              <span
                className="text-[8px] sm:text-[9px] font-mono tracking-widest uppercase mt-0.5 text-cyan-400/80 truncate hidden xs:inline"
              >
                Antarctic Twin
              </span>
            </div>
          </div>

          {/* Station Switcher - Clean Compact Design for Both Mobile & Desktop */}
          <div
            className="flex items-center p-0.5 sm:p-1 rounded-xl ml-1 sm:ml-2 border border-slate-700/60 bg-slate-900/80 flex-shrink-0"
          >
            {stations.map((st) => {
              const isSelected = selectedStationId === st.station_id;
              const shortName = st.station_id === 'maitri' ? 'Maitri' : 'Bharati';
              return (
                <button
                  key={st.station_id}
                  onClick={() => handleStationChange(st.station_id)}
                  className={`px-2 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={st.name}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-slate-500'}`} />
                  <span>{shortName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Center: Desktop Navigation Links (hidden on mobile/tablet) ── */}
        <nav
          className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-900/80 border border-slate-800"
        >
          <NavLink
            to={`/station/${selectedStationId}`}
            className={() => {
              const isDash =
                location.pathname === `/station/${selectedStationId}` ||
                location.pathname === `/station/${selectedStationId}/dashboard` ||
                location.pathname === `/station/${selectedStationId}/domains`;
              return navLinkClass(isDash);
            }}
            title="Dashboard"
          >
            {() => {
              const isDash =
                location.pathname === `/station/${selectedStationId}` ||
                location.pathname === `/station/${selectedStationId}/dashboard` ||
                location.pathname === `/station/${selectedStationId}/domains`;
              return (
                <>
                  <LayoutDashboard className="w-4 h-4" style={{ color: navIconColor(isDash) }} />
                  <span>Dashboard</span>
                </>
              );
            }}
          </NavLink>

          <NavLink
            to={`/station/${selectedStationId}/twin3d`}
            className={({ isActive }) => navLinkClass(isActive)}
            title="3D Station Twin"
          >
            {({ isActive }) => (
              <>
                <Box className="w-4 h-4" style={{ color: navIconColor(isActive) }} />
                <span>3D Twin</span>
              </>
            )}
          </NavLink>

          <NavLink
            to={`/station/${selectedStationId}/logistics`}
            className={({ isActive }) => navLinkClass(isActive)}
            title="Polar Logistics"
          >
            {({ isActive }) => (
              <>
                <Truck className="w-4 h-4" style={{ color: navIconColor(isActive) }} />
                <span>Logistics</span>
              </>
            )}
          </NavLink>

          <NavLink
            to={`/station/${selectedStationId}/energy`}
            className={({ isActive }) => navLinkClass(isActive)}
            title="Energy & Fuel"
          >
            {({ isActive }) => (
              <>
                <Zap className="w-4 h-4" style={{ color: navIconColor(isActive) }} />
                <span>Energy</span>
              </>
            )}
          </NavLink>

          <NavLink
            to={`/station/${selectedStationId}/decision`}
            className={({ isActive }) => navLinkClass(isActive)}
            title="Decision Intelligence"
          >
            {({ isActive }) => (
              <>
                <Brain className="w-4 h-4" style={{ color: navIconColor(isActive) }} />
                <span>Intelligence</span>
              </>
            )}
          </NavLink>

          {role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) => navLinkClass(isActive)}
              title="Admin"
            >
              {({ isActive }) => (
                <>
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Admin</span>
                </>
              )}
            </NavLink>
          )}
        </nav>

        {/* ── Right: Risk Badge & Mobile Menu Button ── */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Live Risk Badge - Full on Desktop, Compact on Mobile */}
          <div
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border text-[10px] sm:text-xs font-semibold shadow-sm flex-shrink-0"
            style={{
              backgroundColor: riskStyle.bg,
              color: riskStyle.text,
              borderColor: riskStyle.border,
            }}
            title={`Risk Level: ${currentRisk?.level || 'LOW'} (${currentRisk?.score || 18} pts)`}
          >
            <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">RISK:</span>
            <span>{currentRisk?.level || 'LOW'}</span>
            <span className="hidden sm:inline">({currentRisk?.score || 18} pts)</span>
          </div>

          {/* Console Badge on Desktop */}
          <div
            className="hidden lg:flex items-center gap-2 pl-3"
            style={{ borderLeft: '1px solid var(--border)' }}
          >
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-200">
                NCPOR / MoES
              </div>
              <div className="text-[10px] font-mono uppercase text-emerald-400 flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Console
              </div>
            </div>
          </div>

          {/* Mobile Hamburger Drawer Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center p-2 rounded-xl border border-slate-700 bg-slate-800/80 text-cyan-400 hover:text-white hover:bg-slate-700 cursor-pointer transition-all active:scale-95"
            aria-label="Toggle Menu"
            title="All Operational Modules"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-rose-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* ── Mobile Slide-Over Drawer Navigation ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Sheet */}
          <div className="relative w-[85vw] max-w-[340px] h-full bg-[#050f1d] border-l border-cyan-500/30 shadow-2xl flex flex-col z-10 overflow-y-auto animate-in slide-in-from-right duration-250">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 sticky top-0 z-10 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="Logo" className="w-7 h-7 object-contain" />
                <div>
                  <div className="text-sm font-black text-white">POLARTWIN</div>
                  <div className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest">Mobile Cockpit</div>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 border border-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Station Switcher Cards in Drawer */}
            <div className="p-4 border-b border-slate-800/80 space-y-2">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Active Research Station
              </div>
              <div className="grid grid-cols-2 gap-2">
                {stations.map((st) => {
                  const isSelected = selectedStationId === st.station_id;
                  const isMaitri = st.station_id === 'maitri';
                  return (
                    <button
                      key={st.station_id}
                      onClick={() => handleStationChange(st.station_id)}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'bg-blue-600/25 border-cyan-400 text-white shadow-lg'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold capitalize text-white">
                          {isMaitri ? 'Maitri' : 'Bharati'}
                        </span>
                        <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
                      </div>
                      <div className="text-[9px] font-mono text-slate-400 truncate">
                        {isMaitri ? 'Inland Oasis' : 'Prydz Bay Coast'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Status Bar */}
            <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Composite Risk:</span>
              <span
                className="px-2 py-0.5 rounded text-[10px] font-bold"
                style={{ backgroundColor: riskStyle.bg, color: riskStyle.text, border: `1px solid ${riskStyle.border}` }}
              >
                {currentRisk?.level || 'LOW'} • {currentRisk?.score || 18} pts
              </span>
            </div>

            {/* Navigation Links List */}
            <div className="p-3 space-y-1 flex-1">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                Operational Modules
              </div>
              {allModules.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600/30 to-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: `${item.color}18`,
                          border: `1px solid ${item.color}35`,
                          color: item.color,
                        }}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">{item.name}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-600'}`} />
                  </button>
                );
              })}
            </div>

            {/* Drawer Footer */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-center">
              <div className="text-[10px] font-mono text-slate-400">
                MoES • NCPOR Antarctic Platform
              </div>
              <div className="text-[9px] font-mono text-cyan-400/70 mt-0.5">
                Version 2.0 • Real-Time Digital Twin
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
