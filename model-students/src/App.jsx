import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import PanelPage from './PanelPage'
import './App.css'

function HomePage() {
  const navigate = useNavigate()

  const goToPanel = (slug) => {
    navigate(`/panel/${slug}`)
  }

  return (
    <main className="layout">
      <section className="half top-half" aria-label="Top layout">
        <button
          type="button"
          className="panel panel-button"
          onClick={() => goToPanel('govern-ai')}
        >
          <span className="panel-title">Who should govern A.I. use in the university?</span>
        </button>

        <article className="panel hero-panel">
          <p>Model Students</p>
        </article>

        <button
          type="button"
          className="panel panel-button"
          onClick={() => goToPanel('professor-ai')}
        >
          <span className="panel-title">Should professors use A.I. to teach?</span>
        </button>
      </section>

      <section className="half bottom-half" aria-label="Bottom layout">
        <button
          type="button"
          className="panel panel-button"
          onClick={() => goToPanel('guilty-ai')}
        >
          <span className="panel-title">Why do students feel guilty using A.I. for school?</span>
        </button>

        <button
          type="button"
          className="panel panel-button"
          onClick={() => goToPanel('ai-privilege')}
        >
          <span className="panel-title">Should A.I. be a student-earned privilege?</span>
        </button>
      </section>
    </main>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/panel/:slug" element={<PanelPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
