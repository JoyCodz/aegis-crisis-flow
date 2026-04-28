import { Brain, ChevronRight, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { confidenceLabel, confidenceColor, severityColor, incidentTypeLabel } from '../../lib/aegisUtils';

export default function AIReasoningPanel({ reasoning }) {
    if (!reasoning) {
        return (
            <div className="panel p-6 text-center">
                <Brain className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No active AI analysis. Trigger a scenario to begin.</p>
            </div>
        );
    }

    return (
        <div className="panel overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-card">
                <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-info" />
                    <span className="text-sm font-semibold text-foreground">AI Intelligence Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono font-semibold ${severityColor(reasoning.severity)}`}>
                        {reasoning.severity?.toUpperCase()}
                    </span>
                    <span className="text-muted-foreground text-xs">·</span>
                    <span className={`text-xs font-mono ${confidenceColor(reasoning.confidence)}`}>
                        {confidenceLabel(reasoning.confidence)} CONFIDENCE ({Math.round((reasoning.confidence || 0) * 100)}%)
                    </span>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Classification */}
                <div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-semibold mb-3 ${reasoning.severity === 'critical' ? 'bg-critical/10 border-critical/30 text-critical' :
                            'bg-warning/10 border-warning/30 text-warning'
                        }`}>
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {reasoning.title}
                    </div>
                </div>

                {/* Confidence meter */}
                <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">AI Confidence Score</span>
                        <span className={`font-mono font-semibold ${confidenceColor(reasoning.confidence)}`}>
                            {Math.round((reasoning.confidence || 0) * 100)}%
                        </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ${reasoning.confidence >= 0.9 ? 'bg-safe' :
                                    reasoning.confidence >= 0.75 ? 'bg-warning' : 'bg-critical'
                                }`}
                            style={{ width: `${Math.round((reasoning.confidence || 0) * 100)}%` }}
                        />
                    </div>
                </div>

                {/* Reasoning Evidence */}
                <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <ChevronRight className="w-3 h-3" />
                        Evidence — Why this classification
                    </h4>
                    <div className="space-y-1.5">
                        {reasoning.reasons?.map((reason, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs">
                                <span className="text-warning mt-0.5 flex-shrink-0 font-mono">→</span>
                                <span className="text-foreground/80 leading-relaxed">{reason}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-info" />
                        Autonomous Actions — Initiated by Crisis Engine
                    </h4>
                    <div className="space-y-1.5">
                        {reasoning.actions?.map((action, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs bg-info/5 border border-info/10 rounded px-2.5 py-1.5">
                                <CheckCircle className="w-3 h-3 text-info mt-0.5 flex-shrink-0" />
                                <span className="text-foreground/90 leading-relaxed">{action}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}