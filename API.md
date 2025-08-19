# API Documentation 📚

Complete API reference for the SEO Report Generation System.

## 🏗️ Architecture Overview

The system follows a modular API-first architecture with 4 independent analysis modules plus report generation.

```
Frontend Dashboard → API Routes → Analysis Modules → Report Engine → PDF Output
```

## 🔍 Analysis Endpoints

### 1. Technical SEO Analysis

**Endpoint:** `POST /api/analyze/technical-seo`

**Description:** Analyzes website performance using Google PageSpeed Insights API

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "coreWebVitals": {
    "lcp": { "value": "2.1s", "score": "good" },
    "cls": { "value": "0.05", "score": "good" },
    "fid": { "value": "67ms", "score": "good" }
  },
  "performanceScore": 85,
  "seoScore": 100,
  "accessibilityScore": 89,
  "bestPracticesScore": 95,
  "issues": [
    {
      "type": "warning",
      "title": "Render-blocking resources",
      "description": "CSS files are blocking the first paint",
      "impact": "medium"
    }
  ]
}
```

**Features:**
- ✅ Real Google PageSpeed API integration
- ✅ Exponential backoff retry logic (3 attempts)
- ✅ Mobile + Desktop analysis
- ✅ Core Web Vitals scoring

---

### 2. Content Audit Analysis  

**Endpoint:** `POST /api/analyze/content-audit`

**Description:** Crawls website to analyze content quality and completeness

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "totalPages": 15,
  "indexedPages": 12,
  "metadataCompleteness": {
    "titleTags": { "count": 12, "percentage": 100 },
    "metaDescriptions": { "count": 8, "percentage": 67 },
    "h1Tags": { "count": 10, "percentage": 83 }
  },
  "contentMetrics": {
    "averageWordCount": 650,
    "pagesWithCTAs": { "count": 5, "percentage": 42 },
    "contentFreshness": { "fresh": 8, "stale": 4 }
  },
  "topPages": [
    {
      "url": "https://example.com/",
      "title": "Homepage Title",
      "wordCount": 850,
      "hasMetaDescription": true,
      "hasH1": true,
      "hasCTA": true,
      "lastModified": "2025-08-15"
    }
  ],
  "issues": [
    {
      "type": "warning", 
      "title": "Missing meta descriptions",
      "description": "4 pages are missing meta descriptions",
      "affectedPages": 4
    }
  ]
}
```

**Features:**
- ✅ Real sitemap discovery (robots.txt + direct crawling)
- ✅ JSDOM HTML parsing
- ✅ Multi-page content analysis
- ✅ CTA detection with keyword matching

---

### 3. Keyword Rankings Analysis

**Endpoint:** `POST /api/analyze/keywords`

**Description:** Analyzes keyword rankings using multiple SERP APIs

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "totalKeywords": 25,
  "indexedKeywords": 18,
  "distribution": {
    "top3": { "count": 3, "percentage": 17 },
    "top10": { "count": 8, "percentage": 44 },
    "top50": { "count": 15, "percentage": 83 }
  },
  "performingKeywords": {
    "best": [
      {
        "keyword": "example service",
        "position": 1,
        "volume": 1200,
        "difficulty": 45,
        "url": "https://example.com/service",
        "change": 2
      }
    ],
    "worst": [
      {
        "keyword": "competitive term",
        "position": 67,
        "volume": 5400,
        "difficulty": 78,
        "url": "https://example.com/page",
        "change": -5
      }
    ],
    "new": []
  },
  "organicTraffic": {
    "estimated": 2500,
    "change": 15
  },
  "opportunities": []
}
```

**Features:**
- ✅ Multiple API fallbacks (ScaleSerp → SerpApi → ValueSerp)
- ✅ Real SERP position tracking
- ✅ Search volume data
- ✅ Position change tracking

---

### 4. Backlink Profile Analysis

**Endpoint:** `POST /api/analyze/backlinks`

**Description:** Discovers backlinks from Archive.org and social mentions

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "totalBacklinks": 150,
  "referringDomains": 45,
  "domainRating": 65,
  "organicTraffic": 25000,
  "backlinks": {
    "new": [
      {
        "fromUrl": "https://referring-site.com/article",
        "fromDomain": "referring-site.com", 
        "anchorText": "example company",
        "type": "dofollow",
        "domainRating": 72,
        "traffic": 15000,
        "firstSeen": "2025-08-01",
        "lastSeen": "2025-08-19"
      }
    ],
    "lost": [],
    "top": []
  },
  "anchorTexts": [
    {
      "text": "example company",
      "count": 25,
      "percentage": 45
    }
  ],
  "referringDomainsGrowth": {
    "thisMonth": 5,
    "lastMonth": 3,
    "change": 2
  },
  "topReferringDomains": [
    {
      "domain": "high-authority.com",
      "backlinks": 8,
      "domainRating": 85,
      "traffic": 50000
    }
  ]
}
```

