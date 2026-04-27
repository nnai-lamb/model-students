import { Navigate, useParams } from 'react-router-dom'

const panelItems = [
  { slug: 'starter', label: 'Starter' },
  { slug: 'top-row-item-3', label: 'Top row item 3' },
  { slug: 'documentation', label: 'Documentation' },
  { slug: 'community', label: 'Community' },
]

function PanelPage() {
  const { slug } = useParams()
  const panel = panelItems.find((item) => item.slug === slug)

  if (!panel) {
    return <Navigate to="/" replace />
  }

  return (
    <main className="panel-page" aria-label="Panel detail page">
      <h1>{panel.label}</h1>
    </main>
  )
}

export default PanelPage