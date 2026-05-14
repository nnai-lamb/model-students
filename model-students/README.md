## Optional: Persist responses with Firebase

This project uses `localStorage` by default for responses. To persist responses across devices and deploys, you can enable Firebase Firestore.

1. Create a Firebase project at https://console.firebase.google.com/ and enable Firestore.
2. Install the SDK:

```bash
cd model-students
npm install firebase
```

3. Add your Firebase web config values to a `.env` file at the `model-students` root. For Vite, use the `VITE_` prefix:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. For development you can use the example `firestore.rules` file included in the project root. Do NOT use permissive rules in production — require `request.auth != null` for writes.

5. Run the app and try posting responses; new items will be written to Firestore and loaded on page open.

Note: `.env` is usually gitignored, and that is fine. With Vite, the values are read at build time and bundled into the static app. The deployed GitHub Pages site does not need access to your `.env` file at runtime.

Responses created with `npm run dev` are saved to a separate Firestore collection from the GitHub Pages build, so local test messages will not show up in production.

## GitHub Pages deploy secrets

If you deploy with the included GitHub Actions workflow, add these repository secrets so the build can inject your Firebase config at build time:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

The workflow reads those secrets during `npm run build`, so the deployed GitHub Pages site still works even though `.env` is not committed.
