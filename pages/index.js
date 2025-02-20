export default function Home({ fid, moxieStatus }) {
    const imageText = `
      Moxie Status:
      Claimable: ${moxieStatus.claimable.toFixed(2)} MOXIE
      Claimed: ${moxieStatus.claimed.toFixed(2)} MOXIE
      Processing: ${moxieStatus.processing.toFixed(2)} MOXIE
    `
  
    return (
      <html>
        <head>
          <meta property="og:image" content={`https://via.placeholder.com/600x400.png?text=${encodeURIComponent(imageText)}`} />
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content={`https://via.placeholder.com/600x400.png?text=${encodeURIComponent(imageText)}`} />
          <meta property="fc:frame:button:1" content="Refresh" />
          <meta property="fc:frame:button:1:action" content="post" />
          <meta property="fc:frame:button:1:target" content={`${process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:3000'}`} />
        </head>
        <body>
          <h1>Moxie Status for FID: {fid}</h1>
          <p>{imageText.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}</p>
        </body>
      </html>
    )
  }
  
  export async function getServerSideProps({ query }) {
    const fid = query.fid || "602"
    const res = await fetch(`http://localhost:3000/api/moxie?fid=${fid}`, {
      method: 'GET',
    })
  
    if (!res.ok) {
      console.error("خطا در پاسخ API:", await res.text())
      return {
        props: {
          fid,
          moxieStatus: { claimable: 0, claimed: 0, processing: 0 },
        },
      }
    }
  
    const moxieStatus = await res.json()
  
    return {
      props: {
        fid,
        moxieStatus,
      },
    }
  } 
  