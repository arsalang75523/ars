import { request, gql } from 'graphql-request'

async function getMoxieStatus(fid = "602") {
  console.log('در حال گرفتن داده‌ها برای FID:', fid);
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
  const endpoint = 'https://api.airstack.xyz/gql'
  const headers = { Authorization:process.env.AIRSTACK_API_KEY = "13827f8b8c521443da97ed54d4d6a891d" }

  try {
    const data = await request(endpoint, query, {}, headers)
    console.log("داده‌ها گرفته شد:", data);
    const details = data.FarcasterMoxieClaimDetails.FarcasterMoxieClaimDetails[0] || {}
    return {
      claimable: details.availableClaimAmount || 0,
      claimed: details.claimedAmount || 0,
      processing: details.processingAmount || 0,
    }
  } catch (error) {
    console.error("خطا در گرفتن داده‌ها:", error);
    return { claimable: 0, claimed: 0, processing: 0 }
  }
}

export default async function handler(req, res) {
  const fid = req.query.fid || "602"
  const moxieStatus = await getMoxieStatus(fid)
  res.status(200).json(moxieStatus)
}