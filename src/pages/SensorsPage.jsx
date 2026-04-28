import { useAegisStore } from '../lib/aegisStore';
import { startSimulation, stopSimulation } from '../lib/aegisEngine';
import ScenarioLauncher from '../components/aegis/ScenarioLauncher';
import SensorGrid from '../components/aegis/SensorGrid';
import { INITIAL_SENSORS, INITIAL_RESPONDERS, ZONES } from '../lib/aegisSimulation';
import { aegisDispatch } from '../lib/aegisStore';
import { useEffect } from 'react';
import { Activity, WifiOff, AlertTriangle, Battery, Shield } from 'lucide-react';

export default function SensorsPage() {
    const { sensors, activeScenario } = useAegisStore();

    useEffect(() => {
        if (!sensors || sensors.length === 0) {
            aegisDispatch({
                incidents: [],
                responders: INITIAL_RESPONDERS.map(r => ({ ...r })),
                sensors: INITIAL_SENSORS.map(s => ({ ...s })),
                zones: ZONES.map(z => ({ ...z, status: 'normal', occupancy: Math.floor(z.capacity * 0.4), blocked_exits: [], risk_score: 0 })),
                events: [],
            });
        }
    }, []);

    const online = sensors?.filter(s => s.status === 'online') || [];
    const offline = sensors?.filter(s => s.status === 'offline') || [];
    const alerting = sensors?.filter(s => s.alert) || [];
    const degraded = sensors?.filter(s => s.status === 'degraded') || [];
    const lowBattery = sensors?.filter(s => s.battery < 20) || [];

    return (
        <div className="h-[calc(100vh-56px)] overflow-y-auto">
            <div className="p-4 lg:p-6 space-y-4 max-w-[1800px] mx-auto">
                <ScenarioLauncher activeScenario={activeScenario} onStart={startSimulation} onStop={stopSimulation} />

                {/* Sensor Health Summary */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                    {[
                        { label: 'Online', value: online.length, icon: Activity, color: 'text-safe', alert: false },
                        { label: 'Alerting', value: alerting.length, icon: AlertTriangle, color: alerting.length > 0 ? 'text-critical' : 'text-muted-foreground', alert: alerting.length > 0 },
                        { label: 'Offline', value: offline.length, icon: WifiOff, color: offline.length > 0 ? 'text-critical' : 'text-muted-foreground', alert: offline.length > 0 },
                        { label: 'Degraded', value: degraded.length, icon: Shield, color: degraded.length > 0 ? 'text-warning' : 'text-muted-foreground', alert: false },
                        { label: 'Low Battery', value: lowBattery.length, icon: Battery, color: lowBattery.length > 0 ? 'text-warning' : 'text-muted-foreground', alert: false },
                    ].map(m => {
                        const Icon = m.icon;
                        return (
                            <div key={m.label} className={`panel p-4 ${m.alert ? 'border-critical/20' : ''}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <Icon className={`w-4 h-4 ${m.color}`} />
                                    {m.alert && <span className="w-1.5 h-1.5 rounded-full bg-critical animate-ping" />}
                                </div>
                                <div className={`text-2xl font-mono font-bold ${m.color}`}>{m.value}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">{m.label}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Offline Alert */}
                {offline.length > 0 && (
                    <div className="panel p-3 border-critical/30 bg-critical/5">
                        <div className="flex items-center gap-2 mb-2">
                            <WifiOff className="w-4 h-4 text-critical" />
                            <span className="text-xs font-semibold text-critical uppercase tracking-wide">Sensor Failure Detected — Redundancy Protocol Active</span>
                        </div>
                        <div className="space-y-1">
                            {offline.map(s => (
                                <div key={s.sensor_id} className="flex items-center gap-3 text-xs">
                                    <span className="font-mono text-muted-foreground w-20">{s.sensor_id}</span>
                                    <span className="text-foreground">{s.name}</span>
                                    <span className="text-muted-foreground">·</span>
                                    <span className="text-muted-foreground">{s.zone_name}</span>
                                    <span className="text-critical">OFFLINE</span>
                                    <span className="text-muted-foreground">— Multi-source verification engaged; human confirmation requested</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Multi-source reliability note */}
                <div className="panel p-3 border-info/10 bg-info/5 flex items-start gap-3">
                    <Shield className="w-4 h-4 text-info flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-muted-foreground">
                        <span className="text-info font-semibold">Fault-Tolerant Sensor Architecture — </span>
                        Aegis uses multi-source verification: each emergency detection requires corroboration from ≥2 independent sensors or a CCTV analytics signal. Individual sensor failures trigger confidence reduction and automatic fallback to adjacent sensor arrays and manual verification requests.
                    </div>
                </div>

                {/* Full Sensor Grid */}
                <div className="panel overflow-hidden">
                    <div className="px-4 py-3 border-b border-border">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sensor Array — All Zones</span>
                    </div>
                    <div className="p-3">
                        <SensorGrid sensors={sensors || []} compact={false} />
                    </div>
                </div>
            </div>
        </div>
    );
}