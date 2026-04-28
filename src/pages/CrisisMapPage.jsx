import { useAegisStore } from '../lib/aegisStore';
import { startSimulation, stopSimulation } from '../lib/aegisEngine';
import CrisisMap from '../components/aegis/CrisisMap';
import ScenarioLauncher from '../components/aegis/ScenarioLauncher';
import { INITIAL_SENSORS, INITIAL_RESPONDERS, ZONES } from '../lib/aegisSimulation';
import { aegisDispatch } from '../lib/aegisStore';
import { useEffect } from 'react';
import { MapPin, Users, AlertTriangle, DoorOpen } from 'lucide-react';
import { zoneStatusColor } from '../lib/aegisUtils';

export default function CrisisMapPage() {
    const { incidents, responders, sensors, zones, activeScenario } = useAegisStore();

    useEffect(() => {
        if (!zones || zones.length === 0) {
            aegisDispatch({
                incidents: [],
                responders: INITIAL_RESPONDERS.map(r => ({ ...r })),
                sensors: INITIAL_SENSORS.map(s => ({ ...s })),
                zones: ZONES.map(z => ({ ...z, status: 'normal', occupancy: Math.floor(z.capacity * 0.4), blocked_exits: [], risk_score: 0 })),
                events: [],
            });
        }
    }, []);

    const activeIncident = incidents?.find(i => i.status === 'active' || i.status === 'escalating');
    const deployedResponders = responders?.filter(r => r.status === 'deployed' || r.status === 'en_route');

    return (
        <div className="h-[calc(100vh-56px)] overflow-y-auto">
            <div className="p-4 lg:p-6 space-y-4 max-w-[1800px] mx-auto">
                <ScenarioLauncher activeScenario={activeScenario} onStart={startSimulation} onStop={stopSimulation} />

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
                    {/* Map — full width on top */}
                    <div className="xl:col-span-3">
                        <CrisisMap
                            zones={zones}
                            responders={responders}
                            incidents={incidents}
                            blockedExits={activeIncident?.blocked_exits || []}
                        />
                    </div>

                    {/* Side Panel */}
                    <div className="space-y-4">
                        {/* Zone Status */}
                        <div className="panel overflow-hidden">
                            <div className="px-4 py-3 border-b border-border">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Zone Status</span>
                            </div>
                            <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
                                {(zones || []).map(z => (
                                    <div key={z.zone_id} className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-secondary/30">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-2 h-2 rounded-sm flex-shrink-0"
                                                style={{ backgroundColor: zoneStatusColor(z.status) }}
                                            />
                                            <span className="text-xs text-foreground truncate max-w-[120px]">{z.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span className="font-mono">{z.occupancy || 0}</span>
                                            <span className={`capitalize text-xs font-medium ${z.status === 'danger' ? 'text-critical' :
                                                    z.status === 'evacuating' ? 'text-warning' :
                                                        z.status === 'isolated' ? 'text-purple-400' :
                                                            z.status === 'elevated' ? 'text-yellow-400' : 'text-muted-foreground'
                                                }`}>{z.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Deployed Responders */}
                        <div className="panel overflow-hidden">
                            <div className="px-4 py-3 border-b border-border">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Deployed Responders
                                    {deployedResponders?.length > 0 && (
                                        <span className="ml-2 text-warning font-mono">{deployedResponders.length}</span>
                                    )}
                                </span>
                            </div>
                            <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
                                {deployedResponders?.length === 0 && (
                                    <p className="text-xs text-muted-foreground py-4 text-center">None deployed</p>
                                )}
                                {deployedResponders?.map(r => (
                                    <div key={r.id} className="flex items-center justify-between px-2 py-1.5 rounded bg-warning/5 border border-warning/10">
                                        <div>
                                            <div className="text-xs font-medium text-foreground">{r.name}</div>
                                            <div className="text-xs text-muted-foreground">{r.zone_name}</div>
                                        </div>
                                        <span className={`text-xs font-mono font-semibold ${r.status === 'en_route' ? 'text-info' : 'text-warning'}`}>
                                            {r.status === 'en_route' ? 'EN ROUTE' : 'ON SCENE'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Accessibility */}
                        {activeIncident?.evacuation_active && (
                            <div className="panel p-3 border border-info/20 bg-info/5">
                                <div className="text-xs font-semibold text-info mb-2 flex items-center gap-1.5">
                                    <Users className="w-3.5 h-3.5" />
                                    Accessibility Routes Active
                                </div>
                                <div className="space-y-1 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <span className="text-info">♿</span>
                                        <span>Wheelchair-safe path via Lobby Exit-B</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-info">👂</span>
                                        <span>Visual strobe alerts activated in all zones</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-info">🚨</span>
                                        <span>Mobility-impaired guests flagged for priority rescue</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Blocked Exits Banner */}
                {activeIncident?.blocked_exits?.length > 0 && (
                    <div className="panel p-3 border-critical/30 bg-critical/5 flex items-center gap-3">
                        <AlertTriangle className="w-4 h-4 text-critical flex-shrink-0" />
                        <div className="text-xs">
                            <span className="text-critical font-semibold">BLOCKED EXITS: </span>
                            <span className="text-foreground">{activeIncident.blocked_exits.join(', ')}</span>
                            <span className="text-muted-foreground ml-2">— Evacuation rerouted automatically via alternate paths</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}