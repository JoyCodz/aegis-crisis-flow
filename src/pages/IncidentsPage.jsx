import { useState } from 'react';
import { useAegisStore } from '../lib/aegisStore';
import { startSimulation, stopSimulation } from '../lib/aegisEngine';
import IncidentCard from '../components/aegis/IncidentCard';
import AIReasoningPanel from '../components/aegis/AIReasoningPanel';
import CrisisTimeline from '../components/aegis/CrisisTimeline';
import EmergencyReport from '../components/aegis/EmergencyReport';
import ScenarioLauncher from '../components/aegis/ScenarioLauncher';
import { generateAIReasoning } from '../lib/aegisSimulation';
import { AlertTriangle, ChevronRight, Users, MapPin, ShieldCheck } from 'lucide-react';
import { severityColor, incidentTypeLabel } from '../lib/aegisUtils';

export default function IncidentsPage() {
    const { incidents, events, activeScenario, responders, zones } = useAegisStore();
    const [selected, setSelected] = useState(null);

    const reasoning = activeScenario ? generateAIReasoning(activeScenario) : null;
    const activeInc = selected || incidents[0];

    return (
        <div className="h-[calc(100vh-56px)] overflow-y-auto">
            <div className="p-4 lg:p-6 space-y-4 max-w-[1800px] mx-auto">
                <ScenarioLauncher activeScenario={activeScenario} onStart={startSimulation} onStop={stopSimulation} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Incident List */}
                    <div className="space-y-4">
                        <div className="panel overflow-hidden">
                            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">All Incidents</span>
                                <span className="text-xs font-mono text-muted-foreground">{incidents.length} total</span>
                            </div>
                            <div className="p-2 space-y-2">
                                {incidents.length === 0 ? (
                                    <div className="py-10 text-center text-muted-foreground text-sm">
                                        <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                        <p>No incidents. Launch a scenario.</p>
                                    </div>
                                ) : (
                                    incidents.map(inc => (
                                        <IncidentCard
                                            key={inc.id}
                                            incident={inc}
                                            onClick={() => setSelected(inc)}
                                            active={activeInc?.id === inc.id}
                                        />
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Emergency Report */}
                        <EmergencyReport />
                    </div>

                    {/* Incident Detail */}
                    <div className="lg:col-span-2 space-y-4">
                        {activeInc ? (
                            <>
                                {/* Detail Header */}
                                <div className={`panel p-4 border ${activeInc.severity === 'critical' ? 'border-critical/30 glow-critical' : 'border-warning/20'}`}>
                                    <div className="flex items-start justify-between gap-4 mb-3">
                                        <div>
                                            <h2 className={`text-lg font-bold ${severityColor(activeInc.severity)}`}>{activeInc.title}</h2>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                                <span>{incidentTypeLabel(activeInc.type)}</span>
                                                <ChevronRight className="w-3 h-3" />
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {activeInc.zone_name}</span>
                                                <ChevronRight className="w-3 h-3" />
                                                <span className={`font-semibold uppercase ${severityColor(activeInc.severity)}`}>{activeInc.severity}</span>
                                            </div>
                                        </div>
                                        <div className={`text-right px-3 py-2 rounded border text-xs ${activeInc.status === 'active' ? 'text-critical border-critical/30 bg-critical/10' :
                                                activeInc.status === 'escalating' ? 'text-warning border-warning/30 bg-warning/10' :
                                                    activeInc.status === 'contained' ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' :
                                                        'text-safe border-safe/30 bg-safe/10'
                                            }`}>
                                            <div className="font-semibold uppercase">{activeInc.status}</div>
                                            <div className="opacity-70 mt-0.5">{Math.round((activeInc.confidence || 0) * 100)}% conf</div>
                                        </div>
                                    </div>

                                    {/* Status Flags */}
                                    <div className="flex flex-wrap gap-2">
                                        {activeInc.evacuation_active && (
                                            <span className="text-xs bg-warning/15 border border-warning/30 text-warning px-2 py-1 rounded font-medium">
                                                ▶ EVACUATION ACTIVE
                                            </span>
                                        )}
                                        {activeInc.blocked_exits?.length > 0 && (
                                            <span className="text-xs bg-critical/15 border border-critical/30 text-critical px-2 py-1 rounded font-medium">
                                                ✕ {activeInc.blocked_exits.length} EXIT{activeInc.blocked_exits.length > 1 ? 'S' : ''} BLOCKED
                                            </span>
                                        )}
                                        {activeInc.assigned_responders?.length > 0 && (
                                            <span className="text-xs bg-safe/10 border border-safe/30 text-safe px-2 py-1 rounded font-medium flex items-center gap-1">
                                                <ShieldCheck className="w-3 h-3" />
                                                {activeInc.assigned_responders.length} RESPONDER{activeInc.assigned_responders.length > 1 ? 'S' : ''} DEPLOYED
                                            </span>
                                        )}
                                    </div>

                                    {/* Assigned Responders */}
                                    {activeInc.assigned_responders?.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-border">
                                            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                                <Users className="w-3 h-3" /> Assigned Responders
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {activeInc.assigned_responders.map((name, i) => (
                                                    <span key={i} className="text-xs bg-secondary border border-border px-2 py-0.5 rounded text-foreground">{name}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* AI Reasoning */}
                                <AIReasoningPanel reasoning={reasoning} />

                                {/* Timeline */}
                                <div className="panel overflow-hidden">
                                    <div className="px-4 py-3 border-b border-border">
                                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Incident Timeline</span>
                                    </div>
                                    <div className="p-3">
                                        <CrisisTimeline events={events} maxHeight="350px" />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="panel flex items-center justify-center h-64">
                                <div className="text-center text-muted-foreground">
                                    <AlertTriangle className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                    <p className="text-sm">Select an incident or run a scenario</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}