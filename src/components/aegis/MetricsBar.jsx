import { AlertTriangle, Users, Activity, Shield, Wifi } from 'lucide-react';

export default function MetricsBar({ incidents, responders, sensors, zones }) {
    const activeIncidents = incidents?.filter(i => i.status === 'active' || i.status === 'escalating').length || 0;
    const criticalIncidents = incidents?.filter(i => i.severity === 'critical' && i.status !== 'resolved').length || 0;
    const deployedResponders = responders?.filter(r => r.status === 'deployed' || r.status === 'en_route').length || 0;
    const offlineSensors = sensors?.filter(s => s.status === 'offline').length || 0;
    const alertingSensors = sensors?.filter(s => s.alert).length || 0;
    const totalOccupancy = zones?.reduce((sum, z) => sum + (z.occupancy || 0), 0) || 0;
    const evacuatingZones = zones?.filter(z => z.status === 'evacuating' || z.status === 'isolated').length || 0;

    const metrics = [
        {
            label: 'Active Incidents',
            value: activeIncidents,
            sub: criticalIncidents > 0 ? `${criticalIncidents} critical` : 'none critical',
            icon: AlertTriangle,
            color: activeIncidents > 0 ? 'text-critical' : 'text-safe',
            alert: activeIncidents > 0,
        },
        {
            label: 'Responders Deployed',
            value: deployedResponders,
            sub: `${(responders?.length || 0) - deployedResponders} available`,
            icon: Shield,
            color: deployedResponders > 0 ? 'text-warning' : 'text-muted-foreground',
            alert: false,
        },
        {
            label: 'Sensor Alerts',
            value: alertingSensors,
            sub: offlineSensors > 0 ? `${offlineSensors} offline` : 'all online',
            icon: Activity,
            color: alertingSensors > 0 ? 'text-critical' : offlineSensors > 0 ? 'text-warning' : 'text-safe',
            alert: alertingSensors > 0,
        },
        {
            label: 'Total Occupancy',
            value: totalOccupancy.toLocaleString(),
            sub: evacuatingZones > 0 ? `${evacuatingZones} zones evacuating` : 'all zones normal',
            icon: Users,
            color: evacuatingZones > 0 ? 'text-warning' : 'text-muted-foreground',
            alert: evacuatingZones > 0,
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {metrics.map((m) => {
                const Icon = m.icon;
                return (
                    <div key={m.label} className={`panel p-4 ${m.alert ? 'border-critical/20' : ''}`}>
                        <div className="flex items-start justify-between mb-2">
                            <Icon className={`w-4 h-4 ${m.color}`} />
                            {m.alert && <span className="w-1.5 h-1.5 rounded-full bg-critical animate-ping" />}
                        </div>
                        <div className={`text-2xl font-mono font-bold ${m.color}`}>{m.value}</div>
                        <div className="text-xs text-foreground font-medium mt-0.5">{m.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{m.sub}</div>
                    </div>
                );
            })}
        </div>
    );
}