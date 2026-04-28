import { useEffect, useRef } from 'react';
import { useAegisStore } from '../../lib/aegisStore';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { RadioTower, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function LiveRadioFeed() {
    const { communications } = useAegisStore();
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [communications]);

    return (
        <Card className="flex flex-col h-full bg-card/50 backdrop-blur-sm border-border">
            <CardHeader className="py-3 px-4 border-b border-border bg-muted/20">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2 tracking-wide uppercase">
                        <RadioTower className="w-4 h-4 text-purple-500" />
                        Live Operational Radio
                    </CardTitle>
                    <div className="flex gap-2">
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Active Feed
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden relative">
                <ScrollArea className="h-full p-4">
                    {communications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50 space-y-2 py-8">
                            <RadioTower className="w-8 h-8 mb-2" />
                            <p className="text-xs uppercase tracking-widest">Awaiting Transmissions</p>
                        </div>
                    ) : (
                        <div className="space-y-4 pb-4">
                            {communications.map((msg, idx) => {
                                const isCommand = msg.sender === 'COMMAND';
                                return (
                                    <div key={msg.id} className={`flex flex-col ${isCommand ? 'items-end' : 'items-start'}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-mono text-muted-foreground">
                                                {format(new Date(msg.timestamp), 'HH:mm:ss')}
                                            </span>
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isCommand ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                {isCommand ? 'CMD' : msg.channel}
                                            </span>
                                        </div>
                                        <div className={`px-3 py-2 rounded-md max-w-[85%] text-sm font-mono leading-relaxed ${
                                            isCommand 
                                                ? 'bg-purple-500/10 border border-purple-500/20 text-purple-100 rounded-tr-none' 
                                                : 'bg-blue-500/10 border border-blue-500/20 text-blue-100 rounded-tl-none'
                                        }`}>
                                            <div className="font-semibold text-[10px] mb-1 opacity-70 uppercase tracking-wider">
                                                {msg.sender} → {msg.receiver}
                                            </div>
                                            {msg.message}
                                        </div>
                                        <div className="flex items-center gap-1 mt-1 text-[9px] text-muted-foreground uppercase">
                                            {msg.status === 'delivered' && <><Clock className="w-3 h-3" /> Delivered</>}
                                            {msg.status === 'read' && <><CheckCircle2 className="w-3 h-3 text-green-500" /> Acknowledged</>}
                                            {msg.status === 'escalated' && <><AlertCircle className="w-3 h-3 text-red-500" /> No Ack - Escalated</>}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={scrollRef} />
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
