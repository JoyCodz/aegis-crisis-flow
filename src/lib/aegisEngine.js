import {
    INITIAL_SENSORS, INITIAL_RESPONDERS, ZONES, EXITS,
    SCENARIO_FIRE, SCENARIO_MEDICAL, SCENARIO_SECURITY, SCENARIO_GAS, SCENARIO_CROWD,
    generateAIReasoning, generateTimelineEvents, simulateSensorUpdate,
} from './aegisSimulation';
import { aegisDispatch, aegisGetState } from './aegisStore';

let simTimer = null;
let simTick = 0;

function buildInitialZones() {
    return ZONES.map(z => ({
        ...z,
        status: 'normal',
        occupancy: Math.floor(z.capacity * (0.3 + Math.random() * 0.5)),
        blocked_exits: [],
        risk_score: 0,
    }));
}

function buildInitialResponders() {
    return INITIAL_RESPONDERS.map(r => ({ ...r }));
}

export function startSimulation(scenario) {
    stopSimulation();
    simTick = 0;

    const reasoning = generateAIReasoning(scenario);
    const baseTime = Date.now();
    const events = generateTimelineEvents(scenario, baseTime);
    const zones = buildInitialZones();
    const sensors = INITIAL_SENSORS.map(s => ({ ...s }));
    const responders = buildInitialResponders();

    const incident = {
        id: `INC-${Date.now()}`,
        title: reasoning.title,
        type: reasoning.type,
        severity: reasoning.severity,
        status: 'active',
        zone_id: getIncidentZone(scenario),
        zone_name: getIncidentZoneName(scenario),
        confidence: reasoning.confidence,
        description: reasoning.reasons[0],
        ai_reasoning: reasoning.reasons.join(' | '),
        recommended_actions: reasoning.actions,
        assigned_responders: [],
        affected_zones: [],
        evacuation_active: false,
        blocked_exits: [],
        detected_at: new Date(baseTime).toISOString(),
        source: 'AI Engine',
    };

    aegisDispatch({
        activeScenario: scenario,
        incidents: [incident],
        responders,
        sensors,
        zones,
        events: [events[0]].filter(Boolean),
        evacuationPaths: [],
        communications: [],
        blockedRoutes: [],
        tick: 0,
    });

    simTimer = setInterval(() => {
        simTick++;
        evolveSimulation(scenario, events, baseTime);
    }, 2000);
}

export function stopSimulation() {
    if (simTimer) { clearInterval(simTimer); simTimer = null; }
    simTick = 0;
    const zones = buildInitialZones();
    const responders = buildInitialResponders();
    const sensors = INITIAL_SENSORS.map(s => ({ ...s }));
    aegisDispatch({
        activeScenario: null,
        incidents: [],
        responders,
        sensors,
        zones,
        events: [],
        evacuationPaths: [],
        communications: [],
        blockedRoutes: [],
        tick: 0,
    });
}

function evolveSimulation(scenario, allEvents, baseTime) {
    const s = aegisGetState();
    const elapsed = simTick * 2;

    const relevantEvents = allEvents.filter(ev => {
        const evTime = new Date(ev.timestamp).getTime();
        const evElapsed = (evTime - baseTime) / 1000;
        return evElapsed <= elapsed;
    });

    const updatedSensors = simulateSensorUpdate(s.sensors, scenario, simTick);
    let updatedZones = evolveZones(s.zones, scenario, simTick);
    
    // Communication & Responder Engine
    const { responders: updatedResponders, newComms } = evolveRespondersAndComms(s.responders, scenario, simTick, s.communications);
    const updatedComms = [...s.communications, ...newComms];

    // Incident Engine
    const updatedIncidents = evolveIncidents(s.incidents, scenario, simTick, updatedZones, updatedResponders);
    const activeIncident = updatedIncidents[0];

    // Routing & Occupancy Engine
    let evacuationPaths = [];
    let blockedRoutes = [];
    
    if (activeIncident?.evacuation_active) {
        // Find blocked exits based on zones in danger
        const dangerZones = updatedZones.filter(z => z.status === 'danger' || z.status === 'isolated');
        
        // Block edges that touch danger zones
        dangerZones.forEach(dz => {
            dz.connections.forEach(conn => {
                blockedRoutes.push(`${dz.zone_id}-${conn}`);
                blockedRoutes.push(`${conn}-${dz.zone_id}`);
            });
        });

        // Add scenario-specific blocks (e.g. fire blocking Corridor B -> Exit C)
        if (scenario === SCENARIO_FIRE && simTick >= 4) {
            blockedRoutes.push('Z3-Exit-C');
            blockedRoutes.push('Exit-C-Z3');
        }

        evacuationPaths = calculateEvacuationPaths(updatedZones, blockedRoutes);
        updatedZones = simulateOccupancyFlow(updatedZones, evacuationPaths);
    }

    aegisDispatch({
        sensors: updatedSensors,
        zones: updatedZones,
        responders: updatedResponders,
        incidents: updatedIncidents,
        events: relevantEvents,
        evacuationPaths,
        communications: updatedComms,
        blockedRoutes,
        tick: simTick,
    });
}

