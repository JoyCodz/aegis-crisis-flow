import { AlertTriangle, Flame, Shield, Wind, Users, Building } from 'lucide-react';
import { severityColor, severityBg, incidentTypeLabel, formatTimestamp } from '../../lib/aegisUtils';

const typeIcons = {
    fire: Flame,
    medical: Shield,
    security: Shield,
    gas_leak: Wind,
    crowd_panic: Users,
    structural: Building,
};

export default function IncidentCard({ incident, onClick, active }) {
    const Icon = typeIcons[incident.type] || AlertTriangle;
    const isCritical = incident.severity === 'critical';

    return (
        <button
            onClick={onClick}
            className={`w-full text-left panel p-4 transition-all hover:border-foreground/20 ${active ? 'border-foreground/30 bg-secondary/40' : ''
                } ${isCritical ? 'glow-critical' : ''}`}
        >
            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-md border ${severityBg(incident.severity)} flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${severityColor(incident.severity)}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-semibold text-sm text-foreground truncate">{incident.title}</span>
                        <span className={`text-xs font-mono font-semibold uppercase flex-shrink-0 ${severityColor(incident.severity)}`}>
                            {incident.severity}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                        <span>{incidentTypeLabel(incident.type)}</span>
                        <span>·</span>
                        <span>{incident.zone_name}</span>
                        {incident.detected_at && (
                            <>
                                <span>·</span>
                                <span className="font-mono">{formatTimestamp(incident.detected_at)}</span>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`text-xs px-1.5 py-0.5 rounded border font-medium capitalize ${incident.status === 'active' ? 'text-critical border-critical/30 bg-critical/10' :
                                incident.status === 'escalating' ? 'text-warning border-warning/30 bg-warning/10' :
                                    incident.status === 'contained' ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' :
                                        'text-safe border-safe/30 bg-safe/10'
                            }`}>
                            {incident.status}
                        </span>
                        {incident.confidence && (
                            <span className="text-xs text-muted-foreground font-mono">
                                {Math.round(incident.confidence * 100)}% confidence
                            </span>
                        )}
                        {incident.evacuation_active && (
                            <span className="text-xs text-warning border border-warning/30 bg-warning/10 px-1.5 py-0.5 rounded">
                                EVACUATION ACTIVE
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </button>
    );
}