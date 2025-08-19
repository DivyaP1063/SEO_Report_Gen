"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  Globe,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ExternalLink,
  Zap,
  Eye,
  FileText,
  Download,
  Star,
  Shield,
  BarChart3,
  Users,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import { validateAndNormalizeURL, getDomainFromUrl } from "@/lib/url-validator"
import {
  analyzeTechnicalSEO,
  analyzeContentAudit,
  analyzeKeywords,
  analyzeBacklinks,
  ANALYSIS_STEPS,
  getScoreColor,
  getScoreBadgeVariant,
  getCoreWebVitalColor,
} from "@/lib/seo-analyzer"
import { generateReport, downloadHTMLReport, type ReportData } from "@/lib/report-generator"

interface AnalysisState {
  isAnalyzing: boolean
  progress: number
  currentStep: string
  complete: boolean
  url?: string
}

interface TechnicalSEOData {
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

interface ContentAuditData {
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

interface KeywordAnalysisData {
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
  opportunities: Array<{
    keyword: string
    position: number
    volume: number
    difficulty: number
    url: string
    change: number
  }>
  organicTraffic: {
    estimated: number
    change: number
  }
}

interface BacklinkAnalysisData {
  totalBacklinks: number
  referringDomains: number
  domainRating: number
  organicTraffic: number
  backlinks: {
    new: Array<{
      fromUrl: string
      fromDomain: string
      anchorText: string
      type: "dofollow" | "nofollow"
      domainRating: number
      traffic: number
      firstSeen: string
      lastSeen: string
    }>
    lost: Array<{
      fromUrl: string
      fromDomain: string
      anchorText: string
      type: "dofollow" | "nofollow"
      domainRating: number
      traffic: number
      firstSeen: string
      lastSeen: string
    }>
    top: Array<{
      fromUrl: string
      fromDomain: string
      anchorText: string
      type: "dofollow" | "nofollow"
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

export function SEODashboard() {
  const [url, setUrl] = useState("")
  const [validationError, setValidationError] = useState("")
  const [analysis, setAnalysis] = useState<AnalysisState>({
    isAnalyzing: false,
    progress: 0,
    currentStep: "",
    complete: false,
  })
  const [technicalSEOData, setTechnicalSEOData] = useState<TechnicalSEOData | null>(null)
  const [contentAuditData, setContentAuditData] = useState<ContentAuditData | null>(null)
  const [keywordData, setKeywordData] = useState<KeywordAnalysisData | null>(null)
  const [backlinkData, setBacklinkData] = useState<BacklinkAnalysisData | null>(null)
  const [analysisError, setAnalysisError] = useState("")
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)

  const handleUrlChange = (value: string) => {
    setUrl(value)
    setValidationError("")

    if (value.trim()) {
      const validation = validateAndNormalizeURL(value)
      if (!validation.isValid && value.length > 3) {
        setValidationError(validation.error || "Invalid URL")
      }
    }
  }

  const handleAnalyze = async () => {
    const validation = validateAndNormalizeURL(url)

    if (!validation.isValid) {
      setValidationError(validation.error || "Invalid URL")
      return
    }

    setValidationError("")
    setAnalysisError("")
    setTechnicalSEOData(null)
    setContentAuditData(null)
    setKeywordData(null)
    setBacklinkData(null)
    setAnalysis({
      isAnalyzing: true,
      progress: 0,
      currentStep: "Initializing analysis...",
      complete: false,
      url: validation.normalizedUrl,
    })

    try {
      // Simulate progress through analysis steps
      for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
        const step = ANALYSIS_STEPS[i]

        setAnalysis((prev) => ({
          ...prev,
          currentStep: step.step,
          progress: step.progress,
        }))

        // Start technical SEO analysis when we reach that step
        if (step.step.includes("technical SEO")) {
          try {
            const technicalData = await analyzeTechnicalSEO(validation.normalizedUrl!)
            setTechnicalSEOData(technicalData)
          } catch (error) {
            console.error("Technical SEO analysis failed:", error)
            setAnalysisError("Technical SEO analysis failed. Showing demo data.")
          }
        }

        if (step.step.includes("content quality")) {
          try {
            const contentData = await analyzeContentAudit(validation.normalizedUrl!)
            setContentAuditData(contentData)
          } catch (error) {
            console.error("Content audit failed:", error)
            setAnalysisError("Content audit failed. Showing demo data.")
          }
        }

        if (step.step.includes("keyword rankings")) {
          try {
            const keywordAnalysisData = await analyzeKeywords(validation.normalizedUrl!)
            setKeywordData(keywordAnalysisData)
          } catch (error) {
            console.error("Keyword analysis failed:", error)
            setAnalysisError("Keyword analysis failed. Showing demo data.")
          }
        }

        if (step.step.includes("backlink profile")) {
          try {
            const backlinkAnalysisData = await analyzeBacklinks(validation.normalizedUrl!)
            setBacklinkData(backlinkAnalysisData)
          } catch (error) {
            console.error("Backlink analysis failed:", error)
            setAnalysisError("Backlink analysis failed. Showing demo data.")
          }
        }

        await new Promise((resolve) => setTimeout(resolve, step.duration))
      }

      setAnalysis({
        isAnalyzing: false,
        progress: 100,
        currentStep: "Analysis complete",
        complete: true,
        url: validation.normalizedUrl,
      })
    } catch (error) {
      console.error("Analysis failed:", error)
      setAnalysisError("Analysis failed. Please try again.")
      setAnalysis((prev) => ({
        ...prev,
        isAnalyzing: false,
      }))
    }
  }

  const handleGenerateReport = async () => {
    if (!analysis.url) return

    // Ensure we have all required data
    if (!technicalSEOData || !contentAuditData || !keywordData || !backlinkData) {
      setAnalysisError("Please run a complete analysis before generating the report")
      return
    }

    setIsGeneratingReport(true)

    try {
      // Prepare data in the format expected by the API
      const reportRequestData = {
        url: analysis.url,
        technicalSeo: technicalSEOData,
        contentAudit: contentAuditData,
        keywords: keywordData,
        backlinks: backlinkData
      }

      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportRequestData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Report generation failed: ${response.status}`)
      }

      const result = await response.json()

      if (result.success && result.htmlContent) {
        const domain = getDomainFromUrl(analysis.url)
        const filename = `seo-report-${domain}-${new Date().toISOString().split("T")[0]}.html`
        downloadHTMLReport(result.htmlContent, filename)
      } else {
        setAnalysisError(result.error || "Failed to generate report")
      }
    } catch (error) {
      console.error("Report generation failed:", error)
      setAnalysisError("Failed to generate report. Please try again.")
    } finally {
      setIsGeneratingReport(false)
    }
  }

  const domain = analysis.url ? getDomainFromUrl(analysis.url) : ""
  const overallScore = technicalSEOData
    ? Math.round(
        (technicalSEOData.performanceScore +
          technicalSEOData.seoScore +
          technicalSEOData.accessibilityScore +
          technicalSEOData.bestPracticesScore) /
          4,
      )
    : 72

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 75) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreBadgeStyle = (score: number) => {
    if (score >= 90) return "bg-green-500 border-green-600 text-white"
    if (score >= 75) return "bg-yellow-500 border-yellow-600 text-white"
    return "bg-red-500 border-red-600 text-white"
  }

  const getCoreWebVitalBadgeStyle = (score: "good" | "needs-improvement" | "poor") => {
    switch (score) {
      case "good":
        return "bg-green-500 border-green-600 text-white"
      case "needs-improvement":
        return "bg-yellow-500 border-yellow-600 text-white"
      case "poor":
        return "bg-red-500 border-red-600 text-white"
      default:
        return "bg-gray-500 border-gray-600 text-white"
    }
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return "default"
    if (score >= 75) return "secondary"
    return "destructive"
  }

  const getCoreWebVitalColor = (score: "good" | "needs-improvement" | "poor") => {
    switch (score) {
      case "good":
        return "text-green-500"
      case "needs-improvement":
        return "text-yellow-500"
      case "poor":
        return "text-red-500"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="min-h-screen bg-slate-800 text-white">
      <div className="container mx-auto p-6 space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-8">
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="h-12 w-12 text-white" />
              </div>
              <div className="text-center">
                <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  SEO Pro Analytics
                </span>
                <div className="text-sm text-blue-400 font-semibold tracking-wide mt-1">
                  Enterprise-Grade SEO Intelligence
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
              One-Click SEO Report Generation
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Generate comprehensive SEO reports with enterprise-grade analysis. Get actionable insights on technical
              SEO, content audit, performance metrics, and competitive intelligence in seconds.
            </p>
          </div>
    
        </div>

        {/* URL Input Section */}
        <Card className="max-w-3xl mx-auto shadow-xl border border-gray-700 bg-gray-800/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="flex items-center justify-center gap-3 font-heading text-2xl text-white">
              <div className="h-12 w-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Globe className="h-6 w-6 text-blue-400" />
              </div>
              Website Analysis
            </CardTitle>
            <CardDescription className="text-base text-gray-300">
              Enter your website URL to generate a comprehensive SEO report with actionable insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="example.com or https://example.com"
                    value={url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className={`h-12 text-lg border-2 transition-colors bg-gray-700 text-white placeholder-gray-400 ${
                      validationError
                        ? "border-red-500 focus-visible:ring-red-500 bg-red-900/20"
                        : "border-gray-600"
                    }`}
                  />
                  {validationError && (
                    <p className="text-sm text-destructive flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      {validationError}
                    </p>
                  )}
                </div>
                <Button
                  onClick={handleAnalyze}
                  disabled={!url || !!validationError || analysis.isAnalyzing}
                  className="bg-primary hover:bg-primary/90 h-12 px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {analysis.isAnalyzing ? (
                    <>
                      <Clock className="h-5 w-5 mr-2 animate-spin" />
                      Analyzing
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-2" />
                      Analyze Site
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>

              {analysis.isAnalyzing && (
                <div className="space-y-4 p-6 bg-gradient-to-r from-gray-700/50 to-gray-600/20 rounded-xl border border-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg text-white">Analysis in Progress</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-blue-400 rounded-full animate-pulse" />
                      <span className="text-gray-300 font-mono">{Math.round(analysis.progress)}%</span>
                    </div>
                  </div>
                  <Progress value={analysis.progress} className="w-full h-3" />
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="h-8 w-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 animate-spin text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{analysis.currentStep}</div>
                      <div className="text-sm text-gray-400">This may take 30-60 seconds for comprehensive analysis</div>
                    </div>
                  </div>
                </div>
              )}

              {analysisError && (
                <Alert className="border-red-500 bg-red-900/20">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-300 font-medium">{analysisError}</AlertDescription>
                </Alert>
              )}

              {!analysis.isAnalyzing && !analysis.complete && (
                <Alert className="border-blue-500 bg-blue-900/20">
                  <Zap className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-gray-300">
                    <strong className="text-white">Pro tip:</strong> Our AI-powered analysis covers 50+ SEO factors including Core Web Vitals,
                    content quality, technical issues, and competitive insights. Get started in seconds!
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {analysis.complete && (
          <div className="space-y-8">
            <Card className="shadow-xl border border-gray-700 bg-gray-800/90 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-3 text-white">
                      <div className="h-10 w-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-blue-400" />
                      </div>
                      SEO Analysis Results
                    </CardTitle>
                    <CardDescription className="text-base mt-2 text-gray-300">
                      Comprehensive analysis for <strong>{domain}</strong>
                    </CardDescription>
                  </div>
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>{overallScore}</div>
                    <span className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium ${getScoreBadgeStyle(overallScore)}`}>
                      Overall Score
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="technical" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2 bg-gray-700 border border-gray-600 p-1">
                    <TabsTrigger value="technical" className="text-sm text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                      Technical SEO
                    </TabsTrigger>
                    <TabsTrigger value="content" className="text-sm text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                      Content Audit
                    </TabsTrigger>
                    <TabsTrigger value="keywords" className="text-sm text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                      Keywords
                    </TabsTrigger>
                    <TabsTrigger value="backlinks" className="text-sm text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                      Backlinks
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="technical">
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <Zap className="h-5 w-5" />
                          Technical SEO Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {technicalSEOData && (
                          <>
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-white">Core Web Vitals</h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center space-y-2 p-4 bg-gray-700 border border-gray-600 rounded-lg shadow-sm">
                                  <div className="text-sm text-gray-400">Largest Contentful Paint</div>
                                  <div className="text-2xl font-bold text-white">{technicalSEOData.coreWebVitals.lcp.value}</div>
                                  <span className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium ${getCoreWebVitalBadgeStyle(technicalSEOData.coreWebVitals.lcp.score)}`}>
                                    {technicalSEOData.coreWebVitals.lcp.score.replace("-", " ").toUpperCase()}
                                  </span>
                                </div>
                                <div className="text-center space-y-2 p-4 bg-gray-700 border border-gray-600 rounded-lg shadow-sm">
                                  <div className="text-sm text-gray-400">Cumulative Layout Shift</div>
                                  <div className="text-2xl font-bold text-white">{technicalSEOData.coreWebVitals.cls.value}</div>
                                  <span className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium ${getCoreWebVitalBadgeStyle(technicalSEOData.coreWebVitals.cls.score)}`}>
                                    {technicalSEOData.coreWebVitals.cls.score.replace("-", " ").toUpperCase()}
                                  </span>
                                </div>
                                <div className="text-center space-y-2 p-4 bg-gray-700 border border-gray-600 rounded-lg shadow-sm">
                                  <div className="text-sm text-gray-400">First Input Delay</div>
                                  <div className="text-2xl font-bold text-white">{technicalSEOData.coreWebVitals.fid.value}</div>
                                  <span className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium ${getCoreWebVitalBadgeStyle(technicalSEOData.coreWebVitals.fid.score)}`}>
                                    {technicalSEOData.coreWebVitals.fid.score.replace("-", " ").toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="text-center space-y-2 p-4 bg-gray-700 border border-gray-600 rounded-lg shadow-sm">
                                <div className="text-sm text-gray-400">Performance</div>
                                <div className={`text-2xl font-bold ${getScoreColor(technicalSEOData.performanceScore)}`}>
                                  {technicalSEOData.performanceScore}
                                </div>
                                <span className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium ${getScoreBadgeStyle(technicalSEOData.performanceScore)}`}>Score</span>
                              </div>
                              <div className="text-center space-y-2 p-4 bg-gray-700 border border-gray-600 rounded-lg shadow-sm">
                                <div className="text-sm text-gray-400">SEO</div>
                                <div className={`text-2xl font-bold ${getScoreColor(technicalSEOData.seoScore)}`}>
                                  {technicalSEOData.seoScore}
                                </div>
                                <span className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium ${getScoreBadgeStyle(technicalSEOData.seoScore)}`}>Score</span>
                              </div>
                              <div className="text-center space-y-2 p-4 bg-gray-700 border border-gray-600 rounded-lg shadow-sm">
                                <div className="text-sm text-gray-400">Accessibility</div>
                                <div className={`text-2xl font-bold ${getScoreColor(technicalSEOData.accessibilityScore)}`}>
                                  {technicalSEOData.accessibilityScore}
                                </div>
                                <span className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium ${getScoreBadgeStyle(technicalSEOData.accessibilityScore)}`}>Score</span>
                              </div>
                              <div className="text-center space-y-2 p-4 bg-gray-700 border border-gray-600 rounded-lg shadow-sm">
                                <div className="text-sm text-gray-400">Best Practices</div>
                                <div className={`text-2xl font-bold ${getScoreColor(technicalSEOData.bestPracticesScore)}`}>
                                  {technicalSEOData.bestPracticesScore}
                                </div>
                                <Badge variant={getScoreBadgeVariant(technicalSEOData.bestPracticesScore)}>Score</Badge>
                              </div>
                            </div>

                            {technicalSEOData.issues.length > 0 && (
                              <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white">Issues & Recommendations</h3>
                                <div className="space-y-3">
                                  {technicalSEOData.issues.map((issue, index) => (
                                    <div
                                      key={index}
                                      className={`w-full p-4 border-l-4 rounded-md ${
                                        issue.type === "error"
                                          ? "border-l-red-500 bg-red-950/20"
                                          : issue.type === "warning"
                                          ? "border-l-yellow-500 bg-yellow-950/20"
                                          : "border-l-blue-500 bg-blue-950/20"
                                      }`}
                                    >
                                      <div className="flex flex-row justify-between items-center w-full">
                                        <div className="flex items-center gap-2">
                                          {issue.type === "error" ? (
                                            <div className="w-4 h-4 text-red-500">⚠</div>
                                          ) : issue.type === "warning" ? (
                                            <div className="w-4 h-4 text-yellow-500">⚠</div>
                                          ) : (
                                            <div className="w-4 h-4 text-blue-500">✓</div>
                                          )}
                                          <span className="font-semibold text-white">{issue.title}</span>
                                        </div>
                                        
                                        <div className="flex-1 px-4">
                                          <span className="text-sm text-gray-400">{issue.description}</span>
                                        </div>
                                        
                                        <div>
                                          <span
                                            className={`px-3 py-1 rounded text-xs font-medium ${
                                              issue.impact === "high"
                                                ? "bg-red-500 text-white"
                                                : issue.impact === "medium"
                                                ? "bg-yellow-500 text-white"
                                                : "bg-green-500 text-white"
                                            }`}
                                          >
                                            {issue.impact} impact
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="content">
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <FileText className="h-5 w-5" />
                          Content Audit Results
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {contentAuditData && (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="text-center space-y-2 p-4 bg-gray-700 border border-gray-600 rounded-lg shadow-sm">
                                <div className="text-sm text-gray-400">Total Pages</div>
                                <div className="text-2xl font-bold text-white">{contentAuditData.totalPages}</div>
                                <span className="inline-flex items-center justify-center rounded-md border border-gray-500 bg-gray-600 text-white px-2 py-0.5 text-xs font-medium">Crawled</span>
                              </div>
                              <div className="text-center space-y-2 p-4 bg-gray-700 border border-gray-600 rounded-lg shadow-sm">
                                <div className="text-sm text-gray-400">Indexed Pages</div>
                                <div className="text-2xl font-bold text-white">{contentAuditData.indexedPages}</div>
                                <span className="inline-flex items-center justify-center rounded-md border border-green-600 bg-green-500 text-white px-2 py-0.5 text-xs font-medium">In Search</span>
                              </div>
                              <div className="text-center space-y-2 p-4 bg-gray-700 border border-gray-600 rounded-lg shadow-sm">
                                <div className="text-sm text-gray-400">Average Word Count</div>
                                <div className="text-2xl font-bold text-white">{contentAuditData.contentMetrics.averageWordCount}</div>
                                <span className="inline-flex items-center justify-center rounded-md border border-blue-600 bg-blue-500 text-white px-2 py-0.5 text-xs font-medium">Words</span>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-white">Metadata Completeness</h3>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm">
                                  <span className="font-medium text-white">Title Tags</span>
                                  <div className="flex items-center gap-3">
                                    <div className="w-24 bg-gray-600 rounded-full h-2">
                                      <div 
                                        className="bg-green-500 h-full rounded-full transition-all" 
                                        style={{ width: `${contentAuditData.metadataCompleteness.titleTags.percentage}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm font-mono text-white">
                                      {contentAuditData.metadataCompleteness.titleTags.percentage}%
                                    </span>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm">
                                  <span className="font-medium text-white">Meta Descriptions</span>
                                  <div className="flex items-center gap-3">
                                    <div className="w-24 bg-gray-600 rounded-full h-2">
                                      <div 
                                        className="bg-blue-500 h-full rounded-full transition-all" 
                                        style={{ width: `${contentAuditData.metadataCompleteness.metaDescriptions.percentage}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm font-mono text-white">
                                      {contentAuditData.metadataCompleteness.metaDescriptions.percentage}%
                                    </span>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm">
                                  <span className="font-medium text-white">H1 Tags</span>
                                  <div className="flex items-center gap-3">
                                    <div className="w-24 bg-gray-600 rounded-full h-2">
                                      <div 
                                        className="bg-purple-500 h-full rounded-full transition-all" 
                                        style={{ width: `${contentAuditData.metadataCompleteness.h1Tags.percentage}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm font-mono text-white">
                                      {contentAuditData.metadataCompleteness.h1Tags.percentage}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="keywords">
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <Search className="h-5 w-5" />
                          Keyword Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {keywordData ? (
                          <div className="space-y-6">
                            {/* Keywords Overview */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="text-center space-y-2 p-4 bg-gray-700 border border-gray-600 rounded-lg shadow-sm">
                                <div className="text-sm text-gray-400">Total Keywords</div>
                                <div className="text-2xl font-bold text-white">{keywordData.totalKeywords.toLocaleString()}</div>
                              </div>
                              <div className="text-center space-y-2 p-4 bg-gray-700 border border-gray-600 rounded-lg shadow-sm">
                                <div className="text-sm text-gray-400">Indexed</div>
                                <div className="text-2xl font-bold text-white">{keywordData.indexedKeywords.toLocaleString()}</div>
                              </div>
                              <div className="text-center space-y-2 p-4 bg-gray-700 border border-gray-600 rounded-lg shadow-sm">
                                <div className="text-sm text-gray-400">Top 10</div>
                                <div className="text-2xl font-bold text-white">{keywordData.distribution.top10.count}</div>
                              </div>
                              <div className="text-center space-y-2 p-4 bg-gray-700 border border-gray-600 rounded-lg shadow-sm">
                                <div className="text-sm text-gray-400">Estimated Traffic</div>
                                <div className="text-2xl font-bold text-white">{keywordData.organicTraffic.estimated.toLocaleString()}</div>
                              </div>
                            </div>

                            {/* Keyword Distribution */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-white">Ranking Distribution</h3>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm">
                                  <div className="flex-1">
                                    <span className="text-white">Top 3 Positions</span>
                                    <div className="w-32 mt-2 bg-gray-600 rounded-full h-2">
                                      <div 
                                        className="bg-green-500 h-full rounded-full transition-all" 
                                        style={{ width: `${keywordData.distribution.top3.percentage}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-white">{keywordData.distribution.top3.count}</span>
                                    <span className="inline-flex items-center justify-center rounded-md border border-green-600 bg-green-500 text-white px-2 py-0.5 text-xs font-medium">{keywordData.distribution.top3.percentage}%</span>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm">
                                  <div className="flex-1">
                                    <span className="text-white">Top 10 Positions</span>
                                    <div className="w-32 mt-2 bg-gray-600 rounded-full h-2">
                                      <div 
                                        className="bg-blue-500 h-full rounded-full transition-all" 
                                        style={{ width: `${keywordData.distribution.top10.percentage}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-white">{keywordData.distribution.top10.count}</span>
                                    <span className="inline-flex items-center justify-center rounded-md border border-blue-600 bg-blue-500 text-white px-2 py-0.5 text-xs font-medium">{keywordData.distribution.top10.percentage}%</span>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm">
                                  <div className="flex-1">
                                    <span className="text-white">Top 50 Positions</span>
                                    <div className="w-32 mt-2 bg-gray-600 rounded-full h-2">
                                      <div 
                                        className="bg-yellow-500 h-full rounded-full transition-all" 
                                        style={{ width: `${keywordData.distribution.top50.percentage}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-white">{keywordData.distribution.top50.count}</span>
                                    <span className="inline-flex items-center justify-center rounded-md border border-yellow-600 bg-yellow-500 text-white px-2 py-0.5 text-xs font-medium">{keywordData.distribution.top50.percentage}%</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Best Performing Keywords */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-white">Best Performing Keywords</h3>
                              <div className="space-y-2">
                                {keywordData.performingKeywords.best.map((keyword, index) => (
                                  <div key={index} className="flex justify-between items-center p-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm">
                                    <div>
                                      <div className="font-medium text-white">{keyword.keyword}</div>
                                      <div className="text-sm text-gray-400">Volume: {keyword.volume.toLocaleString()}</div>
                                    </div>
                                    <div className="text-right">
                                      <Badge variant="default">#{keyword.position}</Badge>
                                      {keyword.change !== 0 && (
                                        <div className={`text-xs ${keyword.change > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                          {keyword.change > 0 ? '↓' : '↑'} {Math.abs(keyword.change)}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-400">
                            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Keyword data will appear here after analysis is complete.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="backlinks">
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <ExternalLink className="h-5 w-5" />
                          Backlink Profile
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {backlinkData ? (
                          <div className="space-y-6">
                            {/* Backlinks Overview */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="text-center space-y-2 p-4 bg-gray-700 border border-gray-600 rounded-lg shadow-sm">
                                <div className="text-sm text-gray-400">Total Backlinks</div>
                                <div className="text-2xl font-bold text-white">{backlinkData.totalBacklinks.toLocaleString()}</div>
                              </div>
                              <div className="text-center space-y-2 p-4 bg-gray-700 border border-gray-600 rounded-lg shadow-sm">
                                <div className="text-sm text-gray-400">Referring Domains</div>
                                <div className="text-2xl font-bold text-white">{backlinkData.referringDomains.toLocaleString()}</div>
                              </div>
                              <div className="text-center space-y-2 p-4 bg-gray-700 border border-gray-600 rounded-lg shadow-sm">
                                <div className="text-sm text-gray-400">Domain Rating</div>
                                <div className="text-2xl font-bold text-white">{backlinkData.domainRating}</div>
                              </div>
                              <div className="text-center space-y-2 p-4 bg-gray-700 border border-gray-600 rounded-lg shadow-sm">
                                <div className="text-sm text-gray-400">Organic Traffic</div>
                                <div className="text-2xl font-bold text-white">{backlinkData.organicTraffic.toLocaleString()}</div>
                              </div>
                            </div>

                            {/* Domain Growth */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-white">Referring Domains Growth</h3>
                              <div className="flex justify-between items-center p-4 bg-gray-700 border border-gray-600 rounded-lg shadow-sm">
                                <div>
                                  <div className="text-sm text-gray-400">This Month</div>
                                  <div className="text-xl font-bold text-white">{backlinkData.referringDomainsGrowth.thisMonth}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-400">Last Month</div>
                                  <div className="text-xl font-bold text-white">{backlinkData.referringDomainsGrowth.lastMonth}</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-sm text-gray-400">Change</div>
                                  <div className={`text-xl font-bold ${backlinkData.referringDomainsGrowth.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {backlinkData.referringDomainsGrowth.change > 0 ? '+' : ''}{backlinkData.referringDomainsGrowth.change}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Top Referring Domains */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-white">Top Referring Domains</h3>
                              <div className="space-y-2">
                                {backlinkData.topReferringDomains.map((domain, index) => (
                                  <div key={index} className="flex justify-between items-center p-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm">
                                    <div>
                                      <div className="font-medium text-white">{domain.domain}</div>
                                      <div className="text-sm text-gray-400">
                                        {domain.backlinks} backlinks • DR: {domain.domainRating}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-sm text-gray-400">
                                        {domain.traffic.toLocaleString()} traffic
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Recent Backlinks */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-white">Recent Backlinks</h3>
                              <div className="space-y-2">
                                {backlinkData.backlinks.new.map((backlink, index) => (
                                  <div key={index} className="p-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm">
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <div className="font-medium text-sm text-white">{backlink.fromDomain}</div>
                                        <div className="text-xs text-gray-400 mt-1">
                                          "{backlink.anchorText}"
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <Badge variant={backlink.type === 'dofollow' ? 'default' : 'secondary'}>
                                          {backlink.type}
                                        </Badge>
                                        <div className="text-xs text-gray-400 mt-1">
                                          DR: {backlink.domainRating}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Anchor Text Distribution */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-white">Anchor Text Distribution</h3>
                              <div className="space-y-2">
                                {backlinkData.anchorTexts.map((anchor, index) => (
                                  <div key={index} className="flex justify-between items-center p-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm">
                                    <div className="font-medium text-white">{anchor.text}</div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-white">{anchor.count}</span>
                                      <span className="inline-flex items-center justify-center rounded-md border border-orange-600 bg-orange-500 text-white px-2 py-0.5 text-xs font-medium">{anchor.percentage}%</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-400">
                            <ExternalLink className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Backlink data will appear here after analysis is complete.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-center pt-6">
                  <Button
                    onClick={handleGenerateReport}
                    disabled={isGeneratingReport}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isGeneratingReport ? (
                      <>
                        <Clock className="h-5 w-5 mr-2 animate-spin" />
                        Generating Report...
                      </>
                    ) : (
                      <>
                        <Download className="h-5 w-5 mr-2" />
                        Generate Report
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
