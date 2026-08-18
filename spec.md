# jjTimer — Product Specification

## 1. Overview

jjTimer is a clean, modern, WCA-compliant Rubik's cube practice timer web application built with Vue 3 (Composition API) and Vite, deployed to GitHub Pages. It is designed to provide speedcubers practicing at home with an accurate, distraction-free, and feature-complete training tool supporting all 17 official World Cube Association (WCA) events.

## 2. Target Users

- Speedcubers practicing at home across all skill levels (beginner to elite).
- Competitors requiring strict WCA inspection countdowns, accurate average calculations, and standard random-state scrambles.
- Multi-event cubers who need session management and event-specific statistics.

## 3. Tech Stack

- **Framework**: Vue 3 (Composition API, `<script setup>`)
- **Build Tool**: Vite
- **Scramble Generation**: [cubing.js](https://js.cubing.net/) (official WCA-standard scramble algorithms)
- **Styling**: Vanilla CSS utilizing CSS Custom Properties (Design tokens, dark theme)
- **Persistence**: Browser `localStorage` with JSON export/import capabilities
- **Deployment & CI/CD**: GitHub Pages via GitHub Actions

## 4. Functional Requirements

### 4.1 Timer Engine & State Machine

The core timer transitions through the following discrete states:
- **`idle`**: Default resting state waiting for user interaction. Displays the last solve time or `0.00`.
- **`inspecting`**: Active 15-second countdown (if inspection is enabled).
- **`holding`**: Spacebar or touch is pressed down. Timer color changes (e.g., orange/red) while the hold duration (default 300ms) elapses.
- **`ready`**: Hold duration threshold met. Timer indicator changes to green, signaling release will start timing.
- **`running`**: Solve in progress. Time is measured using high-precision `performance.now()`. Updates visually at display refresh rate or can be hidden.
- **`stopped`**: Timer stopped upon key press or screen tap. Solve recorded, penalties evaluated, statistics recalculated.

#### Timer Controls
- **Inspection Start (when Inspection is ON)**: Instant trigger with 0ms delay upon pressing Space or tapping the timer area from resting states (`idle` or `stopped`).
- **Solve Start**: Hold Spacebar (keyboard) or touch-and-hold the timer area for 300ms until the indicator turns green (`ready`), then release to start timing.
- **Stop**: Press any keyboard key or tap the screen during `running` state.
- **Precision**: Sub-millisecond internal tracking; configurable display format (2 or 3 decimal places).

### 4.2 WCA Inspection

- Optional 15-second inspection phase compliant with WCA Regulation Article A3.
- Starts immediately on keypress/tap (0ms delay) from resting states.
- Visual countdown:
  - **15 to 0 seconds**: Large integer countdown.
  - **8 seconds remaining** (7s elapsed): Warning alert color shift.
  - **3 seconds remaining** (12s elapsed): Final warning color shift.
- Holding during inspection: Holding Space/touch during the countdown begins the 300ms readiness hold (display turns red then green). Releasing green starts the solve timer.
- Penalties:
  - **15.00s – 17.00s**: Solve automatically assigned a `+2` penalty.
  - **> 17.00s**: Solve automatically marked as `DNF` (Did Not Finish).
- Inspection can be canceled or reset back to `idle`.

### 4.3 Scramble Generation

- Scrambles generated via `cubing.js` using official WCA random-state algorithms.
- **Pre-generation**: The next scramble is pre-generated in the background while a solve is running or immediately when entering the `ready` state, ensuring zero latency between solves.
- Previous scramble display and scramble copy-to-clipboard functionality.

### 4.4 Supported WCA Events

jjTimer supports all 17 official WCA events:

| Event Code | Event Name | Scramble Type / Details |
| :--- | :--- | :--- |
| `333` | 3x3x3 Cube | Standard WCA 3x3x3 random-state |
| `222` | 2x2x2 Cube | Optimal random-state |
| `444` | 4x4x4 Cube | WCA random-state with slice moves |
| `555` | 5x5x5 Cube | WCA random-state |
| `666` | 6x6x6 Cube | WCA random-state (prefix moves) |
| `777` | 7x7x7 Cube | WCA random-state (prefix moves) |
| `333bf` | 3x3x3 Blindfolded | Standard 3x3x3 with orientation scramble |
| `333fm` | 3x3x3 Fewest Moves | Standard 3x3x3 FMC notation |
| `333oh` | 3x3x3 One-Handed | Standard 3x3x3 |
| `clock` | Rubik's Clock | WCA Clock scramble notation |
| `minx` | Megaminx | Pochmann notation (R++/D++/U) |
| `pyram` | Pyraminx | Random-state with tip moves |
| `skewb` | Skewb | Random-state |
| `sq1` | Square-1 | Random-state metric |
| `444bf` | 4x4x4 Blindfolded | 4x4x4 random-state |
| `555bf` | 5x5x5 Blindfolded | 5x5x5 random-state |
| `333mbf` | 3x3x3 Multi-Blind | Multi-cube scramble set |

### 4.5 Sessions & Solve Management

- **Multiple Sessions**: Support creating, renaming, and deleting multiple sessions per event or across events.
- **Solve Record Schema**:
  - `id`: Unique string / UUID.
  - `time`: Number (milliseconds elapsed).
  - `scramble`: String (scramble used).
  - `event`: String (WCA event code, e.g. `333`).
  - `date`: ISO timestamp / millisecond epoch.
  - `penalty`: `none` | `+2` | `DNF`.
  - `comment`: Optional user notes for the solve.
- **CRUD Operations**: View solve details, edit penalty (`none` / `+2` / `DNF`), edit comments, delete individual solves or batch clear. All solve actions (penalties, deletion) and session actions (renaming, deletion) are triggered via primary left-click or tap without requiring secondary right-click menus.
- **Persistence**: Automatic persistence to browser `localStorage`.

### 4.6 Statistics Engine

- **Single Statistics**: Current solve, session best single, session worst single.
- **Trimmed Means / Averages (WCA Standard)**:
  - **ao5** (Average of 5): Best 1 and worst 1 trimmed, mean of remaining 3.
  - **ao12** (Average of 12): Best 1 and worst 1 trimmed, mean of remaining 10.
  - **ao50** (Average of 50): Best 5% and worst 5% trimmed, mean of remaining 90%.
  - **ao100** (Average of 100): Best 5% and worst 5% trimmed, mean of remaining 90%.
- **Mean of 3 (mo3)**: Untrimmed mean of 3 consecutive solves (used for 6x6, 7x7, BLD events, FMC).
- **Session Stats**: Session mean, count, standard deviation, and best averages record tracking.
- **Penalty Handling**:
  - `+2`: Adds 2000ms to raw time before calculating averages.
  - `DNF`: Counted as infinity in rankings. Averages with more DNFs than the allowed trim threshold result in `DNF`.

### 4.7 Settings & Customization

- **Inspection Toggle**: Enable/disable 15-second inspection countdown.
- **Hold Duration**: Configure hold-to-start duration (e.g. 0ms, 300ms, 500ms).
- **Time Precision**: Display time with 2 decimal places (`0.00`) or 3 decimal places (`0.000`).
- **Hide Time While Solving**: Option to blind the running timer display to reduce distraction.
- **Sound Alerts**: Optional audio cues at 8s and 12s during inspection, and on timer ready.
- **Data Management**:
  - Export all sessions and solves to JSON.
  - Import sessions and solves from JSON.
  - Clear all data with confirmation.

## 5. Non-Functional Requirements

- **Offline-Capable**: Function fully without an active internet connection once loaded as a PWA / cached asset.
- **Timer Precision**: High-resolution time stamps via `performance.now()` with sub-millisecond fidelity and UI rendering with zero frame drops (<100ms input latency).
- **Responsiveness**: Fluid layout across desktop, tablet, and mobile displays.
- **Accessibility**: Full keyboard navigation support and ARIA attributes for screen readers.
- **Privacy & Telemetry**: Zero analytics, zero tracking cookies, zero external telemetry. All solve data remains local.

## 6. UI Layout & Architecture

- **Visual Style**: Dark theme with high contrast, modern typography (monospace digits for timer), minimal distraction.
- **Layout Structure**:
  - **Header / Scramble Bar**: Event selector, current scramble with large readable font, copy scramble button, next scramble button.
  - **Main Area**: Centered high-precision timer display and status indicators (inspection warnings, ready state color transitions).
  - **Left Panel (Solves History)**: Collapsible list of solves in current session. Clicking any solve opens quick action options (No penalty, +2, DNF, Delete).
  - **Right Panel (Statistics & Settings)**: Collapsible summary of best single, current single, ao5, ao12, ao50, ao100, mo3, session statistics, and app settings.
  - **Bottom Bar (Session & Navigation)**: Session switcher chips. Clicking an active session opens options to rename or delete; clicking inactive chips switches active session.

## 7. Deployment & CI/CD

- **Target**: GitHub Pages (`https://haftel.github.io/jjtimer/`).
- **Pipeline**: Automated build and deployment via GitHub Actions workflow on push to the `main` branch.
- **Build Output**: Static assets generated into the `dist/` directory with base path configuration.
