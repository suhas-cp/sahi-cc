# AI-powered trading & investing experiences: research for Sahi (desktop)

**Status:** Research / divergent exploration. This is not a build plan.
**Date:** 8 October 2026
**Scope:** Desktop (web.sahi.com and desktop terminals) for **traders** (intraday and F&O) and **investors** (fundamentals, long-horizon).
**Web version:** [`sahi-ai-opportunity-map.html`](./sahi-ai-opportunity-map.html). Open it in a browser for the interactive value-chain canvas and the filterable concept catalogue.

---

## 0. TL;DR

1. **AI is now standard at brokers.** Almost every large broker has shipped an "explain what's happening" layer: Robinhood Cortex Digests, Public Alpha, eToro Tori, IBKR news summaries, Groww GR-1. Saying *why a stock moved* is now the baseline and won't set Sahi apart.
2. **2026 is the year of scoped agents.** Public (Agents), eToro (Agent Portfolios), Futu ("Expert" agent), Webull (external chatbot trading with caps) and Upstox (Agent Skill + MCP) all let AI act. Each one comes with consent, limits and a kill switch.
3. **Indian brokers are taking two routes.** One group opens the account to the user's own AI through MCP: Zerodha Kite MCP, Kotak Neo MCP and Upstox MCP. The other builds an in-house analyst: Groww GR-1, Dhan's Fuzz, Angel One's Ask Angel, Kotak's Neome. Nobody has an AI built specifically for *active F&O traders*, which is Sahi's core segment.
4. **Your value-chain canvas idea fills a real gap.** Supply-chain maps exist only in professional terminals: Bloomberg SPLC, FactSet Revere, Refinitiv Value Chains, Capital IQ. I found **no retail product** that maps second-order (ripple) effects. India has recent proof of the need: the 2021 chip shortage (Maruti at ~40% of normal output in Sept 2021) and the 2025 rare-earth magnet curbs (Bajaj Chetak output down ~50% in July 2025).
5. **The biggest gap with an ethical case behind it is trader discipline.** SEBI's FY25 study found that more than 91% of individual F&O traders lost money, with net losses of about ₹1.06 lakh crore. Brokers barely use AI for behavioural protection. Zerodha's nudges are rule-based, and Webull has "drift" alerts. Small startups (tilt detectors, AI journals) show demand but have little reach.
6. **Regulation shapes the design.** SEBI's AI/ML guidelines are imminent and call for human oversight, kill switches and broker accountability for third-party AI. Research analysts already have to disclose AI use. The retail algo framework has been mandatory since 1 April 2026 (Algo-ID, broker as principal). In practice the AI should **explain, surface, simulate and guard**, and it should not issue buy/sell calls unless they come through a registered research analyst.
7. **Desktop is where AI goes deepest.** Robinhood Legend, IBKR Desktop, Bloomberg ASKB and eToro's new desktop all embed AI into dense, multi-panel workflows: canvas, command bar, right-click "explain", saved workflows. Your n8n-style canvas is a natural fit for desktop.

---

## 1. Where Sahi starts from

