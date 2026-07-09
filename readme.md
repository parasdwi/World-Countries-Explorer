# 🌍 World Countries List — Country Search App

A lightweight, dependency-free vanilla JavaScript application that displays a searchable, filterable grid of world countries with flags. Clicking any country card opens a modal popup with detailed information (capital, languages, population, area).

https://parasdwi.github.io/World-Countries-Explorer/
---

## ✨ Features

- **Full country listing** — renders every country in `countries_data.js` as a flag card on page load.
- **Search "Starting With"** — filters countries whose name *starts with* the typed text.
- **Search "Contains"** — filters countries whose name *contains* the typed text anywhere.
- **Live search on input** — typing in the search box filters results in real time (no button click required).
- **Reverse / Sort toggle** — reverses the current display order of the rendered cards with one click.
- **Country detail modal** — clicking a card opens a fixed, centered popup showing:
  - Flag image
  - Country name
  - Capital
  - Languages
  - Population (formatted with thousands separators)
  - Area (km², formatted with thousands separators)
- **Modal dismissal** — closeable via the ✕ button or by clicking outside the modal content (overlay click).
- **Performance-conscious rendering** — uses `DocumentFragment` batching and lazy-loaded images to minimize reflows and unnecessary network requests.

---

## 🗂 Project Structure

```
project-root/
│
├── Country_Search.html      # Page markup, header, buttons, search bar, modal skeleton
├── Country_Search.css       # All styling: layout, cards, buttons, modal
├── Country_Search.js        # App logic: rendering, filtering, sorting, modal
├── countries_data.js        # ES module exporting the countries array (see below — not included, must be supplied)
└── Images/
    ├── globe-2.jpg           # Header background image
    ├── sort.png               # Sort button icon
    └── search2.png             # Search button icon
```

