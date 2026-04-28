// Aegis AI Engine — Local mock client for emergency classification
// Simulates AI-powered emergency responses without external dependencies

function generateMockLLMResponse(prompt) {
    // Parse key info from the prompt to generate contextual responses
    const promptLower = prompt.toLowerCase();

    // Determine emergency type from prompt content
    let type = 'unknown';
    let severity = 'medium';
    let confidence = 0.72;

    if (promptLower.includes('fire') || promptLower.includes('smoke') || promptLower.includes('flame') || promptLower.includes('burning')) {
        type = 'fire';
        severity = 'critical';
        confidence = 0.91;
    } else if (promptLower.includes('medical') || promptLower.includes('unresponsive') || promptLower.includes('injury') || promptLower.includes('heart') || promptLower.includes('bleeding')) {
        type = 'medical';
        severity = 'high';
        confidence = 0.85;
    } else if (promptLower.includes('gas') || promptLower.includes('leak') || promptLower.includes('chemical') || promptLower.includes('fumes')) {
        type = 'gas_leak';
        severity = 'critical';
        confidence = 0.93;
    } else if (promptLower.includes('security') || promptLower.includes('violence') || promptLower.includes('threat') || promptLower.includes('weapon') || promptLower.includes('fight')) {
        type = 'security';
        severity = 'high';
        confidence = 0.78;
    } else if (promptLower.includes('suspicious') || promptLower.includes('trespassing') || promptLower.includes('theft')) {
        type = 'suspicious';
        severity = 'medium';
        confidence = 0.65;
    } else if (promptLower.includes('crowd') || promptLower.includes('panic') || promptLower.includes('stampede') || promptLower.includes('crush')) {
        type = 'crowd_panic';
        severity = 'high';
        confidence = 0.82;
    } else if (promptLower.includes('water') || promptLower.includes('flood') || promptLower.includes('pipe')) {
        type = 'water_leak';
        severity = 'medium';
        confidence = 0.76;
    } else if (promptLower.includes('structural') || promptLower.includes('collapse') || promptLower.includes('crack')) {
        type = 'structural';
        severity = 'high';
        confidence = 0.80;
    }

    // Check for silent mode
    const silentMode = promptLower.includes('silent') || promptLower.includes('covert');

    // Check for accessibility
    const accessibilityFlag = promptLower.includes('accessibility') || promptLower.includes('wheelchair') || promptLower.includes('mobility')
        ? 'Wheelchair-accessible evacuation route via Lobby Exit-B. Priority rescue flagged for mobility-impaired occupants.'
        : '';

    // Generate contextual actions based on type
    const actionsByType = {
        fire: [
            'Fire suppression system activated in affected zone',
            'Evacuation protocol initiated — nearby zones alerted',
            'Fire warden dispatched to scene — ETA 45 seconds',
            'Municipal fire department notified — ETA 4 minutes',
            'HVAC system isolated to prevent smoke spread',
        ],
        medical: [
            'Nearest medic dispatched — ETA 90 seconds',
            'AED retrieval requested from nearest first aid station',
            'Crowd clearance initiated for medical access corridor',
            'Secondary medic alerted as backup',
            'Emergency medical services notified',
        ],
        gas_leak: [
            'Emergency gas shutoff command issued to BMS',
            'Evacuation initiated for affected and adjacent zones',
            'Maintenance specialist dispatched for manual valve shutoff',
            'Electrical systems disabled in affected zones — ignition prevention',
            'Utility emergency line contacted for external shutoff confirmation',
        ],
        security: [
            'Security team deployed to incident location',
            'Silent lockdown protocol activated for affected zone',
            'Police liaison contacted — standby mode',
            'Additional CCTV recording activated for documentation',
            'Guest redirect protocols engaged',
        ],
        crowd_panic: [
            'Overflow routing activated to adjacent zones',
            'Crowd control officers deployed to chokepoints',
            'Secondary access doors opened via security override',
            'PA system activated for orderly crowd redistribution',
            'HVAC set to maximum cooling in affected area',
        ],
        suspicious: [
            'Security patrol dispatched to investigate',
            'CCTV monitoring enhanced for target area',
            'Access control records checked for anomalies',
            'Guest services notified for awareness',
        ],
        water_leak: [
            'Water supply isolated to affected zone',
            'Maintenance team dispatched — ETA 2 minutes',
            'Electrical systems in wet areas checked for safety',
            'Guest relocation initiated from affected rooms',
        ],
        structural: [
            'Zone cordoned off — safety perimeter established',
            'Structural engineer contacted for emergency assessment',
            'Evacuation of affected and adjacent zones initiated',
            'Building management system monitoring activated',
        ],
    };

    const summaryByType = {
        fire: 'Fire emergency detected. Smoke and heat anomalies confirmed by sensor array. Immediate evacuation and suppression protocols engaged.',
        medical: 'Medical emergency reported. Responder team dispatched. Access corridors cleared for rapid medical intervention.',
        gas_leak: 'Gas leak detected above safety threshold. Emergency shutoff and evacuation protocols activated. Ignition prevention measures engaged.',
        security: 'Security threat identified. Covert response team deployed. Area monitoring enhanced for incident documentation.',
        crowd_panic: 'Dangerous crowd density detected. Overflow management and crowd redistribution protocols activated.',
        suspicious: 'Suspicious activity reported. Investigation team dispatched. Enhanced monitoring activated.',
        water_leak: 'Water leak detected. Supply isolation and damage mitigation in progress.',
        structural: 'Structural hazard identified. Safety perimeter established. Emergency engineering assessment requested.',
        unknown: 'Emergency report received. AI classification in progress. Nearest responders alerted as precaution.',
    };

    const sensorCorrelationByType = {
        fire: 'Smoke sensor readings elevated (187ppm, 274% above baseline). Temperature anomaly confirmed at 89°C. Gas sensor showing 6.2% LEL — ignition risk present.',
        medical: 'Motion sensor detected stationary person in reported area. Crowd density elevated at 85% capacity, restricting responder access pathways.',
        gas_leak: 'Gas sensor GAS-01 reading 12.4% LEL — exceeds 10% safety threshold. Ventilation system showing reduced airflow. No temperature spike detected (no ignition event).',
        security: 'CCTV analytics detected anomalous movement patterns. Multiple panic button activations corroborate report.',
        crowd_panic: 'Crowd density sensor at 96.8% capacity. Flow rate anomaly: ingress significantly exceeds egress. Temperature rising from body heat concentration.',
        suspicious: 'CCTV behavioral analytics flagged unusual activity pattern. No corroborating sensor alerts — confidence adjusted accordingly.',
        water_leak: 'Humidity sensors in adjacent areas showing elevated readings. No electrical hazard alerts from connected systems.',
        structural: 'Vibration sensors triggered in affected zone. No seismic activity detected — localized structural event suspected.',
        unknown: 'No specific sensor correlations found for this report type. Manual verification recommended.',
    };

    return {
        type,
        severity,
        confidence,
        summary: summaryByType[type] || summaryByType.unknown,
        sensor_correlation: sensorCorrelationByType[type] || sensorCorrelationByType.unknown,
        silent_mode: silentMode,
        accessibility_flag: accessibilityFlag,
        actions: actionsByType[type] || ['Alert nearest responders', 'Monitor situation via CCTV', 'Prepare evacuation routes'],
        activate_scenario: severity === 'critical',
        // For EmergencyReport component
        translation: '',
        details: `Emergency type: ${type}. Severity: ${severity}. Confidence: ${(confidence * 100).toFixed(0)}%.`,
    };
}

export const aegisAI = {
    auth: {
        me: async () => ({
            id: 'local-user',
            name: 'Local Admin',
            email: 'admin@aegis.local',
            role: 'admin',
        }),
        logout: () => {
            console.log('[Aegis] Logout called (local mode)');
        },
        redirectToLogin: () => {
            console.log('[Aegis] Redirect to login called (local mode)');
        },
    },
    integrations: {
        Core: {
            InvokeLLM: async ({ prompt, response_json_schema }) => {
                // Simulate a brief processing delay for realism
                await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
                return generateMockLLMResponse(prompt);
            },
        },
    },
};
