# ArkeoGIS - Islamic Archeology Archive (Frontend)

This repository contains the client-side application for **ArkeoGIS**, a collaborative Web GIS system designed to map and manage data regarding Islamic Archeology in Java.

It is built using **Vanilla JavaScript (ES6 Modules)** and connects to the Node.js Backend API to perform CRUD operations, spatial visualization, and verification workflows.

## Key Features

### Public Interface
* **Interactive Web GIS:** Visualizes verified archaeological sites using **Leaflet.js**.
* **Searchable Directories:** Dedicated pages for:
    * **Kingdoms** (*Kerajaan*)
    * **Historical Figures** (*Tokoh*)
    * **Archaeologists** (*Arkeolog*)
* **Deep Relationships:** View artifacts found at specific sites, researchers linked to excavations, and historical figures attributed to specific objects.

### Contributor Tools
* **Data Submission:** Forms to report new Sites, Artifacts (Objects), and Master Data.
* **Cascading Location Selects:** Dynamic loading of City → District → Village for precise site location.

### Verifier & Admin Dashboard
* **Verification Workflow:** Review "Pending" sites and artifacts. Approve to publish them to the map or Reject to discard.
* **Master Data Management:**
    * **Location Manager:** Add/Edit/Delete Cities, Districts, and Villages.
    * **Title Manager:** Manage titles (*Gelar*) for historical figures.
* **RBAC UI:** Interface elements (Edit/Delete buttons) automatically hide/show based on the logged-in user's JWT role.

## Tech Stack

* **HTML5:** Semantic markup for Multi-Page Application (MPA) structure.
* **CSS3:** Custom styling without frameworks.
    * `style.css`: Core layout and typography.
    * `components.css`: Cards, buttons, badges, and form elements.
    * `map.css`: Leaflet overrides and map container styling.
* **JavaScript (ES6):** Modular architecture.
    * `modules/api.js`: Centralized Fetch API wrapper.
    * `modules/auth.js`: JWT handling and Role decoding.
    * `modules/ui.js`: DOM manipulation and rendering logic.
* **Leaflet.js:** Open-source JavaScript library for mobile-friendly interactive maps.

## Project Structure

```text
frontend/
├── assets/
│   └── css/
│       ├── components.css   # Reusable UI components (cards, forms)
│       ├── map.css          # Map specific styling
│       └── style.css        # Global layout and navigation
├── modules/
│   ├── api.js               # API Endpoints & Fetch Wrapper
│   ├── auth.js              # Token management & Role logic
│   ├── dashboard.js         # Logic for the Verifier Dashboard
│   ├── main.js              # Main controller for standard pages
│   ├── map.js               # Leaflet initialization & marker logic
│   └── ui.js                # HTML generation (Cards, Lists, Modals)
├── index.html               # Homepage (Map & Site List)
├── dashboard.html           # Protected Admin/Verifier Panel
├── login.html               # Auth: Login
├── register.html            # Auth: Register
├── link-atribusi.html       # Tool: Link Object <-> Figure
├── link-penelitian.html     # Tool: Link Archaeologist <-> Site
├── manage-lokasi.html       # Tool: Manage Cities/Districts/Villages
├── manage-gelar.html        # Tool: Manage Titles
├── [Entity Pages]           # arkeolog.html, kerajaan.html, tokoh.html
└── [Form Pages]             # add-*.html, edit-*.html
```

## Setup & Installation

Because this project uses **ES6 Modules** (`import`/`export`), it cannot be run directly via the `file://` protocol. It must be served via a local HTTP server.

### 1. Prerequisites
Ensure your Backend API is running.
1. Navigate to your backend directory (e.g., `week3_CRUD_demo`).
2. Run `node index.js`.
3. Ensure the backend is listening at `http://localhost:3000`.

### 2. Run the Frontend

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

## Configuration

If you need to change the Backend API URL (e.g., if you deploy the backend to the cloud), modify **`modules/api.js`**:

```javascript
// modules/api.js
const API_BASE = 'http://localhost:3000'; // Change this to your server URL
```

## Usage Guide

### 1. Viewing Data (Public)
* Open `index.html` to see the map. Only **Verified** sites appear here.
* Navigate to **Kerajaan**, **Tokoh**, or **Arkeolog** via the navbar to browse directories.

### 2. Authentication
* Click **"Masuk"** (Login) in the navbar.
* Default contributors can register via `register.html`.
* *Note: To become a Verifier or Admin, the role must be updated directly in the database.*

### 3. Verification (Verifikator Only)
1.  Log in as a user with the `verifikator` role.
2.  Click **"Dashboard"** in the navbar (yellow link).
3.  You will see list of **Pending Sites** and **Pending Artifacts**.
4.  Click **Setuju** (Approve) to verify data, or **Tolak** (Reject) to delete the submission.

### 4. Managing Relations
* **Link Research:** Go to an Archaeologist's profile or the "Edit" page to link them to a specific Site.
* **Link Attribution:** Go to a Historical Figure's page to link them to specific Artifacts found at a site.

## Contribution

1.  **CSS:** Keep styles modular. Use `components.css` for reusable widgets.
2.  **JS:** All API calls must go through `modules/api.js`. Do not use `fetch` directly in HTML files.
3.  **Validation:** Ensure forms handle empty states and API errors gracefully (using `alert` or UI feedback).