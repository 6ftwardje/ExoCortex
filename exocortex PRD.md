Exocortex for Google Drive - PRD (Product Requirements Document)

Algemene App Info

Naam: Exocortex Doelgroep: Creatieve ondernemers, agencies, bedrijven die Google Drive gebruiken als kennisbank. Belangrijkste Functies:

Drive structuur lezen en visueel maken.

AI prompts gebruiken om documenten toe te voegen.

Slimme zoekopdrachten en samenvattingen uitvoeren.

Technologie Stack

Frontend: React

Backend: Node.js + Express

Database: Firebase Firestore

AI Integratie: OpenAI GPT-4 / Claude 3.5

API Integraties: Google Drive API, Google Docs API

Project Structuur (indicatief)

/exocortex
|-- /backend
|   |-- /controllers
|   |-- /services
|   |-- /routes
|   |-- app.js
|-- /frontend
|   |-- /components
|   |-- /pages
|   |-- /utils
|   |-- App.js
|-- /database
|   |-- schema.md
|-- /tasks
|   |-- initial-tasks.md
|-- README.md

Functionaliteiten Overzicht

1. Authentificatie

OAuth 2.0 authenticatie met Google.

Sessies beheren met refresh tokens.

2. Organigram Generator

Crawlt hele Google Drive structuur.

Visualiseert als boomstructuur (frontend tree component).

Slaat structuur gecached op in Firestore.

3. Document Toevoeging via Prompt

Input prompt interface in frontend.

AI herschrijft inhoud voor nettere meeting notes.

Upload naar juiste locatie in Drive op basis van structuur.

4. Document Search & Samenvatten

Gebruiker kan natuurlijke query’s geven.

Files gefilterd op metadata en/of content.

AI samenvat de resultaten in een leesbare output.

Hoofdschermen UI

Login / Connect to Drive

Dashboard met boomstructuur

Prompt input scherm

Zoek en samenvatting output scherm

MVP Tasks

Setup



Authentificatie Flow



Drive Crawler



Frontend Organigram Visualisatie



Prompt-to-Upload Functionaliteit



Zoekfunctie & Samenvatting



Testing & Validatie



Rules en Best Practices

Caching Drive structuur om limieten te sparen.

Duidelijke error messages bij API failures.

Security tokens encrypten.

Gebruik environment variables voor API keys.

API retries inbouwen bij rate limiting.

Opmerking: De MVP mag eenvoudig zijn, maar moet robuust omgaan met fouten en limieten van Google API.

Tip: Gebruik Clawed Taskmaster na het importeren van deze PRD om automatisch een volledige taaklijst te genereren inclusief sub-tasks en complexiteitsanalyse.

Ready for Taskmaster Initialization! 🚀

