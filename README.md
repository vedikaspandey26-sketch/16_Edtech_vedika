# StudyMate AI

**Your study path, personalized.**

A hackathon MVP that turns "search for a topic" into "search for a topic — for you."
Students answer a short, friendly questionnaire about what they're learning, their level,
goal, preferred format, and available time. StudyMate AI scores a curated resource dataset
against that profile and returns 3–5 resources, each with a plain-language explanation of
*why* it was recommended, organized into a short study path.

## Project structure

```
studymate-ai/
  backend/
    app.py                    # Flask API
    recommendation_engine.py  # Scoring + explanation logic
    data/resources.json       # ~25 sample resources across 9 topics
    requirements.txt
  frontend/
    src/
      pages/         LandingPage, QuestionnairePage, ResultsPage, SavedPage
      components/    NavBar, Chip, ProgressSteps, ResourceCard, StudyPath
      data/options.js         Questionnaire option lists
      services/api.js         Talks to the Flask API
      services/storage.js     localStorage save/remove + session handoff
```

## Design system

The UI runs a dark, "calm during exams" theme rather than a default light template:

- **Palette** — deep navy/charcoal base (`abyss`, `surface`), soft indigo-lavender and teal
  accents, muted amber/coral reserved for difficulty and status cues only. No pure black,
  no harsh neon.
- **Type** — Space Grotesk for display/headings, Inter for body, one consistent scale.
- **Icons** — [lucide-react](https://lucide.dev) throughout (no emoji-as-UI); each option
  in `data/options.js` carries an actual icon component.
- **Components** — one shared button/chip/card/input system in `index.css`
  (`.btn-primary`, `.btn-secondary`, `.chip`, `.card`, `.input-field`, `.glass`), so every
  page (landing, questionnaire, results, saved) looks like the same product.
- **Details** — match scores render as a gradient progress ring, empty states use a
  shared `EmptyState` component instead of a blank page, and transitions stay in the
  150–300ms range so the interface feels responsive without being distracting.

## How to install

**Backend**
```bash
cd backend
python3 -m venv venv          # optional but recommended
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Frontend**
```bash
cd frontend
npm install
```

## How to run

**1. Start the backend** (from `backend/`):
```bash
python3 app.py
```
Runs on `http://localhost:5000`. Health check: `GET /api/health`.

**2. Start the frontend** (from `frontend/`, in a second terminal):
```bash
npm run dev
```
Runs on `http://localhost:5173` and proxies `/api/*` requests to the Flask backend
(configured in `vite.config.js`), so no CORS setup is needed in dev even though
`flask-cors` is enabled as a fallback.

Open `http://localhost:5173` in your browser.

## How the recommendation algorithm works

Every resource in `resources.json` is scored against the student's profile using six
weighted, explainable factors (each a 0–1 fraction of its weight, summing to 0–100):

```
score = topic_match      * 35
      + level_match       * 20
      + goal_match         * 20
      + format_match       * 10
      + difficulty_match   * 10
      + time_match         * 5
```

- **topic_match** — exact/partial topic match scores highest; if the student names a
  specific topic, resources from a different topic (even the same subject) are excluded
  rather than padded in with a weak score.
- **level_match / difficulty_match** — distance-based on an ordinal scale (beginner →
  advanced, easy → challenging), so a "close" level still gets partial credit.
- **goal_match** — 1 if the resource is tagged for the student's stated goal, else 0.
- **format_match** — 1 if the resource's format is among the student's selected formats.
- **time_match** — 1 if the resource fits inside the student's available time, decaying
  as it runs longer.

Resources are sorted by score and the top 3–5 are returned, each with a generated
`reason` string built from which factors actually matched — this is what powers the
"Why this resource?" callout. If nothing shares the requested topic, the engine falls
back to the closest resources overall rather than returning an empty page, and the UI
shows a "we couldn't find an exact match" banner.

The five resources are also re-ordered into a short **study path**
(concept → visual/interactive → notes → practice) instead of being shown as a flat list.

## Demo flow (~30 seconds)

1. Land on the homepage → click **"Find my resources."**
2. Step 1: Subject **Computer Science**, Topic **Binary Search**, Knowledge **Complete beginner**.
3. Step 2: Goal **Prepare for an exam**, Difficulty **Easy**.
4. Step 3: Format **Video + Practice**, Time **30 minutes** → **"Get my study path."**
5. Results page opens on **"Binary Search Explained" (94–100% match)** with its
   "Why this resource?" explanation front and center, 2–4 more picks below, the
   personalization strip (🎓 Undergraduate · 📝 Exam prep · 🌱 Beginner · ⏱ 30 min),
   and the study path sequence at the bottom.
6. Use the format/difficulty/time filters to show refinement, then click **Save** on a
   card and check the **Saved** page in the nav.

## Assumptions made

- No authentication or personal data is collected — only learning preferences, per the
  brief's privacy requirement.
- Saved resources persist in the browser's `localStorage`; there's no backend database,
  since a hackathon demo only needs to work on the presenter's machine.
- The dataset is a realistic but static sample (~25 resources across 9 topics) rather
  than a live API integration, so the demo works with no external dependency or network
  flakiness.
- "Custom subject" input (when a student picks "Other") is matched against the dataset
  by subject text; if nothing matches, the fallback path returns the closest resources
  by goal/format/difficulty/time rather than a blank page.
