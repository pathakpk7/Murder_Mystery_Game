# 🔍 Project Vritra — Investigation Hints & SQL Guide

This document contains investigative guidance and canonical SQL query references for Project Vritra investigations.

---

## 🎓 Case 0: Detective Academy (Missing Evidence)

**Objective:** Audit the evidence locker and learn fundamental SQL clauses.

**Investigation Queries:**
```sql
-- Step 1: Search all items in the locker
SELECT * FROM evidence_locker;

-- Step 2: Filter for missing items
SELECT * FROM evidence_locker WHERE status = 'Missing';

-- Step 3: Count items grouped by type
SELECT item_type, COUNT(*) FROM evidence_locker GROUP BY item_type;

-- Step 4: Restrict results to the top 5
SELECT * FROM evidence_locker LIMIT 5;

-- Step 5: Chronological sort
SELECT * FROM evidence_locker ORDER BY date_added ASC;
```

---

## 🏛️ Case 1: The Nagabhavan Estate Mystery

**Objective:** Investigate the locked-room murder of industrialist Rajveer Rathore.

**Investigation Queries:**
```sql
-- 1. Identify all registered suspects
SELECT * FROM suspects WHERE case_id = 1;

-- 2. Review witness testimonies
SELECT * FROM witnesses WHERE case_id = 1;

-- 3. Search physical and document evidence
SELECT * FROM evidence WHERE case_id = 1;

-- 4. Examine forensic toxicology and fingerprint reports
SELECT * FROM forensics WHERE case_id = 1;

-- 5. Reconstruct the chronological timeline
SELECT * FROM timeline WHERE case_id = 1 ORDER BY time ASC;

-- 6. Discover hidden serpent symbol
SELECT * FROM evidence WHERE case_id = 1 AND description LIKE '%serpent%';

-- 7. Cross-reference fingerprint analysis with suspects
SELECT s.name, s.motive, f.analysis_result 
FROM suspects s 
JOIN forensics f ON s.case_id = f.case_id 
WHERE s.case_id = 1 AND f.analysis_result LIKE '%Raghav Sethi%';
```

---

## 🧪 Case 2: The Poisoned Soma

**Objective:** Track the rare botanical poison used during the cultural summit.

**Investigation Queries:**
```sql
-- Query suspects and alibis
SELECT * FROM suspects WHERE case_id = 2;

-- Query forensic chemical breakdown
SELECT * FROM forensics WHERE case_id = 2 AND type = 'Chemical';

-- Cross-reference timeline with witness sightings
SELECT * FROM timeline WHERE case_id = 2 ORDER BY time ASC;
```

---

## 🛕 Case 3: The Temple Cipher

**Objective:** Decrypt the stolen Sun Temple inscription.

**Investigation Queries:**
```sql
-- Inspect stolen artifacts and cipher fragments
SELECT * FROM evidence WHERE case_id = 3;

-- Audit suspect access logs
SELECT * FROM suspects WHERE case_id = 3;
```
