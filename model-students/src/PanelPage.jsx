import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import AddResponse from './AddResponse'
import { fetchResponses, addResponse, updateResponse } from './firebase'
import './PanelPage.css'

const panelItems = [
  { slug: 'govern-ai', label: 'Who should govern A.I. use in the university?' },
  { slug: 'professor-ai', label: 'Should professors use A.I. to teach?' },
  { slug: 'guilty-ai', label: 'Why do studetns feel guilty using A.I. for school?' },
  { slug: 'ai-privilege', label: 'Should A.I. be a student-earned privilege?' },
]

function PanelPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const panel = panelItems.find((item) => item.slug === slug)
  const pageRef = useRef(null)
  const panelContentRef = useRef(null)
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  
  // Initialize responses from localStorage (quick local fallback)
  const [responses, setResponses] = useState(() => {
    try {
      const storedResponses = localStorage.getItem(`responses-${slug}`)
      if (storedResponses) {
        console.log(`Loading responses for ${slug}:`, JSON.parse(storedResponses))
        return JSON.parse(storedResponses)
      }
    } catch (error) {
      console.error('Failed to parse stored responses:', error)
    }
    return []
  })

  // Load responses from Firestore (if available) and prefer remote data when present.
  useEffect(() => {
    let cancelled = false

    async function loadRemote() {
      if (!slug) return
      try {
        const remote = await fetchResponses(slug)
        if (cancelled) return
        if (remote && remote.length > 0) {
          // remote items contain the original response fields saved by the client
          const mapped = remote.map((r) => ({ id: r.id || r._docId || `${r._docId}`, ...r }))
          setResponses(mapped)
        }
      } catch (err) {
        console.error('Failed to fetch remote responses:', err)
      }
    }

    loadRemote()
    return () => {
      cancelled = true
    }
  }, [slug])

  // Save responses to localStorage whenever they change
  useEffect(() => {
    try {
      console.log(`Saving responses for ${slug}:`, responses)
      localStorage.setItem(`responses-${slug}`, JSON.stringify(responses))
    } catch (err) {
      console.error('Failed to save responses to localStorage', err)
    }
  }, [responses, slug])

  // Wrapper around setResponses that also persists newly added responses to Firestore.
  const setResponsesAndPersist = (updater) => {
    setResponses((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater

      try {
        const added = next.filter((n) => !prev.some((p) => p.id === n.id))
        const modified = next.filter((n) => {
          const existing = prev.find((p) => p.id === n.id)
          return existing && JSON.stringify(existing) !== JSON.stringify(n)
        })

        added.forEach((item) => {
          addResponse(slug, item).catch((err) => console.error('Failed to save new response to Firestore', err))
        })

        modified.forEach((item) => {
          updateResponse(slug, item).catch((err) => console.error('Failed to update response in Firestore', err))
        })
      } catch (err) {
        console.error('Error while persisting responses:', err)
      }

      return next
    })
  }

  if (!panel) {
    return <Navigate to="/" replace />
  }

  return (
    <main ref={pageRef} className="panel-page" aria-label="Panel detail page">
      <button type="button" className="respond-button" onClick={() => setIsComposerOpen(true)}>
        Respond
      </button>

      <button type="button" className="back-button" onClick={() => navigate('/')}>
        ← Back
      </button>

      <div ref={panelContentRef} className="panel-page-content">
        <h1>{panel.label}</h1>
      </div>

      <AddResponse
        isComposerOpen={isComposerOpen}
        setIsComposerOpen={setIsComposerOpen}
        pageRef={pageRef}
        panelContentRef={panelContentRef}
        responses={responses}
        setResponses={setResponsesAndPersist}
      />
    </main>
  )
}

export default PanelPage