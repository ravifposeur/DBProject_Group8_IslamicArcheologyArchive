# ArkeoGIS - Islamic Archeology Archive (Frontend)

This repository contains the client-side application for **ArkeoGIS**, a collaborative Web GIS system designed to map and manage data regarding Islamic Archeology in Java.

The application is built using **Vanilla JavaScript (ES6 Modules)** for a lightweight, dependency-free frontend that connects to a RESTful API.

## Key Features

### Public Interface
* **Interactive Web GIS:** Powered by **Leaflet.js**, displaying verified sites with custom tooltips.
* **Search & Filters:**
    * Real-time search by Site Name, Village, Kingdom, or Historical Figure.
    * Filter markers by Site Type (Candi, Makam, etc.) or specific Historical Figures.
* **Responsive Side Panel:** View detailed site information, related artifacts (objects), and research teams in a slide-out panel (adapts to a bottom sheet on mobile).
* **Landing Page & Guide:** Dedicated pages for user onboarding (`index.html` and `guide.html`).

### Contributor Tools
* **User Authentication:** Registration, Login, and **Forgot/Reset Password** flows.
* **Data Reporting:**
    * **Report Sites:** Add new sites using GPS geolocation or manual map picking.
    * **Report Artifacts:** Add objects (findings) to specific sites with physical dimensions and transliteration data.
* **Dynamic Data Entry:** If a Kingdom, Researcher, or Historical Figure doesn't exist in the dropdown, contributors can select **"➕ Buat Baru"** to create it on the fly while reporting.
* **Cascading Locations:** Dynamic dropdowns for Administrative Areas (City → District → Village).

### Admin & Verifier Dashboard (`dashboard.html`)
* **Dual Verification Workflow:**
    * **Verify Sites:** Review pending sites. Includes logic to highlight "New Data" (e.g., if a user created a new Kingdom).
    * **Verify Objects:** Dedicated tab to review, approve, or reject specific artifact findings.
* **Data Management:**
    * **Region Manager:** Add Cities, Districts, and Villages.
    * **Entity Managers:** CRUD forms for **Kerajaan** (Kingdoms), **Arkeolog** (Researchers), and **Tokoh** (Historical Figures).
* **Relation Linking:** Manually link Researchers to Sites or Historical Figures to Objects via the dashboard.

## Tech Stack

* **Core:** HTML5, CSS3, JavaScript (ES6 Modules).
* **Styling:**
    * Native CSS Variables for theming (Primary Blue, Success Green, Warning Orange).
    * Responsive Flexbox/Grid layouts.
    * Backdrop filters for modern UI elements (Glassmorphism).
* **Maps:** [Leaflet.js](https://leafletjs.com/) (v1.9.4).

## Project Structure

```text
week4_integration/
├── assets/
│   └── css/
│       └── style.css        # Global styles, Map, Components, and Responsive logic
├── modules/
│   ├── api.js               # Centralized Fetch wrapper & Endpoint definitions
│   ├── auth.js              # JWT Token management (Save/Get/Decode)
│   ├── dashboard.js         # Admin logic: Verification & Master Data forms
│   ├── main.js              # Entry point for the Map interface
│   ├── map.js               # Leaflet initialization & marker rendering
│   ├── panel.js             # Side-panel logic (Details, Object lists)
│   └── ui.js                # DOM manipulation, Modals, Dynamic Dropdowns
├── index.html               # Landing Page
├── map.html                 # Main WebGIS Interface
├── dashboard.html           # Admin/Verifier Control Panel
├── guide.html               # User Manual/Documentation
```

## Configuration

If you need to change the Backend API URL, modify **`modules/api.js`**:

```javascript
const BASE_URL = 'https://arkeologis-be.vercel.app/api';
// Change this (e.g. to 'http://localhost:3000/api')
```

## Setup & Installation

Because this project uses **ES6 Modules** (`import`/`export`), it cannot be run directly via the `file://` protocol. It must be served via a local HTTP server.

**Option A: VS Code Live Server (Recommended)**
1. Open the `frontend` folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` and select **"Open with Live Server"**.

**Option B: Python**
If you have Python installed, run this command inside the `frontend` folder:
```bash
# Python 3
python -m http.server 8000
```
Then visit `http://localhost:8000`.

**Option C: Node.js (http-server)**
```bash
npx http-server .
```

## Usage Guide

### 1. Exploring
* Open `map.html` to see verified sites. Click markers to open the Side Panel

### 2. Reporting
* Click **Login**.
* Click the **Floating (+)** button (bottom right).
* Click a location on the map to open the reporting modal.

### 3. Verifying (Admin)
1. Log in as a user with the `admind` or `verifikator` role.
2. A **Dashboard** button will appear on the map page.
3. Use the Dashboard to Approve/Reject pending submissions.