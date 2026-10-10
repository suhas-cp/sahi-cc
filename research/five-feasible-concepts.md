# Five realistic AI concepts for Sahi (desktop)

**Date:** 10 October 2026
**Builds on:** [`ai-trading-investing-experiences.md`](./ai-trading-investing-experiences.md) (the full research and the 46-concept catalogue)
**Status:** Research shortlist, not a build plan.

---

## How these were picked

1. Three independent agents scored all 46 concepts from the catalogue, each on one lens:
   - **Buildability (40%):** is the data available to an Indian broker, is the technology reliable, and could a small team ship a first version in one or two quarters?
   - **User value and fit (30%):** does it solve a frequent problem for Sahi's active F&O and intraday traders, build on existing features, and stand out from Indian peers?
   - **Regulatory and trust safety (30%):** is it safe under SEBI research-analyst rules, the algo framework and the coming AI/ML guidelines, and how much harm does an error cause?
2. Concepts had to score at least 3 out of 5 on every lens.
3. The six highest scorers were each handed to a separate challenger agent. The challenger searched the web and tried to prove the concept unrealistic for a mid-sized Indian broker.
4. **None of the six was refuted.** Two of them (tilt detection and self-set guardrails) overlapped heavily, so they are merged below.

### Scores (top 15 of 46)

| Rank | ID | Concept | Build | Value | Safety | Weighted |
|---|---|---|---|---|---|---|
| 1 | E2 | Smart pre-trade check | 5 | 5 | 5 | 5.0 |
| 2 | R1 | Tilt detection | 5 | 5 | 5 | 5.0 |
| 3 | R4 | Weekly behaviour report | 5 | 5 | 5 | 5.0 |
| 4 | R2 | Self-set guardrails | 5 | 4 | 5 | 4.7 |
| 5 | D5 | F&O unusual-activity explainer | 5 | 5 | 3 | 4.4 |
| 6 | D6 | Event radar | 5 | 4 | 4 | 4.4 |
| 7 | P3 | Position what-if | 5 | 4 | 4 | 4.4 |
| 8 | U10 | Inline jargon explainer | 5 | 3 | 5 | 4.4 |
| 9 | U11 | Market-regime strip | 5 | 4 | 4 | 4.4 |
| 10 | U6 | Red-flag scanner | 5 | 3 | 5 | 4.4 |
| 11 | R3 | Auto-journal | 4 | 4 | 5 | 4.3 |
| 12 | E3 | Adaptive stops | 5 | 4 | 3 | 4.1 |
| 13 | D1 | Natural-language screener | 4 | 4 | 4 | 4.0 |
| 14 | D4 | Buzzing stocks with a reason | 4 | 5 | 3 | 4.0 |
| 15 | E4 | Instruction to alert | 4 | 4 | 4 | 4.0 |

The challengers' own feasibility ratings were lower for some concepts than the lens scores suggest, mainly on user value and how new the idea is. Those ratings are shown on each concept below.

---

## 1. Pre-trade risk check

**Catalogue ID:** E2 · **For:** traders · **Challenger feasibility:** 5/5

### What it is
While a trader fills in an order, small chips appear in the order window:
- "3rd trade in 10 min after a loss"
- "This trade risks 4% of your capital"
- "TCS results tomorrow"
- "Adding to a losing position"

The chips never block the order and never show an "all clear". They show only what fired, with the data source and time.

### Why it's realistic
- Every input is Sahi's own data (positions, order and trade book, margin, capital) or a standard exchange file (surveillance lists, price bands, expiry calendar).
- The checks are simple rules, so nothing can be made up, and no AI model sits in the order path.
- Sahi already has related groundwork: Market Price Protection, P&L Protect, a Kill Switch and default stop-loss and target on orders.

### Where the AI comes in
- Warning thresholds learned from each trader's own history: tighten after drawdowns, relax for flags a trader repeatedly dismisses without losing.
- An optional plain-language "why this matters", generated away from the order path.

