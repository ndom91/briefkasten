export default async function handler(req) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url')
  if (url) {
    const decodedUrl = decodeURIComponent(url)
    const result = await fetch(decodedUrl)
    const buffer = await result.blob()
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': result.headers.get('content-type') ?? 'image/jpeg',
      },
    })
  }
  return new Response(JSON.stringify({ error: 'no URL provided' }), {
    status: 400,
    headers: {
      'content-type': 'application/json',
    },
  })
}

export const config = {
  runtime: 'experimental-edge',
}
