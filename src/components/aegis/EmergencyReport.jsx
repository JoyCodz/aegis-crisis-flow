import { useState } from 'react';
import { MessageSquare, Send, Languages, Mic } from 'lucide-react';
import { aegisAI } from '@/api/aegisClient';

const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'zh', label: '中文' },
    { code: 'ar', label: 'العربية' },
    { code: 'pt', label: 'Português' },
    { code: 'ja', label: '日本語' },
    { code: 'de', label: 'Deutsch' },
];

export default function EmergencyReport({ onReportProcessed }) {
    const [text, setText] = useState('');
    const [lang, setLang] = useState('en');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const submit = async () => {
        if (!text.trim()) return;
        setLoading(true);
        setResult(null);
        const res = await aegisAI.integrations.Core.InvokeLLM({
            prompt: `You are an emergency classification AI for a hospitality crisis platform.
      
A ${lang !== 'en' ? `${LANGUAGES.find(l => l.code === lang)?.label}-language` : ''} emergency report has been submitted:

"${text}"

Tasks:
1. If not in English, translate it first.
2. Classify the emergency type: fire | medical | security | gas_leak | crowd_panic | structural | unknown
3. Assess severity: critical | high | medium | low
4. Assign confidence (0.0-1.0)
5. Extract key details (location if mentioned, number of people affected, immediate risks)
6. Generate 3-4 recommended immediate actions

Return structured JSON only.`,
            response_json_schema: {
                type: 'object',
                properties: {
                    translation: { type: 'string' },
                    type: { type: 'string' },
                    severity: { type: 'string' },
                    confidence: { type: 'number' },
                    summary: { type: 'string' },
                    details: { type: 'string' },
                    actions: { type: 'array', items: { type: 'string' } },
                },
            },
        });
        setResult(res);
        setLoading(false);
        if (onReportProcessed) onReportProcessed(res);
    };

    return (
        <div className="panel overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-info" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Emergency Report — Multi-Language AI Intake</span>
            </div>

            <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                    <Languages className="w-3.5 h-3.5 text-muted-foreground" />
                    <select
                        value={lang}
                        onChange={e => setLang(e.target.value)}
                        className="bg-input border border-border rounded px-2 py-1 text-xs text-foreground"
                    >
                        {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                    </select>
                    <span className="text-xs text-muted-foreground">Report language</span>
                </div>

                <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder='e.g. "There is smoke and people are coughing near the restaurant" or "Hay humo en el restaurante"'
                    className="w-full bg-input border border-border rounded p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none h-20 focus:outline-none focus:border-info/50"
                />

                <button
                    onClick={submit}
                    disabled={loading || !text.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-info/10 border border-info/30 text-info text-xs font-semibold rounded hover:bg-info/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <div className="w-3 h-3 border-2 border-info/50 border-t-info rounded-full animate-spin" />
                    ) : (
                        <Send className="w-3 h-3" />
                    )}
                    {loading ? 'AI Processing...' : 'Submit to AI Triage'}
                </button>

                {result && (
                    <div className={`rounded border p-3 space-y-2 ${result.severity === 'critical' ? 'bg-critical/5 border-critical/30' :
                            result.severity === 'high' ? 'bg-warning/5 border-warning/30' :
                                'bg-info/5 border-info/30'
                        }`}>
                        {result.translation && result.translation !== text && (
                            <div className="text-xs text-muted-foreground italic border-b border-border pb-2">
                                Translation: "{result.translation}"
                            </div>
                        )}
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className={`text-xs font-semibold uppercase px-2 py-0.5 rounded border ${result.type === 'fire' ? 'text-critical border-critical/30 bg-critical/10' :
                                    result.type === 'medical' ? 'text-blue-400 border-blue-500/30 bg-blue-500/10' :
                                        'text-warning border-warning/30 bg-warning/10'
                                }`}>{result.type?.replace('_', ' ') || 'Unknown'}</span>
                            <span className={`text-xs font-mono font-bold ${result.severity === 'critical' ? 'text-critical' :
                                    result.severity === 'high' ? 'text-warning' : 'text-yellow-400'
                                }`}>{result.severity?.toUpperCase()}</span>
                            <span className="text-xs text-muted-foreground">{Math.round((result.confidence || 0) * 100)}% confidence</span>
                        </div>
                        <p className="text-xs text-foreground">{result.summary}</p>
                        <div className="space-y-1">
                            {result.actions?.map((a, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs">
                                    <span className="text-info mt-0.5">→</span>
                                    <span className="text-foreground/80">{a}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}