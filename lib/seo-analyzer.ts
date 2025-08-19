export interface SEOAnalysisProgress {
  step: string
  progress: number
  duration: number
}

export const ANALYSIS_STEPS: SEOAnalysisProgress[] = [
  { step: "Validating website accessibility...", progress: 10, duration: 800 },
  { step: "Analyzing technical SEO metrics...", progress: 20, duration: 1200 },
  { step: "Crawling website structure...", progress: 35, duration: 1000 },
  { step: "Evaluating page performance...", progress: 50, duration: 900 },
  { step: "Auditing content quality...", progress: 65, duration: 700 },
  { step: "Analyzing keyword rankings...", progress: 80, duration: 800 },
  { step: "Checking backlink profile...", progress: 90, duration: 600 },
  { step: "Generating comprehensive report...", progress: 100, duration: 500 },
]

export async function analyzeTechnicalSEO(url: string) {
  try {
    const response = await fetch("/api/analyze/technical-seo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    })

    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Technical SEO analysis error:", error)
    throw error
  }
}

export async function analyzeContentAudit(url: string) {
  try {
    const response = await fetch("/api/analyze/content-audit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    })

    if (!response.ok) {
      throw new Error(`Content audit failed: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Content audit error:", error)
    throw error
  }
}

export async function analyzeKeywords(url: string) {
  try {
    const response = await fetch("/api/analyze/keywords", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    })

    if (!response.ok) {
      throw new Error(`Keywords analysis failed: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Keywords analysis error:", error)
    throw error
  }
}

export async function analyzeBacklinks(url: string) {
  try {
    const response = await fetch("/api/analyze/backlinks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    })

    if (!response.ok) {
      throw new Error(`Backlinks analysis failed: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Backlinks analysis error:", error)
    throw error
  }
}

export function getScoreColor(score: number): string {
  if (score >= 90) return "text-green-600"
  if (score >= 70) return "text-yellow-600"
  return "text-red-600"
}

export function getScoreBadgeVariant(score: number): "default" | "secondary" | "destructive" | "outline" {
  if (score >= 90) return "secondary"
  if (score >= 70) return "outline"
  return "destructive"
}

export function getCoreWebVitalColor(score: "good" | "needs-improvement" | "poor"): string {
  switch (score) {
    case "good":
      return "text-green-600"
    case "needs-improvement":
      return "text-yellow-600"
    case "poor":
      return "text-red-600"
    default:
      return "text-gray-600"
  }
}

export function getContentScoreColor(percentage: number): string {
  if (percentage >= 90) return "text-green-600"
  if (percentage >= 70) return "text-yellow-600"
  return "text-red-600"
}

export function getContentScoreBadge(percentage: number): "default" | "secondary" | "destructive" | "outline" {
  if (percentage >= 90) return "secondary"
  if (percentage >= 70) return "outline"
  return "destructive"
}
