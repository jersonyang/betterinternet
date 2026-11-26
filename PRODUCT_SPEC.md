# BetterInternet — Product specification
**EE 582 · v0.1 · Better networks. Better learning.**

## 1. Objective
**Academic title:** Wi-Fi Coverage and Capacity Optimization for K–12 Schools.
**Engineering question:** Where should school access points be placed, and what improvements should be prioritized, given coverage targets, client demand, existing Ethernet jacks, internet capacity and a limited budget?
**Audience:** School IT specialists and wireless networking students. This is a preliminary, predictive planning tool, not a certified RF survey or procurement recommendation.

The assignment's website option calls for a focused engineering demonstrator, a website URL, and slides describing, illustrating and discussing the website. The three draft milestones below are our proposed schedule, not additional requirements taken from the assignment sheet.

## 2. Four features — one shared design workspace
| Feature | v1 acceptance criteria |
|---|---|
| 1. Floor plan | One fictional 52 × 30 m school floor with classrooms, science lab, library, hallway, wired computer lab, office, IT room and gym. Select a room; edit device counts and material; add, move and remove APs and existing jacks. Dimensions fixed for v1. Local save/reset. |
| 2. Coverage | Calculate a 5 GHz RSSI map from AP coordinates, EIRP, distance and crossed walls. Show legend, target threshold, per-room coverage and covered sample percentage. Update when placement/material/power changes. No simulated heatmap placeholders. |
| 3. Capacity | Edit wired/wireless counts, active fraction, online demand and assumed usable AP capacity. Associate wireless demand to an eligible AP, estimate unmet demand and WAN headroom separately. Presets: regular learning, digital testing and video. |
| 4. Optimizer | Compare baseline and candidate AP layouts under an incremental budget, using existing jacks or permitting new cable runs at user-entered cost. Return predicted coverage, unmet wireless demand, cost, and an explanation of bottlenecks and tradeoffs. Apply only on user request. If requirements cannot be met, say so. |

**Not in v1:** freeform floor plan drawing, uploads, 3D, multi-floor, commercial hardware database, authentication, backend, live measurements, full interference/roaming simulator, PDF export. Do not expand scope without explicit approval.

## 3. Model and defaults (editable illustrative assumptions)
### RF coverage — Draft 2
Use meters internally. For each sample point and AP:

`RSSI = EIRP - FSPL(1 m) - 10*n*log10(max(d,1 m)/1 m) - sum(wall losses)`

`FSPL(1 m) = 20*log10(f_MHz) - 27.55` dB. Begin with 5 GHz, EIRP 18 dBm, path-loss exponent n=2.5, receiver height 1.2 m, AP height 2.7 m; use 3D direct distance. Gym ceiling/mounting height may be an editable assumption if time permits. Wall losses: drywall 3 dB, masonry 8 dB, concrete 12 dB. These are project defaults, not measured material properties. Count each unique crossed interior wall once; if rooms share a wall and materials differ, use the larger assumed loss (explicit heuristic). Doors, furniture, floor-to-floor propagation and multipath omitted. Use a 1 m grid, best received power per sample, and configurable -67 dBm target. Coverage = eligible area samples meeting target / all eligible samples; report hallways and occupied rooms separately if convenient. Avoid treating RSSI as throughput or verified two-way service. This simplified log-distance/multi-wall model is not an implementation of the full ITU standard.

### Capacity — Draft 3
For each room, demand in Mbps = device count × active fraction × assumed Mbps per active device. Track wired and wireless separately. Use editable demand presets (e.g. regular: 0.6 active × 1 Mbps; test: 1 × 0.2 Mbps; video: 1 × 5 Mbps). These values are illustrative, not measurements or testing-vendor requirements. Treat all modeled traffic as internet-bound in this first version; model one direction at a time. Default WAN capacity 300 Mbps, editable.

Assign the wireless demand at deterministic in-room sample locations to the strongest AP above the RSSI threshold. Uncovered demand stays unmet. Each AP has editable assumed effective application goodput (default 100 Mbps; not advertised PHY rate). If offered demand exceeds capacity, allocate proportionally and show unmet demand. Wired clients bypass AP airtime but consume WAN capacity. Model WAN utilization from offered traffic and show potential demand shortfall; no claim of actual internet speed or end-to-end allocation. AP backhaul and wired switches assumed adequate in v1. Co-channel airtime sharing, contention, client roaming and interference are not explicitly simulated; do not label this a measured airtime or interference model. Hardware profiles may be two editable illustrative capacity/cost presets, not claims about Wi-Fi generations.

### Optimization — start testing during Draft 3
Deterministic greedy search with a small candidate set: existing jacks, room centers, and existing AP positions. Evaluate baseline, then feasible single moves or additions, repeating only while improvement occurs (cap iterations and candidate count). New AP cost and new cable run cost are editable; use incremental equipment/installation estimates, not market quotations. Existing APs are sunk cost. Use each jack at most once, and treat a new cable as a flat estimated cost; no actual cable-path or PoE engineering. Existing-jacks-only mode restricts new/relocated APs to free jack positions; unchanged baseline APs are permitted. Flexible mode permits room centers and adds a cable estimate when no suitable jack exists. Cost cannot exceed budget. Keep equipment identity and count consistent; no duplicate AP positions.

