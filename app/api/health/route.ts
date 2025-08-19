import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        pageSpeed: 'checking...',
        serpApi: 'checking...',
        scaleSerp: 'checking...',
        contentAudit: 'operational'
      }
    }

    // Quick PageSpeed API check
    try {
      const testUrl = 'https://www.pagespeed.web.dev/api/pagespeedonline/v5/runPagespeed?url=https://example.com&strategy=mobile'
      const response = await fetch(testUrl, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(5000) 
      })
      healthCheck.services.pageSpeed = response.status === 200 || response.status === 429 ? 'operational' : 'degraded'
    } catch {
      healthCheck.services.pageSpeed = 'unavailable'
    }

    // Check API keys
    healthCheck.services.serpApi = process.env.SERP_API_KEY ? 'configured' : 'missing-key'
    healthCheck.services.scaleSerp = process.env.SCALESERP_API_KEY ? 'configured' : 'missing-key'

    return NextResponse.json(healthCheck)
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    )
  }
}
