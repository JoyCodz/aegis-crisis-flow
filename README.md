# 🛡️ AEGIS — Crisis Orchestration Platform

<div align="center">
  <img alt="AEGIS Dashboard" src="https://via.placeholder.com/1200x600?text=AEGIS+Crisis+Orchestration+Platform" width="100%" />
</div>

<div align="center">
  <strong>AI-powered emergency management and real-time crisis response coordination for enterprise hospitality environments.</strong>
</div>
<br />

<div align="center">
  <a href="https://aegis-crisis-flow.web.app">
    <img src="https://img.shields.io/badge/Live_Demo-🔴_Online-success?style=for-the-badge" alt="Live Demo" />
  </a>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
</div>

---

## 📖 About

AEGIS is an intelligent crisis orchestration platform designed to replace static security dashboards. It combines real-time sensor monitoring, AI-powered threat classification, and autonomous responder coordination to manage emergency situations in large-scale venues like hotels and casinos. 

The platform operates entirely in the browser using a powerful custom simulation engine (`aegisEngine.js`), making it incredibly fast, cost-effective, and easy to deploy.

## ✨ Key Features

* **🧭 Dynamic Evacuation Routing**: Utilizes Dijkstra's pathfinding algorithm to calculate and render real-time, hazard-avoiding evacuation routes across a live SVG floor plan.
* **📻 Live Operational Radio**: A real-time radio feed streaming timestamped dispatches and acknowledgments between Command and responders.
* **👨‍🚒 Tactical Responder Coordination**: Automated responder assignment with a finite state machine managing communication (`AWAITING ACK`, `EN ROUTE`, etc.).
* **🧠 AI Intelligence Layer**: Multi-modal anomaly detection, explainable risk prediction, and confidence-scored emergency classification.
* **🌐 Crisis Simulation Engine**: Run 5 realistic emergency scenarios (Kitchen Fire, Medical Emergency, Security Threat, Gas Leak, Crowd Surge) to train and test coordination.
* **📡 Sensor Grid Monitoring**: 12 sensor types with fault-tolerant architecture, multi-source verification, and reliability scoring.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/JoyCodz/Aegis.git
   cd Aegis
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite 6
- **Styling**: TailwindCSS 3 + CSS Variables (dark theme focused)
- **UI Components**: shadcn/ui (Radix primitives)
- **Icons**: Lucide React
- **Routing**: React Router v6
- **State Management**: Custom observable global store (`aegisStore.js`)
- **Algorithms**: Dijkstra's Shortest Path, Finite State Machines (FSM)

## 📂 Architecture & Project Structure

```text
src/
├── api/            # Local integrations (Mock LLM)
├── components/
│   ├── aegis/      # Core features (CrisisMap, Timeline, RadioFeed)
│   └── ui/         # Reusable shadcn/ui base components
├── lib/            # Core Simulation Engine & Global Store
├── pages/          # Primary Dashboard Views
└── utils/          # Helper functions and formatters
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
