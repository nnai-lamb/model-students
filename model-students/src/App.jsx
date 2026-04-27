import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import lambLogo from './assets/Lamb_logo.png'
import nnaiLogo from './assets/NNAI.png'
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
          aria-label="Starter panel"
          onClick={() => goToPanel('starter')}
        >
          <span className="panel-title">Starter</span>
        </button>

        <article className="panel hero-panel">
          <img src={nnaiLogo} className="nnai-badge" width="48" height="48" alt="NNAI" />
          <img src={lambLogo} className="base" width="170" height="179" alt="" />
          <p>Model Students</p>
        </article>

        <button
          type="button"
          className="panel panel-button"
          aria-label="Top row item 3 panel"
          onClick={() => goToPanel('top-row-item-3')}
        >
          <span className="panel-title">Top row item 3</span>
        </button>
      </section>

      <section className="half bottom-half" aria-label="Bottom layout">
        <button
          type="button"
          className="panel panel-button"
          aria-label="Documentation panel"
          onClick={() => goToPanel('documentation')}
        >
          <span className="panel-title">Documentation</span>
        </button>

        <button
          type="button"
          className="panel panel-button"
          aria-label="Community panel"
          onClick={() => goToPanel('community')}
        >
          <span className="panel-title">Community</span>
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
