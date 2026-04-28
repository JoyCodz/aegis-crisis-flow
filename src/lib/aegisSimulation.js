// Aegis Simulation Engine — generates realistic live data streams

export const EXITS = [
    { id: 'Exit-A', x: 5, y: 75, label: 'A' },
    { id: 'Exit-B', x: 200, y: 5, label: 'B' },
    { id: 'Exit-C', x: 460, y: 40, label: 'C' },
    { id: 'Exit-D', x: 5, y: 310, label: 'D' },
    { id: 'Exit-E', x: 460, y: 200, label: 'E' },
];

export const ZONES = [
    { zone_id: 'Z1', name: 'Grand Ballroom', floor: 1, capacity: 800, x: 60, y: 70, w: 180, h: 120, connections: ['Z2', 'Z5', 'Exit-A', 'Exit-D'], accessibility_friendly: true, congestion_penalty: 1 },
    { zone_id: 'Z2', name: 'Main Lobby', floor: 1, capacity: 400, x: 260, y: 70, w: 140, h: 80, connections: ['Z1', 'Z3', 'Z10', 'Exit-B'], accessibility_friendly: true, congestion_penalty: 1.5 },
    { zone_id: 'Z3', name: 'Restaurant A', floor: 1, capacity: 200, x: 420, y: 70, w: 120, h: 80, connections: ['Z2', 'Z4', 'Exit-C'], accessibility_friendly: true, congestion_penalty: 1.2 },
    { zone_id: 'Z4', name: 'Kitchen', floor: 1, capacity: 40, x: 420, y: 160, w: 120, h: 60, connections: ['Z3', 'Z7'], accessibility_friendly: false, congestion_penalty: 1.8 },
    { zone_id: 'Z5', name: 'Conference Hall', floor: 2, capacity: 350, x: 60, y: 250, w: 160, h: 100, connections: ['Z1', 'Z6', 'Exit-D'], accessibility_friendly: true, congestion_penalty: 1.1 },
    { zone_id: 'Z6', name: 'Pool Area', floor: 2, capacity: 150, x: 240, y: 250, w: 140, h: 100, connections: ['Z5', 'Z7', 'Z8'], accessibility_friendly: false, congestion_penalty: 1.5 },
    { zone_id: 'Z7', name: 'Corridor B', floor: 2, capacity: 60, x: 400, y: 250, w: 140, h: 40, connections: ['Z4', 'Z6', 'Exit-E'], accessibility_friendly: true, congestion_penalty: 1 },
    { zone_id: 'Z8', name: 'Casino Floor', floor: 3, capacity: 600, x: 60, y: 390, w: 200, h: 120, connections: ['Z6', 'Z9', 'Exit-D'], accessibility_friendly: true, congestion_penalty: 1.4 },
    { zone_id: 'Z9', name: 'Bar & Lounge', floor: 3, capacity: 120, x: 280, y: 390, w: 120, h: 60, connections: ['Z8'], accessibility_friendly: true, congestion_penalty: 1.3 },
    { zone_id: 'Z10', name: 'Elevator Lobby', floor: 1, capacity: 30, x: 260, y: 160, w: 60, h: 60, connections: ['Z2'], accessibility_friendly: true, congestion_penalty: 1 },
];

