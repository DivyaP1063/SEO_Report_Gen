import puppeteer, { Browser } from 'puppeteer'
import { 
  SEOReportData, 
  ReportGenerationOptions,
  TechnicalSEOData,
  ContentAuditData,
  KeywordsData,
  BacklinksData
} from './types/report-types'
import { ExecutiveSummaryGenerator } from './executive-summary-generator'
import { RecommendationsEngine } from './recommendations-engine'
import { HTMLReportTemplate } from './html-report-template'

export class SEOReportGenerator {
  /**
   * Generate complete SEO report from individual module data
   */
  static async generateCompleteReport(
    url: string,
    modules: {
      technicalSeo: TechnicalSEOData
      contentAudit: ContentAuditData
      keywords: KeywordsData
      backlinks: BacklinksData
    },
    options: ReportGenerationOptions = { format: 'pdf', includeCharts: true, includeTechnicalDetails: true }
  ): Promise<{ data: SEOReportData; html: string; pdf?: Buffer }> {
    
    console.log('[v0] Starting complete SEO report generation...')
    console.log('[v0] Modules structure check:', Object.keys(modules))
    
    // Extract domain from URL
    const domain = new URL(url).hostname
    
    // Generate executive summary
    console.log('[v0] Generating executive summary...')
    console.log('[v0] Technical SEO data structure:', JSON.stringify(modules.technicalSeo, null, 2))
    console.log('[v0] Content Audit data structure:', JSON.stringify(modules.contentAudit, null, 2))
    const executiveSummary = ExecutiveSummaryGenerator.generate({
      ...modules,
      url
    })
    
    // Generate recommendations
    console.log('[v0] Generating recommendations...')
    const recommendations = RecommendationsEngine.generate({
      ...modules,
      url
    })
    
    // Compile complete report data
    const reportData: SEOReportData = {
      url,
      domain,
      analyzedAt: new Date().toISOString(),
      technicalSeo: modules.technicalSeo,
      contentAudit: modules.contentAudit,
      keywords: modules.keywords,
      backlinks: modules.backlinks,
      executiveSummary,
      recommendations
    }
    
    // Generate HTML report
    console.log('[v0] Generating HTML report...')
    const html = HTMLReportTemplate.generate(reportData)
    
    let pdf: Buffer | undefined
    
    // Generate PDF if requested
    if (options.format === 'pdf') {
      console.log('[v0] Converting to PDF...')
      pdf = await this.generatePDF(html, options)
    }
    
    console.log('[v0] SEO report generation completed!')
    
    return {
      data: reportData,
      html,
      pdf
    }
  }
  
  /**
   * Generate PDF from HTML using Puppeteer
   */
  private static async generatePDF(
    html: string, 
    options: ReportGenerationOptions
  ): Promise<Buffer> {
    let browser: Browser | null = null
    
    try {
      console.log('[v0] Launching browser for PDF generation...')
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
      
      const page = await browser.newPage()
      
      // Set content
      await page.setContent(html, { 
        waitUntil: 'networkidle0',
        timeout: 30000
      })
      
      // Wait for charts to render
      if (options.includeCharts) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
      
      // Generate PDF
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        },
        displayHeaderFooter: true,
        headerTemplate: `
          <div style="font-size: 10px; color: #666; text-align: center; width: 100%;">
            SEO Analysis Report
          </div>
        `,
        footerTemplate: `
          <div style="font-size: 10px; color: #666; text-align: center; width: 100%;">
            <span class="pageNumber"></span> of <span class="totalPages"></span>
          </div>
        `
      })
      
      console.log('[v0] PDF generated successfully')
      return pdf as Buffer
      
    } catch (error) {
      console.error('[v0] Error generating PDF:', error)
      throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      if (browser) {
        await browser.close()
      }
    }
  }
  
  /**
   * Save report files to disk
   */
  static async saveReportFiles(
    reportResult: { data: SEOReportData; html: string; pdf?: Buffer },
    outputDir: string = './reports'
  ): Promise<{ htmlPath: string; pdfPath?: string; jsonPath: string }> {
    const fs = await import('fs/promises')
    const path = await import('path')
    
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true })
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const domain = reportResult.data.domain.replace(/[^a-zA-Z0-9]/g, '-')
    const baseFileName = `seo-report-${domain}-${timestamp}`
    
    // Save HTML file
    const htmlPath = path.join(outputDir, `${baseFileName}.html`)
    await fs.writeFile(htmlPath, reportResult.html, 'utf-8')
    
    // Save JSON data
    const jsonPath = path.join(outputDir, `${baseFileName}.json`)
    await fs.writeFile(jsonPath, JSON.stringify(reportResult.data, null, 2), 'utf-8')
    
    let pdfPath: string | undefined
    
    // Save PDF file if available
    if (reportResult.pdf) {
      pdfPath = path.join(outputDir, `${baseFileName}.pdf`)
      await fs.writeFile(pdfPath, reportResult.pdf)
    }
    
    console.log('[v0] Report files saved:', { htmlPath, pdfPath, jsonPath })
    
    return { htmlPath, pdfPath, jsonPath }
  }
  
  /**
   * Get report summary statistics
   */
  static getReportSummary(reportData: SEOReportData): {
    overallScore: number
    moduleScores: Record<string, number>
    criticalIssues: number
    recommendations: number
  } {
    const techScore = (
      reportData.technicalSeo.performanceScore +
      reportData.technicalSeo.seoScore +
      reportData.technicalSeo.accessibilityScore +
      reportData.technicalSeo.bestPracticesScore
    ) / 4
    
    const contentScore = (
      reportData.contentAudit.metadataCompleteness.titleTags.percentage +
      reportData.contentAudit.metadataCompleteness.metaDescriptions.percentage +
      reportData.contentAudit.metadataCompleteness.h1Tags.percentage
    ) / 3
    
    const keywordScore = Math.min(reportData.keywords.distribution.top10.percentage * 2, 100)
    const backlinkScore = Math.min(reportData.backlinks.domainRating, 100)
    
    const overallScore = (techScore + contentScore + keywordScore + backlinkScore) / 4
    
    const criticalIssues = [
      ...reportData.technicalSeo.issues.filter(i => i.type === 'error'),
      ...reportData.contentAudit.issues.filter(i => i.type === 'error')
    ].length
    
    return {
      overallScore: Math.round(overallScore),
      moduleScores: {
        technical: Math.round(techScore),
        content: Math.round(contentScore),
        keywords: Math.round(keywordScore),
        backlinks: Math.round(backlinkScore)
      },
      criticalIssues,
      recommendations: reportData.recommendations?.length || 0
    }
  }
}