// --- Pathfinding Engine (Dijkstra) ---
function calculateEvacuationPaths(zones, blockedRoutes) {
    const paths = [];
    const exitIds = EXITS.map(e => e.id);
    
    // Create adjacency list
    const graph = {};
    zones.forEach(z => {
        graph[z.zone_id] = z.connections.filter(c => !blockedRoutes.includes(`${z.zone_id}-${c}`));
    });
    // Add exits as sink nodes
    exitIds.forEach(e => { graph[e] = []; });

    // For every zone with occupancy > 0, find shortest path to an exit
    zones.forEach(startZone => {
        if (startZone.occupancy <= 0 || startZone.status === 'danger' || startZone.status === 'isolated') return;

        let distances = {};
        let previous = {};
        let queue = new Set(Object.keys(graph));

        Object.keys(graph).forEach(node => {
            distances[node] = Infinity;
            previous[node] = null;
        });
        distances[startZone.zone_id] = 0;

        while (queue.size > 0) {
            let u = null;
            queue.forEach(node => {
                if (u === null || distances[node] < distances[u]) u = node;
            });
            
            if (distances[u] === Infinity) break;
            queue.delete(u);

            if (exitIds.includes(u)) {
                // Found nearest exit!
                let path = [];
                let curr = u;
                while (curr !== null) {
                    path.unshift(curr);
                    curr = previous[curr];
                }
                paths.push({ start_zone: startZone.zone_id, path: path });
                break; // stop searching for this zone
            }

            if (graph[u]) {
                graph[u].forEach(neighbor => {
                    if (!queue.has(neighbor)) return;
                    
                    // Base weight 1, add congestion penalties if neighbor is a zone
                    const neighborZone = zones.find(z => z.zone_id === neighbor);
                    let weight = 1;
                    if (neighborZone) {
                        weight += (neighborZone.congestion_penalty - 1);
                        // Penalty for going through an evacuating zone
                        if (neighborZone.status === 'evacuating') weight += 0.5; 
                    }

                    const alt = distances[u] + weight;
                    if (alt < distances[neighbor]) {
                        distances[neighbor] = alt;
                        previous[neighbor] = u;
                    }
                });
            }
        }
    });
    
    return paths;
}

function simulateOccupancyFlow(zones, evacuationPaths) {
    let zMap = {};
    zones.forEach(z => { zMap[z.zone_id] = { ...z }; });

    evacuationPaths.forEach(ep => {
        const path = ep.path;
        if (path.length > 1) {
            const startId = path[0];
            const nextId = path[1];
            
            // Flow 1-5 people per tick based on congestion
            const flowRate = Math.max(1, Math.floor(Math.random() * 5));
            
            if (zMap[startId] && zMap[startId].occupancy > 0) {
                const actualFlow = Math.min(zMap[startId].occupancy, flowRate);
                zMap[startId].occupancy -= actualFlow;
                
                // If the next node is a zone (not an exit), add them to that zone temporarily
                if (zMap[nextId]) {
                    zMap[nextId].occupancy += actualFlow;
                }
            }
        }
    });

    return Object.values(zMap);
}