export const INITIAL_SENSORS = [
    { sensor_id: 'SMK-01', name: 'Smoke K-01', type: 'smoke', zone_id: 'Z4', zone_name: 'Kitchen', status: 'online', value: 12, unit: 'ppm', threshold: 50, battery: 87, reliability_score: 0.95, alert: false },
    { sensor_id: 'SMK-02', name: 'Smoke K-02', type: 'smoke', zone_id: 'Z1', zone_name: 'Grand Ballroom', status: 'online', value: 8, unit: 'ppm', threshold: 50, battery: 92, reliability_score: 0.98, alert: false },
    { sensor_id: 'TMP-01', name: 'Temp K-01', type: 'temperature', zone_id: 'Z4', zone_name: 'Kitchen', status: 'online', value: 38, unit: '°C', threshold: 75, battery: 76, reliability_score: 0.93, alert: false },
    { sensor_id: 'TMP-02', name: 'Temp B-01', type: 'temperature', zone_id: 'Z1', zone_name: 'Grand Ballroom', status: 'online', value: 22, unit: '°C', threshold: 75, battery: 88, reliability_score: 0.97, alert: false },
    { sensor_id: 'GAS-01', name: 'Gas K-14', type: 'gas', zone_id: 'Z4', zone_name: 'Kitchen', status: 'online', value: 0.2, unit: '%LEL', threshold: 10, battery: 94, reliability_score: 0.91, alert: false },
    { sensor_id: 'MOT-01', name: 'Motion L-01', type: 'motion', zone_id: 'Z2', zone_name: 'Main Lobby', status: 'online', value: 1, unit: 'active', threshold: 1, battery: 81, reliability_score: 0.89, alert: false },
    { sensor_id: 'CRD-01', name: 'Crowd B-01', type: 'crowd_density', zone_id: 'Z1', zone_name: 'Grand Ballroom', status: 'online', value: 340, unit: 'persons', threshold: 720, battery: 79, reliability_score: 0.92, alert: false },
    { sensor_id: 'CRD-02', name: 'Crowd L-01', type: 'crowd_density', zone_id: 'Z2', zone_name: 'Main Lobby', status: 'online', value: 120, unit: 'persons', threshold: 360, battery: 85, reliability_score: 0.94, alert: false },
    { sensor_id: 'DOC-01', name: 'Door Exit-A', type: 'door_contact', zone_id: 'Z2', zone_name: 'Main Lobby', status: 'online', value: 1, unit: 'open', threshold: 1, battery: 96, reliability_score: 0.99, alert: false },
    { sensor_id: 'CTV-01', name: 'CCTV Ballroom', type: 'cctv', zone_id: 'Z1', zone_name: 'Grand Ballroom', status: 'online', value: 0, unit: 'anomaly', threshold: 1, battery: 100, reliability_score: 0.96, alert: false },
    { sensor_id: 'SMK-K14', name: 'Smoke K-14', type: 'smoke', zone_id: 'Z4', zone_name: 'Kitchen', status: 'online', value: 15, unit: 'ppm', threshold: 50, battery: 62, reliability_score: 0.88, alert: false },
    { sensor_id: 'TMP-C01', name: 'Temp Casino', type: 'temperature', zone_id: 'Z8', zone_name: 'Casino Floor', status: 'online', value: 24, unit: '°C', threshold: 75, battery: 71, reliability_score: 0.90, alert: false },
];

export const INITIAL_RESPONDERS = [
    { id: 'R1', name: 'Marcos Silva', role: 'fire_warden', status: 'available', comm_state: 'idle', zone_id: 'Z2', zone_name: 'Main Lobby', skills: ['fire_response', 'evacuation'], workload: 0, radio_channel: 'CH-1' },
    { id: 'R2', name: 'Aisha Nkosi', role: 'medic', status: 'available', comm_state: 'idle', zone_id: 'Z5', zone_name: 'Conference Hall', skills: ['first_aid', 'trauma', 'wheelchair_assistance'], workload: 0, radio_channel: 'CH-2' },
    { id: 'R3', name: 'James Park', role: 'security', status: 'available', comm_state: 'idle', zone_id: 'Z8', zone_name: 'Casino Floor', skills: ['crowd_control', 'security', 'cpr'], workload: 0, radio_channel: 'CH-3' },
    { id: 'R4', name: 'Sofia Reyes', role: 'manager', status: 'available', comm_state: 'idle', zone_id: 'Z1', zone_name: 'Grand Ballroom', skills: ['coordination', 'guest_relations'], workload: 0, radio_channel: 'CH-4' },
    { id: 'R5', name: 'Luca Bianchi', role: 'maintenance', status: 'available', comm_state: 'idle', zone_id: 'Z4', zone_name: 'Kitchen', skills: ['gas_shutoff', 'electrical', 'hvac'], workload: 0, radio_channel: 'CH-5' },
    { id: 'R6', name: 'Yuki Tanaka', role: 'medic', status: 'available', comm_state: 'idle', zone_id: 'Z3', zone_name: 'Restaurant A', skills: ['first_aid', 'trauma'], workload: 0, radio_channel: 'CH-6' },
    { id: 'R7', name: 'Derek Jones', role: 'security', status: 'available', comm_state: 'idle', zone_id: 'Z6', zone_name: 'Pool Area', skills: ['crowd_control', 'water_rescue'], workload: 0, radio_channel: 'CH-7' },
    { id: 'R8', name: 'Priya Patel', role: 'fire_warden', status: 'available', comm_state: 'idle', zone_id: 'Z7', zone_name: 'Corridor B', skills: ['fire_response', 'evacuation', 'accessibility'], workload: 0, radio_channel: 'CH-8' },
];

