import { type NextRequest, NextResponse } from "next/server"
import { SEOReportGenerator } from "@/lib/seo-report-generator"
import { TechnicalSEOData, ContentAuditData, KeywordsData, BacklinksData } from "@/lib/types/report-types"

// Input interface for API requests
interface ReportRequestData {
  url: string
  technicalSeo: TechnicalSEOData
  contentAudit: ContentAuditData
  keywords: KeywordsData
  backlinks: BacklinksData
}

export async function POST(request: NextRequest) {
  try {
    const requestData: ReportRequestData = await request.json()

    if (!requestData.url) {
      return NextResponse.json({ error: "URL is required in request data" }, { status: 400 })
    }

    // Validate that we have the required module data
    if (!requestData.technicalSeo || !requestData.contentAudit || !requestData.keywords || !requestData.backlinks) {
      return NextResponse.json({ 
        error: "All module data is required (technicalSeo, contentAudit, keywords, backlinks)" 
      }, { status: 400 })
    }

    // Generate the complete report using static method (HTML only)
    const result = await SEOReportGenerator.generateCompleteReport(
      requestData.url,
      {
        technicalSeo: requestData.technicalSeo,
        contentAudit: requestData.contentAudit,
        keywords: requestData.keywords,
        backlinks: requestData.backlinks
      },
      { 
        format: 'html', 
        includeCharts: true, 
        includeTechnicalDetails: true 
      }
    )

    // Extract domain for response metadata
    const domain = new URL(requestData.url).hostname

    // Return the generated HTML report data
    return NextResponse.json({
      success: true,
      reportData: result.data,
      htmlContent: result.html,
      metadata: {
        generatedAt: result.data.analyzedAt,
        domain,
        url: requestData.url,
        executiveSummary: result.data.executiveSummary,
        recommendations: result.data.recommendations
      }
    })

  } catch (error) {
    console.error("Report generation error:", error)
    
    // Return detailed error information
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    const errorStack = error instanceof Error ? error.stack : undefined
    
    return NextResponse.json({
      error: "Failed to generate report",
      message: errorMessage,
      ...(process.env.NODE_ENV === 'development' && { stack: errorStack })
    }, { status: 500 })
  }
}

// Alternative endpoint for HTML download
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const domain = searchParams.get('domain')
  const date = searchParams.get('date')
  
  if (!domain || !date) {
    return NextResponse.json({ error: "Domain and date parameters are required" }, { status: 400 })
  }

  try {
    // This would typically retrieve a saved HTML file
    // For now, return a placeholder response
    return NextResponse.json({
      message: "HTML download endpoint",
      downloadUrl: `seo-report-${domain}-${date}.html`,
      note: "HTML report generation is available through the POST endpoint"
    })
  } catch (error) {
    console.error("HTML download error:", error)
    return NextResponse.json({ error: "Failed to retrieve HTML report" }, { status: 500 })
  }
}
