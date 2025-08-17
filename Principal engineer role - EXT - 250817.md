# **\[TL001\]Principal engineer** \- One-click SEO report generation system

# Objective

Build a system that, given a website URL, automatically generates a structured SEO report (similar to the EC-Council SEO deck). 

The system should:

1. Be triggered with one input (the website URL).  
2. Fetch, process, and compile relevant SEO metrics.  
3. Generate a human-readable report (PDF/HTML/Doc).  
4. Be modular → each module can be improved independently (keywords, backlinks, technical, content, etc.).  
5. Be implemented in n8n or anything you are comfortable with using available APIs & automation.

# Pipeline design

## Input Layer

The user provides the website URL.  
System validates URL & normalizes (https://domain.com).

## Data Extraction Modules

Each module is independent and contributes to the report.

1. Keyword Rankings  
   1. Data source: Google Search Console API (needs site verification), or fallback \= SEMrush / Ahrefs API.  
   2. Metrics:   
      1. Total indexed keywords  
      2. Distribution across Top 3 / Top 10 / Top 50  
      3. Best/worst performing keywords  
      4. Keyword opportunities (missing vs competitor)  
2. Content Audit  
   1. Crawl/Scrape website.  
   2. Metrics:  
      1. \# of indexed pages  
      2. Avg. word count per page  
      3. Metadata completeness (Title, Description, H1)  
      4. CTA presence (check for “enroll”, “download”, “contact”)  
      5. Content freshness (last modified date vs today)  
3. Technical SEO (Performance)  
   1. Data source: Google PageSpeed Insights API.  
   2. Metrics:   
      1. Core Web Vitals: LCP, CLS, FID  
      2. Mobile vs Desktop performance score  
      3. Page load time  
      4. Issues (render-blocking JS/CSS, oversized images)  
4. Backlink Profile  
   1. Data source: Ahrefs/Majestic/SEMrush API (trial creds acceptable).  
   2. Metrics:  
      1. Total backlinks  
      2. Referring domains  
      3. Authority score  
      4. Anchor text distribution  
      5. New vs lost links (last 30 days)  
5. Competitor Benchmarking  
   1. Input: User adds 2–3 competitor domains.  
   2. Metrics:  
      1. Overlapping keywords  
      2. Ranking gaps  
      3. Backlink comparison  
      4. Content strategy comparison (blog frequency, freshness)

**Note:** You don’t need to implement everything, think of this as a demo to a potential customer, prioritise, use AI as your copilot, figure out what would the customer like seeing and get impressed. :))

# Metrics with benchmarking (reference)

| Module | Metric | Good Benchmark | Source/API |
| :---- | :---- | :---- | :---- |
| Keyword Rankings | % keywords in Top 10 | 20–30%+ | GSC / SEMrush |
| Content Audit | Title & meta filled pages | 90%+ | Serper/Tavily etc |
| Content Audit | Avg. word count/page | 800–1,200 words | Crawl data |
| Technical SEO | LCP (Largest Contentful Paint) | \<2.5s | PageSpeed API |
| Technical SEO | CLS (Cumulative Layout Shift) | \<0.1 | PageSpeed API |
| Technical SEO | Mobile speed score | 70+ | PageSpeed API |
| Backlinks | Referring domains | 500+ (quality matters) | Ahrefs API |
| Backlinks | New vs lost links | Positive growth | Ahrefs API |
| Competitors | Shared keywords | Identify gaps | SEMrush/Ahrefs |
| International | hreflang presence | Implemented | Crawl/HTML parse |
| Conversions | Organic CVR | 2–5% | GA4 |

# Output structure

Final SEO report should mirror the following format:

1. Executive Summary  
   1. Current ranking, traffic status, quick wins, urgent issues.  
2. Keyword Rankings  
   1. Distribution charts (Top 3 / Top 10 / Top 50).  
   2. Table of best/worst keywords.  
3. Content Audit  
   1. Indexed pages count, metadata completeness, CTA audit.  
   2. Pages needing refresh (older than 18 months).  
4. Technical SEO  
   1. PageSpeed scores (Mobile \+ Desktop).  
   2. Core Web Vitals performance.  
   3. Issues flagged.  
5. Backlink Profile  
   1. Total backlinks & domains.  
   2. Top anchor texts.  
   3. Growth trend (30 days).  
6. Competitor Comparison  
   1. Keyword gap table.  
   2. Backlink domain overlap chart.  
7. Recommendations & Roadmap  
   1. 3-month phased priorities.

# Expectations

1. Use n8n workflows to orchestrate API calls, crawl, and analysis. (simplest choice, but if you wanna do something better then go for it)  
2. Design as modular nodes (keyword module, content module, etc.).  
3. Effective error handling  
4. Output: Auto-generate a PDF report   
5. Don’t implement everything, implement what’s the most important, we are not expecting a 100% output, we want a 60% system that becomes the base for a 100% output.

# Evaluation criteria

1. System design: Is the pipeline modular and extensible?  
2. Robustness: Can it gracefully handle failures (e.g., API limits)?  
3. Data accuracy: Are the right metrics fetched & reported?  
4. Report clarity: Does the output resemble a professional SEO deck?  
5. Creativity: Are there smart workarounds for costly APIs?  
6. Speed: How fast can we ship this while maintaining system stability?