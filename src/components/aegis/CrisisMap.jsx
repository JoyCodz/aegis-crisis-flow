import { useEffect, useRef, useState } from 'react';
import { useAegisStore } from '../../lib/aegisStore';

const ZONE_POSITIONS = {
    Z1: { x: 20, y: 20, w: 160, h: 110, label: 'Grand Ballroom' },
    Z2: { x: 200, y: 20, w: 130, h: 70, label: 'Main Lobby' },
    Z3: { x: 350, y: 20, w: 110, h: 70, label: 'Restaurant A' },
    Z4: { x: 350, y: 110, w: 110, h: 55, label: 'Kitchen' },
    Z5: { x: 20, y: 155, w: 150, h: 90, label: 'Conference Hall' },
    Z6: { x: 190, y: 155, w: 130, h: 90, label: 'Pool Area' },
    Z7: { x: 340, y: 185, w: 120, h: 35, label: 'Corridor B' },
    Z8: { x: 20, y: 270, w: 185, h: 105, label: 'Casino Floor' },
    Z9: { x: 225, y: 270, w: 110, h: 55, label: 'Bar & Lounge' },
    Z10: { x: 200, y: 100, w: 55, h: 55, label: 'Elev Lobby' },
};

import { EXITS } from '../../lib/aegisSimulation';

function getNodeCenter(id) {
    if (ZONE_POSITIONS[id]) {
        return {
            x: ZONE_POSITIONS[id].x + ZONE_POSITIONS[id].w / 2,
            y: ZONE_POSITIONS[id].y + ZONE_POSITIONS[id].h / 2
        };
    }
    const exit = EXITS.find(e => e.id === id);
    if (exit) return { x: exit.x, y: exit.y };
    return { x: 0, y: 0 };
}

