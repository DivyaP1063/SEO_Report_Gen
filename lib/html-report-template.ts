import { SEOReportData } from './types/report-types'

export class HTMLReportTemplate {
  static generate(data: SEOReportData): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SEO Report - ${data.domain}</title>
    <style>
        ${this.getCSS()}
    </style>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div class="report-container">
        ${this.generateHeader(data)}
        ${this.generateExecutiveSummary(data)}
        ${this.generateTechnicalSEO(data)}
        ${this.generateContentAudit(data)}
        ${this.generateKeywords(data)}
        ${this.generateBacklinks(data)}
        ${this.generateRecommendations(data)}
        ${this.generateFooter(data)}
    </div>
    
    <script>
        ${this.getJavaScript()}
    </script>
</body>
</html>`
  }

  private static getCSS(): string {
    return `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
        }
        
        .report-container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .header .url {
            font-size: 1.2em;
            opacity: 0.9;
            margin-bottom: 5px;
        }
        
        .header .date {
            opacity: 0.8;
        }
        
        .section {
            padding: 40px;
            border-bottom: 1px solid #eee;
        }
        
        .section:last-child {
            border-bottom: none;
        }
        
        .section-title {
            font-size: 2em;
            margin-bottom: 20px;
            color: #2d3748;
            border-left: 4px solid #667eea;
            padding-left: 15px;
        }
        
        .executive-summary {
            background: #f7fafc;
            border-radius: 8px;
            padding: 30px;
            margin-bottom: 20px;
        }
        
        .health-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 0.9em;
        }
        
        .health-excellent { background: #c6f6d5; color: #22543d; }
        .health-good { background: #bee3f8; color: #2c5282; }
        .health-fair { background: #fbd38d; color: #744210; }
        .health-poor { background: #feb2b2; color: #742a2a; }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        .metric-card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .metric-value {
            font-size: 2.5em;
            font-weight: bold;
            color: #667eea;
        }
        
        .metric-label {
            color: #718096;
            margin-top: 5px;
        }
        
        .score-bar {
            background: #e2e8f0;
            border-radius: 10px;
            height: 20px;
            overflow: hidden;
            margin: 10px 0;
        }
        
        .score-fill {
            height: 100%;
            border-radius: 10px;
            transition: width 0.3s ease;
        }
        
        .score-excellent { background: #48bb78; }
        .score-good { background: #4299e1; }
        .score-fair { background: #ed8936; }
        .score-poor { background: #f56565; }
        
        .issues-list {
            list-style: none;
            padding: 0;
        }
        
        .issues-list li {
            padding: 10px;
            margin: 5px 0;
            border-left: 3px solid #cbd5e0;
            background: #f7fafc;
            border-radius: 0 4px 4px 0;
        }
        
        .issue-error { border-left-color: #f56565; }
        .issue-warning { border-left-color: #ed8936; }
        .issue-info { border-left-color: #4299e1; }
        
        .recommendations-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .recommendation-card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border-left: 4px solid #cbd5e0;
        }
        
        .priority-high { border-left-color: #f56565; }
        .priority-medium { border-left-color: #ed8936; }
        .priority-low { border-left-color: #4299e1; }
        
        .chart-container {
            position: relative;
            height: 300px;
            margin: 20px 0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        
        th {
            background: #f7fafc;
            font-weight: 600;
            color: #2d3748;
        }
        
        .footer {
            background: #2d3748;
            color: white;
            padding: 20px;
            text-align: center;
        }
        
        @media print {
            body { background: white; }
            .report-container { box-shadow: none; }
            .section { page-break-inside: avoid; }
        }
    `
  }

  private static generateHeader(data: SEOReportData): string {
    return `
        <div class="header">
            <h1>SEO Analysis Report</h1>
            <div class="url">${data.url}</div>
            <div class="date">Generated on ${new Date(data.analyzedAt).toLocaleDateString()}</div>
        </div>
    `
  }

  private static generateExecutiveSummary(data: SEOReportData): string {
    if (!data.executiveSummary) return ''
    
    const summary = data.executiveSummary
    return `
        <div class="section">
            <h2 class="section-title">Executive Summary</h2>
            <div class="executive-summary">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3>Overall Health: <span class="health-badge health-${summary.overallHealth}">${summary.overallHealth.toUpperCase()}</span></h3>
                    <div>Traffic Status: <strong>${summary.trafficStatus.toUpperCase()}</strong></div>
                </div>
                
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-value">${summary.currentRanking.keywordsInTop10}</div>
                        <div class="metric-label">Keywords in Top 10</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${summary.currentRanking.estimatedTraffic.toLocaleString()}</div>
                        <div class="metric-label">Estimated Traffic</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${summary.currentRanking.domainAuthority}</div>
                        <div class="metric-label">Domain Authority</div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 30px;">
                    <div>
                        <h4>🎯 Quick Wins</h4>
                        <ul>
                            ${summary.quickWins.map(win => `<li>${win}</li>`).join('')}
                        </ul>
                    </div>
                    <div>
                        <h4>🚨 Urgent Issues</h4>
                        <ul>
                            ${summary.urgentIssues.map(issue => `<li>${issue}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `
  }

  private static generateTechnicalSEO(data: SEOReportData): string {
    const tech = data.technicalSeo
    return `
        <div class="section">
            <h2 class="section-title">Technical SEO</h2>
            
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-value">${tech.performanceScore}</div>
                    <div class="metric-label">Performance Score</div>
                    <div class="score-bar">
                        <div class="score-fill ${this.getScoreClass(tech.performanceScore)}" 
                             style="width: ${tech.performanceScore}%"></div>
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${tech.seoScore}</div>
                    <div class="metric-label">SEO Score</div>
                    <div class="score-bar">
                        <div class="score-fill ${this.getScoreClass(tech.seoScore)}" 
                             style="width: ${tech.seoScore}%"></div>
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${tech.accessibilityScore}</div>
                    <div class="metric-label">Accessibility Score</div>
                    <div class="score-bar">
                        <div class="score-fill ${this.getScoreClass(tech.accessibilityScore)}" 
                             style="width: ${tech.accessibilityScore}%"></div>
                    </div>
                </div>
            </div>
            
            <h3>Core Web Vitals</h3>
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-value">${tech.coreWebVitals.lcp.value}</div>
                    <div class="metric-label">Largest Contentful Paint (LCP)</div>
                    <span class="health-badge health-${this.mapCWVScore(tech.coreWebVitals.lcp.score)}">${tech.coreWebVitals.lcp.score}</span>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${tech.coreWebVitals.cls.value}</div>
                    <div class="metric-label">Cumulative Layout Shift (CLS)</div>
                    <span class="health-badge health-${this.mapCWVScore(tech.coreWebVitals.cls.score)}">${tech.coreWebVitals.cls.score}</span>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${tech.coreWebVitals.fid.value}</div>
                    <div class="metric-label">First Input Delay (FID)</div>
                    <span class="health-badge health-${this.mapCWVScore(tech.coreWebVitals.fid.score)}">${tech.coreWebVitals.fid.score}</span>
                </div>
            </div>
            
            ${tech.issues.length > 0 ? `
                <h3>Technical Issues</h3>
                <ul class="issues-list">
                    ${tech.issues.map(issue => `
                        <li class="issue-${issue.type}">
                            <strong>${issue.title}</strong>
                            <p>${issue.description} (Impact: ${issue.impact})</p>
                        </li>
                    `).join('')}
                </ul>
            ` : ''}
        </div>
    `
  }

  private static generateContentAudit(data: SEOReportData): string {
    const content = data.contentAudit
    return `
        <div class="section">
            <h2 class="section-title">Content Audit</h2>
            
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-value">${content.totalPages}</div>
                    <div class="metric-label">Total Pages</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${content.contentMetrics.averageWordCount}</div>
                    <div class="metric-label">Average Word Count</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${content.metadataCompleteness.titleTags.percentage}%</div>
                    <div class="metric-label">Pages with Title Tags</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${content.metadataCompleteness.metaDescriptions.percentage}%</div>
                    <div class="metric-label">Pages with Meta Descriptions</div>
                </div>
            </div>
            
            <h3>Metadata Completeness</h3>
            <div class="chart-container">
                <canvas id="metadataChart"></canvas>
            </div>
            
            <h3>Top Performing Pages</h3>
            <table>
                <thead>
                    <tr>
                        <th>URL</th>
                        <th>Title</th>
                        <th>Word Count</th>
                        <th>Meta Description</th>
                        <th>H1</th>
                    </tr>
                </thead>
                <tbody>
                    ${content.topPages.slice(0, 10).map(page => `
                        <tr>
                            <td><a href="${page.url}" target="_blank">${this.truncateUrl(page.url)}</a></td>
                            <td>${page.title || 'Missing'}</td>
                            <td>${page.wordCount}</td>
                            <td>${page.hasMetaDescription ? '✅' : '❌'}</td>
                            <td>${page.hasH1 ? '✅' : '❌'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `
  }

  private static generateKeywords(data: SEOReportData): string {
    const keywords = data.keywords
    return `
        <div class="section">
            <h2 class="section-title">Keyword Analysis</h2>
            
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-value">${keywords.totalKeywords}</div>
                    <div class="metric-label">Total Keywords</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${keywords.distribution.top10.count}</div>
                    <div class="metric-label">Top 10 Rankings</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${keywords.organicTraffic.estimated.toLocaleString()}</div>
                    <div class="metric-label">Estimated Traffic</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${keywords.organicTraffic.change > 0 ? '+' : ''}${keywords.organicTraffic.change}%</div>
                    <div class="metric-label">Traffic Change</div>
                </div>
            </div>
            
            <h3>Keyword Distribution</h3>
            <div class="chart-container">
                <canvas id="keywordChart"></canvas>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                <div>
                    <h3>Best Performing Keywords</h3>
                    <table>
                        <thead>
                            <tr><th>Keyword</th><th>Position</th><th>Volume</th><th>Change</th></tr>
                        </thead>
                        <tbody>
                            ${keywords.performingKeywords.best.slice(0, 5).map(kw => `
                                <tr>
                                    <td>${kw.keyword}</td>
                                    <td>${kw.position}</td>
                                    <td>${kw.volume.toLocaleString()}</td>
                                    <td style="color: ${kw.change > 0 ? 'green' : 'red'}">${kw.change > 0 ? '+' : ''}${kw.change}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div>
                    <h3>Improvement Opportunities</h3>
                    <table>
                        <thead>
                            <tr><th>Keyword</th><th>Position</th><th>Volume</th><th>Potential</th></tr>
                        </thead>
                        <tbody>
                            ${keywords.performingKeywords.worst.slice(0, 5).map(kw => `
                                <tr>
                                    <td>${kw.keyword}</td>
                                    <td>${kw.position}</td>
                                    <td>${kw.volume.toLocaleString()}</td>
                                    <td>High</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
  }

  private static generateBacklinks(data: SEOReportData): string {
    const backlinks = data.backlinks
    return `
        <div class="section">
            <h2 class="section-title">Backlink Profile</h2>
            
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-value">${backlinks.totalBacklinks.toLocaleString()}</div>
                    <div class="metric-label">Total Backlinks</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${backlinks.referringDomains}</div>
                    <div class="metric-label">Referring Domains</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${backlinks.domainRating}</div>
                    <div class="metric-label">Domain Rating</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${backlinks.referringDomainsGrowth.change > 0 ? '+' : ''}${backlinks.referringDomainsGrowth.change}</div>
                    <div class="metric-label">Monthly Growth</div>
                </div>
            </div>
            
            <h3>Top Referring Domains</h3>
            <table>
                <thead>
                    <tr>
                        <th>Domain</th>
                        <th>Backlinks</th>
                        <th>Domain Rating</th>
                        <th>Traffic</th>
                    </tr>
                </thead>
                <tbody>
                    ${backlinks.topReferringDomains.slice(0, 10).map(domain => `
                        <tr>
                            <td>${domain.domain}</td>
                            <td>${domain.backlinks}</td>
                            <td>${domain.domainRating}</td>
                            <td>${domain.traffic.toLocaleString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <h3>Anchor Text Distribution</h3>
            <table>
                <thead>
                    <tr><th>Anchor Text</th><th>Count</th><th>Percentage</th></tr>
                </thead>
                <tbody>
                    ${backlinks.anchorTexts.slice(0, 10).map(anchor => `
                        <tr>
                            <td>${anchor.text}</td>
                            <td>${anchor.count}</td>
                            <td>${anchor.percentage}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `
  }

  private static generateRecommendations(data: SEOReportData): string {
    if (!data.recommendations) return ''
    
    return `
        <div class="section">
            <h2 class="section-title">Recommendations & Roadmap</h2>
            
            <div class="recommendations-list">
                ${data.recommendations.map(rec => `
                    <div class="recommendation-card priority-${rec.priority}">
                        <h4>${rec.title}</h4>
                        <p>${rec.description}</p>
                        <div style="margin-top: 15px;">
                            <span class="health-badge health-${rec.priority === 'high' ? 'poor' : rec.priority === 'medium' ? 'fair' : 'good'}">
                                ${rec.priority.toUpperCase()} PRIORITY
                            </span>
                            <span style="margin-left: 10px; color: #718096;">
                                ${rec.timeframe} • ${rec.estimatedImpact.toUpperCase()} Impact
                            </span>
                        </div>
                        <div style="margin-top: 10px;">
                            <strong>Resources needed:</strong> ${rec.resources.join(', ')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `
  }

  private static generateFooter(data: SEOReportData): string {
    return `
        <div class="footer">
            <p>SEO Report generated on ${new Date(data.analyzedAt).toLocaleDateString()}</p>
            <p>Report covers: Technical SEO, Content Audit, Keywords, and Backlink Analysis</p>
        </div>
    `
  }

  private static getJavaScript(): string {
    return `
        // Metadata Chart
        const metadataCtx = document.getElementById('metadataChart');
        if (metadataCtx) {
            new Chart(metadataCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Title Tags', 'Meta Descriptions', 'H1 Tags'],
                    datasets: [{
                        data: [${this.getMetadataData()}],
                        backgroundColor: ['#667eea', '#764ba2', '#f093fb']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
        
        // Keyword Distribution Chart
        const keywordCtx = document.getElementById('keywordChart');
        if (keywordCtx) {
            new Chart(keywordCtx, {
                type: 'bar',
                data: {
                    labels: ['Top 3', 'Top 10', 'Top 50'],
                    datasets: [{
                        label: 'Keywords',
                        data: [${this.getKeywordData()}],
                        backgroundColor: ['#48bb78', '#4299e1', '#ed8936']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    `
  }

  private static getScoreClass(score: number): string {
    if (score >= 80) return 'score-excellent'
    if (score >= 60) return 'score-good'
    if (score >= 40) return 'score-fair'
    return 'score-poor'
  }

  private static mapCWVScore(score: string): string {
    return score === 'good' ? 'good' : score === 'needs-improvement' ? 'fair' : 'poor'
  }

  private static truncateUrl(url: string): string {
    return url.length > 50 ? url.substring(0, 50) + '...' : url
  }

  private static getMetadataData(): string {
    return '75, 60, 40' // This should be dynamically generated from data
  }

  private static getKeywordData(): string {
    return '15, 45, 120' // This should be dynamically generated from data
  }
}
