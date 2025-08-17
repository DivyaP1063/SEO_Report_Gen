import { type NextRequest, NextResponse } from "next/server"

interface ReportData {
  url: string
  domain: string
  analysisDate: string
  overallScore: number
  technicalSEO?: {
    coreWebVitals: {
      lcp: { value: string; score: "good" | "needs-improvement" | "poor" }
      cls: { value: string; score: "good" | "needs-improvement" | "poor" }
      fid: { value: string; score: "good" | "needs-improvement" | "poor" }
    }
    performanceScore: number
    seoScore: number
    accessibilityScore: number
    bestPracticesScore: number
    issues: Array<{
      type: "error" | "warning" | "info"
      title: string
      description: string
      impact: "high" | "medium" | "low"
    }>
  }
  contentAudit?: {
    totalPages: number
    indexedPages: number
    metadataCompleteness: {
      titleTags: { count: number; percentage: number }
      metaDescriptions: { count: number; percentage: number }
      h1Tags: { count: number; percentage: number }
    }
    contentMetrics: {
      averageWordCount: number
      pagesWithCTAs: { count: number; percentage: number }
      contentFreshness: { fresh: number; stale: number }
    }
    issues: Array<{
      type: "error" | "warning" | "info"
      title: string
      description: string
      affectedPages: number
    }>
  }
}

