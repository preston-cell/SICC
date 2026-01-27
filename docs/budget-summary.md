# EstateAI: Budget Usage Summary

## Development Infrastructure Costs

### API and Cloud Services

| Service | Purpose | Pricing Tier | Monthly Cost |
|---------|---------|-------------|-------------|
| **Anthropic Claude API** | AI gap analysis, document generation, document review | Pay-per-token | Variable (usage-based) |
| **E2B** | Sandboxed code execution for AI agent runs | Developer tier | Variable (usage-based) |
| **Convex** | Real-time database and serverless backend | Free tier (dev) | $0 |
| **Vercel** | Frontend hosting and deployment | Free tier (Hobby) | $0 |
| **Clerk** | User authentication | Free tier (dev) | $0 |
| **Resend** | Email notifications | Free tier (100 emails/day) | $0 |
| **GitHub** | Repository hosting and version control | Free tier | $0 |

### Development Tools

| Tool | Purpose | Cost |
|------|---------|------|
| Node.js / npm | Runtime and package management | Free |
| TypeScript | Type safety | Free |
| Next.js | Application framework | Free (open source) |
| Tailwind CSS | Styling framework | Free (open source) |
| VS Code | Development environment | Free |

## Cost Breakdown by Phase

### Phase 1-4: Core Infrastructure and Intake (Weeks 1-2)
- Convex dev environment: Free tier
- Minimal API usage during development
- Primary cost: Anthropic API for testing gap analysis prompts

### Phase 5-7: Advanced Features and Design (Week 2-3)
- Increased Anthropic API usage for gap analysis testing
- E2B sandbox sessions for agent execution testing
- Vercel deployments for staging previews

### Phase 8-9: Document Generation and Upload (Week 3-4)
- Highest API usage period (document generation + analysis testing)
- E2B sessions for sandboxed document processing
- Multiple Vercel deployments for demo preparation

## Production Cost Projections

For production deployment at scale:

| Service | Per-User Estimate | 100 Users/mo | 1,000 Users/mo |
|---------|-------------------|---------------|-----------------|
| Anthropic API | ~$0.50-2.00/analysis | $50-200 | $500-2,000 |
| E2B | ~$0.10-0.50/session | $10-50 | $100-500 |
| Convex | Pro plan | $25 | $25-100 |
| Vercel | Pro plan | $20 | $20 |
| Clerk | Pro plan | $25 | $25-100 |
| **Total** | | **~$130-295/mo** | **~$670-2,720/mo** |

## Notes

- Development was conducted primarily on free tiers with pay-per-use API access
- The largest variable cost is the Anthropic Claude API, driven by the three-phase gap analysis (each analysis makes multiple Claude API calls)
- E2B costs are proportional to the number of sandboxed execution sessions
- All infrastructure services offer free development tiers sufficient for MVP testing
