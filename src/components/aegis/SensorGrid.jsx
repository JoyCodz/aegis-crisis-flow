import { Activity, AlertTriangle, WifiOff, Battery } from 'lucide-react';

const TYPE_LABELS = {
    smoke: 'Smoke',
    temperature: 'Temp',
    gas: 'Gas',
    motion: 'Motion',
    crowd_density: 'Crowd',
    door_contact: 'Door',
    cctv: 'CCTV',
};

export default function SensorGrid({ sensors, compact }) {
    return (
        <div className={`grid gap-2 ${compact ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
            {sensors.map(s => {
                const pct = s.threshold > 0 ? Math.min(1, s.value / s.threshold) : 0;
                const alerting = s.alert || pct >= 0.8;
                const offline = s.status === 'offline';
                const degraded = s.status === 'degraded';

                return (
                    <div
                        key={s.sensor_id}
                        className={`panel p-3 relative transition-all ${offline ? 'opacity-50 border-muted-foreground/20' :
                                alerting ? 'border-critical/40 glow-critical' :
                                    degraded ? 'border-warning/30' : ''
                            }`}
                    >
                        {/* Status dot */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${offline ? 'bg-muted-foreground' : alerting ? 'bg-critical animate-ping' : degraded ? 'bg-warning' : 'bg-safe'}`} />
                                <span className="text-xs text-muted-foreground font-mono">{s.sensor_id}</span>
                            </div>
                            {offline && <WifiOff className="w-3 h-3 text-muted-foreground" />}
                            {alerting && !offline && <AlertTriangle className="w-3 h-3 text-critical" />}
                        </div>

                        <div className="mb-1">
                            <span className="text-xs font-medium text-foreground block truncate">{s.name}</span>
                            <span className="text-xs text-muted-foreground">{s.zone_name} · {TYPE_LABELS[s.type]}</span>
                        </div>

                        {!offline && (
                            <>
                                <div className="flex items-end justify-between mb-1.5">
                                    <span className={`text-lg font-mono font-semibold ${alerting ? 'text-critical' : 'text-foreground'}`}>
                                        {typeof s.value === 'number' ? s.value.toFixed(s.type === 'gas' ? 1 : 0) : s.value}
                                        <span className="text-xs text-muted-foreground ml-1">{s.unit}</span>
                                    </span>
                                    <span className="text-xs text-muted-foreground">/{s.threshold}{s.unit}</span>
                                </div>

                                <div className="h-1 bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${pct >= 1 ? 'bg-critical' : pct >= 0.8 ? 'bg-warning' : pct >= 0.5 ? 'bg-yellow-400' : 'bg-safe'
                                            }`}
                                        style={{ width: `${Math.min(100, pct * 100)}%` }}
                                    />
                                </div>
                            </>
                        )}

                        {offline && (
                            <p className="text-xs text-muted-foreground mt-2">OFFLINE — No signal</p>
                        )}

                        {!compact && (
                            <div className="flex items-center gap-3 mt-2 pt-2 border-t border-border">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Battery className="w-3 h-3" />
                                    <span>{s.battery?.toFixed(0)}%</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Activity className="w-3 h-3" />
                                    <span>{((s.reliability_score || 0) * 100).toFixed(0)}% reliable</span>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}