From public listings (not Sahi's internal roadmap):

- A discount broker for **active F&O and intraday traders**, run by Aaritya Broking. It charges a flat ₹10 per order, and both a web platform and apps are available.
- Existing trader tooling: 1-click chart trading, trailing stop-loss, **Scalper Mode**, 20+ real-time scanners (momentum, volume shockers, breakouts, gap up/down, golden and death cross, 52-week high/low), an option chain with payoff and Greeks, GTT/GTC and basket orders.
- An existing AI hook: **"Buzzing Stocks & Sahi AI"**, which detects breakouts, trends and unusual market activity in real time.

**Implication:** Sahi already has trader DNA and a detection layer. The missing layers are **explanation** (why), **context** (what usually happens next, how it affects *me*), **discipline** (protecting traders from themselves) and a **fundamentals/investor** layer, which is where the value-chain idea sits.

---

## 2. Who is using AI: the landscape

### 2.1 Indian brokers and platforms

| Player | What they've shipped | Interaction model | Notes |
|---|---|---|---|
| **Zerodha** | **Kite MCP** (2025): connect Claude or other assistants to holdings, positions, orders and P&L. Example asks: drift vs target allocation, sector exposure, unrealised P&L. **Nudges**: rule-based pre-trade risk warnings (penny stocks, illiquid stocks, T2T). Partners: Tijori (supply-chain links), Sensibull (options) | Bring-your-own-AI with per-tool consent; order placement only if granted | Zerodha says penny-stock volumes fell >50% after the nudges (company claim, not independently verified) |
| **Groww** | **GR-1** (unveiled at Groww Next, Feb 2026): research analyst that reads markets, tracks news sentiment and gives portfolio-personalised insight. Explains *why* an MF was recommended and how it fits current holdings. Can draft an order-review card or set an alert but **never places trades itself**. MF Prime adds portfolio health checks, SIP monitoring and behavioural nudges | In-app assistant (icon on Stocks/Explore), opt-in beta, layered consent | Pilot reported at 30–50k users in March 2026 |
| **Dhan (Raise)** | **Fuzz**: India-focused finance AI model announced Aug 2025. Pitches "traceable", source-backed answers and data stored in India | Research assistant for serious investors | Raised $120M Series B (Oct 2025) partly for AI. I couldn't confirm Fuzz's current live status |
| **Angel One** | **ARQ Prime** (algorithmic stock/MF recommendations). **Ask Angel** conversational assistant (1.1M+ users). AI used across onboarding (face match, signature checks), tickets and an internal data-analyst agent. Says it is betting on **voice AI** | Assistant plus recommendation engine | Some analysts say parts of the "AI" are really research-analyst calls |
| **Upstox** | Trading Copilot for support (35% fewer agent handovers per Microsoft case study). **Agent Skill** (June 2026) lets Claude Code / Codex place live orders, stream data and manage portfolios, with confirmation prompts, LIMIT by default, lot-size validation, kill switch and sandbox. Claude plugin-marketplace install (Sept 2026), read-only or trading | Developer/agent-first | The clearest Indian example of agentic trading guardrails |
| **Kotak Neo** | **Neome**: multilingual AI assistant over Kotak research. **Kotak Neo MCP** (holdings, order book, research recos to Claude/Cursor). Rebranded the whole retail business as Kotak Neo (Oct 2026) | Assistant + MCP | Multilingual is a notable India angle |
| **Perplexity Finance** | Live earnings-call transcripts and concall schedules for NSE/BSE companies (Aug 2025), free | Research surface outside brokers | Shows that concall intelligence is becoming free |
| **Tijori** | Supply-chain links, revenue mix, raw-material prices and sector dashboards for Indian companies, built from annual reports and investor presentations | Research tool | Notes that the auto sector discloses customers and suppliers more than pharma or chemicals do. That's good news for the auto example |
| **Sensibull / Opstra** | Rule-based options strategy suggestions from a market view, payoff, Greeks, IV percentile, OI | Strategy builders | I found no true AI layer. This is where an "options copilot" could fit |

### 2.2 Global brokers

| Player | AI features | Why it matters for Sahi |
|---|---|---|
| **Robinhood: Cortex** (Gold-only in the US) | **Digests**: plain-language "what's moving this stock / your portfolio" from news, analyst ratings and real-time signals. Conversational assistant covering holdings, research, orders and navigation. **Natural-language scans and custom indicators** inside **Legend** (browser-based desktop platform) | The desktop scanner + NL indicator builder lines up directly with Sahi's scanners |
| **Public.com** | **Alpha** co-pilot on every asset page (explains moves, summarises earnings calls, Alpha button on news alerts). **Generated Assets** (May 2025): a plain-English theme becomes a custom index backtested vs S&P 500, with 2,500+ built in the first month. **Agents** (2026): NL instructions that monitor, move cash and trade, with follow-up questions before activation, a visible activity log and pause/kill | "Theme to basket" and "instruction to agent" with clarifying questions |
| **eToro: Tori** | Memory across sessions, real-time X sentiment (via Grok), **Agent Portfolios** that may trade only inside an allotted sub-portfolio, proactive "why it moved" alerts, WhatsApp/Apple Watch delivery. AI-first app plus new **desktop platform for active traders** (July 2026) | Scoped autonomy through a sub-portfolio budget |
| **Webull: Vega** | Portfolio review against **stated goals**. **Alerts when trading behaviour drifts from the user's own strategy**. Voice orders that show the **interpreted order before submitting**. External chatbots can trade with symbol whitelists, size caps, forced preview or read-only mode | Behavioural drift alerts and "show interpretation first" are both directly reusable |
| **moomoo / Futu** | AI trend projection that compares a chart to historical patterns from up to 100 other stocks. Daily/weekly digests from 200+ sources. **"Expert" agent mode** (July 2026, "Agentic AI + Skills"), covering strategy generation through simulated trading | Pattern-analogue charts and strategy-to-paper-trade flow |
| **Tiger Brokers: TigerGPT** | DeepSeek-R1 reasoning model (Feb 2025) for multi-step market analysis. 1.17M conversations since 2023 | Reasoning-model research assistant |
| **Interactive Brokers** | AI news summaries filtered to portfolio and watchlist, AI-tagged "Hot News". **Ask IBKR** (Oct 2025): natural-language portfolio analytics (performance vs benchmark, allocation, holdings, activity) **in IBKR Desktop**, with suggested queries and dropdown refiners | NL query plus structured refiners suits a desktop power user |
| **Bloomberg: ASKB** (beta, Feb 2026) | Multi-agent conversational layer over all Terminal data. **Cites sources**, **shows the BQL code** behind each answer, generates annotated charts, **saves, re-runs and shares workflows**, schedules Morning Reports and syncs desktop to mobile | The gold standard for *trust UX* in professional finance AI |
| **TradingView: Chart Copilot** (beta, Apr 2026) | Trend strength, key levels, patterns and news-based move explanations on the chart | Chart-native AI |
| **Composer** | "Trade with AI": plain-English prompt becomes a backtested, executable strategy in under 60s. "Help me choose" (3 questions produce 3 strategies) | Fast prompt-to-backtest loop |
| **Fiscal.ai (ex-FinChat)** | Copilot over filings, transcripts and 2,250+ segment KPIs, auditable back to source filings | Segment-level KPI data, which is what a value-chain view needs |

### 2.3 Professional supply-chain / value-chain tools (inspiration for idea #1)

- **Bloomberg SPLC:** interactive supplier/customer diagram plus a table of supplier margins, inventory vs sales growth and cash cycles. Some links are marked as **"implied"** relationships (inferred from news and analyst reports).
- **FactSet Revere:** customers, suppliers, competitors and partners drawn from filings, presentations and press releases, plus geographic revenue exposure.
- **Refinitiv Workspace Value Chains** and **Capital IQ Business Relationships.**
- Research: Bloomberg has tested graph neural networks on supply-chain data for portfolio construction, and an arXiv paper (2026) notes that few have built comprehensive stock-market knowledge graphs for retail-usable insight.
- **Gap:** I found no retail-facing product that maps ripple effects to suppliers and customers.

### 2.4 Patterns across the market

1. **"Explain" is table stakes.** Digests, "why it moved" and news summaries are everywhere now.
2. **Chat compiles into an artifact.** The best products don't leave users stuck in chat. A prompt becomes a *visible, editable* object: a scan, an indicator, a strategy, an order card, a BQL query, an index.
3. **Show the interpretation before acting.** Webull voice preview, Groww's order review card and Public's clarifying questions all do this.
4. **Autonomy comes with explicit limits.** eToro uses sub-portfolio budgets, Webull uses symbol and size caps, Upstox has a kill switch, Zerodha MCP has per-tool consent.
5. **Proactive beats reactive.** Tori, Robinhood and IBKR push personalised "this matters to you" alerts.
6. **Memory and personalisation:** eToro memory, Bloomberg profile (role, focus, preferences).
7. **Open ecosystems through MCP in India:** Zerodha, Kotak and Upstox let users bring Claude or other assistants.
8. **Two areas remain under-served:** **behaviour/discipline** and **causal or supply-chain reasoning** for retail.

---

## 3. Guardrails that shape any design (India)

| Constraint | What it says | Design implication |
|---|---|---|
| **SEBI F&O study (FY25)** | >91% of individual F&O traders made net losses. Aggregate net loss ~₹1,05,603 cr, up 41% on FY24 (FY22–24: 93% lost, >₹1.8 lakh cr) | AI that *increases* trading frequency is ethically and reputationally risky. AI that *protects* traders is a strong positioning |
| **SEBI AI/ML guidelines** (consultation June 2025; chairman said in Aug 2026 that they're coming "shortly") | Five principles: governance, investor protection/disclosure, testing, fairness/bias, data/cyber. Human oversight and **kill switches**. Tiered approach. **The regulated entity is accountable for AI it uses, including third-party tools.** Disclosure of AI use where it affects clients | Visible AI labelling, human-in-the-loop for actions, kill switch, audit logs, model testing |
| **SEBI Intermediaries (Amendment) Regs 2025** | New chapter on AI usage | Same as above |
| **Research Analyst / Investment Adviser rules** (Dec 2024 amendment; Jan 2025 circular) | RAs and IAs must disclose the **extent of AI-tool use** in research and advice. "Trading calls" formally defined | AI that says "buy X" crosses into regulated advice. Keep it explaining, comparing and simulating unless it goes through a registered RA |
| **Retail algo framework** (circular 4 Feb 2025; mandatory 1 Apr 2026) | Every algo order is tagged with an exchange **Algo-ID**. The broker is principal and providers are agents. Strategies above 10 orders per second must be registered. Static IP for API use | Any "describe a strategy and let AI run it" feature has to route through this framework |
| **AI/ML reporting** (exchange circulars) | Half-yearly AI/ML disclosure by trading members | Keep an inventory of AI features |
| **IOSCO (Mar 2025)** | Flags over-reliance on AI, concentration on a few providers, and the human-AI interaction risk. Retail herding (meme episodes) is a stated concern | Avoid serving everyone the same AI "pick", because it risks herding |
| **Trust data** | 31% of US investors would act on GenAI financial advice **without verifying** it (CFP Board, 2023) | Users may *over*-trust AI. Design for verification with citations, confidence levels and base rates |

---

## 4. Deep dive: the value-chain canvas (your idea #1)

### 4.1 Why it's promising

- **The need is real and recent.** In the 2021 chip shortage, Maruti guided to ~40% of normal output for Sept 2021, ~60% for Oct and ~85% for Nov. Q2 FY22 profit fell 66% YoY and ~1.16 lakh vehicles were not produced. Tata Motors' JLR expected a ~50% wholesale drop in Q2 FY22. In 2025, China's April export licensing on rare earths cut Bajaj Chetak output nearly 50% in July. Rajiv Bajaj warned of a possible "zero month" in August, and production restarted on 20 August. Maruti reportedly cut near-term e-Vitara targets by two-thirds.
- **Signals were visible before the stock moved.** Bajaj flagged a "dark cloud" over magnet supply on its May 2025 earnings call, weeks before the production impact. A chain view would have put the magnet node on amber at that point.
- **Investors who don't read charts need a mental model.** Fundamentals investors reason in causes (inputs, capacity, demand, margins), and a graph makes that reasoning visible.
- **There is no retail competitor.** Professional tools exist, but none is aimed at retail investors (see §2.3).

### 4.2 Anatomy of the canvas (n8n-style)

In n8n, each node shows its live input, output and status, and data visibly flows along edges. Map that to a company:

```
 ┌──────────── INPUTS ────────────┐   ┌─────── COMPONENTS ──────┐   ┌──── COMPANY ────┐   ┌──────── DEMAND ─────────┐
 │ Steel / Aluminium / Copper     │──▶│ Castings, forgings      │──▶│                 │──▶│ Dealers & inventory     │
 │ Rubber / Crude derivatives     │──▶│ Tyres, plastics         │──▶│   OEM           │──▶│ Auto loans (rates,      │
 │ Rare-earth magnets  ⚠ STRESS   │──▶│ EV motors               │──▶│ (e.g. Maruti,   │   │   NBFC/bank appetite)   │
 │ Semiconductors      ● NORMAL   │──▶│ ECUs, infotainment      │──▶│  Tata, M&M,     │──▶│ Rural demand (monsoon)  │
 │ Lithium cells                  │──▶│ Battery packs           │──▶│  Bajaj)         │──▶│ Urban demand, exports   │
 └────────────────────────────────┘   └─────────────────────────┘   └─────────────────┘   └─────────────────────────┘
          ▲ side inputs: FX (e.g. JPY/USD exposure) · emission/EV policy & subsidies · freight & logistics · tax changes
```

**Node** = an economic dependency, such as a commodity, component, supplier group, demand driver or policy. Each node carries:
- **State:** Normal / Watch / Stress / Disrupted, colour-coded and driven by live signals (commodity price, import data, news, management commentary, peer disclosures).
- **Listed companies at this node**, including the user's holdings, highlighted.
- **Evidence drawer:** the news, filings and concall quotes behind the current state, with dates and sources.

**Edge** = a dependency between nodes. Each edge carries:
- **Strength:** share of cost or revenue exposed, where disclosed.
- **Substitutability:** alternate sources, ease of switching.
- **Lag:** how long a shock takes to hit (inventory buffer, lead time).
- **Provenance:** *disclosed* (solid line) vs *AI-inferred* (dashed line), following Bloomberg's "implied relationship" practice, plus a confidence level.

### 4.3 Interactions to explore

| Interaction | What the user does | What AI contributes |
|---|---|---|
| **Build-a-chain** | Open any stock and press "Show value chain" | Builds the graph from annual reports, investor decks, concalls and peer filings, then labels each edge disclosed or inferred |
| **Live status** | Glance at the canvas | Colours nodes by real-time signals and pulses the ones that changed today |
| **Click to drill down** | Click a node | Summary of the node's health, key metric charts (e.g., rare-earth prices), evidence with citations, which listed companies sit at this node |
| **Ripple / propagate** | Select a stressed node, then "Show ripple" | Animates first-, second- and third-order effects downstream and upstream, with estimated lag and size ranges (never point predictions) |
| **What-if shock** | Drag a slider: "chip supply −30% for 2 quarters" | Scenario narrative plus which companies are most and least exposed and why. Labelled as a simulation, not a forecast |
| **Shock-first entry** | Start from an event ("China restricts rare earths") rather than a company | Builds a **shock map** of every sector and company exposed, and how much is in *my* portfolio |
| **Portfolio overlay** | Toggle "My holdings" | Highlights the user's stocks on the graph and computes **hidden concentration** (e.g., "4 holdings depend on one input") |
| **Compare chains** | Put two OEMs side by side | Shows differences in exposure (EV-heavy vs ICE-heavy, import dependence) |
| **Time scrubber / replay** | Scrub back to 2021 or mid-2025 | Replays how the chain turned red and how the stocks reacted. This teaches the pattern |
| **Watch a node** | Pin "Semiconductors" | Alerts when the node changes state, with a plain-language "why this matters for your holdings" |
| **Thesis-break map** | Mark "these nodes would break my thesis" | Turns the user's thesis into monitored nodes (links to Thesis Tracker, §5) |
| **Ask the canvas** | "Which auto ancillaries benefit if EV adoption accelerates?" | Answers in the canvas itself by highlighting nodes and paths, not only in chat |
| **Zoom levels** | Scroll out or in | Economy → sector → company → component, like a map |

### 4.4 Variants beyond supply chains (same canvas, different lens)

- **Macro transmission maps:** repo rate → bank NIMs → NBFC lending → auto loans → two-wheeler demand. Crude → OMCs, paints, tyres, aviation. Monsoon → rural income → tractors, two-wheelers, FMCG. USD/INR → IT exporters and pharma.
- **Policy/Budget maps:** a scheme, duty or tax change, shown with who benefits and who's hurt, and by how much.
- **Thematic maps:** EV, defence, railways, data centres, semiconductors in India. The chain becomes a discovery tool ("which listed company makes *this* part?").
- **Competitive maps:** peers, substitutes, new entrants.
- **Spillover maps for news:** when one company's event re-prices linked firms. For example, an AI product launch in Feb 2026 wiped value from data and analytics firms that had nothing to do with it.
- **Sector-specific examples:** pharma (China API dependence, US FDA), IT (US client budgets, visas, currency), FMCG (palm oil, monsoon), cement (coal/petcoke, infra spend), aviation (fuel, engine availability).

### 4.5 Hard problems to research

1. **Data completeness.** Supply-chain disclosure is thin. The US mandate covers only customers above 10% of revenue, and India has no comprehensive mandate. Tijori notes that auto discloses more than pharma or chemicals, so **auto is a good first sector**.
2. **Inferred links and confidence.** Users need to see which links are disclosed and which are guessed. How do we show confidence without clutter?
3. **Correlation vs causation.** The canvas must not imply certainty. Show ranges and lags, and use language like "exposed to" rather than "will fall".
4. **Staleness.** Chains change slowly but node states change daily. Separate the "structure" refresh cadence from the "signal" refresh cadence.
5. **Cognitive load.** Real chains are hairballs. Use progressive disclosure, a "show only what changed" mode and smart collapsing.
6. **Advice line.** "Exposed companies" lists can read like recommendations, so this needs careful framing (see §3).

---

## 5. Divergent concept catalogue

Legend: **I** = investor · **T** = trader · **B** = both. *Precedent* is the closest existing product, if any.

### 5.1 Discover

| # | Concept | User | What AI does | Precedent |
|---|---|---|---|---|
| D1 | **Natural-language screener** | B | "Debt-free auto ancillaries with >20% EV revenue and rising margins" compiles into visible, editable filters | Robinhood Cortex scans, Futu AI screening, ASKB showing query code |
| D2 | **Idea-to-basket (theme builder)** | I | Theme in plain words → candidate basket → backtest vs Nifty → monitor. Research-only framing | Public Generated Assets |
| D3 | **Value-chain discovery** | I | "Who makes the parts for X?" Browse the chain to find listed suppliers | Tijori links; pro SPLC tools |
| D4 | **Buzzing stocks with a "why"** | T | Extends Sahi AI's breakout detection with the cause (news, block deal, OI build-up, sector move) and **base rates** ("past 50 similar breakouts: X% follow-through") | Robinhood Digests, moomoo pattern analogues |
| D5 | **Unusual-activity explainer for F&O** | T | Unusual OI, IV spikes or PCR shifts get a plain-language reading and a list of likely interpretations | Sensibull data (no AI layer) |
| D6 | **Event radar** | B | Calendar of results, RBI policy, expiry, Budget, global data, filtered to *my* holdings and positions, with an implied move vs historical move for each | IBKR filtered news; Perplexity concall calendar |
| D7 | **Peer and "similar company" finder** | I | "Companies like X but smaller / cheaper / less China-dependent" | Fiscal.ai segment KPIs |

### 5.2 Understand (research)

| # | Concept | User | What AI does | Precedent |
|---|---|---|---|---|
| U1 | **Value-chain canvas** (§4) | I | Causal map with live node states, ripple and what-if | Pro only |
| U2 | **"Why is it moving" on the chart** | B | Hover a candle or gap to get an AI annotation of what happened then (news, filings, deals), pinned on the timeline | Robinhood Digests, TradingView Chart Copilot |
| U3 | **Concall copilot** | I | Live transcript, key takeaways, **tone shift vs last quarter**, Q&A topics that analysts pushed on | Perplexity live transcripts |
| U4 | **Management promise ledger** | I | Tracks what management guided vs what they delivered, quarter by quarter, with a credibility score per company | None found |
| U5 | **Filing diff** | I | "What changed in this annual report vs last year": new risks, auditor remarks, related-party transactions, promoter pledge, contingent liabilities | None found for retail |
| U6 | **Red-flag scanner** | I | Governance and accounting warning signs, surveillance-list status, pledge increases, frequent auditor changes | Zerodha rule-based nudges |
| U7 | **Ask-anything analyst with citations** | B | Research Q&A grounded in Indian filings, prices and news. Every claim links to its source. Shows the query or formula used | Dhan Fuzz, Groww GR-1, Bloomberg ASKB |
| U8 | **Compare mode** | I | Two or three companies side by side with an AI narrative of the real differences | Fiscal.ai |
| U9 | **Results one-pager** | I | Post-results summary: beat/miss vs history, segment trends, guidance change, what to watch | Public Alpha earnings summaries |
| U10 | **Inline jargon explainer** | B | Hover any term (PCR, IV, max pain, EBITDA) for an in-context explanation using the user's *current* numbers, in English, Hindi or Hinglish | Kotak Neome (multilingual) |
| U11 | **Market-regime strip** | T | One line of context: "trend day vs range day, VIX elevated, FII selling, global cues", so traders know the environment before trading | moomoo digest |

### 5.3 Decide and plan

| # | Concept | User | What AI does | Precedent |
|---|---|---|---|---|
| P1 | **Thesis tracker** | I | User writes a thesis in plain words. AI turns it into monitorable KPIs and nodes, watches filings and news, and reports "thesis intact / weakening / broken" | None found |
| P2 | **Options strategy copilot** | T | "Mildly bullish on Nifty till Thursday, max loss ₹5k" gives candidate structures with payoff, Greeks, margin and probability, and explains the trade-offs | Sensibull (rule-based); AI conversation is new |
| P3 | **Scenario / what-if on positions** | T | "Nifty −2% and VIX +3 by 2 pm?" produces a P&L heatmap and shows which leg hurts | Opstra simulator (non-AI) |
| P4 | **Strategy from words → backtest → paper** | T | Describe rules, see them compiled into a visual strategy, backtest, paper-trade, then go live only through the algo framework | Composer, Futu Expert mode |
| P5 | **Pre-market trading plan** | T | AI helps write today's plan (levels, setups, max loss, max trades) and holds the user to it during the session | Tradezella-style planning |
| P6 | **Portfolio X-ray** | I | Concentration, MF and stock overlap, sector and factor exposure, **hidden exposure through value chains**, drift vs target | Zerodha MCP drift example, Groww Prime health check, Ask IBKR |
| P7 | **Rebalance / tax-aware what-if** | I | "If I trim X, what happens to my exposure and taxes?" Includes harvesting the long-term capital-gains exemption and tax-loss harvesting ideas, as education | None found at Indian brokers |
| P8 | **Event-day preparation brief** | T | Before results, policy or expiry days: implied move, historical reactions, liquidity notes | None found |

### 5.4 Act (execute)

| # | Concept | User | What AI does | Precedent |
|---|---|---|---|---|
| E1 | **Command-bar / natural-language order entry** | T | "Buy 2 lots Nifty 25000 CE limit 120 SL 90" becomes a structured ticket preview that the user confirms. Voice optional | Webull voice orders with interpreted preview |
| E2 | **Smart pre-trade check** | T | Before submitting, checks risk per trade vs capital, margin, event risk ("results tomorrow"), liquidity and slippage, circuit proximity, "adding to a loser", "3rd trade in 10 min after a loss" | Zerodha Nudges (rule-based) |
| E3 | **Adaptive stops** | T | Suggests stop and trailing distance from current volatility. Builds on Sahi's trailing SL | — |
| E4 | **Instruction-to-alert** | B | "Tell me if Bank Nifty breaks yesterday's high with 2× volume" becomes a visible, editable rule | Robinhood Cortex NL indicators |
| E5 | **Guarded agents** | B | Monitoring and conditional-action agents with a capital budget, symbol whitelist, size caps, forced preview, kill switch, activity log and Algo-ID tagging | Public Agents, eToro Agent Portfolios, Upstox Agent Skill, Webull caps |
| E6 | **Bring-your-own-AI (Sahi MCP)** | T (power users) | Let users connect Claude or other assistants with per-tool consent: read-only by default, trading opt-in | Zerodha, Kotak, Upstox MCP |

### 5.5 Monitor

| # | Concept | User | What AI does | Precedent |
|---|---|---|---|---|
| M1 | **Personal morning brief and evening wrap** | B | "What changed overnight that matters to *my* holdings and positions" | Bloomberg Morning Reports, Robinhood Portfolio Digests |
| M2 | **P&L attribution** | B | "Portfolio −2% today: 60% from IT holdings after a US tech sell-off" | Ask IBKR performance queries |
| M3 | **Live position narrator** | T | "Your short straddle's delta is now +0.4, near your adjustment rule" | None found |
| M4 | **Proactive "this matters to you" alerts** | B | Filters the news firehose to items that affect holdings or watched value-chain nodes, and explains why | eToro Tori, IBKR filtered news |
| M5 | **Node watch** (from §4) | I | Alerts when a dependency in a holding's value chain changes state | None found |
| M6 | **Tip / scam shield** | B | Paste a WhatsApp or Telegram tip and get a check: surveillance status, promoter pledges, volume pattern typical of pump-and-dump, whether the source is registered | None found. India-specific need |

### 5.6 Reflect and improve (the discipline layer)

| # | Concept | User | What AI does | Precedent |
|---|---|---|---|---|
| R1 | **Tilt / revenge-trade detection** | T | Detects patterns such as a loss followed by a bigger position and a quick re-entry, or bursts of trades, size spikes after drawdown, stop widening. Responds with a soft intervention: cool-down, size reminder, "take 10 min?" | Webull drift alerts; startups (StopTilt, TradeMindful) |
| R2 | **User-set guardrails** | T | Daily loss limit, max trades and max size, set by the user while calm and enforced by the platform when the user is not | Anti-Tilt app "max-loss lock" |
| R3 | **Auto-journal** | T | Every trade logged with context (setup, market regime, time, holding period). Optional emotion tag | Tradezella |
| R4 | **Weekly behaviour report** | T | "You lose most in the first 15 min", "Your win rate halves after 2 losses", "Cost of impatience: ₹X" | TradeMindful "cost of impatience" |
| R5 | **Rule-drift alerts** | T | Compares actual behaviour with the user's stated plan or strategy | Webull Vega |
| R6 | **Session replay with coach** | T | Replay a past day with commentary on decision points | None found |
| R7 | **Personal micro-lessons** | B | Short lessons triggered by the user's *own* mistakes, not generic courses | None found |
| R8 | **Paper-to-live graduation** | T | Paper-trade a strategy, then unlock live trading after evidence of discipline | Futu simulated trading |

---

## 6. Interface paradigms suited to desktop

1. **Canvas workspace (n8n-style):** for value chains, strategies (condition → action nodes) and research boards that link notes, charts and AI findings.
2. **Command palette (Ctrl/Cmd+K):** navigate, query and act with the keyboard. Power traders live on the keyboard.
3. **Right-click or hover "Explain / Compare / Alert / Add to thesis"** on any object: candle, option-chain cell, holding row, node.
4. **Side-panel copilot with memory:** persists context across sessions and knows the user's style (eToro memory, Bloomberg profile).
5. **Intent-based layouts:** "Set up for Bank Nifty expiry scalping" makes AI arrange the panels (1-min chart, option chain, OI, positions, P&L).
6. **Saved and shareable AI workflows:** re-run "my Friday portfolio review" (Bloomberg ASKB pattern).
7. **Chat that produces an artifact:** every answer can become a scan, alert, strategy, chart or basket the user can edit directly.
8. **Multi-monitor awareness:** pop the copilot, canvas or journal out to a second screen.
9. **Multilingual and voice:** Hindi and Hinglish explanations. Angel One and Kotak are already going this way.

---

## 7. Trust and safety design principles (from the research)

| Principle | Seen at | For Sahi |
|---|---|---|
| **Cite everything** | Bloomberg ASKB, Dhan Fuzz ("traceable"), Fiscal.ai (audit to filing) | Each claim links to a filing, news item or data point |
| **Show the logic** | ASKB shows BQL; Robinhood NL indicators compile to rules | The scan, strategy or indicator is shown as editable rules |
| **Interpret before acting** | Webull voice preview, Groww order review card, Public clarifying questions | Every AI-initiated action produces a preview card that needs a click to confirm |
| **Scoped autonomy** | eToro sub-portfolio, Webull caps, Zerodha per-tool consent | Budgets, whitelists, caps, read-only default |
| **Kill switch and audit log** | Upstox, Public, SEBI's direction | One-click stop for all agents, with a full history |
| **Inform, don't recommend** | Robinhood, Tori and GR-1 disclaimers; SEBI RA rules | Explain, compare and simulate. No buy/sell calls unless through a registered RA, with AI-use disclosure |
| **Ranges and base rates, not predictions** | — | "Historically X–Y%" rather than "will go up" |
| **Show uncertainty** | Bloomberg "implied" links | Show disclosed vs inferred and confidence levels |
| **Avoid herding** | IOSCO concerns | Personalise. Don't push the same "top pick" to everyone |
| **Data stays in India** | Dhan Fuzz | Relevant for regulation and trust |

---

## 8. Where the white space is (evaluation lens)

A qualitative read to steer the next research round, not a roadmap.

| Concept cluster | User value | Needs AI? | Differentiation vs Indian peers | India data availability | Regulatory / trust risk |
|---|---|---|---|---|---|
| Value-chain canvas + shock maps (U1, D3, M5) | High (investors) | High | **Very high** (no retail equivalent) | Medium (auto good, others thin) | Medium (must not read as advice) |
| Discipline layer (R1–R5, E2) | **Very high** (91% lose) | Medium–High | **High** (only rule-based nudges today) | High (own trade data) | Low (protective). Tension with per-order revenue |
| Options strategy copilot (P2, P3) | High (core Sahi users) | Medium | High (no AI options copilot found in India) | High | Medium (could look like advice) |
| NL scans, alerts, indicators (D1, E4) | High | High | Medium (Robinhood has it; Indian peers don't) | High | Low |
| "Why it moved" + base rates (D4, U2) | Medium–High | High | Low–Medium (table stakes globally) | High | Low |
| Concall / filings intelligence (U3–U5) | High (investors) | High | Medium (Perplexity is free) | High | Low |
| Guarded agents (E5) and MCP (E6) | Medium (power users) | High | Low–Medium (Upstox, Zerodha, Kotak are already there) | High | **High** (algo framework, kill switch) |
| Thesis tracker (P1) | High (investors) | High | High | Medium | Low |
| Tip / scam shield (M6) | High (India-specific) | Medium | High | Medium | Low |

Two clusters stand out because they are both differentiated and fit Sahi's identity: **(a) the value-chain canvas**, which is the investor-side wedge, and **(b) the discipline layer**, which is the trader-side wedge and has a strong ethical story given the SEBI data. A third option is the **options copilot**, which builds directly on Sahi's existing trader DNA.

---

## 9. Open questions for user research

**Investors / value-chain canvas**
1. Do fundamentals investors want to *understand the chain* themselves, or just get alerted when something in it breaks?
2. How much do they trust AI-*inferred* links vs disclosed ones? Does a dashed edge lower trust in the whole canvas?
3. Which starting point feels more natural: company-first ("show me Maruti's chain") or shock-first ("what does a rare-earth ban hit")?
4. What is the right depth before it becomes a hairball? Tier-1 only, or tier-2 and beyond?
5. Would they pay for this, or does it belong in the free tier as an engagement driver?

**Traders / discipline**
6. Will active traders accept friction such as cool-downs and loss locks? Does it have to be *self-set* to be accepted?
7. Where is the line between a helpful nudge and a nanny?
8. Do traders want a live narrator during market hours, or only post-session reviews?

**Both**
9. Chat vs canvas vs command bar: which mode suits which job?
10. What level of citation and "show your work" makes AI output feel trustworthy without slowing users down?
11. Language: English only, or Hindi/Hinglish explanations? Is voice useful on desktop?
12. How do users feel about AI acting for them (agents) vs only advising? What limits make it feel safe?

**Suggested research methods:** contextual inquiry with 5–8 F&O traders and 5–8 fundamentals investors; a diary study during one results season; concept tests of a static value-chain canvas for one auto OEM; card sorting of the §5 catalogue by perceived value.

---

## 10. Sources

**Sahi**
- [Chittorgarh: Sahi broker review](https://www.chittorgarh.com/stockbroker/Sahi/184/)
- [Investorgain: Sahi review](https://www.investorgain.com/discount/sahi-review/)

**Indian brokers and platforms**
- [Zerodha: Connect your account to AI assistants with Kite MCP](https://zerodha.com/z-connect/featured/connect-your-zerodha-account-to-ai-assistants-with-kite-mcp)
- [Zerodha support: What is a nudge](https://support.zerodha.com/category/trading-and-markets/alerts-and-nudges/nudges/articles/what-is-nudge)
- [ThinkInsights: Zerodha's nudge theory playbook](https://thinkinsights.net/consulting/zerodhas-nudge-theory-playbook)
- [Zerodha: New on Tijori](https://zerodha.com/z-connect/business-updates/new-on-tijori)
- [ValuePickr: Tijori thread (data sources)](https://forum.valuepickr.com/t/tijori-view-key-non-financial-metrics-from-annual-reports/19594?page=2)
- [Entrackr: Groww showcases AI tools at Groww Next 2026](https://entrackr.com/news/groww-showcases-ai-powered-investing-tools-at-groww-next-2026-11168623)
- [Groww: GR-1 product update](https://groww.in/updates/gr-1-ai-investing-assistant-groww)
- [Business Standard: Groww builds AI-powered platform](https://www.business-standard.com/companies/news/groww-builds-ai-powered-platform-across-trading-wealth-and-fixed-income-126022800536_1.html)
- [Raise Financial Services launches Fuzz AI](https://completeaitraining.com/news/raise-financial-services-launches-fuzz-ai-for-serious/)
- [IBS Intelligence: Raise raises $120M](https://ibsintelligence.com/ibsi-news/raise-financial-services-raises-120m-to-fuel-ai-and-investing-innovation/)
- [Investing.com: Angel One earnings call transcript](https://www.investing.com/news/transcripts/earnings-call-transcript-angel-one-q1-2026-profit-jumps-as-growth-cools-93CH-4794754)
- [Multibagg: Angel One Q3 FY26 and AI](https://www.multibagg.ai/market-pulse/articles/angel-one-q3-fy26-growth-90356)
- [MarketsEasy: Indian brokers and AI signals](https://marketseasy.in/blog/indian-brokers-ai-signals-intraday-breakout-stocks-2026)
- [Upstox: Agent Skills launch](https://upstox.com/developer/api-documentation/announcements/agent-skills-launch/)
- [Microsoft: Upstox customer support copilot](https://www.microsoft.com/en-in/aifirstmovers/upstox)
- [Kotak Neo MCP](https://www.kotakneo.com/platform/kotak-neo-mcp/)
- [Hans India: Kotak Securities rebrands as Kotak Neo](https://www.thehansindia.com/business/market-compass/kotak-securities-rebrands-as-kotak-neo-1130092)
- [TechCrunch: Perplexity live earnings transcripts for Indian stocks](https://techcrunch.com/2025/08/18/perplexity-now-supports-live-earnings-call-transcripts-for-indian-stocks/)
- [Zerodha: Introducing Sensibull](https://zerodha.com/z-connect/tradezerodha/sensibull/introducing-sensibull-the-options-trading-platform)

**Global brokers and tools**
- [Robinhood: Cortex](https://robinhood.com/us/en/support/articles/cortex)
- [Robinhood: Cortex Digests](https://robinhood.com/us/en/support/articles/cortex-digests)
- [Benzinga: Cortex Digests in UK](https://benzinga.com/markets/tech/25/08/47252402/robinhood-unveils-cortex-ai-tool-digests-in-uk-bringing-real-time-stock-explanations-to-everyday-investors-after-95-us-approval)
- [TipRanks/The Fly: Robinhood custom scans in Cortex](https://www.tipranks.com/news/the-fly/robinhood-product-manager-introduces-custom-scans-widget-within-cortex-thefly)
- [FX News Group: Public introduces Alpha](https://fxnewsgroup.com/forex-news/retail-forex/public-introduces-ai-based-investing-co-pilot-alpha/)
- [FX News Group: Public's agentic brokerage](https://fxnewsgroup.com/forex-news/retail-forex/public-introduces-new-phase-of-its-ai-vision-agentic-brokerage/)
- [eCommerce News: Public rolls out AI agents](https://e-commerce.news/story/public-rolls-out-ai-agents-to-automate-trading-strategies)
- [Sahm Capital: eToro launches AI-first app](https://www.sahmcapital.com/news/content/etoro-launches-new-app-ai-first-smart-and-social-2026-07-07)
- [Quiver Quant: eToro AI-first app, agentic tools, desktop platform](https://www.quiverquant.com/news/eToro+Unveils+AI-First+Mobile+App%2C+Agentic+Trading+Tools+and+New+Desktop+Platform+at+London+Event)
- [Finance Magnates: Webull voice orders in AI tool](https://www.financemagnates.com/forex/webull-voice-activated-stock-orders-come-to-free-ai-tool)
- [Stork.ai: Webull overview (agent caps)](https://www.stork.ai/en/webull)
- [moomoo: AI trading features](https://moomoo.com/au/feature/aitrading)
- [Macau Business: Futu AI agentic upgrade](https://macaubusiness.com/futu-unveils-major-ai-upgrade-making-professional-agentic-investing-accessible-to-all-seize-the-next-rally-with-futu-ai)
- [AAP: TigerGPT DeepSeek integration](https://www.aap.com.au/aapreleases/cision20250218ae21242/)
- [Business Wire: IBKR AI news summaries](https://www.businesswire.com/news/home/20241211090832/en)
- [Good Money Guide: Ask IBKR](https://goodmoneyguide.com/investing/interactive-brokers-launches-ask-ibkr-an-ai-tool-that-offers-instant-portfolio-insights/)
- [FX News Group: Ask IBKR on IBKR Desktop](https://fxnewsgroup.com/forex-news/platforms/interactive-brokers-adds-ask-ibkr-functionality-to-ibkr-desktop-platform/)
- [The TRADE: Bloomberg embeds agentic AI (ASKB)](https://thetradenews.com/bloomberg-embeds-agentic-ai-into-the-terminal)
- [FinTech Global: ASKB to mobile](https://fintech.global/2026/08/19/bloomberg-extends-askb-ai-assistant-to-mobile-devices/)
- [TradersPost: TradingView AI tools 2026](https://blog.traderspost.io/article/best-ai-trading-tools-tradingview-2026)
- [Business Wire: Composer Trade with AI](https://www.businesswire.com/news/home/20251021050436/en/Composer-Supercharges-Investing-Platform-with-New-Trade-With-AI-Tool)
- [TraderHQ: Koyfin vs FinChat (Fiscal.ai)](https://traderhq.com/koyfin-vs-finchat/)
- [Tradezella: AI trading coach](https://www.tradezella.com/blog/ai-trading-coach)
- [AlternativeTo: StopTilt](https://alternativeto.net/software/stoptilt/about/)

**Supply chain / value chain**
- [Emory Libraries: Bloomberg SPLC guide](https://prod.libraries.emory.edu/sites/default/files/migrated-documents/db-pages/bloomberg-splc.pdf)
- [Cranfield: Supply chain data on Bloomberg and Workspace](https://blogs.cranfield.ac.uk/library/supply-chain-bloomberg-workspace)
- [Finextra: FactSet buys Revere Data](https://www.finextra.com/pressarticle/51462/factset-buys-revere-data)
- [HBS Library: Supply chain relationships](https://www.library.hbs.edu/services/help-center/supply-chain-relationships)
- [arXiv: Knowledge graph construction for stock markets](https://arxiv.org/html/2601.11528v1)
- [Bloomberg video: AI tool sparks stocks sell-off (Feb 2026)](https://www.bloomberg.com/news/videos/2026-02-04/anthropic-ai-tool-sparks-stocks-selloff-video)
- [Brattle: Spillover effects](https://www.brattle.com/wp-content/uploads/2026/05/How-Spillover-Effects-Can-Skew-AI-Securities-Class-Actions-1.pdf)

**Auto-sector shocks**
- [Mobility Outlook: Maruti expects 40% of normal output (Sept 2021)](https://www.mobilityoutlook.com/news/maruti-suzuki-to-cut-production-in-september-expects-40-of-normal-output/)
- [Tickertape: Semiconductor shortage and Maruti](https://www.tickertape.in/blog/semiconductor-shortage-maruti-suzuki/)
- [TechXplore: Tata Motors in the red over chip shortages](https://techxplore.com/news/2022-01-india-tata-motors-red-chip.html)
- [Mobility Outlook: JLR expects Q2 wholesale to drop 50%](https://mobilityoutlook.com/news/jlr-expects-q2-wholesale-to-drop-by-50-due-to-chip-shortage)
- [Bloomberg: China magnet curbs threaten India auto output, Bajaj warns](https://www.bloomberg.com/news/articles/2025-05-29/china-magnet-curbs-threaten-india-auto-output-bajaj-warns)
- [Business Today: Rajiv Bajaj on "zero month"](https://www.businesstoday.in/amp/latest/corporate/story/looking-at-zero-month-in-august-rajiv-bajaj-says-bajaj-autos-ev-production-hit-hard-by-china-s-rare-earth-move-486258-2025-07-25)
- [Autocar India: Chetak production slumps in July](https://www.autocarindia.com/industry-amp/bajaj-chetak-production-slumps-in-july-amid-rare-earth-magnet-crunch-436723)
- [Outlook Business: Chetak supplies resumed](https://www.outlookbusiness.com/corporate/e-scooter-chetak-supplies-resumed-sufficient-supply-of-rare-earth-magnets-secured-bajaj-auto)
- [Outlook Business: China rare-earth curbs and Indian EVs](https://www.outlookbusiness.com/industry/china-rare-earth-curbs-india-ev-shortage)

**Regulation and risk**
- [Business Standard: F&O net losses widened in FY25 (SEBI study)](https://www.business-standard.com/markets/news/net-losses-of-traders-in-fo-widens-in-fy25-sebi-study-125070701221_1.html)
- [SEBI: 93% of F&O traders lost FY22–FY24](https://www.sebi.gov.in/media-and-notifications/press-releases/sep-2024/updated-sebi-study-reveals-93-of-individual-traders-incurred-losses-in-equity-fando-between-fy22-and-fy24-aggregate-losses-exceed-1-8-lakh-crores-over-three-years_86906.html)
- [TaxGuru: SEBI proposes responsible AI/ML guidelines](https://taxguru.in/sebi/sebi-proposes-guidelines-responsible-usage-ai-ml-indian-securities-markets.html)
- [Moneylife: SEBI to mandate human oversight and kill switches](https://www.moneylife.in/article/ai-in-markets-sebi-to-mandate-human-oversight-kill-switches-and-data-controls-says-pandey/81406.html)
- [Taxmann: SEBI mandates RAs/IAs to disclose AI-tool use](https://taxmann.com/post/blog/sebi-mandates-ias-and-ras-to-disclose-use-of-ai-tools-in-providing-investment-advice-research-services-to-clients)
- [Sansa Legal: SEBI algo trading framework 2026](https://www.sansalegal.com/post/sebi-algorithmic-trading-framework-2026-what-retail-traders-in-india-must-know)
- [Mondaq: NSE circular on AI/ML reporting](https://www.mondaq.com/india/new-technology/1770328/nse-circular-on-aiml-reporting-what-trading-members-need-to-know)
- [Regulation Tomorrow: IOSCO consults on AI in capital markets](https://www.regulationtomorrow.com/2025/03/iosco-consults-on-ai-in-capital-markets/)
- [IOSCO: Chair speech, May 2025](https://www.iosco.org/library/speeches/pdf/20250514-Jean-Paul-Servais.pdf)
- [CNBC: 31% of investors OK with AI as advisor](https://www.cnbc.com/2023/08/24/31percent-of-investors-are-ok-with-using-ai-as-their-financial-advisor.html)

> **Source-quality note:** Several broker feature details come from press releases, review sites and aggregators rather than primary product docs. Feature availability and dates change quickly, so check the product directly before citing any detail externally.
