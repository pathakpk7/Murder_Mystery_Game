# 🕵️ PROJECT VRITRA — STORY-DRIVEN SQL DETECTIVE THRILLER

Official Master Guide & Complete Step-by-Step SQL Walkthrough for **Project Vritra**.

---

## 🚀 Quick Start Guide

### 1. Start the Backend API Server
```cmd
cd backend
node app.js
```
*The Express server runs on `http://localhost:5433` with Supabase database connection and canonical offline fallback.*

### 2. Launch the Single-Page Application (SPA)
Open `frontend/index.html` directly in any web browser.

---

## 🎯 Master Step-by-Step Gameplay & SQL Query Walkthrough (Cases 0 to 18)

Copy and paste the exact SQL queries into the **SQL Query Editor** to complete every mission, earn 3 stars, unlock ranks, and expose Dr. Vedant Kashyap (*The Sutradhar*).

---

### 🎓 CASE 0: Detective Academy (Onboarding & Missing Evidence Audit)
- **Primary Finding:** `missing_evidence`
- **Queries:**
```sql
-- Step 1: Inspect all items in the evidence locker
SELECT * FROM evidence_locker;

-- Step 2: Filter for missing items
SELECT * FROM evidence_locker WHERE status = 'Missing';

-- Step 3: Group and count by item type
SELECT item_type, COUNT(*) FROM evidence_locker GROUP BY item_type;

-- Step 4: Chronological audit
SELECT * FROM evidence_locker ORDER BY date_added ASC;
```

---

### 🏛️ CASE 1: The Nagabhavan Estate Mystery (Act I: The Pattern)
- **Prime Suspect / Perpetrator:** `Raghav Sethi`
- **Queries:**
```sql
-- Step 1: Identify all registered suspects
SELECT * FROM suspects WHERE case_id = 1;

-- Step 2: Review witness statements
SELECT * FROM witnesses WHERE case_id = 1;

-- Step 3: Inspect crime scene evidence
SELECT * FROM evidence WHERE case_id = 1;

-- Step 4: Analyze forensic lab toxicology and fingerprints
SELECT * FROM forensics WHERE case_id = 1;

-- Step 5: Chronological timeline reconstruction
SELECT * FROM timeline WHERE case_id = 1 ORDER BY time ASC;

-- Step 6: Cross-reference fingerprints with suspects
SELECT s.name, s.motive, f.analysis_result FROM suspects s JOIN forensics f ON s.case_id = f.case_id WHERE s.case_id = 1 AND f.analysis_result LIKE '%Raghav Sethi%';
```

---

### 🧪 CASE 2: The Poisoned Soma (Act I: The Pattern)
- **Prime Suspect / Perpetrator:** `Dr. Madhavan Joshi`
- **Queries:**
```sql
SELECT * FROM suspects WHERE case_id = 2;
SELECT * FROM forensics WHERE case_id = 2 AND type = 'Chemical';
SELECT * FROM timeline WHERE case_id = 2 ORDER BY time ASC;
```

---

### 🛕 CASE 3: The Temple Cipher (Act I: The Pattern)
- **Prime Suspect / Perpetrator:** `Kallol Sen`
- **Queries:**
```sql
SELECT * FROM evidence WHERE case_id = 3;
SELECT * FROM suspects WHERE case_id = 3;
```

---

### 📿 CASE 4: The Silent Devotee (Act I: The Pattern)
- **Prime Suspect / Perpetrator:** `Swami Shankarananda`
- **Queries:**
```sql
SELECT * FROM suspects WHERE case_id = 4;
SELECT * FROM witnesses WHERE case_id = 4;
```

---

### 🔥 CASE 5: Ashes of Dharma (Act I: The Pattern)
- **Prime Suspect / Perpetrator:** `Devabrata Ray`
- **Queries:**
```sql
SELECT * FROM suspects WHERE case_id = 5;
SELECT * FROM forensics WHERE case_id = 5;
```

---

### 👥 CASE 6: The Twin Illusion (Act II: The Conspiracy)
- **Prime Suspect / Perpetrator:** `Vikram & Vivek Malhotra`
- **Queries:**
```sql
SELECT * FROM suspects WHERE case_id = 6;
SELECT * FROM timeline WHERE case_id = 6 ORDER BY time ASC;
```

---

### ⏳ CASE 7: Wheel of Time (Act II: The Conspiracy)
- **Prime Suspect / Perpetrator:** `Kalyan Sen`
- **Queries:**
```sql
SELECT * FROM suspects WHERE case_id = 7;
SELECT * FROM evidence WHERE case_id = 7;
```

