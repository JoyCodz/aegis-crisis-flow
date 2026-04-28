import { Flame, Heart, Shield, Wind, Users, Play, Square } from 'lucide-react';
import { SCENARIO_FIRE, SCENARIO_MEDICAL, SCENARIO_SECURITY, SCENARIO_GAS, SCENARIO_CROWD } from '../../lib/aegisSimulation';

const SCENARIOS = [
    {
        id: SCENARIO_FIRE,
        label: 'Kitchen Fire',
        desc: 'Smoke & heat anomaly in kitchen spreads to restaurant',
        icon: Flame,
        severity: 'critical',
        color: 'border-critical/30 bg-critical/5 hover:bg-critical/10',
        activeColor: 'border-critical bg-critical/15 glow-critical',
        iconColor: 'text-critical',
    },
    {
        id: SCENARIO_MEDICAL,
        label: 'Medical Emergency',
        desc: 'Guest unresponsive in Grand Ballroom — SOS triggered',
        icon: Heart,
        severity: 'high',
        color: 'border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10',
        activeColor: 'border-blue-500 bg-blue-500/15',
        iconColor: 'text-blue-400',
    },
    {
        id: SCENARIO_SECURITY,
        label: 'Security Threat',
        desc: 'Aggressive altercation on Casino Floor — panic buttons activated',
        icon: Shield,
        severity: 'high',
        color: 'border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10',
        activeColor: 'border-purple-500 bg-purple-500/15',
        iconColor: 'text-purple-400',
    },
    {
        id: SCENARIO_GAS,
        label: 'Gas Leak',
        desc: 'LEL threshold exceeded in kitchen — ignition risk critical',
        icon: Wind,
        severity: 'critical',
        color: 'border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10',
        activeColor: 'border-yellow-500 bg-yellow-500/15',
        iconColor: 'text-yellow-400',
    },
    {
        id: SCENARIO_CROWD,
        label: 'Crowd Surge',
        desc: 'Main lobby at 97% capacity — crowd compression detected',
        icon: Users,
        severity: 'high',
        color: 'border-orange-500/30 bg-orange-500/5 hover:bg-orange-500/10',
        activeColor: 'border-orange-500 bg-orange-500/15',
        iconColor: 'text-orange-400',
    },
];

export default function ScenarioLauncher({ activeScenario, onStart, onStop }) {
    return (
        <div className="panel overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Crisis Simulation Engine</span>
                {activeScenario && (
                    <button
                        onClick={onStop}
                        className="flex items-center gap-1.5 text-xs text-critical border border-critical/30 bg-critical/10 hover:bg-critical/20 px-2.5 py-1 rounded transition-colors"
                    >
                        <Square className="w-3 h-3" />
                        Stop Simulation
                    </button>
                )}
            </div>
            <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
                {SCENARIOS.map(s => {
                    const Icon = s.icon;
                    const isActive = activeScenario === s.id;
                    return (
                        <button
                            key={s.id}
                            onClick={() => isActive ? onStop() : onStart(s.id)}
                            disabled={activeScenario && !isActive}
                            className={`text-left p-3 rounded border transition-all disabled:opacity-30 disabled:cursor-not-allowed ${isActive ? s.activeColor : s.color
                                }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <Icon className={`w-4 h-4 ${isActive ? s.iconColor : 'text-muted-foreground'}`} />
                                {isActive ? (
                                    <span className="text-xs font-mono text-info animate-pulse">LIVE</span>
                                ) : (
                                    <Play className="w-3 h-3 text-muted-foreground" />
                                )}
                            </div>
                            <div className="text-xs font-semibold text-foreground mb-0.5">{s.label}</div>
                            <div className="text-xs text-muted-foreground leading-snug">{s.desc}</div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}