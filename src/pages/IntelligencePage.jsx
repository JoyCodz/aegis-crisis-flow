import { useState } from 'react';
import { useAegisStore } from '../lib/aegisStore';
import { startSimulation, stopSimulation } from '../lib/aegisEngine';
import ScenarioLauncher from '../components/aegis/ScenarioLauncher';
import AIReasoningPanel from '../components/aegis/AIReasoningPanel';
import EmergencyReport from '../components/aegis/EmergencyReport';
import { generateAIReasoning, INITIAL_SENSORS, INITIAL_RESPONDERS, ZONES } from '../lib/aegisSimulation';
import { aegisDispatch } from '../lib/aegisStore';
import { useEffect } from 'react';
import { Brain, Zap, Target, AlertTriangle, ChevronRight, TrendingUp } from 'lucide-react';

const RISK_PREDICTIONS = [
    {
        zone: 'Kitchen (Z4)',
        risk: 'Fire Escalation',
        probability: 0.72,
        factors: ['Gas line inspection 60 days overdue', 'High temperature variance last 48h', 'Adjacent restaurant at 94% capacity'],
        recommendation: 'Schedule maintenance inspection immediately',
    },
    {
        zone: 'Grand Ballroom (Z1)',
        risk: 'Overcrowding',
        probability: 0.51,
        factors: ['Events capacity booked at 98% Saturday', 'Single primary exit on north side', 'HVAC operating at reduced capacity'],
        recommendation: 'Deploy crowd flow management pre-event',
    },
    {
        zone: 'Casino Floor (Z8)',
        risk: 'Security Incident',
        probability: 0.33,
        factors: ['Late night operational hours', 'Above-average footfall on weekends', 'Historical incident rate elevated vs comparable venues'],
        recommendation: 'Increase security patrol frequency',
    },
];

export default function IntelligencePage() {
    const { incidents, sensors, activeScenario } = useAegisStore();

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

    const reasoning = activeScenario ? generateAIReasoning(activeScenario) : null;

    return (
        <div className="h-[calc(100vh-56px)] overflow-y-auto">
            <div className="p-4 lg:p-6 space-y-4 max-w-[1800px] mx-auto">
                <ScenarioLauncher activeScenario={activeScenario} onStart={startSimulation} onStop={stopSimulation} />

                {/* Intelligence Header */}
                <div className="panel p-4 flex items-center gap-4 border-info/20">
                    <div className="p-3 rounded-lg bg-info/10 border border-info/20">
                        <Brain className="w-6 h-6 text-info" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-foreground">Aegis AI Intelligence Layer</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Multi-modal anomaly detection · Explainable risk prediction · Confidence-scored emergency classification · Adaptive decision engine
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Active AI Analysis */}
                    <div className="space-y-4">
                        <AIReasoningPanel reasoning={reasoning} />
                        <EmergencyReport />
                    </div>

                    {/* Predictive Risk Engine */}
                    <div className="space-y-4">
                        <div className="panel overflow-hidden">
                            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-warning" />
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Predictive Risk Engine</span>
                                <span className="ml-auto text-xs text-muted-foreground font-mono">Updated 30s ago</span>
                            </div>
                            <div className="p-4 space-y-4">
                                {RISK_PREDICTIONS.map((pred, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <AlertTriangle className={`w-3.5 h-3.5 ${pred.probability > 0.6 ? 'text-warning' : pred.probability > 0.4 ? 'text-yellow-400' : 'text-muted-foreground'}`} />
                                                    <span className="text-xs font-semibold text-foreground">{pred.risk}</span>
                                                </div>
                                                <span className="text-xs text-muted-foreground">{pred.zone}</span>
                                            </div>
                                            <span className={`text-sm font-mono font-bold ${pred.probability > 0.6 ? 'text-warning' : pred.probability > 0.4 ? 'text-yellow-400' : 'text-muted-foreground'}`}>
                                                {Math.round(pred.probability * 100)}%
                                            </span>
                                        </div>
                                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${pred.probability > 0.6 ? 'bg-warning' : pred.probability > 0.4 ? 'bg-yellow-400' : 'bg-safe'}`}
                                                style={{ width: `${pred.probability * 100}%` }}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            {pred.factors.map((f, j) => (
                                                <div key={j} className="flex items-start gap-2 text-xs">
                                                    <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                                                    <span className="text-muted-foreground">{f}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex items-start gap-2 text-xs bg-info/5 border border-info/10 rounded px-2 py-1.5">
                                            <Zap className="w-3 h-3 text-info flex-shrink-0 mt-0.5" />
                                            <span className="text-foreground/80">{pred.recommendation}</span>
                                        </div>
                                        {i < RISK_PREDICTIONS.length - 1 && <div className="border-t border-border pt-2" />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AI Engine Status */}
                        <div className="panel p-4 space-y-3">
                            <div className="flex items-center gap-2 mb-1">
                                <Target className="w-4 h-4 text-info" />
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Engine Status</span>
                            </div>
                            {[
                                { label: 'Anomaly Detection', status: 'ACTIVE', color: 'text-safe', detail: '12 data streams monitored' },
                                { label: 'Risk Prediction Model', status: 'ACTIVE', color: 'text-safe', detail: '72h rolling forecast' },
                                { label: 'Emergency Classifier', status: 'ACTIVE', color: 'text-safe', detail: '6 categories · 94.2% accuracy' },
                                { label: 'Crisis Decision Engine', status: activeScenario ? 'ENGAGED' : 'STANDBY', color: activeScenario ? 'text-warning' : 'text-info', detail: activeScenario ? 'Orchestrating response' : 'Awaiting trigger' },
                                { label: 'Responder Assignment AI', status: activeScenario ? 'ACTIVE' : 'STANDBY', color: activeScenario ? 'text-warning' : 'text-info', detail: 'Proximity + skill matching' },
                                { label: 'Sensor Reliability Monitor', status: 'ACTIVE', color: 'text-safe', detail: `${sensors?.length || 0} sensors tracked` },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">{item.label}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground">{item.detail}</span>
                                        <span className={`font-mono font-semibold ${item.color}`}>{item.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}