export const SCENARIO_FIRE = 'fire_kitchen';
export const SCENARIO_MEDICAL = 'medical_ballroom';
export const SCENARIO_SECURITY = 'security_casino';
export const SCENARIO_GAS = 'gas_kitchen';
export const SCENARIO_CROWD = 'crowd_lobby';

export function generateAIReasoning(scenario) {
    const reasonings = {
        [SCENARIO_FIRE]: {
            title: 'Kitchen Fire — Escalating',
            type: 'fire',
            severity: 'critical',
            confidence: 0.94,
            reasons: [
                'Smoke sensor K-14 reading 187 ppm — 274% above baseline',
                'Temperature anomaly: Kitchen zone at 89°C, exceeding 75°C threshold',
                'Gas sensor GAS-01 elevated: 6.2% LEL — potential ignition risk',
                'Kitchen maintenance last completed 47 days ago (overdue)',
                'Adjacent Restaurant A occupancy: 98% capacity (196/200 guests)',
                'CCTV analytics: Smoke particulate visible in frames 1420-1445',
            ],
            actions: [
                'Initiate immediate evacuation of Kitchen (Z4) and Restaurant A (Z3)',
                'Dispatch fire warden Marcos Silva and Priya Patel to Kitchen',
                'Activate kitchen suppression system via HVAC integration',
                'Close fire doors on Corridor B (Z7) to prevent smoke spread',
                'Alert guests in Grand Ballroom to prepare for potential evacuation',
                'Notify municipal fire department — ETA 4 minutes',
            ],
        },
        [SCENARIO_MEDICAL]: {
            title: 'Medical Emergency — Ballroom',
            type: 'medical',
            severity: 'high',
            confidence: 0.88,
            reasons: [
                'SOS distress signal received from guest device in Grand Ballroom',
                'Motion sensor detected stationary person for 3+ minutes',
                'Staff report: guest unresponsive near Stage C',
                'Crowd density elevated at 680/800 — restricted responder access',
                'Nearest medic (Aisha Nkosi) currently 2 zones away',
            ],
            actions: [
                'Dispatch medic Aisha Nkosi immediately — ETA 90 seconds',
                'Clear evacuation path through Lobby Exit-B for medical access',
                'Request AED retrieval from Main Lobby first aid station',
                'Dispatch secondary medic Yuki Tanaka as backup',
                'Alert hotel management Sofia Reyes for guest coordination',
            ],
        },
        [SCENARIO_SECURITY]: {
            title: 'Security Threat — Casino Floor',
            type: 'security',
            severity: 'high',
            confidence: 0.81,
            reasons: [
                'CCTV detected aggressive behavior pattern — Casino Zone C4',
                'Multiple panic button activations within 30-second window',
                'Motion anomaly: erratic crowd movement near tables 12-16',
                'Staff report: verbal altercation escalating to physical',
                'Casino occupancy at 87% — crowd management risk elevated',
            ],
            actions: [
                'Deploy security team James Park to Casino Zone C4 immediately',
                'Activate silent lockdown protocol for Casino exits',
                'Alert police liaison — standby mode activated',
                'Redirect new guests away from Casino Floor',
                'Activate additional CCTV recording for incident documentation',
            ],
        },
        [SCENARIO_GAS]: {
            title: 'Gas Leak Detected — Kitchen',
            type: 'gas_leak',
            severity: 'critical',
            confidence: 0.96,
            reasons: [
                'Gas sensor GAS-01 reading 12.4% LEL — exceeds 10% threshold',
                'Temperature sensor stable — no ignition event yet',
                'Kitchen ventilation system showing reduced airflow',
                'Maintenance log: gas line inspection 60 days overdue',
                'Adjacent zones Restaurant A and Corridor B at risk',
            ],
            actions: [
                'Emergency gas shutoff via building management system',
                'Dispatch maintenance specialist Luca Bianchi immediately',
                'Evacuate Kitchen (Z4), Restaurant A (Z3), and Corridor B (Z7)',
                'Disable electrical systems in affected zones to prevent ignition',
                'Contact utility emergency line for external shutoff confirmation',
                'Establish safety perimeter — 30 meter exclusion zone',
            ],
        },
        [SCENARIO_CROWD]: {
            title: 'Crowd Surge — Main Lobby',
            type: 'crowd_panic',
            severity: 'high',
            confidence: 0.79,
            reasons: [
                'Crowd density sensor: 387/400 capacity — 96.8% occupancy',
                'Flow rate anomaly: 340 persons entering, only 80 exiting per minute',
                'CCTV: crowd compression detected near entrance gate',
                'Temperature rising in Lobby from body heat — 1.4°C increase',
                'Staff report: guests expressing distress at entrance choke points',
            ],
            actions: [
                'Activate overflow routing to Conference Hall and Ballroom corridors',
                'Deploy crowd control — security Derek Jones to main entrance',
                'Open secondary access doors via security override',
                'Issue PA announcement for orderly crowd redistribution',
                'Increase lobby HVAC to maximum cooling capacity',
            ],
        },
    };
    return reasonings[scenario] || null;
}

