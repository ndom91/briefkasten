export default async function handler(req, res) {
  /* const { searchParams } = new URL(req.url) // edge-runtime */
  /* const url = searchParams.get('url') */
  const url = req.query.url
  if (url) {
    const decodedUrl = decodeURIComponent(url)
    const result = await fetch(decodedUrl)
    const buffer = await result.blob()
    /* return new Response(buffer, { */
    /*   status: 200, */
    /*   headers: { */
    /*     'Content-Type': result.headers.get('content-type') ?? 'image/png', */
    /*   }, */
    /* }) */
    return res.status(200).send(buffer)
  }
  return res.status(400).json({
    error: `No URL provided`,
  })
  /* return new Response(JSON.stringify({ error: 'no URL provided' }), { */
  /*   status: 400, */
  /*   headers: { */
  /*     'content-type': 'application/json', */
  /*   }, */
  /* }) */
}

/* export const config = { */
/*   runtime: 'experimental-edge', */
/* } */