### Watch out for
- **Scalper Mode.** Sahi sells one-tap scalping, and other brokers market their scalper screens as having no pop-ups. Run the checks in the background there and show them in a session strip or after the trade.
- **Warning fatigue.** SEBI's mandatory F&O warning at login hasn't stopped heavy losses. Keep checks rare, specific and backed by the trader's own numbers, and drop the noisy ones.
- **Overlap with mandatory pop-ups.** Exchanges already require surveillance pop-ups (ASM, GSM, ESM) at order entry. Fold them into the same card instead of adding another dialog.
- **Calling a rules engine "AI".** Only the learned thresholds and explanations justify the AI label. Overclaiming invites "AI-washing" criticism and must still be reported in the exchange AI/ML disclosures.
- **Revenue tension.** Fewer impulsive orders means less ₹10-per-order revenue. Measure retention and outcomes, not order volume.

---

## 2. Tilt detection on top of P&L Protect

**Catalogue IDs:** R1 + R2 (merged) · **For:** traders · **Challenger feasibility:** 4/5 (tilt detection), 5/5 (guardrails)

### Sahi already has the base
- **P&L Protect** (launched May 2026): a daily loss limit, profit target and trailing P&L stop that can trigger a Kill Switch for the rest of the day.
- **Kill Switch:** locks the intraday or F&O segment for the day.

The self-set guardrail idea (R2) is therefore mostly built already. The new value is the detection layer and smarter limits.

### What's new
- **Detection against the trader's own baseline.** Server-side detection of moves away from the trader's normal 30–90 day pattern: re-entering fast after a loss, sizing up after losses, widening or removing stops, bursts of trades.
- **Soft responses only.** A non-modal "take 10 minutes?" banner, capped at one or two per session, with the trader's own numbers ("your last 3 re-entries within 2 minutes after a loss lost ₹X").
- **Limits suggested from history.** For example, "your win rate drops after 6 trades a day; set a cap?"
- **Commitment lock.** Tightening a limit applies immediately; loosening it waits until the next session.
- **New limit types** that most brokers lack: trades per day, lots per order, time-window blocks (such as the first 15 minutes) and weekly loss limits.

### Rollout that the challengers suggested
1. Silent "shadow mode" on historical fills to tune accuracy.
2. Post-session "tilt moments" in the weekly report (concept 3).
3. Live in-session nudges for traders who opt in.

### Watch out for
- **False alarms for core users.** Scalpers and option sellers trade in bursts and adjust multi-leg positions by design. Ignore hedges, adjustments, exits and algo-tagged orders.
- **Never block an exit or a hedge.** Only orders that add new risk can be held back after a cap.
- **Coverage.** Detection must run on the server across web, app and API, or traders will simply switch device.
- **Backfire risk.** The UK FCA found that notification-style prompts can increase trading. Wording must be calm, specific and never gamified or shaming.
- **Peers already have the basics.** Groww (Lock F&O), Dhan (P&L Exit with Kill Switch), Angel One (Secure Exit) and Zerodha (Kill Switch) all ship loss limits. Sahi's edge is the personal detection and the commitment lock.
- **Data protection.** Behavioural profiling needs a clear notice and consent under the DPDP rules, which phase in by May 2027.

---

## 3. Weekly trading report card

**Catalogue IDs:** R4 (with R3 auto-journal) · **For:** traders · **Challenger feasibility:** 5/5

### What it is
A Saturday report inside the desktop platform, plus a Monday pre-open reminder of the one pattern to watch. It covers about 10 fixed behaviour patterns:
- your worst hour of the day
- win rate after one or two losses
- how fast you re-enter after a loss
- whether size grows after losses
- stop-loss widening
- share of trades on expiry day
- charges as a share of gross profit

Every insight opens the exact trades behind it in a table, with a link to the chart at that time. One click sets a matching guardrail from concept 2.