**Features:**
- ✅ Archive.org CDX API integration
- ✅ CommonCrawl data discovery
- ✅ Social mentions (Reddit, Twitter, Facebook)
- ✅ Real URL and domain extraction

---

## 📊 Report Generation

### Generate Complete Report

**Endpoint:** `POST /api/generate-report`

**Description:** Generates professional PDF/HTML reports from analysis data

**Request:**
```json
{
  "url": "https://example.com",
  "technicalSeo": { /* Technical SEO data object */ },
  "contentAudit": { /* Content audit data object */ },
  "keywords": { /* Keywords data object */ },
  "backlinks": { /* Backlinks data object */ }
}
```

**Response:**
```json
{
  "success": true,
  "reportData": {
    "url": "https://example.com",
    "domain": "example.com",
    "analyzedAt": "2025-08-19T10:30:00.000Z",
    "executiveSummary": {
      "overallHealth": "good",
      "currentRanking": {
        "keywordsInTop10": 8,
        "estimatedTraffic": 2500,
        "domainAuthority": 65
      },
      "quickWins": [
        "Add missing meta descriptions to 4 pages",
        "Optimize images to improve LCP score"
      ],
      "urgentIssues": [
        "Fix accessibility issues on contact page"
      ],
      "trafficStatus": "increasing",
      "competitivePosition": "moderate"
    },
    "recommendations": [
      {
        "priority": "high",
        "category": "technical",
        "title": "Improve Core Web Vitals",
        "description": "Focus on LCP optimization by compressing images",
        "estimatedImpact": "high",
        "timeframe": "1-2 weeks",
        "resources": ["DevOps team", "Frontend developer"]
      }
    ]
  },
  "htmlContent": "<!DOCTYPE html>...",
  "pdfGenerated": true,
  "metadata": {
    "generatedAt": "2025-08-19T10:35:00.000Z",
    "domain": "example.com",
    "url": "https://example.com"
  }
}
```

**Features:**
- ✅ Puppeteer PDF generation
- ✅ Executive summary with AI-powered insights
- ✅ Actionable recommendations engine
- ✅ Professional HTML templates
- ✅ Automatic file naming with timestamps

---

## 🔧 Utility Endpoints

### Health Check

**Endpoint:** `GET /api/health`

**Description:** System health and API availability check

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-08-19T10:00:00.000Z",
  "version": "1.0.0",
  "apis": {
    "googlePageSpeed": "available",
    "serpApis": "available",
    "archiveOrg": "available"
  }
}
```

---

## 🛠️ Error Handling

All endpoints follow consistent error response format:

```json
{
  "error": "Analysis failed",
  "message": "Detailed error description",
  "code": "API_RATE_LIMIT",
  "timestamp": "2025-08-19T10:00:00.000Z"
}
```

### Common Error Codes
- `INVALID_URL` - URL format validation failed
- `API_RATE_LIMIT` - External API quota exceeded
- `TIMEOUT_ERROR` - Request timeout (30s limit)
- `PARSING_ERROR` - HTML/data parsing failed
- `GENERATION_ERROR` - Report generation failed

---

## 🔄 Rate Limiting & Quotas

| API Source | Daily Limit | Retry Logic | Fallback |
|------------|-------------|-------------|----------|
| Google PageSpeed | 25,000 | 3 attempts, exponential backoff | None |
| ScaleSerp | 1,000 | 2 attempts | SerpApi → ValueSerp |
| SerpApi | 100 | 2 attempts | ValueSerp |
| Archive.org | Unlimited | 3 attempts | CommonCrawl |
| Reddit API | 1,000/hour | 2 attempts | Skip social mentions |

---

## 🎯 Response Times

| Endpoint | Average | Range | Factors |
|----------|---------|-------|---------|
| `/api/analyze/technical-seo` | 30s | 15-45s | Google API response time |
| `/api/analyze/content-audit` | 15s | 5-30s | Website size, page count |
| `/api/analyze/keywords` | 8s | 3-15s | SERP API response |
| `/api/analyze/backlinks` | 12s | 5-20s | Archive.org data volume |
| `/api/generate-report` | 16s | 10-25s | PDF generation complexity |

**Total Analysis Time: 45-60 seconds** (modules run in parallel)

---

## 🔒 Security & Best Practices

- ✅ Input validation with URL sanitization
- ✅ Rate limiting per IP address
- ✅ API key rotation support
- ✅ Request timeout handling
- ✅ Error message sanitization
- ✅ CORS policy configuration

---

## 📝 Integration Examples

### Frontend JavaScript
```javascript
// Analyze website
const response = await fetch('/api/analyze/technical-seo', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: 'https://example.com' })
});
const data = await response.json();
```

### cURL Commands
```bash
# Technical SEO Analysis
curl -X POST http://localhost:3000/api/analyze/technical-seo \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'

# Generate Report
curl -X POST http://localhost:3000/api/generate-report \
  -H "Content-Type: application/json" \
  -d @report-data.json
```

---

**API Version:** 1.0.0  
**Last Updated:** August 19, 2025  
**Compatibility:** Next.js 15, Node.js 18+
