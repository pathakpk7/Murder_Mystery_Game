# 🔍 SQL Murder Mystery Game - Hints & Solutions

This file contains all hints and exact SQL queries needed to complete each level and stage in the game.

---

## 🎮 Case: The Blackwood Manor Murder

### Level 1: Triage Alibis and Suspicion

**Objective:** Identify unverified alibis and rank suspects by suspicion.

**Hints:**
- Look for witnesses whose alibis have not been verified
- Sort suspects by their suspicion level to identify the most suspicious ones
- Use WHERE clause to filter for unverified alibis
- Use ORDER BY to sort by suspicion level

**Exact Queries:**
```sql
-- Find all witnesses with unverified alibis
SELECT * FROM witnesses WHERE alibi_verified = 'false';

-- Rank suspects by suspicion level (highest first)
SELECT * FROM suspects ORDER BY suspicion_level DESC;
```

---

### Level 2: Deep-Dive on Unverified Witnesses + Critical Forensics

**Objective:** Investigate each person with unverified alibi and review critical lab results.

**Hints:**
- Focus on the three witnesses with unverified alibis: Mrs. Eleanor Blackwood, Sarah Mitchell, Thomas Blackwood
- Look for forensic evidence marked as "Critical" significance
- Check for DNA matches and fingerprint evidence

**Exact Queries:**
```sql
-- Investigate Mrs. Eleanor Blackwood
SELECT * FROM witnesses WHERE name = 'Mrs. Eleanor Blackwood';

-- Investigate Sarah Mitchell
SELECT * FROM witnesses WHERE name = 'Sarah Mitchell';

-- Investigate Thomas Blackwood
SELECT * FROM witnesses WHERE name = 'Thomas Blackwood';

-- Review critical forensic evidence
SELECT * FROM forensics WHERE significance = 'Critical';
```

---

### Level 3: Align Timeline with Claims

**Objective:** Retrieve timeline and cross-check against witness statements.

**Hints:**
- Get the complete timeline of events
- Compare witness statements against the timeline
- Look for discrepancies in time and location
- Focus on the key witnesses: Sarah Mitchell and Thomas Blackwood

**Exact Queries:**
```sql
-- Get the complete timeline
SELECT * FROM timeline;

-- Check Sarah Mitchell's statement
SELECT * FROM witnesses WHERE name = 'Sarah Mitchell';

-- Check Thomas Blackwood's statement
SELECT * FROM witnesses WHERE name = 'Thomas Blackwood';
```

---

### Level 4: Narrow Top Suspects with Evidence

**Objective:** Filter high-suspicion suspects and check for forensic matches.

**Hints:**
- Filter suspects with suspicion level above 70%
- Check forensic evidence for DNA and fingerprint matches
- Look for evidence that directly links to specific suspects
- Focus on the top 2-3 most suspicious suspects

**Exact Queries:**
```sql
-- Find high-suspicion suspects (above 70%)
SELECT * FROM suspects WHERE suspicion_level > 70;

-- Check forensic evidence matching Thomas Blackwood
SELECT * FROM forensics WHERE match = 'Thomas Blackwood';

-- Check forensic evidence matching Sarah Mitchell
SELECT * FROM forensics WHERE match = 'Sarah Mitchell';
```

---

### Level 5: Confirm the Culprit

**Objective:** Confirm the main culprit using suspect profile and DNA match.

**Hints:**
- The culprit has the highest suspicion level (90%)
- Look for DNA evidence that confirms the identity
- Check forensic evidence for critical significance
- Verify the weapon and location match

**Exact Queries:**
```sql
-- Get Thomas Blackwood's full profile (the culprit)
SELECT * FROM suspects WHERE name = 'Thomas Blackwood';

-- Confirm DNA match evidence
SELECT * FROM forensics WHERE match = 'Thomas Blackwood';

-- Check critical evidence
SELECT * FROM forensics WHERE significance = 'Critical';
```

---

## 🎯 Answer Key

**Murderer:** Thomas Blackwood (Brother of the victim)
**Weapon:** Letter Opener
**Location:** Study
**Motive:** Family inheritance dispute

**Evidence Summary:**
- DNA on clothing matches Thomas Blackwood
- Thomas had an unverified alibi
- Highest suspicion level (90%)
- Was in the study during the time of the murder
- Had access to the letter opener

---

## 💡 General SQL Tips

### SELECT Basics
```sql
-- Select all columns
SELECT * FROM table_name;

-- Select specific columns
SELECT column1, column2 FROM table_name;
```

### WHERE Clause
```sql
-- Filter with condition
SELECT * FROM table_name WHERE column = 'value';

-- Multiple conditions
SELECT * FROM table_name WHERE column1 = 'value' AND column2 > 50;
```

### ORDER BY
```sql
-- Sort ascending
SELECT * FROM table_name ORDER BY column ASC;

-- Sort descending
SELECT * FROM table_name ORDER BY column DESC;
```

### Comparison Operators
- `=` - Equal to
- `>` - Greater than
- `<` - Less than
- `>=` - Greater than or equal to
- `<=` - Less than or equal to
- `<>` or `!=` - Not equal to

---

## 📊 Database Schema Reference

### Witnesses Table
- `id` - Unique identifier
- `name` - Witness name
- `alibi_verified` - Whether alibi is verified (true/false)
- `statement` - Witness statement
- `location_during_crime` - Where they were during the crime

### Suspects Table
- `id` - Unique identifier
- `name` - Suspect name
- `suspicion_level` - Suspicion percentage (0-100)
- `relationship` - Relationship to victim
- `motive` - Possible motive

### Forensics Table
- `id` - Unique identifier
- `evidence_type` - Type of evidence (DNA, fingerprint, weapon, etc.)
- `match` - Person matched to evidence
- `significance` - Evidence significance (Critical, High, Medium, Low)
- `description` - Evidence description

### Timeline Table
- `id` - Unique identifier
- `time` - Time of event
- `event` - Event description
- `location` - Location of event

---

## ⚠️ Important Notes

- The SQL engine is case-insensitive for string matching
- Be precise with names (use exact names as shown in the database)
- Multiple equivalent queries may work for each objective
- The game validates your query results against expected outcomes
- Use the hint button in-game if you get stuck (costs 10 points)

---

**Good luck, Detective! 🔍**
