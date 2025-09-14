import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.query
  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'Missing url' })
    return
  }

  try {
    const response = await fetch(url)
    const html = await response.text()
    const getMeta = (property: string): string | undefined => {
      const regex = new RegExp(
        `<meta[^>]*property=['"]og:${property}['"][^>]*content=['"]([^'"]*)['"][^>]*>`,
        'i'
      )
      const match = html.match(regex)
      return match ? match[1] : undefined
    }

    const title =
      getMeta('title') || html.match(/<title>([^<]*)<\/title>/i)?.[1] || ''
    const description = getMeta('description') || ''
    const image = getMeta('image')

    res.status(200).json({
      title,
      description,
      images: image ? [image] : []
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch metadata' })
  }
}
