import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import AddResponse from './AddResponse'
import './PanelPage.css'

const panelItems = [
  { slug: 'govern-ai', label: 'Who should govern A.I. use in the university?' },
  { slug: 'professor-ai', label: 'Should professors use A.I. to teach?' },
  { slug: 'guilty-ai', label: 'Why do students feel guilty using A.I. for school?' },
  { slug: 'ai-privilege', label: 'Should A.I. be a student-earned privilege?' },
]

function PanelPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const panel = panelItems.find((item) => item.slug === slug)
  const pageRef = useRef(null)
  const panelContentRef = useRef(null)
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const storageKey = slug ? `responses-${slug}` : null

  // Initialize responses from localStorage for both local development and GitHub Pages.
  const [responses, setResponses] = useState(() => {
    if (!storageKey) {
      return []
    }

    try {
      const storedResponses = localStorage.getItem(storageKey)
      if (storedResponses) {
        console.log(`Loading responses for ${slug}:`, JSON.parse(storedResponses))
        return JSON.parse(storedResponses)
      }
    } catch (error) {
      console.error('Failed to parse stored responses:', error)
    }
    return []
  })

  // Save responses to localStorage whenever they change.
  useEffect(() => {
    if (!storageKey) {
      return
    }

    try {
      console.log(`Saving responses for ${slug}:`, responses)
      localStorage.setItem(storageKey, JSON.stringify(responses))
    } catch (err) {
      console.error('Failed to save responses to localStorage', err)
    }
  }, [responses, slug, storageKey])

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
        setResponses={setResponses}
      />
    </main>
  )
}

export default PanelPage