> ⚠️ **Note:** `countries_data.js` is imported by `Country_Search.js` via `import countries_data from "./countries_data.js";` but is not included in this repository snapshot. You must supply this file (see [Data Format](#-data-format) below) for the app to run.

---

## 🧩 How It Works

### 1. Initial Render
On load, `Country_Search.js` builds a `.container` div, inserts it into the DOM right after the `<header>`, and renders one `.flagCard` per entry in `countries_data`.

### 2. Card Creation (`makeCards`)
Each card is built from a country object and contains:
- An `<img>` tag (flag, lazy-loaded)
- A `<p>` tag (country name)

A click listener is attached directly to each card at creation time, which calls `showPopup(country)` with that country's full data.

### 3. Filtering (`filterCountryAndRender`)
Takes a `mode` argument (`'start'` or `'include'`) and:
1. Reads and normalizes the search input (`.trim().toLowerCase()`)
2. Filters `countries_data` using either `startsWith()` or `includes()`
3. Re-renders the container with the filtered results

This single function backs three different triggers:
| Trigger | Mode |
|---|---|
| Typing in the search box (`input` event) | `include` |
| Clicking **"Search with any word"** | `include` |
| Clicking **"Starting Word"** | `start` |

### 4. Rendering (`renderCards`)
To avoid layout thrashing, all cards for a given render pass are appended to an in-memory `DocumentFragment` first, then the fragment is appended to the container in a single DOM operation. The container's previous content is cleared with `innerHTML = ''` before each new render.

### 5. Sorting (`sort` button)
Reverses the current on-screen order of cards. It reads the existing card elements (already-created DOM nodes, not re-rendered from data), reverses their order in memory, and re-inserts them via a `DocumentFragment` — a single batched DOM write instead of N individual moves.

### 6. Modal Popup (`showPopup`)
When a card is clicked:
1. `modalBody.innerHTML` is populated with the selected country's flag, name, capital, languages, population, and area.
2. `modalOverlay.style.display` is set to `'flex'`, which reveals the fixed, screen-centered overlay + modal (see CSS below).

The modal closes when:
- The `.close-btn` (✕) is clicked, **or**
- The user clicks anywhere on the dark overlay *outside* the modal content box (checked via `e.target === modalOverlay`)

---

## 🎨 Styling Overview (`Country_Search.css`)

| Section | Purpose |
|---|---|
| `header` | Full-width hero banner with background image + gradient overlay |
| `.buttons` / `.inputAndIcon` | Search controls layout (flex row, centered) |
| `.container` | Flex-wrap grid holding all `.flagCard` elements |
| `.flagCard` | Individual country card — fixed width, hover scale effect |
| `.modal-overlay` | Fixed, full-screen dark backdrop (`display: none` by default, toggled to `flex` on click) |
| `.modal-content` | The centered white popup box containing country details |
| `.close-btn` | Absolutely positioned ✕ button inside the modal |

The modal is centered using **flexbox on the overlay** (`justify-content: center; align-items: center;`) rather than `transform: translate(-50%, -50%)` — both are valid approaches; this project uses the flex method since the overlay already spans the full viewport.

---

## 📦 Data Format

`countries_data.js` must be an ES module with a **default export** — an array of country objects shaped like this:

```javascript
// countries_data.js
const countries_data = [
  {
    name: "France",
    flag: "https://example.com/flags/fr.png",
    capital: "Paris",
    languages: ["French"],
    population: 67390000,
    area: 551695
  },
  {
    name: "Japan",
    flag: "https://example.com/flags/jp.png",
    capital: "Tokyo",
    languages: ["Japanese"],
    population: 125800000,
    area: 377975
  }
  // ...more countries
];

export default countries_data;
```

### Field reference

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | `string` | ✅ | Used for display, search filtering, and card `id` |
| `flag` | `string` (URL) | ✅ | Rendered as the card & modal image |
| `capital` | `string` | Optional | Falls back to `'N/A'` if missing |
| `languages` | `string[]` | Optional | Joined with `', '`; falls back to `'N/A'` if missing |
| `population` | `number` | ✅ | Must be a number — `.toLocaleString()` is called directly on it (will throw if `undefined`) |
| `area` | `number` | Optional | Falls back to `'N/A'` if missing; formatted with `.toLocaleString()` when present |

> ⚠️ **Gotcha:** Unlike `area`, the `population` field is **not** null-checked before `.toLocaleString()` is called (`country.population.toLocaleString()`). Every object in `countries_data` must include a numeric `population` value, or that card's popup will throw a runtime error.

A free public dataset such as [restcountries.com](https://restcountries.com/) can be mapped into this shape if you don't have your own source.

---

## ▶️ Running the Project

Because `Country_Search.js` uses native ES module syntax (`import`/`export`), it **cannot** be opened directly via `file://` in most browsers — it must be served over HTTP.

### Option 1 — VS Code Live Server
1. Install the **Live Server** extension.
2. Right-click `Country_Search.html` → **Open with Live Server**.

### Option 2 — Node.js quick server
```bash
npx serve .
```
Then open the printed local URL (typically `http://localhost:3000`).

### Option 3 — Python quick server
```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000/Country_Search.html`.

---

## 🚀 Possible Improvements

- [ ] Guard `country.population` with a fallback (`?? 'N/A'`) the same way `area` and `capital` are handled, to avoid runtime errors on incomplete data.
- [ ] Add a "no results found" message when a search/filter returns an empty array.
- [ ] Add `Escape` key support to close the modal (currently only ✕ click and overlay click are supported).
- [ ] Debounce the `input` event listener on the search box to reduce re-renders while typing quickly on large datasets.
- [ ] Move away from inline event listeners per-card toward event delegation on `.container` for better scalability with very large datasets.
- [ ] Add a loading/error state for flag images that fail to load (`onerror` fallback).
- [ ] Populate `.totalCountries` and `.countriesAndCount` placeholder text in the header dynamically from `countries_data.length` and current filter results.

---

## 📄 License

This project is provided as-is for educational/demo purposes. Add your preferred license here (MIT, etc.) if distributing publicly.
