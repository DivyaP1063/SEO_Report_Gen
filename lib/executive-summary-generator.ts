import { 
  SEOReportData, 
  ExecutiveSummary, 
  TechnicalSEOData, 
  ContentAuditData, 
  KeywordsData, 
  BacklinksData 
} from './types/report-types'

export class ExecutiveSummaryGenerator {
  static generate(data: {
    technicalSeo: TechnicalSEOData
    contentAudit: ContentAuditData
    keywords: KeywordsData
    backlinks: BacklinksData
    url: string
  }): ExecutiveSummary {
    const overallHealth = this.calculateOverallHealth(data)
    const quickWins = this.identifyQuickWins(data)
    const urgentIssues = this.identifyUrgentIssues(data)
    const trafficStatus = this.analyzeTrafficStatus(data)
    const competitivePosition = this.assessCompetitivePosition(data)

    return {
      overallHealth,
      currentRanking: {
        keywordsInTop10: data.keywords.distribution.top10.count,
        estimatedTraffic: data.keywords.organicTraffic.estimated,
        domainAuthority: data.backlinks.domainRating
      },
      quickWins,
      urgentIssues,
      trafficStatus,
      competitivePosition
    }
  }

  private static calculateOverallHealth(data: any): "excellent" | "good" | "fair" | "poor" {
    console.log('[v0] calculateOverallHealth - Full data structure:', JSON.stringify(data, null, 2))
    console.log('[v0] calculateOverallHealth - technicalSeo exists?', !!data.technicalSeo)
    console.log('[v0] calculateOverallHealth - contentAudit exists?', !!data.contentAudit)
    
    if (!data.technicalSeo) {
      console.error('[v0] ERROR: technicalSeo is missing from data!')
      return "poor"
    }
    
    if (!data.contentAudit) {
      console.error('[v0] ERROR: contentAudit is missing from data!')
      return "poor"
    }
    
    const techScore = data.technicalSeo.performanceScore
    const seoScore = data.technicalSeo.seoScore
    const metadataCompleteness = (
      data.contentAudit.metadataCompleteness.titleTags.percentage +
      data.contentAudit.metadataCompleteness.metaDescriptions.percentage
    ) / 2

    const averageScore = (techScore + seoScore + metadataCompleteness) / 3

    if (averageScore >= 85) return "excellent"
    if (averageScore >= 70) return "good"
    if (averageScore >= 50) return "fair"
    return "poor"
  }

  private static identifyQuickWins(data: any): string[] {
    const wins: string[] = []

    // Technical quick wins
    if (data.technicalSeo.coreWebVitals.cls.score === "good") {
      wins.push("✅ Excellent layout stability (CLS score)")
    }
    
    if (data.technicalSeo.seoScore >= 90) {
      wins.push("✅ Strong SEO foundation in place")
    }

    // Content quick wins
    if (data.contentAudit.contentMetrics.averageWordCount > 800) {
      wins.push("✅ Good content depth with adequate word count")
    }

    if (data.contentAudit.metadataCompleteness.titleTags.percentage > 80) {
      wins.push("✅ Most pages have proper title tags")
    }

    // Keywords quick wins
    if (data.keywords.distribution.top10.percentage >= 30) {
      wins.push("✅ Strong keyword rankings in top 10 positions")
    }

    // Backlinks quick wins
    if (data.backlinks.referringDomainsGrowth.change > 0) {
      wins.push("✅ Positive backlink growth trend")
    }

    if (data.backlinks.domainRating > 70) {
      wins.push("✅ High domain authority")
    }

    return wins.slice(0, 5) // Limit to top 5 quick wins
  }

  private static identifyUrgentIssues(data: any): string[] {
    const issues: string[] = []

    // Technical urgent issues
    if (data.technicalSeo.performanceScore < 50) {
      issues.push("🚨 Poor performance score - immediate optimization needed")
    }

    if (data.technicalSeo.coreWebVitals.lcp.score === "poor") {
      issues.push("🚨 Slow page loading speed (LCP > 4s)")
    }

    // Content urgent issues
    if (data.contentAudit.metadataCompleteness.titleTags.percentage < 50) {
      issues.push("🚨 Many pages missing title tags")
    }

    if (data.contentAudit.metadataCompleteness.metaDescriptions.percentage < 50) {
      issues.push("🚨 Many pages missing meta descriptions")
    }

    if (data.contentAudit.metadataCompleteness.h1Tags.percentage < 30) {
      issues.push("🚨 Most pages lack proper H1 headings")
    }

    // Keywords urgent issues
    if (data.keywords.distribution.top10.percentage < 10) {
      issues.push("🚨 Very few keywords ranking in top 10")
    }

    // Backlinks urgent issues
    if (data.backlinks.referringDomainsGrowth.change < -10) {
      issues.push("🚨 Significant backlink loss detected")
    }

    return issues.slice(0, 5) // Limit to top 5 urgent issues
  }

  private static analyzeTrafficStatus(data: any): "increasing" | "stable" | "decreasing" {
    const trafficChange = data.keywords.organicTraffic.change
    if (trafficChange > 5) return "increasing"
    if (trafficChange < -5) return "decreasing"
    return "stable"
  }

  private static assessCompetitivePosition(data: any): "strong" | "moderate" | "weak" {
    const domainRating = data.backlinks.domainRating
    const top10Keywords = data.keywords.distribution.top10.percentage
    const overallScore = (domainRating + top10Keywords) / 2

    if (overallScore >= 70) return "strong"
    if (overallScore >= 40) return "moderate"
    return "weak"
  }
}
