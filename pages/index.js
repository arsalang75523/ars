import { Hono } from 'hono'
import { request, gql } from 'graphql-request'
import { serve } from '@hono/node-server'

const app = new Hono()

async function getMoxieStatus(fid = "602") {
  const query = gql`
    query MoxieStatus {
      FarcasterMoxieClaimDetails(
        input: { filter: { fid: { _eq: "${fid}" } }, blockchain: ALL }
      ) {
        FarcasterMoxieClaimDetails {
          availableClaimAmount
          claimedAmount
          processingAmount
        }
      }
    }
  `
  const endpoint = 'https://api.airstack.xyz/gql' // این باید درست باشه
  const headers = { Authorization: process.env.AIRSTACK_API_KEY || "" }

  try {
    const data = await request(endpoint, query, {}, headers)
    const details = data.FarcasterMoxieClaimDetails.FarcasterMoxieClaimDetails[0] || {}
    return {
      claimable: details.availableClaimAmount || 0,
      claimed: details.claimedAmount || 0,
      processing: details.processingAmount || 0,
    }
  } catch (error) {
    console.error("Error fetching Moxie status:", error)
    throw error
  }
}

app.get('/', async (c) => {
  const fid = c.req.query('fid') || "602"
  const moxieStatus = await getMoxieStatus(fid)
  const imageText = `
    Moxie Status:
    Claimable: ${moxieStatus.claimable.toFixed(2)} MOXIE
    Claimed: ${moxieStatus.claimed.toFixed(2)} MOXIE
    Processing: ${moxieStatus.processing.toFixed(2)} MOXIE
  `
  const imageUrl = `https://via.placeholder.com/600x400.png?text=${encodeURIComponent(imageText)}`

  return c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="og:image" content="${imageUrl}">
        <meta property="fc:frame" content="vNext">
        <meta property="fc:frame:image" content="${imageUrl}">
        <meta property="fc:frame:button:1" content="Refresh">
        <meta property="fc:frame:button:1:action" content="post">
        <meta property="fc:frame:button:1:target" content="${c.req.url}">
      </head>
      <body>
        <h1>Moxie Status for FID: ${fid}</h1>
        <p>${imageText.replace(/\n/g, '<br>')}</p>
      </body>
    </html>
  `)
})

serve(app, () => console.log('Server running'))