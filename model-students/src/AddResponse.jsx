import { useState } from 'react'
import './AddResponse.css'

const postItColors = ['#ffe66d', '#ffb4e1', '#b5ead7', '#c7ceea', '#ffdac1', '#d8f3dc']

function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

function intersects(rectA, rectB) {
  return !(
    rectA.right <= rectB.left ||
    rectA.left >= rectB.right ||
    rectA.bottom <= rectB.top ||
    rectA.top >= rectB.bottom
  )
}

function getRandomPostItPosition(mainElement, panelElement, existingResponses = []) {
  const fallback = {
    top: randomBetween(18, 82),
    left: randomBetween(10, 90),
  }

  if (!mainElement || !panelElement) {
    return fallback
  }

  const mainRect = mainElement.getBoundingClientRect()
  const panelRect = panelElement.getBoundingClientRect()

  if (!mainRect.width || !mainRect.height) {
    return fallback
  }

  const noteWidth = 230
  const noteHeight = 170
  const halfW = noteWidth / 2
  const halfH = noteHeight / 2
  const edgePadding = 8

  const xMin = halfW + edgePadding
  const xMax = mainRect.width - halfW - edgePadding
  const yMin = halfH + edgePadding
  const yMax = mainRect.height - halfH - edgePadding

  if (xMin >= xMax || yMin >= yMax) {
    return fallback
  }

  const panelLocal = {
    left: panelRect.left - mainRect.left,
    right: panelRect.right - mainRect.left,
    top: panelRect.top - mainRect.top,
    bottom: panelRect.bottom - mainRect.top,
  }

  for (let i = 0; i < 80; i += 1) {
    const centerX = randomBetween(xMin, xMax)
    const centerY = randomBetween(yMin, yMax)

    const noteRect = {
      left: centerX - halfW,
      right: centerX + halfW,
      top: centerY - halfH,
      bottom: centerY + halfH,
    }

    if (intersects(noteRect, panelLocal)) {
      continue
    }

    // Check against existing responses
    let overlapsWithExisting = false
    for (const response of existingResponses) {
      const existingCenterX = (response.left / 100) * mainRect.width
      const existingCenterY = (response.top / 100) * mainRect.height

      const existingRect = {
        left: existingCenterX - halfW,
        right: existingCenterX + halfW,
        top: existingCenterY - halfH,
        bottom: existingCenterY + halfH,
      }

      if (intersects(noteRect, existingRect)) {
        overlapsWithExisting = true
        break
      }
    }

    if (!overlapsWithExisting) {
      return {
        left: (centerX / mainRect.width) * 100,
        top: (centerY / mainRect.height) * 100,
      }
    }
  }

  return fallback
}

function AddResponse({ isComposerOpen, setIsComposerOpen, pageRef, panelContentRef, responses, setResponses }) {
  const [draftResponse, setDraftResponse] = useState('')

  const handlePostResponse = () => {
    const text = draftResponse.trim()

    if (!text) {
      return
    }

    const safePosition = getRandomPostItPosition(pageRef.current, panelContentRef.current, responses)

    const newResponse = {
      id: Date.now() + Math.random(),
      text,
      isLiked: false,
      likeCount: 0,
      color: postItColors[Math.floor(Math.random() * postItColors.length)],
      top: safePosition.top,
      left: safePosition.left,
      rotate: randomBetween(-10, 10),
    }

    setResponses((prev) => [...prev, newResponse])
    setDraftResponse('')
    setIsComposerOpen(false)
  }

  const handleLikeResponse = (id) => {
    setResponses((prev) =>
      prev.map((response) => {
        if (response.id !== id) {
          return response
        }

        return {
          ...response,
          isLiked: !response.isLiked,
          likeCount: response.likeCount + 1,
        }
      }),
    )
  }

  return (
    <>
      {responses.map((response) => (
        <article
          key={response.id}
          className="post-it-note"
          style={{
            backgroundColor: response.color,
            top: `${response.top}%`,
            left: `${response.left}%`,
            transform: `translate(-50%, -50%) rotate(${response.rotate}deg)`,
          }}
        >
          <p className="post-it-text">{response.text}</p>
          <button
            type="button"
            className={`like-button ${response.isLiked ? 'liked' : ''}`}
            onClick={() => handleLikeResponse(response.id)}
            aria-label={`${response.isLiked ? 'Unlike' : 'Like'} response. ${response.likeCount} clicks`}
          >
            <span className="heart-icon" aria-hidden="true">
              {response.isLiked ? '♥' : '♡'}
            </span>
            <span className="like-count">{response.likeCount}</span>
          </button>
        </article>
      ))}

      {isComposerOpen && (
        <div className="response-composer-overlay" role="dialog" aria-modal="true">
          <div className="response-composer-card">
            <h2>Write a response</h2>
            <textarea
              value={draftResponse}
              onChange={(event) => setDraftResponse(event.target.value)}
              placeholder="Type your response..."
              rows={5}
            />
            <div className="composer-actions">
              <button type="button" onClick={() => setIsComposerOpen(false)}>
                Cancel
              </button>
              <button type="button" onClick={handlePostResponse}>
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AddResponse
