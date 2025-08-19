import { Recommendation, SEOReportData, TechnicalSEOData, ContentAuditData, KeywordsData, BacklinksData } from './types/report-types'

export class RecommendationsEngine {
  static generate(data: {
    technicalSeo: TechnicalSEOData
    contentAudit: ContentAuditData
    keywords: KeywordsData
    backlinks: BacklinksData
    url: string
  }): Recommendation[] {
    const recommendations: Recommendation[] = []

    // Technical SEO recommendations
    recommendations.push(...this.generateTechnicalRecommendations(data.technicalSeo))
    
    // Content recommendations
    recommendations.push(...this.generateContentRecommendations(data.contentAudit))
    
    // Keywords recommendations
    recommendations.push(...this.generateKeywordRecommendations(data.keywords))
    
    // Backlinks recommendations
    recommendations.push(...this.generateBacklinkRecommendations(data.backlinks))

    // Sort by priority and return top 10
    return this.prioritizeRecommendations(recommendations).slice(0, 10)
  }

  private static generateTechnicalRecommendations(data: TechnicalSEOData): Recommendation[] {
    const recommendations: Recommendation[] = []

    // Performance optimizations
    if (data.performanceScore < 60) {
      recommendations.push({
        priority: "high",
        category: "technical",
        title: "Improve Page Performance",
        description: `Current performance score is ${data.performanceScore}/100. Optimize images, minify CSS/JS, and implement caching.`,
        estimatedImpact: "high",
        timeframe: "1-2 months",
        resources: ["Web developer", "Performance optimization tools", "CDN service"]
      })
    }

    // Core Web Vitals improvements
    if (data.coreWebVitals.lcp.score === "poor") {
      recommendations.push({
        priority: "high",
        category: "technical",
        title: "Fix Largest Contentful Paint (LCP)",
        description: `LCP is ${data.coreWebVitals.lcp.value}, which is poor. Optimize server response times and critical resources.`,
        estimatedImpact: "high",
        timeframe: "1-2 weeks",
        resources: ["Technical developer", "Server optimization", "Image optimization tools"]
      })
    }

    if (data.coreWebVitals.cls.score === "poor") {
      recommendations.push({
        priority: "medium",
        category: "technical",
        title: "Reduce Cumulative Layout Shift (CLS)",
        description: `CLS is ${data.coreWebVitals.cls.value}. Add size attributes to images and reserve space for dynamic content.`,
        estimatedImpact: "medium",
        timeframe: "1-2 weeks",
        resources: ["Frontend developer", "Design review"]
      })
    }

    // SEO score improvements
    if (data.seoScore < 80) {
      recommendations.push({
        priority: "medium",
        category: "technical",
        title: "Improve Technical SEO Score",
        description: "Address technical SEO issues like meta tags, structured data, and crawlability.",
        estimatedImpact: "medium",
        timeframe: "1-2 months",
        resources: ["SEO specialist", "Technical developer"]
      })
    }

    return recommendations
  }

  private static generateContentRecommendations(data: ContentAuditData): Recommendation[] {
    const recommendations: Recommendation[] = []

    // Title tags
    if (data.metadataCompleteness.titleTags.percentage < 80) {
      const missingCount = data.totalPages - data.metadataCompleteness.titleTags.count
      recommendations.push({
        priority: "high",
        category: "content",
        title: "Add Missing Title Tags",
        description: `${missingCount} pages are missing title tags. This directly impacts search rankings.`,
        estimatedImpact: "high",
        timeframe: "1-2 weeks",
        resources: ["Content writer", "SEO specialist"]
      })
    }

    // Meta descriptions
    if (data.metadataCompleteness.metaDescriptions.percentage < 80) {
      const missingCount = data.totalPages - data.metadataCompleteness.metaDescriptions.count
      recommendations.push({
        priority: "high",
        category: "content",
        title: "Write Meta Descriptions",
        description: `${missingCount} pages need meta descriptions to improve click-through rates from search results.`,
        estimatedImpact: "medium",
        timeframe: "1-2 weeks",
        resources: ["Content writer", "SEO copywriter"]
      })
    }

    // H1 tags
    if (data.metadataCompleteness.h1Tags.percentage < 70) {
      recommendations.push({
        priority: "medium",
        category: "content",
        title: "Add H1 Headings",
        description: "Most pages lack proper H1 headings. Add descriptive H1 tags to improve content structure.",
        estimatedImpact: "medium",
        timeframe: "1-2 weeks",
        resources: ["Content editor", "Web developer"]
      })
    }

    // Content freshness
    if (data.contentMetrics.contentFreshness.stale > data.contentMetrics.contentFreshness.fresh) {
      recommendations.push({
        priority: "medium",
        category: "content",
        title: "Update Stale Content",
        description: `${data.contentMetrics.contentFreshness.stale} pages haven't been updated in 18+ months. Refresh content regularly.`,
        estimatedImpact: "medium",
        timeframe: "3+ months",
        resources: ["Content team", "Subject matter experts"]
      })
    }

    // Word count improvement
    if (data.contentMetrics.averageWordCount < 600) {
      recommendations.push({
        priority: "medium",
        category: "content",
        title: "Increase Content Depth",
        description: `Average word count is ${data.contentMetrics.averageWordCount}. Expand content to 800+ words for better rankings.`,
        estimatedImpact: "medium",
        timeframe: "1-2 months",
        resources: ["Content writers", "Research team"]
      })
    }

    return recommendations
  }

