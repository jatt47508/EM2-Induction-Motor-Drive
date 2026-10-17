# Three-Phase Induction Motor Drive — Interactive Research Website

> **A Systematic Review on Dynamic Modelling, Parameter Estimation, and Control Schemes**

A premium, interactive academic research website that turns a written Electrical Machines-II study into an explorable, scroll-driven experience — with a scroll-animated 3D motor, live control-block diagrams, and an interactive d–q vector visualiser.

[![Live Site](https://img.shields.io/badge/Live%20Site-GitHub%20Pages-1a3d73)](https://jatt47508.github.io/EM2-Induction-Motor-Drive/)
[![Repository](https://img.shields.io/badge/Repository-GitHub-0b1d3a)](https://github.com/jatt47508/EM2-Induction-Motor-Drive)

---

## Live Demo

**https://jatt47508.github.io/EM2-Induction-Motor-Drive/**

Open it on any device, or scan the QR code in the References section.

---

## Highlights

- **Scroll-driven 3D motor explorer** — a procedural, exploded-view induction motor that opens and closes as you scroll. Drag to orbit, scroll over the model to zoom, and click any part to read its name and role (stator frame, stator core, windings, squirrel-cage rotor, shaft, bearings, cooling fan).
- **Interactive d–q vector visualisation** — toggle the current/flux space vector and drag the angle and magnitude sliders to watch `i_d`, `i_q`, `θ`, and vector magnitude update live.
- **Live control-block diagrams** — switching between **V/f (scalar)**, **Field-Oriented Control (FOC)**, and **Direct Torque Control (DTC)** redraws the real signal-flow diagram alongside the comparison table.
- **Scroll-based research story** — Introduction, Background, Literature Review, Simulation, Operating Principle, Control Schemes, Contributions, Research Gap, and Conclusion, with a sticky nav, scroll-spy, and reading-progress bar.
- **Literature Review explorer** — search and filter the reviewed papers by topic.
- **References with QR codes** — every reference has a clickable DOI/Link, a QR code to open it on your phone, and one-tap IEEE-style citation copy.
- **Dark & light themes** — fully theme-aware, including the 3D scene lighting and every diagram.
- **Responsive & accessible** — mobile-first layout, keyboard-friendly controls, `prefers-reduced-motion` support, and a WebGL fallback message.

---

## Sections

| # | Section | What it covers |
|---|---------|----------------|
| 01 | 3D Motor | Scroll-driven exploded view of the physical machine |
| 02 | Operating | Rotating-field / operating principle |
| 03 | Simulation | Transient speed & torque response with adjustable parameters |
| 04 | Overview | Interactive d–q current/flux vector |
| 05 | Literature | Searchable, filterable review of the selected papers |
| 06 | Control | V/f, FOC, and DTC block diagrams + comparison |
| 07 | References | IEEE-style list with DOI/Link, QR, and citation copy |

---

## Built With

React · TypeScript · Vite · React Three Fiber / three.js · hand-built SVG visualisations · CSS custom properties for theming.

---

## Accuracy Notes

- The transient simulation is a **documented, approximate model**, not measured experimental data. Assumptions are stated on-page: rated anchor 400 V, 50 Hz, 4-pole, 4 kW, 1440 rpm; Kloss torque model with `s_max = 0.2`; inertia `J = 0.06`, damping `B = 0.004`.
- Core relations used: `N_s = 120f / P`, `s = (N_s − N_r) / N_s`, and `J·dω/dt = T_e − T_L − B·ω`.
- Simulated results are clearly labelled as simulated; no experimental values are fabricated.

---

## Academic Context

**Electrical Machines-II · B.Tech · Semester V**

- **Department:** Department of Electrical Engineering
- **University:** C. V. Raman Global University, Odisha
- **Guide:** Dr Priyanka Sen Ma'am
- **Author:** Jatin kumar Mallick

---

## License

Academic coursework project. Feel free to read and learn from it. Third-party libraries remain under their respective licenses.
