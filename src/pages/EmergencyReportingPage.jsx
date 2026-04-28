import { useState, useEffect } from 'react';
import { useAegisStore, aegisDispatch } from '../lib/aegisStore';
import { startSimulation } from '../lib/aegisEngine';
import { INITIAL_SENSORS, INITIAL_RESPONDERS, ZONES } from '../lib/aegisSimulation';
import EmergencyIntakeForm from '../components/aegis/EmergencyIntakeForm';
import EscalationWorkflow from '../components/aegis/EscalationWorkflow';
import { aegisAI } from '@/api/aegisClient';
import { AlertOctagon, Clock, RotateCcw, List } from 'lucide-react';
import { formatTimestamp } from '../lib/aegisUtils';

const SCENARIO_MAP = {
    fire: 'fire_kitchen',
    gas_leak: 'gas_kitchen',
    medical: 'medical_ballroom',
    security: 'security_casino',
    suspicious: 'security_casino',
    crowd_panic: 'crowd_lobby',
};

const STAGE_SEQUENCE = ['received', 'ai_analysis', 'sensor_check', 'confidence', 'escalation', 'responders', 'orchestration'];

export default function EmergencyReportingPage() {
    const { sensors, activeScenario } = useAegisStore();
    const [phase, setPhase] = useState('intake'); // intake | processing | result
    const [submittedForm, setSubmittedForm] = useState(null);
    const [aiResult, setAiResult] = useState(null);
    const [currentStage, setCurrentStage] = useState(null);
    const [escalationEvents, setEscalationEvents] = useState([]);
    const [reportHistory, setReportHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

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

    const addEvent = (msg, important = false) => {
        setEscalationEvents(prev => [...prev, { ts: Date.now(), msg, important }]);
    };

    const handleSubmit = async (form) => {
        setSubmittedForm(form);
        setPhase('processing');
        setEscalationEvents([]);
        setAiResult(null);
        setCurrentStage('received');

        const now = Date.now();
        addEvent('Emergency report received — intake validation passed', true);

        // Build sensor context
        const sensorState = (sensors || []).filter(s => s.alert || s.value > s.threshold * 0.7);
        const sensorContext = sensorState.length > 0
            ? sensorState.map(s => `${s.name}: ${s.value}${s.unit} (threshold: ${s.threshold}${s.unit})`).join('; ')
            : 'No active sensor anomalies detected nearby';

        // Advance through stages with timing
        await delay(600);
        setCurrentStage('ai_analysis');
        addEvent('AI classification engine activated — analyzing report content');

        await delay(700);
        setCurrentStage('sensor_check');
        addEvent(`Cross-referencing ${(sensors || []).length} active sensors — ${sensorState.length > 0 ? sensorState.length + ' anomalies detected' : 'no corroborating alerts'}`);

        // Run AI
        const aiResponse = await aegisAI.integrations.Core.InvokeLLM({
            prompt: `You are the AI crisis classification engine for AEGIS, an enterprise hospitality emergency platform.

An emergency report has been submitted. Analyze it comprehensively.

REPORT DETAILS:
- Channel: ${form.channel}
- Emergency Type: ${form.type}
- Location: ${form.zone}${form.roomNumber ? ', Room ' + form.roomNumber : ''}${form.floor ? ', Floor ' + form.floor : ''}
- Estimated affected people: ${form.affectedCount || 'unknown'}
- Description: "${form.description || '(no description provided)'}"
- Silent distress mode: ${form.silentMode ? 'YES — covert response required' : 'No'}
- Accessibility needs: ${form.accessibilityNeeds ? form.accessibilityType || 'Yes (unspecified)' : 'None'}
- Reporter: ${form.reporterName || 'Anonymous'}

LIVE SENSOR DATA (nearby):
${sensorContext}

Your tasks:
1. Classify the emergency type precisely: fire | medical | gas_leak | security | suspicious | crowd_panic | water_leak | structural
2. Assign severity: critical | high | medium | low
3. Calculate confidence (0.0-1.0) based on report quality + sensor corroboration
4. Write a clear operational summary (1-2 sentences)
5. Describe sensor correlation findings
6. If silent_mode=true, set silent_mode_response=true
7. If accessibility needs present, write specific rescue priority instruction
8. Generate 4-5 specific autonomous response actions already initiated by the crisis engine
9. Recommend if full scenario orchestration should be activated

Return JSON only.`,
            response_json_schema: {
                type: 'object',
                properties: {
                    type: { type: 'string' },
                    severity: { type: 'string' },
                    confidence: { type: 'number' },
                    summary: { type: 'string' },
                    sensor_correlation: { type: 'string' },
                    silent_mode: { type: 'boolean' },
                    accessibility_flag: { type: 'string' },
                    actions: { type: 'array', items: { type: 'string' } },
                    activate_scenario: { type: 'boolean' },
                },
            },
        });

        setCurrentStage('confidence');
        addEvent(`Confidence score calculated: ${Math.round((aiResponse.confidence || 0) * 100)}% — ${aiResponse.sensor_correlation || 'sensor check complete'}`, true);

        await delay(500);
        setCurrentStage('escalation');
        const sevLabel = aiResponse.severity?.toUpperCase() || 'UNKNOWN';
        addEvent(`Escalation decision: ${sevLabel} severity — ${aiResponse.severity === 'critical' || aiResponse.severity === 'high' ? 'immediate response activated' : 'monitoring protocol initiated'}`, true);

        await delay(500);
        setCurrentStage('responders');
        addEvent('Nearest qualified responders identified and alerted via radio');

        if (form.accessibilityNeeds) {
            addEvent('Accessibility rescue priority flag raised — wheelchair-safe route generated');
        }
        if (form.silentMode) {
            addEvent('SILENT PROTOCOL: Security team notified discretely — no public alarm triggered', true);
        }

        await delay(500);
        setCurrentStage('orchestration');
        addEvent('Crisis orchestration engine engaged — full response coordination active', true);

        // Add to history
        const historyEntry = {
            id: `RPT-${Date.now()}`,
            type: form.type,
            zone: form.zone,
            severity: aiResponse.severity,
            confidence: aiResponse.confidence,
            silent: form.silentMode,
            accessibility: form.accessibilityNeeds,
            ts: new Date().toISOString(),
            summary: aiResponse.summary,
        };
        setReportHistory(prev => [historyEntry, ...prev.slice(0, 9)]);
        setAiResult(aiResponse);
        setPhase('result');

        // Trigger scenario simulation if AI recommends it
        if (aiResponse.activate_scenario && !activeScenario) {
            const scenarioId = SCENARIO_MAP[aiResponse.type] || SCENARIO_MAP[form.type];
            if (scenarioId) {
                setTimeout(() => startSimulation(scenarioId), 1000);
            }
        }
    };

    const reset = () => {
        setPhase('intake');
        setSubmittedForm(null);
        setAiResult(null);
        setCurrentStage(null);
        setEscalationEvents([]);
    };

    return (
        <div className="h-[calc(100vh-56px)] overflow-y-auto">
            <div className="p-4 lg:p-6 max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="flex items-start justify-between mb-5 gap-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-lg bg-critical/10 border border-critical/20">
                            <AlertOctagon className="w-5 h-5 text-critical" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-foreground">Intelligent Emergency Reporting</h1>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Multi-channel intake · AI triage · Sensor verification · Autonomous escalation
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {reportHistory.length > 0 && (
                            <button
                                onClick={() => setShowHistory(!showHistory)}
                                className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border px-2.5 py-1.5 rounded hover:text-foreground transition-colors"
                            >
                                <List className="w-3.5 h-3.5" />
                                History ({reportHistory.length})
                            </button>
                        )}
                        {phase !== 'intake' && (
                            <button
                                onClick={reset}
                                className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border px-2.5 py-1.5 rounded hover:text-foreground transition-colors"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                New Report
                            </button>
                        )}
                    </div>
                </div>

                {/* Report History */}
                {showHistory && reportHistory.length > 0 && (
                    <div className="panel overflow-hidden mb-4">
                        <div className="px-4 py-3 border-b border-border">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Report History</span>
                        </div>
                        <div className="divide-y divide-border">
                            {reportHistory.map(r => (
                                <div key={r.id} className="px-4 py-2.5 flex items-center gap-4 text-xs">
                                    <span className="font-mono text-muted-foreground w-24 flex-shrink-0">{formatTimestamp(r.ts)}</span>
                                    <span className={`font-semibold uppercase w-20 flex-shrink-0 ${r.severity === 'critical' ? 'text-critical' : r.severity === 'high' ? 'text-warning' : 'text-yellow-400'}`}>{r.severity}</span>
                                    <span className="text-foreground capitalize">{r.type?.replace(/_/g, ' ')}</span>
                                    <span className="text-muted-foreground">{r.zone}</span>
                                    <span className="font-mono text-muted-foreground ml-auto">{Math.round((r.confidence || 0) * 100)}%</span>
                                    {r.silent && <span className="text-purple-400 border border-purple-500/30 bg-purple-500/10 px-1.5 rounded">SILENT</span>}
                                    {r.accessibility && <span className="text-info border border-info/30 bg-info/10 px-1.5 rounded">♿</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Left: Form or Summary */}
                    <div>
                        {phase === 'intake' ? (
                            <div className="panel overflow-hidden">
                                <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                                    <AlertOctagon className="w-4 h-4 text-critical" />
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Submit Emergency Report</span>
                                </div>
                                <div className="p-4">
                                    <EmergencyIntakeForm onSubmit={handleSubmit} disabled={false} />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Submitted summary */}
                                <div className={`panel p-4 ${phase === 'processing' ? 'border-warning/30 glow-warning' : aiResult?.severity === 'critical' ? 'border-critical/30 glow-critical' : 'border-warning/20'}`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Report Submitted</span>
                                        {phase === 'processing' && (
                                            <div className="flex items-center gap-1.5 text-xs text-warning animate-pulse">
                                                <div className="w-2 h-2 rounded-full bg-warning animate-ping" />
                                                AI Processing
                                            </div>
                                        )}
                                        {phase === 'result' && (
                                            <span className="text-xs text-safe font-mono">✓ PROCESSED</span>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                                        <div>
                                            <span className="text-muted-foreground">Type: </span>
                                            <span className="text-foreground capitalize font-medium">{submittedForm?.type?.replace(/_/g, ' ')}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Channel: </span>
                                            <span className="text-foreground capitalize">{submittedForm?.channel?.replace(/_/g, ' ')}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Zone: </span>
                                            <span className="text-foreground">{submittedForm?.zone || '—'}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Room: </span>
                                            <span className="text-foreground">{submittedForm?.roomNumber || '—'}</span>
                                        </div>
                                        {submittedForm?.affectedCount && (
                                            <div>
                                                <span className="text-muted-foreground">Affected: </span>
                                                <span className="text-foreground">~{submittedForm.affectedCount} people</span>
                                            </div>
                                        )}
                                        {submittedForm?.silentMode && (
                                            <div className="col-span-2">
                                                <span className="text-purple-400 border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 rounded text-xs">● SILENT DISTRESS MODE</span>
                                            </div>
                                        )}
                                        {submittedForm?.accessibilityNeeds && (
                                            <div className="col-span-2">
                                                <span className="text-info border border-info/30 bg-info/10 px-2 py-0.5 rounded text-xs">♿ Accessibility: {submittedForm.accessibilityType || 'Requested'}</span>
                                            </div>
                                        )}
                                    </div>
                                    {submittedForm?.description && (
                                        <div className="mt-3 pt-3 border-t border-border">
                                            <p className="text-xs text-muted-foreground italic">"{submittedForm.description}"</p>
                                        </div>
                                    )}
                                </div>

                                {/* New report CTA after result */}
                                {phase === 'result' && (
                                    <button
                                        onClick={reset}
                                        className="w-full py-2.5 rounded border border-border text-xs text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        Submit Another Report
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right: Escalation Workflow */}
                    <div>
                        {(phase === 'processing' || phase === 'result') ? (
                            <EscalationWorkflow
                                report={submittedForm}
                                aiResult={phase === 'result' ? aiResult : null}
                                currentStage={currentStage}
                                events={escalationEvents}
                            />
                        ) : (
                            <div className="panel p-6 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                                <div className="p-4 rounded-full bg-secondary/50 mb-4">
                                    <Clock className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-sm font-semibold text-foreground mb-2">Awaiting Emergency Report</h3>
                                <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                                    Submit an emergency report to activate AI triage, multi-source sensor verification, and automated escalation workflows.
                                </p>
                                <div className="mt-4 grid grid-cols-2 gap-2 w-full max-w-xs text-xs text-muted-foreground">
                                    {['AI Classification', 'Sensor X-Check', 'Confidence Score', 'Auto-Escalation'].map(f => (
                                        <div key={f} className="flex items-center gap-1.5 bg-secondary/50 rounded px-2 py-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 flex-shrink-0" />
                                            {f}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}