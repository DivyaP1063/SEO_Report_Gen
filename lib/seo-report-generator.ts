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
    options: ReportGenerationOptions = { format: 'html', includeCharts: true, includeTechnicalDetails: true }
  ): Promise<{ data: SEOReportData; html: string }> {
    
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
    
    console.log('[v0] SEO HTML report generation completed!')
    
    return {
      data: reportData,
      html
    }
  }
  
  /**
   * Save report files to disk (HTML only)
   */
  static async saveReportFiles(
    reportResult: { data: SEOReportData; html: string },
    outputDir: string = './reports'
  ): Promise<{ htmlPath: string; jsonPath: string }> {
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
    
    console.log('[v0] Report files saved:', { htmlPath, jsonPath })
    
    return { htmlPath, jsonPath }
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
