// Minimal Firebase integration (Firestore) for storing responses.
// Replace the firebaseConfig values with your project's config.
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, updateDoc } from 'firebase/firestore'

const env = import.meta.env

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'YOUR_AUTH_DOMAIN',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  appId: env.VITE_FIREBASE_APP_ID || 'YOUR_APP_ID',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

function getResponsesCollectionName() {
  return import.meta.env.DEV ? 'responses-dev' : 'responses-prod'
}

// Fetch responses for a specific slug. Returns an array of response objects.
export async function fetchResponses(slug) {
  const q = query(collection(db, getResponsesCollectionName()), where('slug', '==', slug), orderBy('createdAt', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => {
    const data = d.data() || {}
    const resp = data.response || {}
    return { _docId: d.id, ...resp }
  })
}

// Add a response for a slug. `response` should be the full response object saved by the client.
export async function addResponse(slug, response) {
  const payload = {
    slug,
    response,
    createdAt: Date.now(),
  }

  const docRef = await addDoc(collection(db, getResponsesCollectionName()), payload)
  return docRef.id
}

// Update an existing response (matched by slug + response.id). Returns the updated doc id or null.
export async function updateResponse(slug, response) {
  try {
    const q = query(
      collection(db, getResponsesCollectionName()),
      where('slug', '==', slug),
      where('response.id', '==', response.id),
    )
    const snap = await getDocs(q)
    if (snap.empty) return null

    const docRef = snap.docs[0].ref
    await updateDoc(docRef, { response, updatedAt: Date.now() })
    return docRef.id
  } catch (err) {
    console.error('updateResponse error', err)
    throw err
  }
}

export default db
