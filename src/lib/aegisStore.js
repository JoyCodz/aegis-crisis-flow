import { useState, useEffect, useCallback, useRef } from 'react';

// Simple global store using module-level state + listeners
let state = {
    activeScenario: null,
    incidents: [],
    responders: [],
    sensors: [],
    zones: [],
    events: [],
    evacuationPaths: [],
    communications: [],
    blockedRoutes: [],
    tick: 0,
};

const listeners = new Set();

function setState(partial) {
    state = { ...state, ...partial };
    listeners.forEach(fn => fn(state));
}

function getState() {
    return state;
}

export function useAegisStore() {
    const [s, setS] = useState(state);

    useEffect(() => {
        const fn = newState => setS({ ...newState });
        listeners.add(fn);
        return () => listeners.delete(fn);
    }, []);

    return s;
}

export function aegisDispatch(partial) {
    setState(partial);
}

export function aegisGetState() {
    return getState();
}