### Why it's realistic
- It's calculations on Sahi's own trade data plus settlement and charges files, run in a weekend batch, so live-market speed doesn't matter.
- **Upstox already ships a weekly Trading Insights report** for F&O traders. That proves the data, technology and regulatory footing. Sahi stands out by focusing on behaviour patterns and linking each insight to a guardrail, rather than slicing profit and loss.
- A field study of more than 1,500 online-broker customers found that investors who received performance-feedback reports traded less, diversified more and earned higher risk-adjusted returns.

### Where the AI comes in
The AI only phrases numbers that have already been calculated. An automatic check confirms every number in the text matches its source. Template-written text is an acceptable fallback.

### Watch out for
- **Small samples.** A week often has too few trades. Use rolling 4- and 12-week windows, set a minimum trade count per insight, show the sample size, and show nothing rather than noise.
- **Multi-leg positions.** Straddles and spreads must be grouped into one position. Expiry, exercise and physical settlement must be closed from clearing files, and charges included for true rupee P&L.
- **Hindsight bias.** A "cost of impatience" figure must be measured against the trader's own stop-loss, target or plan, and show both money lost and money saved. Otherwise it can teach traders to hold losers.
- **Data residency.** SEBI's cloud framework requires client data to stay in India. Use an AI model hosted in India, send only anonymised statistics, or use templates.
- **Low engagement from losing traders.** Show it in the platform rather than by email, frame it around strengths and rupees saved, and offer English, Hindi and Hinglish.

---

## 4. "Explain" button on the option chain

**Catalogue ID:** D5 · **For:** F&O traders · **Challenger feasibility:** 4/5

### What it is
An on-demand panel inside the option chain and OI view that describes what the data is doing, in both directions:

> OI rose and premium fell at 25000 CE. That fits call writing, or buyers losing value.

It adds past outcomes for similar moves ("in the last N similar PCR shifts, Nifty's next-day move ranged from X to Y"), with the sample size, lookback window and the time the OI data was last updated.

### Why it's realistic
- Sahi already calculates OI build-up labels (long, short, covering, unwinding), PCR, IV, Greeks, max pain and OI support and resistance. The AI only puts them into plain words and adds context.
- No Indian broker has an AI explanation layer here. FYERS has rule-based OI labels, and Sensibull and Opstra show charts and calculations.

### Regulation
- **Start with indices** (Nifty, Bank Nifty, Fin Nifty, Sensex). SEBI's July 2025 research-analyst FAQ excludes discussion of broad-based indices from the definition of a "research report".
- **Add stock options later** under Sahi's own SEBI research-analyst registration (INH000022172), with the required disclosures, AI-use disclosure and a compliance-approved set of templates. Stock-level technical analysis is not exempt.

### Watch out for
- **No verdicts.** No "bullish" or "bearish", no targets or entries, and no buy button next to the explanation. This group mostly buys options and mostly loses money, and SEBI is actively pursuing options-tip sellers.
- **Ambiguous data.** Public OI can't tell buyers from writers, and sources disagree on what a high PCR means. Always give both readings.
- **Freshness.** NSE OI refreshes about every 3 minutes, while about 59% of index-options turnover is on expiry-day contracts. Show the timestamp prominently.
- **Two kinds of OI.** SEBI moved to delta-based future-equivalent OI for position limits in 2025. Label notional and future-equivalent OI separately.
- **Live data and outside AI providers.** A SEBI circular of May 2024 restricts sharing real-time price data with third parties. Use templates or an AI model Sahi hosts itself.
- **Added value is modest.** Experienced traders may find it redundant. On-demand "explain" inside the option chain is more likely to be used than pushed alerts.

---

## 5. Event radar on positions

**Catalogue ID:** D6 · **For:** traders and investors · **Challenger feasibility:** 4/5

### What it is
- Event chips on position and holding rows, option-chain expiry tabs and charts: results, RBI policy (next meeting 2–4 December 2026), expiry dates, the Budget and major US data releases.
- For F&O names, the move the options market expects around the event next to past moves: "past moves exceeded the expected move in 3 of the last 10 results".
- Risk-first wording: "Your short straddle spans TCS results. If it moves like past extremes, your loss is about ₹X."
- A "results tomorrow" line feeds into the pre-trade check (concept 1).

