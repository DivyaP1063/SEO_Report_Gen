export interface SEOReportData {
  url: string
  domain: string
  analyzedAt: string
  technicalSeo: TechnicalSEOData
  contentAudit: ContentAuditData  
  keywords: KeywordsData
  backlinks: BacklinksData
  executiveSummary?: ExecutiveSummary
  recommendations?: Recommendation[]
}

export interface TechnicalSEOData {
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

export interface ContentAuditData {
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
    contentFreshness: {
      fresh: number
      stale: number
    }
  }
  topPages: Array<{
    url: string
    title: string
    wordCount: number
    hasMetaDescription: boolean
    hasH1: boolean
    hasCTA: boolean
    lastModified?: string
  }>
  issues: Array<{
    type: "error" | "warning" | "info"
    title: string
    description: string
    affectedPages: number
  }>
}

export interface KeywordsData {
  totalKeywords: number
  indexedKeywords: number
  distribution: {
    top3: { count: number; percentage: number }
    top10: { count: number; percentage: number }
    top50: { count: number; percentage: number }
  }
  performingKeywords: {
    best: Array<{
      keyword: string
      position: number
      volume: number
      difficulty: number
      url: string
      change: number
    }>
    worst: Array<{
      keyword: string
      position: number
      volume: number
      difficulty: number
      url: string
      change: number
    }>
    new: Array<{
      keyword: string
      position: number
      volume: number
      difficulty: number
      url: string
      change: number
    }>
  }
  opportunities: any[]
  organicTraffic: {
    estimated: number
    change: number
  }
}

export interface BacklinksData {
  totalBacklinks: number
  referringDomains: number
  domainRating: number
  organicTraffic: number
  backlinks: {
    new: Array<{
      fromUrl: string
      fromDomain: string
      anchorText: string
      type: string
      domainRating: number
      traffic: number
      firstSeen: string
      lastSeen: string
    }>
    lost: Array<{
      fromUrl: string
      fromDomain: string
      anchorText: string
      type: string
      domainRating: number
      traffic: number
      firstSeen: string
      lastSeen: string
    }>
    top: Array<{
      fromUrl: string
      fromDomain: string
      anchorText: string
      type: string
      domainRating: number
      traffic: number
      firstSeen: string
      lastSeen: string
    }>
  }
  anchorTexts: Array<{
    text: string
    count: number
    percentage: number
  }>
  referringDomainsGrowth: {
    thisMonth: number
    lastMonth: number
    change: number
  }
  topReferringDomains: Array<{
    domain: string
    backlinks: number
    domainRating: number
    traffic: number
  }>
}

export interface ExecutiveSummary {
  overallHealth: "excellent" | "good" | "fair" | "poor"
  currentRanking: {
    keywordsInTop10: number
    estimatedTraffic: number
    domainAuthority: number
  }
  quickWins: string[]
  urgentIssues: string[]
  trafficStatus: "increasing" | "stable" | "decreasing"
  competitivePosition: "strong" | "moderate" | "weak"
}

export interface Recommendation {
  priority: "high" | "medium" | "low"
  category: "technical" | "content" | "keywords" | "backlinks"
  title: string
  description: string
  estimatedImpact: "high" | "medium" | "low"
  timeframe: "1-2 weeks" | "1-2 months" | "3+ months"
  resources: string[]
}

export interface ReportGenerationOptions {
  format: "pdf" | "html"
  includeCharts: boolean
  includeTechnicalDetails: boolean
  logoUrl?: string
  brandColor?: string
  reportTitle?: string
}
