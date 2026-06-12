# 🚀 Dynamic Split Testing Simulator

A modern React-based A/B Testing Simulator that allows users to create experiments, compare variants, simulate user traffic, analyze performance metrics, and track experiment history through an interactive dashboard.

## 📌 Overview

Dynamic Split Testing Simulator is designed to demonstrate how A/B testing platforms work in real-world product environments. Users can configure experiments, run simulations, visualize performance data, and determine winning variants based on key metrics.

## ✨ Features

## Live Link: https://glowing-madeleine-8013db.netlify.app/


### 🎯 Experiment Setup

* Create and configure A/B test experiments
* Define Variant A and Variant B
* Set traffic allocation percentages
* Configure experiment parameters

### 📊 Real-Time Analytics

* Conversion rate tracking
* Click-through rate monitoring
* Performance comparison between variants
* Interactive charts and visualizations

### 🏆 Winner Detection

* Automatic comparison of variants
* Highlights the best-performing version
* Displays key statistical metrics

### 📈 Data Visualization

* Dynamic charts and graphs
* Variant performance comparison
* Analytics dashboard

### 🕒 Experiment History

* Save previous experiment results
* Review historical performance
* Compare past experiments

### 📂 Export & Import

* Export experiment data
* Import saved experiment configurations
* Easy data sharing

### ⚡ State Management

* Centralized state using Zustand
* Efficient and scalable architecture

---

## 🛠️ Tech Stack

| Technology        | Purpose            |
| ----------------- | ------------------ |
| React.js          | Frontend Framework |
| Vite              | Build Tool         |
| Zustand           | State Management   |
| JavaScript (ES6+) | Application Logic  |
| CSS               | Styling            |
| Charts Library    | Data Visualization |

---

## 📁 Project Structure

```text
src/
├── components/
│   ├── AnalyticsStage.jsx
│   ├── ExperimentSetup.jsx
│   ├── ExportImport.jsx
│   ├── SimulationControls.jsx
│   ├── TelemetryScoreboard.jsx
│   └── VariantVisualizer.jsx
│
├── pages/
│   ├── Dashboard.jsx
│   ├── ExperimentDetails.jsx
│   └── History.jsx
│
├── store/
│   └── useExperimentStore.js
│
├── charts/
├── hooks/
├── services/
├── utils/
└── workers/
```

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/sejaltech/Dynamic-Split-Testing-Simulator.git
```

Move into the project folder:

```bash
cd Dynamic-Split-Testing-Simulator
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## 🎮 How It Works

1. Create a new experiment.
2. Configure Variant A and Variant B.
3. Allocate traffic distribution.
4. Run the simulation.
5. Monitor analytics and performance metrics.
6. Analyze results and identify the winning variant.
7. Save results for future reference.

---

## 🎯 Learning Outcomes

This project demonstrates:

* React Component Architecture
* State Management with Zustand
* Data Visualization
* A/B Testing Concepts
* Performance Analytics
* Modern Frontend Development
* Dashboard Design Patterns

---

## 👩‍💻 Author

**Sejal Singh**

Built as a frontend project to simulate real-world experimentation and product analytics workflows.