// --- Communication & Responder Engine ---
function evolveRespondersAndComms(responders, scenario, tick, existingComms) {
    let newComms = [];
    
    const rMap = responders.map(r => ({ ...r }));

    const dispatchResponder = (r_id, z_id, z_name, workload) => {
        const r = rMap.find(x => x.id === r_id);
        if (r && r.status === 'available') {
            r.status = 'dispatched';
            r.comm_state = 'awaiting_ack';
            r.zone_id = z_id;
            r.zone_name = z_name;
            r.assigned_incident_id = 'active';
            r.workload = workload;
            r.last_dispatch_tick = tick;
            
            newComms.push({
                id: `MSG-${Date.now()}-${Math.random()}`,
                timestamp: new Date().toISOString(),
                channel: r.radio_channel,
                sender: 'COMMAND',
                receiver: r.name,
                message: `DISPATCH: Proceed to ${z_name} immediately. Acknowledge.`,
                status: 'delivered'
            });
        }
    };

    // Scenario dispatch triggers
    if (scenario === SCENARIO_FIRE) {
        if (tick === 2) dispatchResponder('R1', 'Z4', 'Kitchen', 80);
        if (tick === 3) dispatchResponder('R8', 'Z4', 'Kitchen', 70);
    } else if (scenario === SCENARIO_MEDICAL) {
        if (tick === 1) dispatchResponder('R2', 'Z1', 'Grand Ballroom', 90);
        if (tick === 2) dispatchResponder('R6', 'Z1', 'Grand Ballroom', 60);
    } else if (scenario === SCENARIO_SECURITY) {
        if (tick === 1) dispatchResponder('R3', 'Z8', 'Casino Floor', 85);
    } else if (scenario === SCENARIO_GAS) {
        if (tick === 1) dispatchResponder('R5', 'Z4', 'Kitchen', 95);
        if (tick === 2) dispatchResponder('R1', 'Z3', 'Restaurant A', 70);
    } else if (scenario === SCENARIO_CROWD) {
        if (tick === 1) dispatchResponder('R7', 'Z2', 'Main Lobby', 75);
        if (tick === 2) dispatchResponder('R3', 'Z2', 'Main Lobby', 65);
    }

    // State Machine Transitions
    rMap.forEach(r => {
        if (r.status === 'dispatched' && r.comm_state === 'awaiting_ack') {
            // Acknowledge after 1-2 ticks
            if (tick >= r.last_dispatch_tick + 1 + Math.floor(Math.random() * 2)) {
                r.comm_state = 'acknowledged';
                r.status = 'en_route';
                r.last_ack_tick = tick;
                
                newComms.push({
                    id: `MSG-${Date.now()}-${Math.random()}`,
                    timestamp: new Date().toISOString(),
                    channel: r.radio_channel,
                    sender: r.name,
                    receiver: 'COMMAND',
                    message: `Copy COMMAND. En route to ${r.zone_name}. ETA 2 mins.`,
                    status: 'read'
                });
            }
        } else if (r.status === 'en_route' && r.comm_state === 'acknowledged') {
            // Arrive after 3-5 ticks
            if (tick >= r.last_ack_tick + 3 + Math.floor(Math.random() * 2)) {
                r.status = 'deployed';
                r.comm_state = 'on_scene';
                
                newComms.push({
                    id: `MSG-${Date.now()}-${Math.random()}`,
                    timestamp: new Date().toISOString(),
                    channel: r.radio_channel,
                    sender: r.name,
                    receiver: 'COMMAND',
                    message: `On scene at ${r.zone_name}. Commencing operations.`,
                    status: 'read'
                });
            }
        }
    });

    return { responders: rMap, newComms };
}

function evolveZones(zones, scenario, tick) {
    return zones.map(z => {
        const z2 = { ...z };
        if (scenario === SCENARIO_FIRE || scenario === SCENARIO_GAS) {
            if (z.zone_id === 'Z4') {
                z2.status = tick >= 1 ? 'danger' : 'elevated';
                z2.risk_score = Math.min(100, tick * 15);
            }
            if (z.zone_id === 'Z3') {
                z2.status = tick >= 3 ? 'evacuating' : tick >= 2 ? 'elevated' : 'normal';
                z2.risk_score = Math.min(80, tick * 10);
            }
            if (z.zone_id === 'Z7') {
                z2.status = tick >= 5 ? 'isolated' : 'normal';
            }
        }
        if (scenario === SCENARIO_CROWD) {
            if (z.zone_id === 'Z2') {
                z2.status = tick >= 1 ? 'danger' : 'elevated';
            }
            if (z.zone_id === 'Z5' || z.zone_id === 'Z1') {
                z2.status = tick >= 3 ? 'elevated' : 'normal';
            }
        }
        return z2;
    });
}

function evolveIncidents(incidents, scenario, tick, zones, responders) {
    return incidents.map(inc => {
        const inc2 = { ...inc };
        inc2.assigned_responders = responders.filter(r => r.assigned_incident_id === 'active').map(r => r.name);

        if (scenario === SCENARIO_FIRE || scenario === SCENARIO_GAS) {
            inc2.evacuation_active = tick >= 3;
            inc2.status = tick >= 10 ? 'contained' : 'escalating';
            inc2.affected_zones = ['Z4', 'Z3', tick >= 5 ? 'Z7' : null].filter(Boolean);
        }
        if (scenario === SCENARIO_MEDICAL) {
            inc2.status = tick >= 8 ? 'contained' : 'active';
        }
        if (scenario === SCENARIO_SECURITY) {
            inc2.status = tick >= 9 ? 'contained' : 'active';
        }
        if (scenario === SCENARIO_CROWD) {
            inc2.evacuation_active = tick >= 4;
            inc2.status = tick >= 8 ? 'contained' : 'active';
        }
        return inc2;
    });
}

function getIncidentZone(scenario) {
    const map = { [SCENARIO_FIRE]: 'Z4', [SCENARIO_MEDICAL]: 'Z1', [SCENARIO_SECURITY]: 'Z8', [SCENARIO_GAS]: 'Z4', [SCENARIO_CROWD]: 'Z2' };
    return map[scenario] || 'Z1';
}

function getIncidentZoneName(scenario) {
    const map = { [SCENARIO_FIRE]: 'Kitchen', [SCENARIO_MEDICAL]: 'Grand Ballroom', [SCENARIO_SECURITY]: 'Casino Floor', [SCENARIO_GAS]: 'Kitchen', [SCENARIO_CROWD]: 'Main Lobby' };
    return map[scenario] || 'Unknown';
}