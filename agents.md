# FrameGallery agent guide

This repository contains a full-stack gallery application:

- Frontend: React app in `frontend/`
- Backend: Spring Boot API in `backend/`
- Runtime assembly: Dockerfile and docker-compose.yml at the repo root

## Repository layout

- `frontend/src/` — React pages, components, and app bootstrap
- `frontend/package.json` — frontend dependencies and scripts
- `backend/src/` — Java/Spring Boot source files
- `backend/build.gradle` — backend dependency and build configuration
- `backend/gradle/wrapper/gradle-wrapper.properties` — Gradle wrapper version
- `Dockerfile` — multi-stage production build for frontend + backend
- `docker-compose.yml` — local service orchestration

## Development workflow

### Frontend

```bash
cd frontend
npm install
npm start
npm run build
npm test
```

### Backend

```bash
cd backend
chmod +x gradlew
./gradlew test
./gradlew bootRun
```

### Docker

```bash
docker compose up --build
```

## Compatibility rules

- Prefer stable, non-preview dependency versions over alpha/beta releases.
- Keep the frontend and backend aligned with the app's current Java/React ecosystem.
- When a package has an alpha or RC release, prefer the last stable version unless a migration is explicitly required and tested.
- Do not introduce broad framework changes without updating related configuration and validation.

## Safety expectations

- Keep changes targeted and minimal.
- Validate with the existing build/test commands before finishing work.
- Prefer the repo's current conventions and avoid unnecessary refactors.
