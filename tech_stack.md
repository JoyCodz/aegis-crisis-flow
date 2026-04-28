# AEGIS Crisis Orchestration Platform
## Final Technical Stack

This document outlines the final, production-ready technology stack used to build the AEGIS Crisis Orchestration Platform, including the new dynamic routing and communication systems.

---

### **1. Core Framework & Frontend**
*   **React (v18)**: The core UI library used for building the responsive, component-based architecture.
*   **Vite (v6)**: The build tool and development server, chosen for its extremely fast Hot Module Replacement (HMR) and optimized Rollup production builds.

### **2. UI, Styling & Visualization**
*   **TailwindCSS (v3)**: Utility-first CSS framework used for rapid, inline styling and responsive design.
*   **shadcn/ui**: A collection of reusable components (built on top of Radix UI primitives and Tailwind) used for the dashboard UI elements (Cards, Dialogs, Scroll Areas, Badges), ensuring accessibility and a premium look.
*   **Lucide React**: The comprehensive icon library used consistently across the dashboard for visual indicators and status icons.
*   **SVG (Scalable Vector Graphics)**: Used natively within React for rendering the dynamic Crisis Map, including real-time graph visualizations, path animations, and occupancy indicators.

### **3. State Management & Data Flow**
*   **Custom Global Store (`aegisStore.js`)**: A lightweight, observable global state module utilizing React's `useSyncExternalStore` pattern. This manages the high-frequency, real-time updates from the simulation engine across the application without excessive re-renders or prop-drilling.
*   **React Router DOM (v6)**: Handles client-side routing, enabling seamless navigation between the various dashboard views (Command Center, Crisis Map, Responders, etc.) as a pure Single Page Application (SPA).

### **4. Operational Simulation Engine**
*   **Tick-Based Engine (`aegisEngine.js`)**: A custom JavaScript loop utilizing `setInterval` that acts as the heartbeat of the platform, driving the passage of time (ticks) to evolve incidents, responder states, and sensor telemetry realistically.
*   **Dijkstra's Pathfinding Algorithm**: Implemented natively within the engine to calculate real-time, dynamic evacuation routes across a modeled graph network of the facility's zones and exits, actively routing around identified hazards.
*   **Finite State Machines (FSM)**: Used to manage the communication layer, moving responders through rigorous tactical states (`idle` -> `dispatched` -> `awaiting_ack` -> `acknowledged` -> `en_route` -> `on_scene`).

### **5. Intelligence & AI Workflows**
*   **Deterministic Logic Engine (`aegisSimulation.js`)**: A robust, localized rule engine that simulates LLM-like reasoning. It parses incoming telemetry from the mock sensors to generate human-readable reasoning, incident confidence scores, and recommended actions.

### **6. Hosting & Deployment**
*   **Firebase Hosting**: Google Cloud's fast, secure hosting platform, configured specifically to serve the static Vite build (`dist` folder) as a Single Page Application (rewriting all traffic to `index.html`).
*   **Firebase CLI**: The toolchain used to configure (`firebase.json`, `.firebaserc`), manage, and deploy the application to production (`aegis-crisis-flow.web.app`).

### **7. Utilities & Libraries**
*   **date-fns**: Used for robust timestamp parsing, manipulation, and formatting, specifically within the live timeline and operational radio feeds.
*   **ESLint & PostCSS**: Integrated into the Vite pipeline for code quality enforcement and CSS processing.