### Why it's realistic
- Almost all of it comes from structured data: board-meeting notices filed with the exchanges (licensed from NSE Data & Analytics or vendors such as TrueData), the RBI's published calendar, the exchange contract master and Sahi's own option chain.
- Hardly any generative AI is needed, so the risk of made-up numbers is low.

### Watch out for
- **It's already common as a plain calendar.** Zerodha tags holdings with upcoming results and RBI events, and Sensibull, Dhan and Trendlyne run event calendars. The value is only in the position-specific numbers.
- **Expected move needs care.** It exists only for about 200 F&O stocks and indices. Stock options expire monthly, so the event part must be separated from ordinary volatility, and illiquid strikes must be skipped ("no liquid options, past moves only").
- **Dates move.** Results meetings are often confirmed only days ahead. Show "confirmed" or "expected" and the time the notice was filed.
- **Timing of past moves.** Indian companies release results both during and after market hours, so the right price window needs the filing time.
- **Rule changes.** Weekly expiry days changed twice in 2024–25 and SEBI is considering ending weekly expiries. Read dates from the contract master instead of hard-coding them.
- **No promotion.** No "trade this event" button or promotional push. Exchange rules bar promotions that encourage trading in specific contracts.

---

## What didn't make the cut

### The value-chain canvas (idea #1)
It scored **1/5 on buildability**, the lowest of all 46, with 3/5 on value and 3/5 on safety.
- Indian companies disclose few of their suppliers and customers (auto is better than pharma or chemicals).
- Inferred links and live "stress" or "disrupted" states leave a lot of room for errors that could prompt panic selling.

**The realistic version is narrow:** auto sector only, disclosed links only, and replays of past shocks (like the 2021 chip shortage and 2025 rare-earth curbs) rather than live alerts.

### Next-best options
- **Red-flag scanner (U6):** surveillance lists, promoter pledges and auditor changes, all from public exchange data. The most realistic investor-side idea.
- **Position what-if (P3):** reprices the trader's own positions under "Nifty down 2% and VIX up 3" scenarios. Fully calculated in-house.

---

## Things in common across all five

- **Mostly rules, with a thin AI layer.** Four of the five run mainly on rules. The honest AI parts are personal baselines, learned thresholds and plain-language explanations of calculated numbers. Market them that way.
- **Calculated numbers, AI words.** Calculate every number in code. Let the AI only phrase numbers that have been checked against their source.
- **Data stays in India.** Use AI models hosted in India, or templates, for anything that touches client data.
- **Audit and disclose.** Log every warning, nudge and explanation, and what the user did next. List each AI feature in the half-yearly exchange AI/ML disclosure, and label AI-written text.
- **Measure the right thing.** Judge success on losses avoided, retention and satisfaction, not order volume.

---

## Corrections to the earlier research

The challengers found facts that the main research document doesn't reflect yet:
- **Sahi already ships discipline features:** P&L Protect (May 2026), a Kill Switch, Market Price Protection and Auto SL/TP in Scalper Mode.
- **Sahi is a SEBI-registered research analyst** (INH000022172) as well as a stockbroker, which gives more room for stock-level explanation than the research assumed.
- **Upstox already offers weekly Trading Insights** for F&O traders, so a weekly report alone is not unique.
- **Newer loss data:** retail F&O traders lost ₹91,685 crore in FY26, an average of ₹1.17 lakh each. 87.7% of individual equity-derivatives traders lost money.
- **SEBI's AI/ML guidelines** were still described as imminent in August 2026.

---

## Sources

