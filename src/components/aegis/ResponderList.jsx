import { User, Radio } from 'lucide-react';
import { statusColor, responderRoleLabel } from '../../lib/aegisUtils';

const roleColors = {
    fire_warden: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    medic: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    security: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    manager: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    maintenance: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

export default function ResponderList({ responders, compact }) {
    return (
        <div className="space-y-2">
            {responders.map(r => (
                <div key={r.id} className={`panel p-3 flex items-center gap-3 ${r.status === 'deployed' || r.status === 'en_route' ? 'border-warning/20' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${roleColors[r.role] || 'bg-secondary text-foreground'}`}>
                        {r.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium text-foreground truncate">{r.name}</span>
                            <span className={`text-xs font-semibold uppercase font-mono ${statusColor(r.status)}`}>
                                {r.status === 'en_route' ? 'EN ROUTE' : r.status}
                            </span>
                        </div>
                        {!compact && (
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className={`text-xs border px-1.5 rounded ${roleColors[r.role] || ''}`}>
                                    {responderRoleLabel(r.role)}
                                </span>
                                <span className="text-xs text-muted-foreground truncate">{r.zone_name}</span>
                            </div>
                        )}
                        {compact && (
                            <div className="text-xs text-muted-foreground">{responderRoleLabel(r.role)} · {r.zone_name}</div>
                        )}
                        {r.assigned_incident_id && !compact && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-warning">
                                <span>Assigned to incident</span>
                            </div>
                        )}
                    </div>
                    {!compact && r.radio_channel && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                            <Radio className="w-3 h-3" />
                            <span className="font-mono">{r.radio_channel}</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}