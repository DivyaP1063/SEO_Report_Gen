export interface URLValidationResult {
  isValid: boolean
  normalizedUrl?: string
  error?: string
}

export function validateAndNormalizeURL(input: string): URLValidationResult {
  if (!input.trim()) {
    return {
      isValid: false,
      error: "Please enter a website URL",
    }
  }

  let url = input.trim()

  // Add protocol if missing
  if (!url.match(/^https?:\/\//)) {
    url = `https://${url}`
  }

  try {
    const urlObj = new URL(url)

    // Basic validation checks
    if (!urlObj.hostname) {
      return {
        isValid: false,
        error: "Invalid domain name",
      }
    }

    // Check for valid TLD (basic check)
    if (!urlObj.hostname.includes(".")) {
      return {
        isValid: false,
        error: "Domain must include a valid extension (e.g., .com, .org)",
      }
    }

    // Normalize the URL
    const normalizedUrl = `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname === "/" ? "" : urlObj.pathname}`

    return {
      isValid: true,
      normalizedUrl,
    }
  } catch (error) {
    return {
      isValid: false,
      error: "Please enter a valid website URL (e.g., example.com or https://example.com)",
    }
  }
}

export function getDomainFromUrl(url: string): string {
  try {
    const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`)
    return urlObj.hostname
  } catch {
    return url
  }
}
