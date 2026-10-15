# Labor Link Connect

Labor Link Connect is a role-based marketplace that helps customers find contractors seeking workers. Customers can browse contractor listings and send work requests; contractors can publish or update their listing and manage incoming requests.

## Product Workflows

- **Customer:** browse active contractor listings, review job details and worker counts, send a request, and see its status. Contact details are shown after the contractor accepts.
- **Contractor:** create or update a listing with a title, phone number, job description, and worker count; review incoming requests and accept or reject them.
- **Account access:** register or sign in with email and password, choosing a customer or contractor account type.

## Architecture

The frontend is a single-page React application organized around route-level pages, shared layouts, and role-specific home views. React Router separates authentication pages from the protected application route. On startup, a Firebase Auth observer restores the session and loads the user's Firestore profile before rendering the app.

Redux Toolkit owns the shared user session and its loading state. Feature-specific listing and request data stays close to the customer and contractor views in React state. Firebase access is centralized in `src/configs/firebase.ts`, while shared domain types and role/status constants live under `src/utils`.

```text
src/
├── components/   Shared interface components
├── configs/      Firebase initialization and data operations
├── layouts/      Authenticated and authentication page shells
├── pages/        Login, registration, and role-specific home views
├── store/        Redux Toolkit store and user session slice
└── utils/        Route protection, domain types, and constants
```

### Data Model

Firestore currently uses three collections:

| Collection              | Purpose                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------- |
| `userdetails/{uid}`     | User profile name and account type, keyed by Firebase Auth UID                        |
| `contractorposts/{uid}` | One contractor listing per UID, including title, phone, description, and worker count |
| `requests/{requestId}`  | Customer-to-contractor request with sender, receiver, and status                      |

Request status values are `1` (pending), `2` (accepted), and `3` (rejected). The UI uses acceptance to control when customer contact details become visible.

## Technology

- React 18, TypeScript, and Vite
- React Router for route composition and protected navigation
- Redux Toolkit and React Redux for shared session state
- Firebase Authentication, Cloud Firestore, and Firebase Storage
- Material UI for form and interaction components
- ESLint and TypeScript compiler checks

## Local Development

### Prerequisites

- Node.js and npm
- A Firebase project with Email/Password Authentication and Cloud Firestore enabled

### Configure Firebase

Create a `.env.local` file in the project root and provide the web app configuration from your Firebase project:

```dotenv
VITE_API_KEY=your_firebase_api_key
VITE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_project.appspot.com
VITE_MESSAGING_SENDER_ID=your_sender_id
VITE_APP_ID=your_firebase_app_id
```

These values are consumed by Vite at build time. Firebase web configuration is not a substitute for access control: configure and test Firestore Security Rules to enforce which authenticated users can read and modify profile, listing, and request documents. The client-side protected route only controls navigation in the UI.

### Install and Run

```bash
npm install
npm run dev
```

Vite prints the local development URL when the server starts.

### Quality Checks

```bash
npm run build  # TypeScript check and production build
npm run lint   # ESLint
npm run preview
```