export default function CrisisMap() {
    const { zones, responders, incidents, evacuationPaths, blockedRoutes } = useAegisStore();
    const svgRef = useRef(null);
    const [tick, setTick] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setTick(p => p + 1), 800);
        return () => clearInterval(t);
    }, []);

    const getZoneStatus = (zoneId) => {
        const z = zones?.find(z => z.zone_id === zoneId);
        return z?.status || 'normal';
    };
    
    const getZoneOccupancy = (zoneId) => {
        const z = zones?.find(z => z.zone_id === zoneId);
        return z?.occupancy || 0;
    };

    const activeIncident = incidents?.find(i => i.status === 'active' || i.status === 'escalating');
    const blockedExits = activeIncident?.blocked_exits || [];

    return (
        <div className="relative w-full panel overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-border">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Live Crisis Map — Floor View</span>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-safe/40 border border-safe inline-block" /> Normal</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-warning/30 border border-warning inline-block" /> Elevated</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-critical/30 border border-critical inline-block" /> Danger</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-purple-500/30 border border-purple-500 inline-block" /> Isolated</span>
                </div>
            </div>

            <div className="p-2 overflow-x-auto">
                <svg
                    ref={svgRef}
                    viewBox="0 0 480 390"
                    className="w-full"
                    style={{ minWidth: '320px', maxHeight: '420px' }}
                >
                    {/* Background grid */}
                    <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(222,28%,14%)" strokeWidth="0.5" />
                        </pattern>
                        <filter id="glow-red">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                    </defs>
                    <rect width="480" height="390" fill="url(#grid)" />

                    {/* Zones */}
                    {Object.entries(ZONE_POSITIONS).map(([zoneId, pos]) => {
                        const status = getZoneStatus(zoneId);
                        const isEvacuating = status === 'evacuating';
                        const isDanger = status === 'danger';
                        const isIsolated = status === 'isolated';
                        const isElevated = status === 'elevated';
                        const occupancy = getZoneOccupancy(zoneId);

                        let fill, stroke, strokeWidth;
                        if (isDanger) { fill = 'hsla(0,84%,55%,0.2)'; stroke = 'hsl(0,84%,55%)'; strokeWidth = 1.5; }
                        else if (isEvacuating) { fill = `hsla(38,95%,55%,${0.15 + Math.sin(tick * 0.5) * 0.1})`; stroke = 'hsl(38,95%,55%)'; strokeWidth = 1.5; }
                        else if (isIsolated) { fill = 'hsla(250,80%,60%,0.2)'; stroke = 'hsl(250,80%,60%)'; strokeWidth = 1.5; }
                        else if (isElevated) { fill = 'hsla(38,95%,55%,0.1)'; stroke = 'hsl(38,95%,55%)'; strokeWidth = 1; }
                        else { fill = 'hsla(222,35%,14%,0.8)'; stroke = 'hsl(222,28%,18%)'; strokeWidth = 1; }

                        return (
                            <g key={zoneId}>
                                <rect
                                    x={pos.x} y={pos.y} width={pos.w} height={pos.h}
                                    rx="4" fill={fill} stroke={stroke} strokeWidth={strokeWidth}
                                />
                                {isDanger && (
                                    <rect
                                        x={pos.x} y={pos.y} width={pos.w} height={pos.h}
                                        rx="4" fill="none" stroke="hsl(0,84%,55%)"
                                        strokeWidth="2" strokeDasharray="4 4" opacity={0.5 + Math.sin(tick * 0.8) * 0.5}
                                    />
                                )}
                                <text
                                    x={pos.x + pos.w / 2} y={pos.y + pos.h / 2 - 4}
                                    textAnchor="middle" dominantBaseline="middle"
                                    fill={isDanger ? 'hsl(0,84%,75%)' : isEvacuating ? 'hsl(38,95%,75%)' : 'hsl(210,30%,75%)'}
                                    fontSize="7" fontFamily="Inter, sans-serif" fontWeight="500"
                                >
                                    {pos.label}
                                </text>
                                
                                {/* Occupancy Counter */}
                                <rect x={pos.x + 3} y={pos.y + 3} width="22" height="10" rx="2" fill="hsla(222,47%,6%,0.7)" stroke="hsl(222,28%,24%)" strokeWidth="0.5" />
                                <text x={pos.x + 14} y={pos.y + 8.5} textAnchor="middle" fontSize="6" fill="hsl(210,30%,60%)" fontFamily="Inter, sans-serif">
                                    {occupancy}
                                </text>

                                {isEvacuating && (
                                    <text
                                        x={pos.x + pos.w / 2} y={pos.y + pos.h / 2 + 8}
                                        textAnchor="middle" fontSize="6" fill="hsl(38,95%,65%)" fontFamily="Inter, sans-serif"
                                    >
                                        EVACUATING
                                    </text>
                                )}
                            </g>
                        );
                    })}

                    {/* Exits */}
                    {EXITS.map(exit => {
                        const isBlocked = blockedExits.includes(exit.id);
                        return (
                            <g key={exit.id}>
                                <circle
                                    cx={exit.x} cy={exit.y} r={9}
                                    fill={isBlocked ? 'hsla(0,84%,55%,0.3)' : 'hsla(142,70%,45%,0.2)'}
                                    stroke={isBlocked ? 'hsl(0,84%,55%)' : 'hsl(142,70%,45%)'}
                                    strokeWidth={isBlocked ? 2 : 1.5}
                                />
                                <text
                                    x={exit.x} y={exit.y}
                                    textAnchor="middle" dominantBaseline="middle"
                                    fill={isBlocked ? 'hsl(0,84%,75%)' : 'hsl(142,70%,65%)'}
                                    fontSize="7" fontFamily="JetBrains Mono, monospace" fontWeight="600"
                                >
                                    {exit.label}
                                </text>
                                {isBlocked && (
                                    <line
                                        x1={exit.x - 6} y1={exit.y - 6} x2={exit.x + 6} y2={exit.y + 6}
                                        stroke="hsl(0,84%,55%)" strokeWidth="1.5"
                                    />
                                )}
                            </g>
                        );
                    })}

                    {/* Dynamic Evacuation Paths */}
                    {evacuationPaths?.map((ep, i) => {
                        const path = ep.path;
                        if (!path || path.length < 2) return null;
                        
                        let d = "";
                        for (let j = 0; j < path.length; j++) {
                            const p = getNodeCenter(path[j]);
                            if (j === 0) d += `M ${p.x} ${p.y} `;
                            else d += `L ${p.x} ${p.y} `;
                        }

                        return (
                            <g key={`path-${i}`} opacity={0.6 + Math.sin(tick * 1.5) * 0.4}>
                                <path 
                                    d={d} 
                                    fill="none" 
                                    stroke="hsl(142,70%,50%)" 
                                    strokeWidth="2" 
                                    strokeDasharray="4 4"
                                    className="animate-[dash_1s_linear_infinite]"
                                />
                                {/* Add small animated arrows along the path could be done with marker-end */}
                            </g>
                        );
                    })}

                    {/* Blocked Routes Indicators */}
                    {blockedRoutes?.map((route, i) => {
                        const [from, to] = route.split('-');
                        // Avoid drawing duplicates (A-B and B-A)
                        if (from > to) return null;
                        
                        const p1 = getNodeCenter(from);
                        const p2 = getNodeCenter(to);
                        const mx = (p1.x + p2.x) / 2;
                        const my = (p1.y + p2.y) / 2;

                        return (
                            <g key={`blocked-${i}`}>
                                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="hsl(0,84%,55%)" strokeWidth="1" strokeDasharray="2 4" opacity="0.3" />
                                <circle cx={mx} cy={my} r="5" fill="hsla(0,84%,15%,0.8)" stroke="hsl(0,84%,55%)" />
                                <text x={mx} y={my} textAnchor="middle" dominantBaseline="middle" fill="hsl(0,84%,55%)" fontSize="6" fontWeight="bold">X</text>
                            </g>
                        );
                    })}

                    {/* Responders */}
                    {responders?.filter(r => r.status !== 'off_duty').map((r, i) => {
                        const zone = ZONE_POSITIONS[r.zone_id];
                        if (!zone) return null;
                        const cx = zone.x + zone.w * 0.3 + (i % 3) * 20;
                        const cy = zone.y + zone.h * 0.6;
                        const roleColors = {
                            fire_warden: 'hsl(25,95%,55%)',
                            medic: 'hsl(200,90%,55%)',
                            security: 'hsl(270,70%,65%)',
                            manager: 'hsl(180,80%,50%)',
                            maintenance: 'hsl(45,90%,55%)',
                        };
                        const color = roleColors[r.role] || 'hsl(210,30%,65%)';
                        const isDeployed = r.status === 'deployed' || r.status === 'en_route';
                        const isCommActive = r.comm_state === 'awaiting_ack' || r.comm_state === 'acknowledged';

                        return (
                            <g key={r.id}>
                                {isDeployed && (
                                    <circle cx={cx} cy={cy} r={isCommActive ? 10 : 7} fill="none" stroke={color} strokeWidth="1"
                                        opacity={0.4 + Math.sin(tick + i) * 0.4} />
                                )}
                                <circle cx={cx} cy={cy} r="4" fill={color} opacity={0.9} />
                                <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="4.5" fill="white" fontWeight="700">
                                    {r.name[0]}
                                </text>
                            </g>
                        );
                    })}

                    {/* Legend */}
                    <g transform="translate(340, 270)">
                        <rect x="0" y="0" width="110" height="80" rx="3" fill="hsla(222,47%,6%,0.85)" stroke="hsl(222,28%,16%)" />
                        <text x="8" y="14" fontSize="6" fill="hsl(215,20%,55%)" fontFamily="Inter, sans-serif" fontWeight="600">RESPONDERS</text>
                        {[
                            { role: 'fire_warden', color: 'hsl(25,95%,55%)', label: 'Fire Warden' },
                            { role: 'medic', color: 'hsl(200,90%,55%)', label: 'Medic' },
                            { role: 'security', color: 'hsl(270,70%,65%)', label: 'Security' },
                            { role: 'manager', color: 'hsl(180,80%,50%)', label: 'Manager' },
                            { role: 'maintenance', color: 'hsl(45,90%,55%)', label: 'Maintenance' },
                        ].map((item, i) => (
                            <g key={item.role} transform={`translate(8, ${24 + i * 11})`}>
                                <circle cx="4" cy="4" r="3.5" fill={item.color} />
                                <text x="12" y="8" fontSize="6" fill="hsl(210,30%,70%)" fontFamily="Inter, sans-serif">{item.label}</text>
                            </g>
                        ))}
                    </g>
                    <style>{`
                        @keyframes dash {
                            to { stroke-dashoffset: -8; }
                        }
                    `}</style>
                </svg>
            </div>
        </div>
    );
}