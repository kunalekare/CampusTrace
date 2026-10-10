# Project Overview: CampusTrace

## 1. Executive Summary
University campuses experience thousands of misplaced personal items each academic term, including laptops, student IDs, keys, backpacks, smartphones, and water bottles. Traditional lost-and-found desks rely on manual paper logbooks or scattered social media posts, resulting in low recovery rates, administrative overhead, and vulnerability to fraudulent claims.

**CampusTrace** is an enterprise cloud platform built for universities to automate item tracing:
1. Students report lost belongings with descriptive tags, locations, and time ranges.
2. Finders submit found items with photos securely stored on Azure Blob Storage.
3. An automated heuristic matching engine compares lost vs. found reports in real-time, computing match confidence scores (0â€“100%).
4. Claimants must submit verification proofs (secret identifiers, serial numbers, purchase invoices) before campus security releases items.

---

## 2. Core Stakeholders
- **Students / Campus Members**: Search lost/found databases, submit detailed reports, review automated match recommendations, and submit ownership claims.
- **Campus Security & Administration**: Review reports, manage claim disputes, inspect verification proof documents, hand over items, and audit system activities.