  private static generateKeywordRecommendations(data: KeywordsData): Recommendation[] {
    const recommendations: Recommendation[] = []

    // Low top 10 rankings
    if (data.distribution.top10.percentage < 20) {
      recommendations.push({
        priority: "high",
        category: "keywords",
        title: "Improve Keyword Rankings",
        description: `Only ${data.distribution.top10.percentage}% of keywords rank in top 10. Focus on on-page optimization and content quality.`,
        estimatedImpact: "high",
        timeframe: "3+ months",
        resources: ["SEO specialist", "Content team", "Link building"]
      })
    }

    // Traffic growth opportunity
    if (data.organicTraffic.change <= 0) {
      recommendations.push({
        priority: "high",
        category: "keywords",
        title: "Increase Organic Traffic",
        description: "Organic traffic is stagnant. Target new keywords and improve existing content.",
        estimatedImpact: "high",
        timeframe: "3+ months",
        resources: ["Keyword research tools", "Content strategy", "SEO specialist"]
      })
    }

    // Low keyword count
    if (data.indexedKeywords < 50) {
      recommendations.push({
        priority: "medium",
        category: "keywords",
        title: "Expand Keyword Coverage",
        description: `Only ${data.indexedKeywords} keywords are ranking. Create content for more relevant keywords.`,
        estimatedImpact: "medium",
        timeframe: "3+ months",
        resources: ["Keyword research", "Content creation team"]
      })
    }

    return recommendations
  }

  private static generateBacklinkRecommendations(data: BacklinksData): Recommendation[] {
    const recommendations: Recommendation[] = []

    // Low referring domains
    if (data.referringDomains < 100) {
      recommendations.push({
        priority: "high",
        category: "backlinks",
        title: "Build More Quality Backlinks",
        description: `Only ${data.referringDomains} referring domains. Focus on earning high-quality backlinks from relevant sites.`,
        estimatedImpact: "high",
        timeframe: "3+ months",
        resources: ["Outreach specialist", "Content marketing", "PR team"]
      })
    }

    // Negative growth
    if (data.referringDomainsGrowth.change < 0) {
      recommendations.push({
        priority: "high",
        category: "backlinks",
        title: "Address Backlink Loss",
        description: `Lost ${Math.abs(data.referringDomainsGrowth.change)} referring domains this month. Investigate and recover lost links.`,
        estimatedImpact: "medium",
        timeframe: "1-2 months",
        resources: ["Link building specialist", "Backlink monitoring tools"]
      })
    }

    // Low domain rating
    if (data.domainRating < 50) {
      recommendations.push({
        priority: "medium",
        category: "backlinks",
        title: "Improve Domain Authority",
        description: `Domain rating is ${data.domainRating}. Focus on earning high-authority backlinks and improving overall link profile.`,
        estimatedImpact: "high",
        timeframe: "3+ months",
        resources: ["Link building strategy", "High-quality content", "Industry partnerships"]
      })
    }

    return recommendations
  }

  private static prioritizeRecommendations(recommendations: Recommendation[]): Recommendation[] {
    const priorityOrder = { "high": 3, "medium": 2, "low": 1 }
    const impactOrder = { "high": 3, "medium": 2, "low": 1 }

    return recommendations.sort((a, b) => {
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      return impactOrder[b.estimatedImpact] - impactOrder[a.estimatedImpact]
    })
  }
}
