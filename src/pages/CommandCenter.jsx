import { useEffect } from 'react';
import { useAegisStore } from '../lib/aegisStore';
import { startSimulation, stopSimulation } from '../lib/aegisEngine';
import ScenarioLauncher from '../components/aegis/ScenarioLauncher';
import MetricsBar from '../components/aegis/MetricsBar';
import IncidentCard from '../components/aegis/IncidentCard';
import CrisisTimeline from '../components/aegis/CrisisTimeline';
import AIReasoningPanel from '../components/aegis/AIReasoningPanel';
import CrisisMap from '../components/aegis/CrisisMap';
import ResponderList from '../components/aegis/ResponderList';
import { generateAIReasoning } from '../lib/aegisSimulation';
import { Shield, AlertTriangle, Clock } from 'lucide-react';
import { INITIAL_SENSORS, INITIAL_RESPONDERS, ZONES } from '../lib/aegisSimulation';
import { aegisDispatch } from '../lib/aegisStore';
import LiveRadioFeed from '../components/aegis/LiveRadioFeed';

export default function CommandCenter() {
    const { incidents, responders, sensors, zones, events, activeScenario } = useAegisStore();

    // Boot with default state if empty
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

    const activeIncident = incidents?.find(i => i.status === 'active' || i.status === 'escalating');
    const reasoning = activeScenario ? generateAIReasoning(activeScenario) : null;

    return (
        <div className="h-[calc(100vh-56px)] overflow-y-auto">
            <div className="p-4 lg:p-6 space-y-4 max-w-[1800px] mx-auto">
                {/* Scenario Launcher */}
                <ScenarioLauncher
                    activeScenario={activeScenario}
                    onStart={startSimulation}
                    onStop={stopSimulation}
                />

                {/* Alert Banner */}
                {activeIncident && (
                    <div className={`rounded-lg border p-3 flex items-center gap-3 ${activeIncident.severity === 'critical'
                            ? 'bg-critical/10 border-critical/40 glow-critical'
                            : 'bg-warning/10 border-warning/40'
                        }`}>
                        <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${activeIncident.severity === 'critical' ? 'text-critical animate-pulse' : 'text-warning'}`} />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className={`text-sm font-bold ${activeIncident.severity === 'critical' ? 'text-critical' : 'text-warning'}`}>
                                    ⚠ {activeIncident.title}
                                </span>
                                <span className="text-xs text-muted-foreground">Zone: {activeIncident.zone_name}</span>
                                {activeIncident.evacuation_active && (
                                    <span className="text-xs bg-warning/20 border border-warning/30 text-warning px-2 py-0.5 rounded font-semibold">
                                        EVACUATION ACTIVE
                                    </span>
                                )}
                                {activeIncident.status === 'escalating' && (
                                    <span className="text-xs bg-critical/20 border border-critical/30 text-critical px-2 py-0.5 rounded font-semibold pulse-critical">
                                        ESCALATING
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">{activeIncident.description}</p>
                        </div>
                        <div className="text-xs font-mono text-muted-foreground flex-shrink-0">
                            {Math.round((activeIncident.confidence || 0) * 100)}% confidence
                        </div>
                    </div>
                )}

                {/* Metrics */}
                <MetricsBar incidents={incidents} responders={responders} sensors={sensors} zones={zones} />

                {/* Main Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    {/* Left: Map + AI Reasoning */}
                    <div className="xl:col-span-2 space-y-4">
                        <CrisisMap
                            zones={zones}
                            responders={responders}
                            incidents={incidents}
                            blockedExits={activeIncident?.blocked_exits || []}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AIReasoningPanel reasoning={reasoning} />
                            <div className="h-[300px]">
                                <LiveRadioFeed />
                            </div>
                        </div>
                    </div>

                    {/* Right: Incidents + Timeline + Responders */}
                    <div className="space-y-4">
                        {/* Active Incidents */}
                        <div className="panel overflow-hidden">
                            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Incidents</span>
                                {incidents.length > 0 && (
                                    <span className={`text-xs font-mono font-bold ${incidents.filter(i => i.status !== 'resolved').length > 0 ? 'text-critical' : 'text-safe'}`}>
                                        {incidents.filter(i => i.status !== 'resolved').length} OPEN
                                    </span>
                                )}
                            </div>
                            <div className="p-2 space-y-2 max-h-60 overflow-y-auto">
                                {incidents.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                        <Shield className="w-6 h-6 mb-2 opacity-40" />
                                        <span className="text-xs">No active incidents</span>
                                        <span className="text-xs opacity-60 mt-1">Select a scenario to simulate</span>
                                    </div>
                                ) : (
                                    incidents.map(inc => (
                                        <IncidentCard key={inc.id} incident={inc} />
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="panel overflow-hidden">
                            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-info" />
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Live Crisis Timeline</span>
                            </div>
                            <div className="p-3">
                                <CrisisTimeline events={events} maxHeight="200px" />
                            </div>
                        </div>

                        {/* Responders */}
                        <div className="panel overflow-hidden">
                            <div className="px-4 py-3 border-b border-border">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Responder Status</span>
                            </div>
                            <div className="p-2 max-h-64 overflow-y-auto">
                                <ResponderList responders={responders} compact />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}