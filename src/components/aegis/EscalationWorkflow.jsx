import { useEffect, useState } from 'react';
import { CheckCircle, Circle, Loader2, AlertTriangle, Zap, Shield, MapPin, Users, Brain } from 'lucide-react';
import { confidenceColor, confidenceLabel, severityColor } from '../../lib/aegisUtils';

const STAGES = [
    { id: 'received', label: 'Report Received', icon: CheckCircle, desc: 'Emergency report ingested by system' },
    { id: 'ai_analysis', label: 'AI Analysis', icon: Brain, desc: 'Classifying emergency type and severity' },
    { id: 'sensor_check', label: 'Sensor Verification', icon: Zap, desc: 'Cross-checking nearby sensor data' },
    { id: 'confidence', label: 'Confidence Scoring', icon: Shield, desc: 'Calculating multi-source threat confidence' },
    { id: 'escalation', label: 'Escalation Decision', icon: AlertTriangle, desc: 'Determining response protocol level' },
    { id: 'responders', label: 'Responders Alerted', icon: Users, desc: 'Nearest qualified responders dispatched' },
    { id: 'orchestration', label: 'Orchestration Active', icon: MapPin, desc: 'Crisis engine coordinating full response' },
];

export default function EscalationWorkflow({ report, aiResult, currentStage, events }) {
    const stageIndex = STAGES.findIndex(s => s.id === currentStage);

    return (
        <div className="space-y-4">
            {/* Stage Progress */}
            <div className="panel overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                    <Brain className="w-4 h-4 text-info" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Escalation Pipeline</span>
                    {currentStage === 'orchestration' && (
                        <span className="ml-auto text-xs text-safe font-mono">FULLY ORCHESTRATED</span>
                    )}
                    {currentStage && currentStage !== 'orchestration' && (
                        <span className="ml-auto text-xs text-warning font-mono animate-pulse">PROCESSING...</span>
                    )}
                </div>
                <div className="p-4">
                    <div className="space-y-2">
                        {STAGES.map((stage, i) => {
                            const Icon = stage.icon;
                            const done = stageIndex > i;
                            const active = stageIndex === i;
                            const pending = stageIndex < i;
                            return (
                                <div key={stage.id} className={`flex items-start gap-3 p-2.5 rounded transition-all ${active ? 'bg-info/5 border border-info/20' : done ? 'opacity-70' : 'opacity-30'}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${done ? 'bg-safe/20 text-safe' : active ? 'bg-info/20 text-info' : 'bg-secondary text-muted-foreground'
                                        }`}>
                                        {active ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        ) : done ? (
                                            <CheckCircle className="w-3.5 h-3.5" />
                                        ) : (
                                            <Circle className="w-3.5 h-3.5" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className={`text-xs font-semibold ${done ? 'text-safe' : active ? 'text-info' : 'text-muted-foreground'}`}>
                                            {stage.label}
                                        </div>
                                        <div className="text-xs text-muted-foreground">{stage.desc}</div>
                                    </div>
                                    {done && <span className="text-xs text-safe font-mono mt-0.5">✓</span>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* AI Analysis Result */}
            {aiResult && (
                <div className={`panel overflow-hidden border ${aiResult.severity === 'critical' ? 'border-critical/30 glow-critical' :
                        aiResult.severity === 'high' ? 'border-warning/30' : 'border-info/20'
                    }`}>
                    <div className="px-4 py-3 border-b border-border">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Classification Result</span>
                    </div>
                    <div className="p-4 space-y-3">
                        {/* Classification */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className={`text-sm font-bold px-3 py-1 rounded border ${aiResult.severity === 'critical' ? 'text-critical border-critical/30 bg-critical/10' :
                                    aiResult.severity === 'high' ? 'text-warning border-warning/30 bg-warning/10' :
                                        'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
                                }`}>
                                {aiResult.type?.replace(/_/g, ' ').toUpperCase()}
                            </span>
                            <span className={`text-xs font-mono font-semibold uppercase ${severityColor(aiResult.severity)}`}>
                                {aiResult.severity}
                            </span>
                            <span className={`text-xs font-mono ${confidenceColor(aiResult.confidence)}`}>
                                {confidenceLabel(aiResult.confidence)} confidence — {Math.round((aiResult.confidence || 0) * 100)}%
                            </span>
                        </div>

                        {/* Confidence bar */}
                        <div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${aiResult.confidence >= 0.85 ? 'bg-safe' :
                                            aiResult.confidence >= 0.65 ? 'bg-warning' : 'bg-critical'
                                        }`}
                                    style={{ width: `${Math.round((aiResult.confidence || 0) * 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Summary */}
                        {aiResult.summary && (
                            <p className="text-xs text-foreground/90 leading-relaxed">{aiResult.summary}</p>
                        )}

                        {/* Sensor correlation */}
                        {aiResult.sensor_correlation && (
                            <div className="bg-info/5 border border-info/15 rounded p-2.5 space-y-1">
                                <div className="text-xs font-semibold text-info flex items-center gap-1.5">
                                    <Zap className="w-3 h-3" /> Sensor Correlation
                                </div>
                                <p className="text-xs text-muted-foreground">{aiResult.sensor_correlation}</p>
                            </div>
                        )}

                        {/* Silent mode */}
                        {aiResult.silent_mode && (
                            <div className="bg-purple-500/10 border border-purple-500/30 rounded p-2.5">
                                <div className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                                    <Shield className="w-3 h-3" /> COVERT RESPONSE — Silent protocol active. Security alerted discreetly.
                                </div>
                            </div>
                        )}

                        {/* Accessibility */}
                        {aiResult.accessibility_flag && (
                            <div className="bg-info/5 border border-info/20 rounded p-2.5">
                                <div className="text-xs font-semibold text-info">♿ Accessibility Priority</div>
                                <p className="text-xs text-muted-foreground mt-0.5">{aiResult.accessibility_flag}</p>
                            </div>
                        )}

                        {/* Actions */}
                        {aiResult.actions?.length > 0 && (
                            <div>
                                <div className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 flex items-center gap-1">
                                    <Zap className="w-3 h-3 text-info" /> Autonomous Actions Initiated
                                </div>
                                <div className="space-y-1">
                                    {aiResult.actions.map((a, i) => (
                                        <div key={i} className="flex items-start gap-2 text-xs bg-info/5 border border-info/10 rounded px-2.5 py-1.5">
                                            <CheckCircle className="w-3 h-3 text-info flex-shrink-0 mt-0.5" />
                                            <span className="text-foreground/90">{a}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Escalation Timeline */}
            {events?.length > 0 && (
                <div className="panel overflow-hidden">
                    <div className="px-4 py-3 border-b border-border">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Live Escalation Timeline</span>
                    </div>
                    <div className="p-3 space-y-1 max-h-56 overflow-y-auto">
                        {[...events].reverse().map((ev, i) => (
                            <div key={i} className={`flex items-start gap-3 py-1.5 ${i === 0 ? 'animate-in fade-in duration-300' : ''}`}>
                                <span className="font-mono text-xs text-muted-foreground flex-shrink-0 w-20">
                                    {new Date(ev.ts).toLocaleTimeString('en-US', { hour12: false })}
                                </span>
                                <span className={`text-xs leading-relaxed ${ev.important ? 'text-warning font-medium' : 'text-foreground/80'}`}>{ev.msg}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}