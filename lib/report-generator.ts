export interface ReportData {
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

export async function generateReport(
  reportData: ReportData,
): Promise<{ success: boolean; htmlContent?: string; downloadUrl?: string; error?: string }> {
  try {
    const response = await fetch("/api/generate-report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reportData),
    })

    if (!response.ok) {
      throw new Error(`Report generation failed: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Report generation error:", error)
    return {
      success: false,
      error: "Failed to generate report",
    }
  }
}

export function downloadHTMLReport(htmlContent: string, filename: string) {
  const blob = new Blob([htmlContent], { type: "text/html" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function printReport(htmlContent: string) {
  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }
}

export function getDomainFromUrl(url: string): string {
  try {
    const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`)
    return urlObj.hostname.replace("www.", "")
  } catch {
    return url
      .replace(/^https?:\/\//, "")
      .replace("www.", "")
      .split("/")[0]
  }
}
