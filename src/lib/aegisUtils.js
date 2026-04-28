export function severityColor(severity) {
    switch (severity) {
        case 'critical': return 'text-critical';
        case 'high': return 'text-warning';
        case 'medium': return 'text-yellow-400';
        case 'low': return 'text-safe';
        default: return 'text-muted-foreground';
    }
}

export function severityBg(severity) {
    switch (severity) {
        case 'critical': return 'bg-critical/10 border-critical/30';
        case 'high': return 'bg-warning/10 border-warning/30';
        case 'medium': return 'bg-yellow-500/10 border-yellow-500/30';
        case 'low': return 'bg-safe/10 border-safe/30';
        default: return 'bg-muted border-border';
    }
}

export function statusColor(status) {
    switch (status) {
        case 'active': return 'text-critical';
        case 'escalating': return 'text-warning';
        case 'contained': return 'text-yellow-400';
        case 'resolved': return 'text-safe';
        case 'online': return 'text-safe';
        case 'offline': return 'text-critical';
        case 'degraded': return 'text-warning';
        case 'available': return 'text-safe';
        case 'deployed': return 'text-warning';
        case 'en_route': return 'text-info';
        default: return 'text-muted-foreground';
    }
}

export function zoneStatusColor(status) {
    switch (status) {
        case 'normal': return '#22c55e';
        case 'elevated': return '#f59e0b';
        case 'danger': return '#ef4444';
        case 'evacuating': return '#f97316';
        case 'isolated': return '#8b5cf6';
        case 'clear': return '#06b6d4';
        default: return '#475569';
    }
}

export function incidentTypeLabel(type) {
    const labels = {
        fire: 'Fire',
        medical: 'Medical',
        security: 'Security Threat',
        gas_leak: 'Gas Leak',
        crowd_panic: 'Crowd Surge',
        structural: 'Structural',
    };
    return labels[type] || type;
}

export function responderRoleLabel(role) {
    const labels = {
        fire_warden: 'Fire Warden',
        medic: 'Medic',
        security: 'Security',
        manager: 'Manager',
        maintenance: 'Maintenance',
    };
    return labels[role] || role;
}

export function eventTypeIcon(type) {
    const icons = {
        detection: '◈',
        classification: '◆',
        escalation: '▲',
        responder_assigned: '●',
        evacuation_initiated: '▶',
        route_blocked: '✕',
        reroute: '↻',
        zone_isolated: '⬡',
        responder_arrived: '✓',
        resolved: '✔',
        sensor_failure: '⚠',
        ai_decision: '◉',
        manual_override: '◎',
    };
    return icons[type] || '·';
}

export function eventTypeColor(type) {
    switch (type) {
        case 'detection': return 'text-warning';
        case 'classification': return 'text-info';
        case 'escalation': return 'text-critical';
        case 'responder_assigned': return 'text-safe';
        case 'evacuation_initiated': return 'text-warning';
        case 'route_blocked': return 'text-critical';
        case 'reroute': return 'text-info';
        case 'zone_isolated': return 'text-warning';
        case 'responder_arrived': return 'text-safe';
        case 'resolved': return 'text-safe';
        case 'sensor_failure': return 'text-critical';
        case 'ai_decision': return 'text-info';
        case 'manual_override': return 'text-muted-foreground';
        default: return 'text-muted-foreground';
    }
}

export function formatTimestamp(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function confidenceLabel(c) {
    if (c >= 0.9) return 'VERY HIGH';
    if (c >= 0.75) return 'HIGH';
    if (c >= 0.55) return 'MODERATE';
    return 'LOW';
}

export function confidenceColor(c) {
    if (c >= 0.9) return 'text-safe';
    if (c >= 0.75) return 'text-warning';
    if (c >= 0.55) return 'text-yellow-400';
    return 'text-critical';
}