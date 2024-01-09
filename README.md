# Event Management Web Client

A React client for signing in, organizing events, discovering upcoming events, and joining events through the companion Rails API.

## User flow

```text
sign up / sign in
        |
        v
authenticated home
  |-- create and manage my events
  |-- browse events available to join
  `-- review events already joined
```

The application keeps authentication and event collections in a shared reducer-backed context. Axios attaches the token stored in `localStorage`, while React Router redirects unauthenticated visitors to sign in.

## Main areas

- `src/context/EventContext.js` — authentication and event collection state.
- `src/services/` — API client and logout handling.
- `src/components/` — authentication, event forms, lists, details, and joining.
- `src/layouts/Home.js` — authenticated event workspace.

## Backend connection

The Axios client uses relative URLs. During local development, configure the proxy target expected by the project or serve the client and API behind the same origin. The companion API is maintained in `event-organizer-rails-api`.

Expected flows include `/login`, `/logout`, event CRUD, event discovery, and event membership routes.

## Local setup

```bash
npm install
npm start
```

The development server opens at `http://localhost:3000` by default. Start the API separately and ensure the browser can reach it through the configured origin or proxy.

## Verification boundary

`src/App.test.js` is the Create React App smoke test and does not establish coverage for authentication or event workflows.

## Known boundaries

- Authentication tokens are stored in browser `localStorage` and sent through a custom authorization header.
- API failures are surfaced through component-level notification handling rather than a centralized error model.
- Runtime configuration is not yet represented by an environment template consumed by `src/services/api.js`.
- The repository contains no screenshots or end-to-end coverage for the principal event flows.

## Next improvements

1. Move the API base URL into an explicit runtime environment variable.
2. Add focused tests for sign-in, protected navigation, event creation, and joining.
3. Standardize loading and error states across event collections.
4. Add screenshots once the client is verified against the companion API.
