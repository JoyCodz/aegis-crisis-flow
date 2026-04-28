import { useEffect, useRef } from 'react';
import { eventTypeIcon, eventTypeColor, formatTimestamp } from '../../lib/aegisUtils';

export default function CrisisTimeline({ events, maxHeight = '400px' }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [events]);

    if (!events || events.length === 0) {
        return (
            <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
                No events. Activate a scenario to begin.
            </div>
        );
    }

    return (
        <div className="overflow-y-auto pr-1" style={{ maxHeight }}>
            <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
                <div className="space-y-1">
                    {[...events].reverse().map((ev, i) => (
                        <div
                            key={i}
                            className={`relative flex items-start gap-3 pl-12 pr-2 py-2 rounded hover:bg-secondary/30 transition-colors group ${i === 0 ? 'animate-in fade-in duration-300' : ''}`}
                        >
                            {/* Node */}
                            <div className={`absolute left-4 top-3 w-4 h-4 flex items-center justify-center text-xs font-mono font-bold ${eventTypeColor(ev.type)}`}>
                                {eventTypeIcon(ev.type)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="font-mono text-xs text-muted-foreground flex-shrink-0">
                                        {formatTimestamp(ev.timestamp)}
                                    </span>
                                    {ev.automated && (
                                        <span className="text-xs text-info/70 border border-info/20 bg-info/5 px-1 rounded">AUTO</span>
                                    )}
                                    {!ev.automated && (
                                        <span className="text-xs text-muted-foreground border border-border px-1 rounded">MANUAL</span>
                                    )}
                                </div>
                                <p className="text-xs text-foreground leading-relaxed">{ev.desc}</p>
                                {ev.actor && (
                                    <p className="text-xs text-muted-foreground mt-0.5">— {ev.actor}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div ref={bottomRef} />
            </div>
        </div>
    );
}