**Sahi**
- [Sahi: Introducing P&L Protect](https://www.sahi.com/blogs/introducing-p-and-l-protect-sahi)
- [Sahi: Kill Switch and P&L Calendar](https://www.sahi.com/blogs/new-feature-drop-kill-switch-p-and)
- [Sahi: Market Price Protection rules](https://www.sahi.com/faq/market-price-protection/what-are-the-rules-for-market-price-protection-mpp-on-the-sahi-app)
- [Sahi: Scalper](https://www.sahi.com/faq/options-scalper/what-is-sahi-scalper)
- [Sahi: Research disclaimer (RA registration)](https://sahi.com/research-disclaimer)
- [Sahi: Options trading features](https://sahi.com/products/options-trading)

**Competitors**
- [Upstox: What is Trading Insights](https://upstox.com/help-center/what-is-trading-insights-264217)
- [Upstox: How to access Trading Insights](https://upstox.com/help-center/how-to-access-trading-insights-264218)
- [Groww: Lock F&O Trading](https://groww.in/updates/lock-fno-trading)
- [Dhan: P&L Exit](https://dhan.co/support/orders-and-positions/pandl-exit/how-does-set-p-and-l-exit-work/)
- [Angel One: Secure Exit](https://www.angelone.in/news/product-updates/introducing-secure-exit-protect-your-gains-limit-your-losses)
- [Zerodha: Kill Switch](https://zerodha.com/z-connect/nudge/introducing-kill-switch)
- [Zerodha: Event tags on holdings](https://support.zerodha.com/category/trading-and-markets/general-kite/kite-mw/articles/event-tag-on-marketwatch-holding)
- [FYERS: OI Interpretation](https://support.fyers.in/portal/en/kb/articles/what-is-oi-interpretation-in-options-analytics)
- [Sensibull: F&O results calendar](https://blog.sensibull.com/2018/07/18/fno-stocks-results-calendar)

**Regulation and data**
- [Moneylife: Retail F&O losses of ₹91,685 crore in FY26](https://www.moneylife.in/article/retail-fo-traders-lose-rs91685-crore-in-fy26-despite-sebi-curbs-average-loss-hits-rs117-lakh-govt/81318.html)
- [Business Today: SEBI research-analyst FAQ (July 2025)](https://businesstoday.in/markets/stocks/story/sebi-enhances-research-analyst-regulations-releases-faqs-for-clarity-486103-2025-07-24)
- [Taxmann: SEBI circular on real-time price data](https://taxmann.com/post/blog/market-intermediaries-must-not-share-real-time-price-data-with-third-parties-except-for-regulatory-purposes-sebi)
- [Business Standard: Future-equivalent OI rollout](https://www.business-standard.com/markets/news/sebi-fo-revamp-new-oi-metric-position-limits-july-december-rollout-125052901798_1.html)
- [Moneylife: SEBI AI/ML guidelines with kill switches](https://www.moneylife.in/article/ai-in-markets-sebi-to-mandate-human-oversight-kill-switches-and-data-controls-says-pandey/81406.html)
- [Lexplosion: SEBI AI chapter in Intermediaries Regulations](https://lexplosion.in/sebi-issues-guidelines-on-ai-usage-entities-using-ai-ml-tools-responsible-for-data-security-ai-generated-outputs-and-compliance-with-applicable-laws/)
- [Tata Communications: SEBI cloud framework](https://www.tatacommunications.com/blog/sebi-cloud-adoption-framework-key-takeaways)
- [NSE: Surveillance pop-up circular](https://nsearchives.nseindia.com/content/circulars/SURV64402.pdf)
- [RBI: MPC schedule 2026–27](https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=62422)
- [NSE Data & Analytics: Corporate data feed](https://nsearchives.nseindia.com/web/sites/default/files/inline-files/Download_Technical_Specification_Corporate_Data.pdf)

**Behavioural evidence**
- [SAFE: Does feedback on personal investment success help?](https://safe-frankfurt.de/publications/working-papers/details/publicationname/does-feedback-on-personal-investment-success-help.html)
- [Investment News: UK FCA finds trading-app prompts increase trading](https://investmentnews.co.nz/investment-news/game-off-uk-regulator-finds-retail-trading-platform-tricks-are-traps)
- [EPFL: Diminishing returns to nudge interventions](https://memento.epfl.ch/event/diminishing-returns-to-intervention-evidence-from)

> **Source-quality note:** The challenger agents gathered these facts through web research, and some come from secondary sites. Check them directly before quoting externally.
