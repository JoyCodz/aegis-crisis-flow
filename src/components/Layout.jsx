import { Outlet } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import AegisHeader from './aegis/AegisHeader';
import { useAegisStore } from '../lib/aegisStore';

export default function Layout() {
    const { incidents, activeScenario } = useAegisStore();
    const activeCount = incidents.filter(i => i.status === 'active' || i.status === 'escalating').length;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <AegisHeader activeIncidents={activeCount} systemStatus={activeScenario ? 'alert' : 'nominal'} />
            <main className="flex-1 overflow-hidden">
                <Outlet />
            </main>
        </div>
    );
}