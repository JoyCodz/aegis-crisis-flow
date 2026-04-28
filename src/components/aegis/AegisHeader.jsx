import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, AlertTriangle, Activity, Map, Users, Cpu, Menu, X } from 'lucide-react';

const NAV = [
    { path: '/', label: 'Command Center', icon: Shield },
    { path: '/incidents', label: 'Incidents', icon: AlertTriangle },
    { path: '/map', label: 'Crisis Map', icon: Map },
    { path: '/responders', label: 'Responders', icon: Users },
    { path: '/sensors', label: 'Sensor Grid', icon: Activity },
    { path: '/intelligence', label: 'AI Intelligence', icon: Cpu },
    { path: '/report', label: 'Emergency Report', icon: AlertTriangle },
];

export default function AegisHeader({ systemStatus, activeIncidents }) {
    const location = useLocation();
    const [time, setTime] = useState(new Date());
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const isAlert = activeIncidents > 0;

    return (
        <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="flex items-center justify-between px-4 lg:px-6 h-14">
                {/* Brand */}
                <div className="flex items-center gap-3">
                    <div className={`relative flex items-center justify-center w-8 h-8 rounded-md ${isAlert ? 'bg-critical/20' : 'bg-info/10'}`}>
                        <Shield className={`w-4 h-4 ${isAlert ? 'text-critical' : 'text-info'}`} />
                        {isAlert && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-critical rounded-full animate-ping" />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm tracking-widest text-foreground">AEGIS</span>
                            <span className="text-muted-foreground text-xs hidden sm:block">/ Crisis Orchestration Platform</span>
                        </div>
                    </div>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-1">
                    {NAV.map(({ path, label, icon: Icon }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${location.pathname === path
                                    ? 'bg-secondary text-foreground'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                                }`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {label}
                        </Link>
                    ))}
                </nav>

                {/* Status Bar */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-3 text-xs font-mono">
                        {activeIncidents > 0 ? (
                            <div className="flex items-center gap-1.5 text-critical pulse-critical">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>{activeIncidents} ACTIVE INCIDENT{activeIncidents > 1 ? 'S' : ''}</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 text-safe">
                                <span className="w-1.5 h-1.5 rounded-full bg-safe inline-block" />
                                <span>ALL SYSTEMS NOMINAL</span>
                            </div>
                        )}
                        <span className="text-border">|</span>
                        <span className="text-muted-foreground">{time.toLocaleTimeString('en-US', { hour12: false })}</span>
                    </div>
                    <button
                        className="lg:hidden text-muted-foreground hover:text-foreground"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {mobileOpen && (
                <div className="lg:hidden border-t border-border bg-card px-4 py-3 flex flex-col gap-1">
                    {NAV.map(({ path, label, icon: Icon }) => (
                        <Link
                            key={path}
                            to={path}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${location.pathname === path
                                    ? 'bg-secondary text-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
}