Rank feasible candidates by normalized weighted score: `0.5*coverage + 0.5*wirelessDemandServedFraction`, with lower incremental cost as tie-breaker. Coverage and demand fractions are 0–1. If wireless demand is zero, optimize coverage only. Report budget, cost, coverage, wireless demand served and WAN overload independently. A WAN bottleneck is not solved by AP changes. Explicitly report whether targets are met; do not claim global optimality. Use identical inputs and model for baseline and proposal. If no beneficial feasible change exists, keep baseline and explain why.

## 4. Four milestones
| Milestone | Website | Slides / evidence |
|---|---|---|
| Draft 1 | Floor plan and configuration prototype | Motivation, engineering objective, four-feature scope, screenshot, proposed equations, limitations, plan |
| Draft 2 | Working RF heatmap and coverage metrics | RF model, assumptions, hallway vs classroom AP experiment, implementation tests |
| Draft 3 | Working capacity analysis, initial optimizer tests | Demand model, wired vs wireless experiment, WAN bottleneck, candidate search and preliminary results |
| Final | Integrated optimizer, comparisons, UI polish, validation, public Vercel URL | Full results, budget experiment, discussion, limitations, live demo, URL |

Use genuine dated snapshots/commits and slide exports. Do not backdate work or present proposed functionality as completed. The student's sample dates are not assumed to be this user's deadlines.

## 5. Validation
- Draft 1: counts reflect changes, AP/jack add/remove/move works, coordinates bounded, save/reload works, reset restores initial demo.
- Draft 2: doubling distance adds about 7.53 dB loss for n=2.5; a single drywall crossing subtracts exactly 3 dB; increased EIRP adds the same dB to RSSI; no APs = zero coverage; handle wall endpoints and deduplicate walls.
- Draft 3: 30 active 1 Mbps Wi-Fi clients = 30 Mbps wireless offered load; moving them to Ethernet gives zero AP load and identical total WAN demand; 150 Mbps offered to a 100 Mbps AP = 50 Mbps unmet, excluding WAN; no clients = no demand; capacity cannot be exceeded.
- Final: zero budget prevents incremental-cost actions; candidates respect jack constraints and cannot spend over budget; repeated identical inputs produce identical outputs; a WAN bottleneck remains flagged after AP-only optimization. Verify baseline and optimized metrics use the same model.
- Physical accuracy is not established by these implementation checks; actual site survey and client measurements are required before installation.

## 6. Implementation and coding-agent rules
Keep one shared project state: rooms, unique walls, APs, jacks, demand settings, budget, and baseline/proposed layout. Keep pure model functions separate from rendering. All calculations run locally; do not upload school data. Use the included static HTML prototype initially; it is dependency-free and deployable to Vercel. Next.js/TypeScript migration is optional, not required by the course. For later drafts, extract the RF, capacity and optimizer code into small ES modules or TypeScript functions with tests. Preserve accessible controls, responsive styling, and readable charts. Do not introduce paid APIs, databases or logins. Keep mock data labeled; do not invent measured results. At each milestone, run acceptance tests and record actual status before tagging the Git commit.

**Next coding task:** Continue from the included Draft 1 prototype. Implement only Feature 2, using the above RF model and test cases. Build the unique-wall geometry from room boundaries, add EIRP and coverage threshold controls, generate an actual sample-grid heatmap and metrics, and preserve all existing room/equipment interactions. Make the Coverage tab functional. Write tests for the model. Do not implement capacity or optimizer yet.

## 7. Technical reading
- Cisco, Wireless High Client Density Design Guide (classroom and high-density design considerations): https://www.cisco.com/c/en/us/td/docs/wireless/controller/technotes/8-7/b_wireless_high_client_density_design_guide.html
- Cisco, Wi-Fi Cell Sizing and Overlapping with Mobile Clients in 5 GHz (coverage considerations): https://www.cisco.com/c/en/us/support/docs/wireless/catalyst-9800-series-wireless-controllers/226331-wi-fi-cell-sizing-and-overlapping-with.html
- Ohio University, Indoor coverage predictor documentation (distance and wall attenuation): https://www.its.ohio.edu/foundations/wireless/propagation-indoors/docs.html
- Course-provided Project Options.pdf and example presentations, for deliverable scope and illustration only.

## Approved branding and infrastructure constraints (supersedes earlier UI wording)
- Better coverage. Better opportunities.
- Black typography, white surfaces, restrained royal blue #3155D9; diagonal-line network logo.
- Four stages: Plan, Analyze, Capacity, Recommendations.
- Fixed (default): lock AP locations and prohibit additions. Limited: lock existing APs, permit proposed additions. Flexible: allow alternative AP layouts. These are modeling constraints, not administrative permissions.
- Future recommendations must distinguish feasible local actions from changes requiring approval or funding. Legacy hardware profiles are planned for Draft 3.
