# QazaqLearn — Kazakh Vocabulary Learning Application

**A React-based vocabulary learning prototype for Mobile-Assisted Language Learning (MALL) research.**

## Live Demo

[Open QazaqLearn](https://kaleidoscopic-twilight-51d497.netlify.app)

## Project Overview

QazaqLearn is a responsive web application designed to support beginner learners in acquiring Kazakh vocabulary through interactive flashcards, visual learning materials, daily practice, and vocabulary quizzes.

The prototype was developed as the practical component of an academic research project examining vocabulary acquisition and retention through Mobile-Assisted Language Learning (MALL).

The application contains **60 Kazakh vocabulary words organised into 10 thematic categories**.

## Main Features

- **Vocabulary Categories:** Explore 10 categories covering everyday Kazakh vocabulary.
- **Interactive Flashcards:** Study Kazakh words with English translations and accompanying images.
- **Daily Practice:** Review a daily selection of vocabulary words.
- **Vocabulary Quizzes:** Practise recognition and cued recall.
- **Learning Progress:** View quiz performance and learning history.
- **Responsive Interface:** Use the application on desktop and mobile browsers.

## Research Mode

QazaqLearn includes a separate Research Mode designed to demonstrate the planned research procedure.

| Component | Purpose |
|---|---|
| Baseline Test | Assess vocabulary knowledge before learning (10 questions) |
| Immediate Post-test | Assess vocabulary knowledge immediately after the learning period (20 questions) |
| Delayed Post-test | Assess vocabulary retention after a planned two-week delay (60 questions) |
| Control Group | Provide the same vocabulary in a conventional text-list format |
| SUS Questionnaire | Evaluate perceived usability using the 10-item System Usability Scale |

The vocabulary assessments include recognition and cued-recall tasks. Research assessment results are stored separately from ordinary practice quiz results.

**Research status:** These features represent prototype research instruments. The application does not currently enforce the research schedule, verify group allocation, or provide centralised participant-data storage. The assessments have different lengths and require further methodological validation before formal comparisons.

## Technology Stack

- React
- JavaScript
- Vite
- HTML and CSS
- Browser localStorage
- Netlify for frontend deployment
- Git and GitHub for version control

## Application Architecture

QazaqLearn currently uses a client-side architecture.

1. Vocabulary data is loaded from local JavaScript modules.
2. React components display vocabulary cards and learning activities.
3. Quiz and research assessment components process submitted responses.
4. Results are calculated in the browser.
5. Results are saved in localStorage and can be retrieved by the application.

The current prototype does not require a dedicated backend or external database.

## Project Structure

```text
kazakh-vocab-app/
├── public/
│   └── images/
├── src/
│   ├── components/
│   ├── data/
│   ├── pages/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── scripts/
├── package.json
└── vite.config.js
```

## Installation and Running Locally

### Requirements

- Node.js
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/ayana24047/qazaqlearn.git
```

Open the project directory:

```bash
cd qazaqlearn
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local address displayed by Vite in your browser.

### Production Build

```bash
npm run build
```

The production-ready frontend is generated in the `dist` directory.

## Research Methodology

The planned study uses a quantitative quasi-experimental approach to investigate Kazakh vocabulary acquisition and retention.

Two learning conditions are considered:

- **Experimental condition:** Vocabulary learning through QazaqLearn.
- **Control condition:** Vocabulary learning through a conventional word list containing the same target vocabulary.

The proposed procedure includes an initial vocabulary assessment, a four-week learning period, an immediate post-test, a delayed post-test approximately two weeks later, and a usability questionnaire.

The intended outcome measures include vocabulary recognition, cued recall, and retention.

These are planned research procedures. The repository does not claim that participant recruitment, formal data collection, or experimental evaluation has been completed.

## Privacy and Ethics

The current prototype saves quiz and research results locally in the user's browser.

- No backend research database is implemented.
- Local browser storage is not a secure multi-user research data management system.
- Demonstration identifiers should be used for prototype testing.
- Real participant data must not be collected without appropriate consent and institutional permissions.
- API credentials and environment files must not be committed to the public repository.

## Current Limitations

- Research results are stored locally rather than in a central database.
- Delayed testing dates are not automatically enforced.
- Participant group membership is not technically restricted.
- Research tests differ in length and require comparability checks.
- Repeated testing may introduce practice effects.
- Formal usability and learning-effectiveness results are not yet available.

## Image Sources

Vocabulary photographs were obtained from external image sources. Source metadata is provided in the image-credit files where available. Image licensing and redistribution requirements should be reviewed before further distribution.

## Academic Context

This prototype supports the practical implementation component of **Assignment 3: Methodology and Core Practical Implementation**.

It demonstrates initial technical readiness, vocabulary presentation, interactive assessment, response processing, and browser-based result storage.

## Project Status

**Frontend prototype implemented.**

The application is available as a live demonstration. Further work includes research instrument validation, formal functional testing, documentation of system architecture, and preparation of the experimental protocol.