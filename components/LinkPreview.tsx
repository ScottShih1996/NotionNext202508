import { useState, useCallback } from 'react'

interface LinkPreviewProps {
  href: string
  children: React.ReactNode
}

interface PreviewData {
  title?: string
  description?: string
  images?: string[]
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ href, children }) => {
  const [data, setData] = useState<PreviewData | null>(null)
  const [loaded, setLoaded] = useState(false)

  const handleMouseEnter = useCallback(async () => {
    if (loaded || !href) return
    setLoaded(true)
    try {
      const res = await fetch(`/api/link-preview?url=${encodeURIComponent(href)}`)
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch link preview', err)
    }
  }, [href, loaded])

  return (
    <span className='notion-link-preview-wrapper'>
      <a href={href} onMouseEnter={handleMouseEnter} target='_blank' rel='noopener noreferrer'>
        {children}
      </a>
      {data && (
        <div className='notion-link-preview'>
          <div className='notion-link-preview-card'>
            {data.images?.[0] && (
              <img
                src={data.images[0]}
                alt={data.title || ''}
                className='notion-link-preview-thumbnail'
              />
            )}
            <div className='notion-link-preview-content'>
              {data.title && (
                <div className='notion-link-preview-title'>{data.title}</div>
              )}
              {data.description && (
                <div className='notion-link-preview-description'>
                  {data.description}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </span>
  )
}

export default LinkPreview
