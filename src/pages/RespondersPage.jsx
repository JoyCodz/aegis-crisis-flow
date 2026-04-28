import { useAegisStore } from '../lib/aegisStore';
import { startSimulation, stopSimulation } from '../lib/aegisEngine';
import ScenarioLauncher from '../components/aegis/ScenarioLauncher';
import { INITIAL_SENSORS, INITIAL_RESPONDERS, ZONES } from '../lib/aegisSimulation';
import { aegisDispatch } from '../lib/aegisStore';
import { useEffect } from 'react';
import { responderRoleLabel, statusColor } from '../lib/aegisUtils';
import { Radio, Shield, Activity, Zap } from 'lucide-react';

const ROLE_COLORS = {
    fire_warden: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    medic: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    security: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    manager: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    maintenance: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

export default function RespondersPage() {
    const { responders, incidents, activeScenario } = useAegisStore();

    useEffect(() => {
        if (!responders || responders.length === 0) {
            aegisDispatch({
                incidents: [],
                responders: INITIAL_RESPONDERS.map(r => ({ ...r })),
                sensors: INITIAL_SENSORS.map(s => ({ ...s })),
                zones: ZONES.map(z => ({ ...z, status: 'normal', occupancy: Math.floor(z.capacity * 0.4), blocked_exits: [], risk_score: 0 })),
                events: [],
            });
        }
    }, []);

    const deployed = responders?.filter(r => r.status === 'deployed' || r.status === 'en_route') || [];
    const available = responders?.filter(r => r.status === 'available') || [];

    const activeIncident = incidents?.find(i => i.status === 'active' || i.status === 'escalating');

    return (
        <div className="h-[calc(100vh-56px)] overflow-y-auto">
            <div className="p-4 lg:p-6 space-y-4 max-w-[1800px] mx-auto">
                <ScenarioLauncher activeScenario={activeScenario} onStart={startSimulation} onStop={stopSimulation} />

                {/* Summary */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                        { label: 'Total Responders', value: responders?.length || 0, color: 'text-foreground' },
                        { label: 'Available', value: available.length, color: 'text-safe' },
                        { label: 'Deployed / En Route', value: deployed.length, color: deployed.length > 0 ? 'text-warning' : 'text-muted-foreground' },
                        { label: 'Avg Workload', value: deployed.length > 0 ? `${Math.round(deployed.reduce((s, r) => s + r.workload, 0) / deployed.length)}%` : '0%', color: 'text-info' },
                    ].map(m => (
                        <div key={m.label} className="panel p-4">
                            <div className={`text-2xl font-mono font-bold ${m.color}`}>{m.value}</div>
                            <div className="text-xs text-muted-foreground mt-1">{m.label}</div>
                        </div>
                    ))}
                </div>

                {/* AI Assignment Note */}
                {activeIncident && deployed.length > 0 && (
                    <div className="panel p-3 border-info/20 bg-info/5 flex items-start gap-3">
                        <Zap className="w-4 h-4 text-info flex-shrink-0 mt-0.5" />
                        <div className="text-xs">
                            <span className="text-info font-semibold">AI Responder Assignment Active — </span>
                            <span className="text-foreground">
                                {deployed.length} responder{deployed.length > 1 ? 's' : ''} autonomously assigned based on proximity, skill match, and availability. Workload balancing enforced.
                            </span>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Deployed */}
                    <div className="panel overflow-hidden">
                        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Deployed / En Route</span>
                            <span className="text-xs font-mono text-warning">{deployed.length}</span>
                        </div>
                        <div className="p-3 space-y-2">
                            {deployed.length === 0 && (
                                <p className="text-center text-xs text-muted-foreground py-8">No responders currently deployed</p>
                            )}
                            {deployed.map(r => (
                                <div key={r.id} className="panel p-3 border-warning/20 bg-warning/5">
                                    <div className="flex items-start gap-3">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 border ${ROLE_COLORS[r.role]}`}>
                                            {r.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-foreground">{r.name}</span>
                                                    {r.comm_state === 'awaiting_ack' && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-500 border border-red-500/30 animate-pulse font-bold tracking-wider">AWAITING ACK</span>}
                                                    {r.comm_state === 'acknowledged' && <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-500 border border-blue-500/30 font-bold tracking-wider">ACKNOWLEDGED</span>}
                                                </div>
                                                <span className={`text-xs font-mono font-bold ${r.status === 'en_route' ? 'text-info' : 'text-warning'}`}>
                                                    {r.status === 'en_route' ? 'EN ROUTE' : 'ON SCENE'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className={`text-xs border px-1.5 rounded ${ROLE_COLORS[r.role]}`}>{responderRoleLabel(r.role)}</span>
                                                <span className="text-xs text-muted-foreground">{r.zone_name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${r.workload > 80 ? 'bg-critical' : r.workload > 60 ? 'bg-warning' : 'bg-safe'}`} style={{ width: `${r.workload}%` }} />
                                                </div>
                                                <span className="text-xs text-muted-foreground font-mono">{r.workload}% load</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                {r.skills?.map(skill => (
                                                    <span key={skill} className="text-xs text-muted-foreground border border-border px-1 rounded">{skill.replace('_', ' ')}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Available */}
                    <div className="panel overflow-hidden">
                        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Available Responders</span>
                            <span className="text-xs font-mono text-safe">{available.length}</span>
                        </div>
                        <div className="p-3 space-y-2">
                            {available.map(r => (
                                <div key={r.id} className="flex items-center gap-3 panel p-2.5">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 border ${ROLE_COLORS[r.role]}`}>
                                        {r.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold text-foreground">{r.name}</span>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Radio className="w-3 h-3" />
                                                <span className="font-mono">{r.radio_channel}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className={`text-xs border px-1.5 rounded ${ROLE_COLORS[r.role]}`}>{responderRoleLabel(r.role)}</span>
                                            <span className="text-xs text-muted-foreground">{r.zone_name}</span>
                                        </div>
                                    </div>
                                    <span className="w-1.5 h-1.5 rounded-full bg-safe flex-shrink-0" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}