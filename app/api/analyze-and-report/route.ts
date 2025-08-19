import { type NextRequest, NextResponse } from "next/server"
import { SEOReportGenerator } from "@/lib/seo-report-generator"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    console.log(`Starting complete SEO analysis and report generation for: ${url}`)

    // Run all analysis modules in parallel
    const [technicalSeoResponse, contentAuditResponse, keywordsResponse, backlinksResponse] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/analyze/technical-seo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      }),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/analyze/content-audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      }),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/analyze/keywords`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      }),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/analyze/backlinks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
    ])

    // Check if all requests were successful
    if (!technicalSeoResponse.ok || !contentAuditResponse.ok || !keywordsResponse.ok || !backlinksResponse.ok) {
      const errors = []
      if (!technicalSeoResponse.ok) errors.push(`Technical SEO: ${technicalSeoResponse.status}`)
      if (!contentAuditResponse.ok) errors.push(`Content Audit: ${contentAuditResponse.status}`)
      if (!keywordsResponse.ok) errors.push(`Keywords: ${keywordsResponse.status}`)
      if (!backlinksResponse.ok) errors.push(`Backlinks: ${backlinksResponse.status}`)
      
      return NextResponse.json({ 
        error: "One or more analysis modules failed", 
        details: errors 
      }, { status: 500 })
    }

    // Parse the analysis results
    const technicalSeoData = await technicalSeoResponse.json()
    const contentAuditData = await contentAuditResponse.json()
    const keywordsData = await keywordsResponse.json()
    const backlinksData = await backlinksResponse.json()

    console.log('All analysis modules completed successfully')

    // Generate the complete report
    const result = await SEOReportGenerator.generateCompleteReport(
      url,
      {
        technicalSeo: technicalSeoData,
        contentAudit: contentAuditData,
        keywords: keywordsData,
        backlinks: backlinksData
      },
      { 
        format: 'pdf', 
        includeCharts: true, 
        includeTechnicalDetails: true 
      }
    )

    console.log('Report generation completed successfully')

    // Return the complete analysis and report
    return NextResponse.json({
      success: true,
      url,
      domain: new URL(url).hostname,
      analyzedAt: result.data.analyzedAt,
      
      // Individual module results
      modules: {
        technicalSeo: { data: technicalSeoData },
        contentAudit: { data: contentAuditData },
        keywords: { data: keywordsData },
        backlinks: { data: backlinksData }
      },
      
      // Complete report data
      report: {
        data: result.data,
        htmlContent: result.html,
        pdfGenerated: !!result.pdf,
        executiveSummary: result.data.executiveSummary,
        recommendations: result.data.recommendations
      }
    })

  } catch (error) {
    console.error("Complete analysis and report generation error:", error)
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    const errorStack = error instanceof Error ? error.stack : undefined
    
    return NextResponse.json({
      error: "Failed to complete analysis and generate report",
      message: errorMessage,
      ...(process.env.NODE_ENV === 'development' && { stack: errorStack })
    }, { status: 500 })
  }
}

// GET endpoint for checking status or retrieving saved reports
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  
  if (!url) {
    return NextResponse.json({ 
      error: "URL parameter is required for report retrieval" 
    }, { status: 400 })
  }

  try {
    // This could be extended to check for cached/saved reports
    return NextResponse.json({
      message: "Report retrieval endpoint",
      url,
      note: "Use POST method to generate a new report"
    })
  } catch (error) {
    console.error("Report retrieval error:", error)
    return NextResponse.json({ error: "Failed to retrieve report" }, { status: 500 })
  }
}