export function generateTimelineEvents(scenario, baseTime) {
    const events = {
        [SCENARIO_FIRE]: [
            { delta: 0, type: 'detection', desc: 'Smoke anomaly detected — Kitchen zone. Sensor SMK-K14 reading 187ppm', actor: 'AI Engine', automated: true },
            { delta: 4, type: 'detection', desc: 'Temperature spike confirmed — Kitchen 89°C exceeding 75°C threshold', actor: 'Sensor Array', automated: true },
            { delta: 9, type: 'classification', desc: 'Emergency classified: FIRE — Severity CRITICAL — Confidence 94%', actor: 'AI Classification', automated: true },
            { delta: 14, type: 'ai_decision', desc: 'Evacuation protocol initiated for Zone Z4 (Kitchen) and Z3 (Restaurant A)', actor: 'Crisis Engine', automated: true },
            { delta: 18, type: 'responder_assigned', desc: 'Fire Warden Marcos Silva dispatched — ETA 45 seconds', actor: 'Responder AI', automated: true },
            { delta: 22, type: 'responder_assigned', desc: 'Fire Warden Priya Patel dispatched as secondary — ETA 70 seconds', actor: 'Responder AI', automated: true },
            { delta: 31, type: 'evacuation_initiated', desc: 'Evacuation flow activated — Corridor B exits open', actor: 'Crisis Engine', automated: true },
            { delta: 47, type: 'route_blocked', desc: 'Exit A-3 blocked — smoke concentration exceeds safe threshold', actor: 'Sensor Array', automated: true },
            { delta: 52, type: 'reroute', desc: 'Evacuation rerouted — guests redirected via Lobby Exit-B and Conference stairwell', actor: 'Crisis Engine', automated: true },
            { delta: 68, type: 'zone_isolated', desc: 'Corridor B isolated — fire doors closed to prevent smoke propagation', actor: 'Building Systems', automated: true },
            { delta: 85, type: 'responder_arrived', desc: 'Marcos Silva on scene — fire suppression in progress', actor: 'Marcos Silva', automated: false },
            { delta: 112, type: 'ai_decision', desc: 'Fire spread model updated — Grand Ballroom risk elevated to MEDIUM', actor: 'AI Engine', automated: true },
        ],
        [SCENARIO_MEDICAL]: [
            { delta: 0, type: 'detection', desc: 'SOS distress signal received — Grand Ballroom, device ID G-447', actor: 'Guest Device', automated: true },
            { delta: 5, type: 'detection', desc: 'Motion anomaly: stationary person detected — Stage C area', actor: 'Motion Sensor', automated: true },
            { delta: 11, type: 'classification', desc: 'Emergency classified: MEDICAL — Severity HIGH — Confidence 88%', actor: 'AI Classification', automated: true },
            { delta: 16, type: 'responder_assigned', desc: 'Medic Aisha Nkosi assigned — nearest medically qualified responder', actor: 'Responder AI', automated: true },
            { delta: 21, type: 'ai_decision', desc: 'Access path cleared via Exit-B to reduce crowd interference', actor: 'Crisis Engine', automated: true },
            { delta: 29, type: 'responder_assigned', desc: 'Secondary medic Yuki Tanaka dispatched as backup', actor: 'Responder AI', automated: true },
            { delta: 78, type: 'responder_arrived', desc: 'Aisha Nkosi on scene — patient assessment in progress', actor: 'Aisha Nkosi', automated: false },
        ],
        [SCENARIO_GAS]: [
            { delta: 0, type: 'detection', desc: 'Gas sensor GAS-01 reading 12.4% LEL — threshold exceeded', actor: 'Sensor Array', automated: true },
            { delta: 3, type: 'ai_decision', desc: 'Emergency gas shutoff command issued to building management system', actor: 'Crisis Engine', automated: true },
            { delta: 7, type: 'classification', desc: 'Emergency classified: GAS LEAK — Severity CRITICAL — Confidence 96%', actor: 'AI Classification', automated: true },
            { delta: 12, type: 'evacuation_initiated', desc: 'Evacuation initiated — Kitchen (Z4), Restaurant A (Z3), Corridor B (Z7)', actor: 'Crisis Engine', automated: true },
            { delta: 18, type: 'responder_assigned', desc: 'Maintenance specialist Luca Bianchi dispatched — gas shutoff', actor: 'Responder AI', automated: true },
            { delta: 25, type: 'zone_isolated', desc: 'Electrical systems disabled in Z4 and Z3 — ignition risk mitigation', actor: 'Building Systems', automated: true },
            { delta: 44, type: 'responder_arrived', desc: 'Luca Bianchi on scene — manual gas valve shutoff in progress', actor: 'Luca Bianchi', automated: false },
        ],
        [SCENARIO_SECURITY]: [
            { delta: 0, type: 'detection', desc: 'Panic button activated x3 — Casino Floor Zone C4', actor: 'Guest Devices', automated: true },
            { delta: 4, type: 'detection', desc: 'CCTV behavior analytics: aggressive movement pattern detected', actor: 'CCTV AI', automated: true },
            { delta: 9, type: 'classification', desc: 'Emergency classified: SECURITY THREAT — Severity HIGH — Confidence 81%', actor: 'AI Classification', automated: true },
            { delta: 14, type: 'responder_assigned', desc: 'Security officer James Park dispatched to Casino Zone C4', actor: 'Responder AI', automated: true },
            { delta: 19, type: 'ai_decision', desc: 'Silent lockdown activated — Casino exits restricted to prevent escalation', actor: 'Crisis Engine', automated: true },
            { delta: 68, type: 'responder_arrived', desc: 'James Park on scene — situation being de-escalated', actor: 'James Park', automated: false },
        ],
        [SCENARIO_CROWD]: [
            { delta: 0, type: 'detection', desc: 'Crowd density alert — Main Lobby at 96.8% capacity', actor: 'Sensor Array', automated: true },
            { delta: 6, type: 'classification', desc: 'Emergency classified: CROWD SURGE — Severity HIGH — Confidence 79%', actor: 'AI Classification', automated: true },
            { delta: 12, type: 'ai_decision', desc: 'Overflow routing activated — Conference Hall and Ballroom corridors opened', actor: 'Crisis Engine', automated: true },
            { delta: 18, type: 'responder_assigned', desc: 'Security Derek Jones deployed to main entrance for crowd management', actor: 'Responder AI', automated: true },
            { delta: 24, type: 'ai_decision', desc: 'Secondary access doors opened via security override', actor: 'Building Systems', automated: true },
        ],
    };
    const base = baseTime || Date.now();
    return (events[scenario] || []).map(e => ({
        ...e,
        timestamp: new Date(base + e.delta * 1000).toISOString(),
    }));
}

