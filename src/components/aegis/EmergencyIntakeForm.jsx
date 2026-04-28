import { useState } from 'react';
import { Flame, Heart, Wind, Shield, Eye, Users, Droplets, Building, Mic, MessageSquare, MapPin, Phone, Watch, AlertOctagon, Accessibility, ChevronRight, Upload, Volume2 } from 'lucide-react';

const EMERGENCY_TYPES = [
    { id: 'fire', label: 'Fire Emergency', icon: Flame, color: 'border-red-500/40 bg-red-500/10 text-red-400', activeColor: 'border-red-500 bg-red-500/20 text-red-300', severity: 'critical' },
    { id: 'medical', label: 'Medical Emergency', icon: Heart, color: 'border-blue-500/40 bg-blue-500/10 text-blue-400', activeColor: 'border-blue-500 bg-blue-500/25 text-blue-300', severity: 'high' },
    { id: 'gas_leak', label: 'Gas Leak', icon: Wind, color: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400', activeColor: 'border-yellow-500 bg-yellow-500/20 text-yellow-300', severity: 'critical' },
    { id: 'security', label: 'Violence / Threat', icon: Shield, color: 'border-purple-500/40 bg-purple-500/10 text-purple-400', activeColor: 'border-purple-500 bg-purple-500/25 text-purple-300', severity: 'high' },
    { id: 'suspicious', label: 'Suspicious Activity', icon: Eye, color: 'border-orange-500/40 bg-orange-500/10 text-orange-400', activeColor: 'border-orange-500 bg-orange-500/20 text-orange-300', severity: 'medium' },
    { id: 'crowd_panic', label: 'Crowd Panic', icon: Users, color: 'border-pink-500/40 bg-pink-500/10 text-pink-400', activeColor: 'border-pink-500 bg-pink-500/25 text-pink-300', severity: 'high' },
    { id: 'water_leak', label: 'Water Leakage', icon: Droplets, color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400', activeColor: 'border-cyan-500 bg-cyan-500/20 text-cyan-300', severity: 'medium' },
    { id: 'structural', label: 'Structural Hazard', icon: Building, color: 'border-amber-500/40 bg-amber-500/10 text-amber-400', activeColor: 'border-amber-500 bg-amber-500/20 text-amber-300', severity: 'high' },
];

const CHANNELS = [
    { id: 'guest_mobile', label: 'Guest Mobile', icon: Phone },
    { id: 'staff_panic', label: 'Staff Panic', icon: AlertOctagon },
    { id: 'room_button', label: 'Room Button', icon: MapPin },
    { id: 'voice', label: 'Voice Report', icon: Volume2 },
    { id: 'silent', label: 'Silent Distress', icon: Eye },
    { id: 'wearable', label: 'Wearable Trigger', icon: Watch },
];

const ZONES_LIST = [
    'Grand Ballroom', 'Main Lobby', 'Restaurant A', 'Kitchen',
    'Conference Hall', 'Pool Area', 'Corridor B', 'Casino Floor',
    'Bar & Lounge', 'Elevator Lobby', 'Guest Rooms Floor 2', 'Guest Rooms Floor 3',
];

export default function EmergencyIntakeForm({ onSubmit, disabled }) {
    const [form, setForm] = useState({
        channel: 'guest_mobile',
        type: '',
        description: '',
        zone: '',
        roomNumber: '',
        floor: '',
        affectedCount: '',
        accessibilityNeeds: false,
        accessibilityType: '',
        silentMode: false,
        reporterName: '',
        reporterContact: '',
    });

    const isSilentCapable = form.type === 'security' || form.type === 'suspicious';

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    const canSubmit = form.type && (form.description || form.zone) && !disabled;

    return (
        <div className="space-y-5">
            {/* Reporting Channel */}
            <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                    Reporting Channel
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                    {CHANNELS.map(ch => {
                        const Icon = ch.icon;
                        const active = form.channel === ch.id;
                        return (
                            <button
                                key={ch.id}
                                onClick={() => set('channel', ch.id)}
                                className={`flex flex-col items-center gap-1 py-2 px-1 rounded border text-xs transition-all ${active ? 'border-info/60 bg-info/10 text-info' : 'border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground'
                                    }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                <span className="text-center leading-tight">{ch.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Emergency Type */}
            <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                    Emergency Type <span className="text-critical">*</span>
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                    {EMERGENCY_TYPES.map(t => {
                        const Icon = t.icon;
                        const active = form.type === t.id;
                        return (
                            <button
                                key={t.id}
                                onClick={() => set('type', t.id)}
                                className={`flex items-center gap-2 p-2.5 rounded border text-xs font-medium transition-all text-left ${active ? t.activeColor + ' border-2' : t.color + ' hover:opacity-90'
                                    }`}
                            >
                                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                                {t.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Silent Mode toggle for security threats */}
            {isSilentCapable && (
                <button
                    onClick={() => set('silentMode', !form.silentMode)}
                    className={`w-full flex items-center gap-3 p-3 rounded border text-xs transition-all ${form.silentMode
                            ? 'border-purple-500/50 bg-purple-500/10 text-purple-300'
                            : 'border-border text-muted-foreground hover:border-foreground/20'
                        }`}
                >
                    <Eye className={`w-4 h-4 flex-shrink-0 ${form.silentMode ? 'text-purple-400' : ''}`} />
                    <div className="text-left">
                        <div className={`font-semibold ${form.silentMode ? 'text-purple-300' : 'text-foreground'}`}>
                            {form.silentMode ? '● SILENT DISTRESS MODE ACTIVE' : 'Activate Silent Distress Mode'}
                        </div>
                        <div className="text-muted-foreground mt-0.5">Discreet security alert — no visible public alarm</div>
                    </div>
                </button>
            )}

            {/* Location */}
            <div className="grid grid-cols-3 gap-2">
                <div className="col-span-3">
                    <label className="text-xs text-muted-foreground mb-1 block">Zone / Location</label>
                    <select
                        value={form.zone}
                        onChange={e => set('zone', e.target.value)}
                        className="w-full bg-input border border-border rounded px-2 py-1.5 text-xs text-foreground"
                    >
                        <option value="">Select zone...</option>
                        {ZONES_LIST.map(z => <option key={z} value={z}>{z}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Room #</label>
                    <input value={form.roomNumber} onChange={e => set('roomNumber', e.target.value)}
                        placeholder="e.g. 214" className="w-full bg-input border border-border rounded px-2 py-1.5 text-xs text-foreground" />
                </div>
                <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Floor</label>
                    <input value={form.floor} onChange={e => set('floor', e.target.value)}
                        placeholder="e.g. 3" className="w-full bg-input border border-border rounded px-2 py-1.5 text-xs text-foreground" />
                </div>
                <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Est. People</label>
                    <input value={form.affectedCount} onChange={e => set('affectedCount', e.target.value)}
                        placeholder="e.g. 12" className="w-full bg-input border border-border rounded px-2 py-1.5 text-xs text-foreground" />
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> Description
                </label>
                <textarea
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    placeholder='Describe what you observe — e.g. "Smoke visible near kitchen entrance, people evacuating"'
                    className="w-full bg-input border border-border rounded p-2.5 text-xs text-foreground placeholder:text-muted-foreground resize-none h-20 focus:outline-none focus:border-info/50"
                />
            </div>

            {/* Accessibility */}
            <div>
                <button
                    onClick={() => set('accessibilityNeeds', !form.accessibilityNeeds)}
                    className={`flex items-center gap-2 text-xs px-3 py-2 rounded border transition-colors w-full ${form.accessibilityNeeds ? 'border-info/50 bg-info/10 text-info' : 'border-border text-muted-foreground hover:border-foreground/20'
                        }`}
                >
                    <Accessibility className="w-3.5 h-3.5" />
                    <span className="font-medium">{form.accessibilityNeeds ? '✓ Accessibility assistance requested' : 'Request accessibility assistance'}</span>
                </button>
                {form.accessibilityNeeds && (
                    <div className="mt-2 grid grid-cols-3 gap-1.5">
                        {['Wheelchair', 'Mobility impaired', 'Hearing impaired', 'Visual impairment', 'Elderly', 'Injured'].map(t => (
                            <button
                                key={t}
                                onClick={() => set('accessibilityType', form.accessibilityType === t ? '' : t)}
                                className={`text-xs py-1.5 px-2 rounded border transition-colors ${form.accessibilityType === t ? 'border-info/60 bg-info/15 text-info' : 'border-border text-muted-foreground hover:border-foreground/20'
                                    }`}
                            >{t}</button>
                        ))}
                    </div>
                )}
            </div>

            {/* Reporter */}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Your Name (optional)</label>
                    <input value={form.reporterName} onChange={e => set('reporterName', e.target.value)}
                        placeholder="Anonymous" className="w-full bg-input border border-border rounded px-2 py-1.5 text-xs text-foreground" />
                </div>
                <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Contact (optional)</label>
                    <input value={form.reporterContact} onChange={e => set('reporterContact', e.target.value)}
                        placeholder="Room / phone" className="w-full bg-input border border-border rounded px-2 py-1.5 text-xs text-foreground" />
                </div>
            </div>

            {/* Submit */}
            <button
                onClick={() => canSubmit && onSubmit(form)}
                disabled={!canSubmit}
                className={`w-full py-3 rounded border font-semibold text-sm transition-all flex items-center justify-center gap-2 ${form.silentMode
                        ? 'border-purple-500/50 bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 disabled:opacity-40'
                        : form.type === 'fire' || form.type === 'gas_leak'
                            ? 'border-critical/50 bg-critical/15 text-critical hover:bg-critical/25 disabled:opacity-40 glow-critical'
                            : 'border-warning/50 bg-warning/15 text-warning hover:bg-warning/25 disabled:opacity-40'
                    } disabled:cursor-not-allowed`}
            >
                {form.silentMode ? (
                    <><Eye className="w-4 h-4" /> Submit Silent Distress Alert</>
                ) : (
                    <><AlertOctagon className="w-4 h-4" /> Submit Emergency Report</>
                )}
            </button>
        </div>
    );
}