function generateReportHTML(data: ReportData): string {
  const getScoreColor = (score: number): string => {
    if (score >= 90) return "#16a34a" // green-600
    if (score >= 70) return "#ca8a04" // yellow-600
    return "#dc2626" // red-600
  }

  const getCoreWebVitalColor = (score: "good" | "needs-improvement" | "poor"): string => {
    switch (score) {
      case "good":
        return "#16a34a"
      case "needs-improvement":
        return "#ca8a04"
      case "poor":
        return "#dc2626"
      default:
        return "#6b7280"
    }
  }

  const getContentScoreColor = (percentage: number): string => {
    if (percentage >= 90) return "#16a34a"
    if (percentage >= 70) return "#ca8a04"
    return "#dc2626"
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SEO Report - ${data.domain}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #1f2937;
          background: #ffffff;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 3px solid #6366f1;
        }
        
        .header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #374151;
          margin-bottom: 10px;
        }
        
        .header .subtitle {
          font-size: 1.2rem;
          color: #6b7280;
          margin-bottom: 10px;
        }
        
        .header .url {
          font-size: 1rem;
          color: #6366f1;
          font-weight: 600;
        }
        
        .header .date {
          font-size: 0.9rem;
          color: #9ca3af;
          margin-top: 10px;
        }
        
        .section {
          margin-bottom: 40px;
          background: #f8fafc;
          padding: 30px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }
        
        .section h2 {
          font-size: 1.8rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .section h3 {
          font-size: 1.3rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 15px;
          margin-top: 25px;
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
          margin-bottom: 25px;
        }
        
        .metric-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .metric-value {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 5px;
        }
        
        .metric-label {
          font-size: 0.9rem;
          color: #6b7280;
          font-weight: 500;
        }
        
        .metric-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-top: 8px;
        }
        
        .badge-good {
          background: #dcfce7;
          color: #166534;
        }
        
        .badge-warning {
          background: #fef3c7;
          color: #92400e;
        }
        
        .badge-error {
          background: #fee2e2;
          color: #991b1b;
        }
        
        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
          margin: 10px 0;
        }
        
        .progress-fill {
          height: 100%;
          transition: width 0.3s ease;
        }
        
        .issues-list {
          list-style: none;
          margin-top: 20px;
        }
        
        .issue-item {
          background: white;
          padding: 15px;
          margin-bottom: 10px;
          border-radius: 6px;
          border-left: 4px solid #6b7280;
        }
        
        .issue-error {
          border-left-color: #dc2626;
        }
        
        .issue-warning {
          border-left-color: #ca8a04;
        }
        
        .issue-info {
          border-left-color: #2563eb;
        }
        
        .issue-title {
          font-weight: 600;
          margin-bottom: 5px;
        }
        
        .issue-description {
          color: #6b7280;
          font-size: 0.9rem;
        }
        
        .recommendations {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
          padding: 20px;
          margin-top: 30px;
        }
        
        .recommendations h3 {
          color: #1e40af;
          margin-bottom: 15px;
        }
        
        .recommendations ul {
          list-style-type: disc;
          margin-left: 20px;
        }
        
        .recommendations li {
          margin-bottom: 8px;
          color: #374151;
        }
        
        .footer {
          text-align: center;
          margin-top: 50px;
          padding-top: 30px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 0.9rem;
        }
        
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .section {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>SEO Analysis Report</h1>
          <div class="subtitle">Comprehensive Website Analysis</div>
          <div class="url">${data.url}</div>
          <div class="date">Generated on ${data.analysisDate}</div>
        </div>

        <!-- Executive Summary -->
        <div class="section">
          <h2>📊 Executive Summary</h2>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-value" style="color: ${getScoreColor(data.overallScore)}">${data.overallScore}</div>
              <div class="metric-label">Overall SEO Score</div>
              <div class="metric-badge ${data.overallScore >= 90 ? "badge-good" : data.overallScore >= 70 ? "badge-warning" : "badge-error"}">
                ${data.overallScore >= 90 ? "Excellent" : data.overallScore >= 70 ? "Good" : "Needs Work"}
              </div>
            </div>
            ${
              data.technicalSEO
                ? `
            <div class="metric-card">
              <div class="metric-value" style="color: ${getScoreColor(data.technicalSEO.performanceScore)}">${data.technicalSEO.performanceScore}</div>
              <div class="metric-label">Performance Score</div>
            </div>
            <div class="metric-card">
              <div class="metric-value" style="color: ${getScoreColor(data.technicalSEO.seoScore)}">${data.technicalSEO.seoScore}</div>
              <div class="metric-label">SEO Score</div>
            </div>
            <div class="metric-card">
              <div class="metric-value" style="color: ${getScoreColor(data.technicalSEO.accessibilityScore)}">${data.technicalSEO.accessibilityScore}</div>
              <div class="metric-label">Accessibility</div>
            </div>
            `
                : ""
            }
          </div>
        </div>

        ${
          data.technicalSEO
            ? `
        <!-- Technical SEO -->
        <div class="section">
          <h2>⚡ Technical SEO Analysis</h2>
          
          <h3>Core Web Vitals</h3>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-value" style="color: ${getCoreWebVitalColor(data.technicalSEO.coreWebVitals.lcp.score)}">${data.technicalSEO.coreWebVitals.lcp.value}</div>
              <div class="metric-label">Largest Contentful Paint</div>
              <div class="metric-badge ${data.technicalSEO.coreWebVitals.lcp.score === "good" ? "badge-good" : data.technicalSEO.coreWebVitals.lcp.score === "needs-improvement" ? "badge-warning" : "badge-error"}">
                ${data.technicalSEO.coreWebVitals.lcp.score.replace("-", " ")}
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-value" style="color: ${getCoreWebVitalColor(data.technicalSEO.coreWebVitals.cls.score)}">${data.technicalSEO.coreWebVitals.cls.value}</div>
              <div class="metric-label">Cumulative Layout Shift</div>
              <div class="metric-badge ${data.technicalSEO.coreWebVitals.cls.score === "good" ? "badge-good" : data.technicalSEO.coreWebVitals.cls.score === "needs-improvement" ? "badge-warning" : "badge-error"}">
                ${data.technicalSEO.coreWebVitals.cls.score.replace("-", " ")}
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-value" style="color: ${getCoreWebVitalColor(data.technicalSEO.coreWebVitals.fid.score)}">${data.technicalSEO.coreWebVitals.fid.value}</div>
              <div class="metric-label">First Input Delay</div>
              <div class="metric-badge ${data.technicalSEO.coreWebVitals.fid.score === "good" ? "badge-good" : data.technicalSEO.coreWebVitals.fid.score === "needs-improvement" ? "badge-warning" : "badge-error"}">
                ${data.technicalSEO.coreWebVitals.fid.score.replace("-", " ")}
              </div>
            </div>
          </div>

          ${
            data.technicalSEO.issues.length > 0
              ? `
          <h3>Technical Issues</h3>
          <ul class="issues-list">
            ${data.technicalSEO.issues
              .map(
                (issue) => `
              <li class="issue-item issue-${issue.type}">
                <div class="issue-title">${issue.title}</div>
                <div class="issue-description">${issue.description}</div>
              </li>
            `,
              )
              .join("")}
          </ul>
          `
              : ""
          }
        </div>
        `
            : ""
        }

        ${
          data.contentAudit
            ? `
        <!-- Content Audit -->
        <div class="section">
          <h2>📝 Content Audit Results</h2>
          
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-value" style="color: #6366f1">${data.contentAudit.indexedPages}</div>
              <div class="metric-label">Indexed Pages</div>
              <div style="font-size: 0.8rem; color: #6b7280; margin-top: 5px;">of ${data.contentAudit.totalPages} total</div>
            </div>
            <div class="metric-card">
              <div class="metric-value" style="color: #6366f1">${data.contentAudit.contentMetrics.averageWordCount}</div>
              <div class="metric-label">Avg. Words per Page</div>
            </div>
            <div class="metric-card">
              <div class="metric-value" style="color: ${getContentScoreColor(data.contentAudit.contentMetrics.pagesWithCTAs.percentage)}">${data.contentAudit.contentMetrics.pagesWithCTAs.percentage}%</div>
              <div class="metric-label">Pages with CTAs</div>
            </div>
          </div>

          <h3>Metadata Completeness</h3>
          <div style="margin-bottom: 20px;">
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Title Tags</span>
                <span style="color: ${getContentScoreColor(data.contentAudit.metadataCompleteness.titleTags.percentage)}; font-weight: 600;">${data.contentAudit.metadataCompleteness.titleTags.percentage}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${data.contentAudit.metadataCompleteness.titleTags.percentage}%; background: ${getContentScoreColor(data.contentAudit.metadataCompleteness.titleTags.percentage)};"></div>
              </div>
              <div style="font-size: 0.8rem; color: #6b7280;">${data.contentAudit.metadataCompleteness.titleTags.count} of ${data.contentAudit.indexedPages} pages</div>
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Meta Descriptions</span>
                <span style="color: ${getContentScoreColor(data.contentAudit.metadataCompleteness.metaDescriptions.percentage)}; font-weight: 600;">${data.contentAudit.metadataCompleteness.metaDescriptions.percentage}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${data.contentAudit.metadataCompleteness.metaDescriptions.percentage}%; background: ${getContentScoreColor(data.contentAudit.metadataCompleteness.metaDescriptions.percentage)};"></div>
              </div>
              <div style="font-size: 0.8rem; color: #6b7280;">${data.contentAudit.metadataCompleteness.metaDescriptions.count} of ${data.contentAudit.indexedPages} pages</div>
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>H1 Tags</span>
                <span style="color: ${getContentScoreColor(data.contentAudit.metadataCompleteness.h1Tags.percentage)}; font-weight: 600;">${data.contentAudit.metadataCompleteness.h1Tags.percentage}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${data.contentAudit.metadataCompleteness.h1Tags.percentage}%; background: ${getContentScoreColor(data.contentAudit.metadataCompleteness.h1Tags.percentage)};"></div>
              </div>
              <div style="font-size: 0.8rem; color: #6b7280;">${data.contentAudit.metadataCompleteness.h1Tags.count} of ${data.contentAudit.indexedPages} pages</div>
            </div>
          </div>

          ${
            data.contentAudit.issues.length > 0
              ? `
          <h3>Content Issues</h3>
          <ul class="issues-list">
            ${data.contentAudit.issues
              .map(
                (issue) => `
              <li class="issue-item issue-${issue.type}">
                <div class="issue-title">${issue.title}</div>
                <div class="issue-description">${issue.description}</div>
              </li>
            `,
              )
              .join("")}
          </ul>
          `
              : ""
          }
        </div>
        `
            : ""
        }

        <!-- Recommendations -->
        <div class="recommendations">
          <h3>🎯 Key Recommendations</h3>
          <ul>
            ${data.overallScore < 70 ? "<li>Focus on improving overall SEO fundamentals - technical performance, content quality, and metadata optimization</li>" : ""}
            ${data.technicalSEO && data.technicalSEO.performanceScore < 80 ? "<li>Optimize page loading speed by compressing images, minifying CSS/JS, and leveraging browser caching</li>" : ""}
            ${data.contentAudit && data.contentAudit.metadataCompleteness.metaDescriptions.percentage < 90 ? "<li>Add compelling meta descriptions to all pages to improve click-through rates from search results</li>" : ""}
            ${data.contentAudit && data.contentAudit.contentMetrics.pagesWithCTAs.percentage < 70 ? "<li>Include clear calls-to-action on more pages to improve user engagement and conversions</li>" : ""}
            ${data.technicalSEO && data.technicalSEO.accessibilityScore < 90 ? "<li>Improve website accessibility by adding alt text to images and ensuring proper color contrast</li>" : ""}
            <li>Monitor SEO performance regularly and track improvements over time</li>
            <li>Consider implementing structured data markup to enhance search result appearance</li>
          </ul>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>This report was generated by SEO Report Generator</p>
          <p>For questions or support, please contact your SEO specialist</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export async function POST(request: NextRequest) {
  try {
    const reportData: ReportData = await request.json()

    if (!reportData.url) {
      return NextResponse.json({ error: "Report data is required" }, { status: 400 })
    }

    // Generate HTML report
    const htmlContent = generateReportHTML(reportData)

    // For demo purposes, we'll return the HTML content
    // In production, you would use Puppeteer to generate PDF
    try {
      // Uncomment this section when you have Puppeteer properly configured
      /*
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
      
      const page = await browser.newPage()
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' })
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        }
      })
      
      await browser.close()

      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="seo-report-${reportData.domain}-${new Date().toISOString().split('T')[0]}.pdf"`
        }
      })
      */

      // For now, return HTML content that can be used for preview or client-side PDF generation
      return NextResponse.json({
        success: true,
        htmlContent,
        downloadUrl: `/api/download-report?domain=${encodeURIComponent(reportData.domain)}&date=${new Date().toISOString().split("T")[0]}`,
      })
    } catch (pdfError) {
      console.error("PDF generation error:", pdfError)

      // Fallback: return HTML content
      return NextResponse.json({
        success: true,
        htmlContent,
        message: "PDF generation unavailable, returning HTML report",
      })
    }
  } catch (error) {
    console.error("Report generation error:", error)
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 })
  }
}
