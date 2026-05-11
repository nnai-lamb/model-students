import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useRef, useState } from 'react'
import AddResponse from './AddResponse'
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
      />
    </main>
  )
}

export default PanelPage