export function simulateSensorUpdate(sensors, scenario, tick) {
    return sensors.map(s => {
        const s2 = { ...s };
        if (scenario === SCENARIO_FIRE || scenario === SCENARIO_GAS) {
            if (s.sensor_id === 'SMK-K14') {
                s2.value = Math.min(200, s.value + tick * 8 + Math.random() * 5);
                s2.alert = s2.value > s2.threshold;
            }
            if (s.sensor_id === 'TMP-01') {
                s2.value = Math.min(120, s.value + tick * 3 + Math.random() * 2);
                s2.alert = s2.value > s2.threshold;
            }
            if (s.sensor_id === 'GAS-01') {
                s2.value = Math.min(20, s.value + tick * 0.4 + Math.random() * 0.2);
                s2.alert = s2.value > s2.threshold;
            }
        }
        if (scenario === SCENARIO_CROWD) {
            if (s.sensor_id === 'CRD-02') {
                s2.value = Math.min(410, s.value + tick * 4 + Math.random() * 3);
                s2.alert = s2.value > s2.threshold;
            }
        }
        // Random sensor failure simulation
        if (tick === 4 && s.sensor_id === 'SMK-01' && (scenario === SCENARIO_FIRE)) {
            s2.status = 'offline';
            s2.reliability_score = 0;
        }
        // Battery drain
        s2.battery = Math.max(0, s.battery - Math.random() * 0.1);
        return s2;
    });
}