---

### 🧘 CASE 8: The Forgotten Monk (Act II: The Conspiracy)
- **Prime Suspect / Perpetrator:** `Swami Dayanand`
- **Queries:**
```sql
SELECT * FROM suspects WHERE case_id = 8;
SELECT * FROM witnesses WHERE case_id = 8;
```

---

### 📜 CASE 9: The Serpent Ledger (Act II: The Conspiracy)
- **Prime Suspect / Perpetrator:** `Sudhir Varma`
- **Queries:**
```sql
SELECT * FROM suspects WHERE case_id = 9;
SELECT * FROM forensics WHERE case_id = 9;
```

---

### 👤 CASE 10: The Vanishing Disciple (Act II: The Conspiracy)
- **Prime Suspect / Perpetrator:** `Aniket Deshpande`
- **Queries:**
```sql
SELECT * FROM suspects WHERE case_id = 10;
SELECT * FROM timeline WHERE case_id = 10 ORDER BY time ASC;
```

---

### 👤 CASE 11: The Seven Shadows (Act III: The System)
- **Prime Suspect / Perpetrator:** `Varun Somayaji`
- **Queries:**
```sql
SELECT * FROM suspects WHERE case_id = 11;
SELECT * FROM evidence WHERE case_id = 11;
```

---

### 💻 CASE 12: The Maya Protocol (Act III: The System)
- **Prime Suspect / Perpetrator:** `Dr. Siddharth Nair`
- **Queries:**
```sql
SELECT * FROM suspects WHERE case_id = 12;
SELECT * FROM forensics WHERE case_id = 12;
```

---

### 🩸 CASE 13: Crimson Yagna (Act III: The System)
- **Prime Suspect / Perpetrator:** `Keshava Namboodiri`
- **Queries:**
```sql
SELECT * FROM suspects WHERE case_id = 13;
SELECT * FROM witnesses WHERE case_id = 13;
```

---

### 🌐 CASE 14: The Oracle Network (Act III: The System)
- **Prime Suspect / Perpetrator:** `Dr. Alok Sen`
- **Queries:**
```sql
SELECT * FROM suspects WHERE case_id = 14;
SELECT * FROM timeline WHERE case_id = 14 ORDER BY time ASC;
```

---

### 📖 CASE 15: The Hidden Manuscript (Act III: The System)
- **Prime Suspect / Perpetrator:** `Prof. Radhamadhav Tripathi`
- **Queries:**
```sql
SELECT * FROM suspects WHERE case_id = 15;
SELECT * FROM evidence WHERE case_id = 15;
```

---

### 🔄 CASE 16: The Vritra Cycle (Act IV: The Architect)
- **Prime Suspect / Perpetrator:** `Indrajit Bhattacharya`
- **Queries:**
```sql
SELECT * FROM suspects WHERE case_id = 16;
SELECT * FROM forensics WHERE case_id = 16;
```

---

### 🏰 CASE 17: The Ninth Realm (Act IV: The Architect)
- **Prime Suspect / Perpetrator:** `Naveen Kashyap`
- **Queries:**
```sql
SELECT * FROM suspects WHERE case_id = 17;
SELECT * FROM timeline WHERE case_id = 17 ORDER BY time ASC;
```

---

### 👑 CASE 18: The Last Witness / The Architect (Act IV: The Architect Final Confrontation)
- **Prime Suspect / Perpetrator:** `Dr. Vedant Kashyap` (*The Sutradhar*)
- **Queries:**
```sql
-- Step 1: Query the primary mastermind
SELECT * FROM suspects WHERE case_id = 18;

-- Step 2: Examine final encryption evidence
SELECT * FROM evidence WHERE case_id = 18;

-- Step 3: Expose Dr. Vedant Kashyap
SELECT s.name, s.motive, f.analysis_result FROM suspects s JOIN forensics f ON s.case_id = f.case_id WHERE s.case_id = 18 AND f.analysis_result LIKE '%Vedant Kashyap%';
```

---

## 🎖️ Task Force Rank Structure

1. **Investigation Intern** (0 Cases • 0 XP)
2. **Junior Analyst** (2 Cases • 1,000 XP)
3. **Investigation Officer** (5 Cases • 3,000 XP)
4. **Crime Analyst** (8 Cases • 6,000 XP)
5. **Senior Investigator** (11 Cases • 10,000 XP)
6. **Lead Investigator** (14 Cases • 15,000 XP)
7. **Special Operations Lead** (17 Cases • 20,000 XP)
8. **Vritra Task Force Commander** (18 Cases • 25,000 XP)