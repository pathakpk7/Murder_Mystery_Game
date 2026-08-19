# 🔍 Project Vritra — Complete Investigation Hints & SQL Field Guide

This master document contains comprehensive investigative guidance, narrative backstory, clue breakdowns, and canonical SQL query references for all 19 Project Vritra cases.

---

## 🎓 Case 0: Detective Academy (Missing Evidence)
**Act:** Tutorial | **Difficulty:** Easy | **Theme:** Training
- **Story Background:** You have just joined the Investigation Division under Prasoon Pathak. Audit the evidence locker and learn fundamental SQL clauses.
- **Key Clues:** Status column contains 'Missing'; evidence items are tagged by laboratory department.
- **Canonical Investigation Queries:**
```sql
-- Step 1: Audit all evidence items
SELECT * FROM evidence_locker;

-- Step 2: Filter for missing items
SELECT * FROM evidence_locker WHERE status = 'Missing';

-- Step 3: Count items grouped by type
SELECT item_type, COUNT(*) FROM evidence_locker GROUP BY item_type;

-- Step 4: Chronological sort
SELECT * FROM evidence_locker ORDER BY date_added ASC;
```

---

## 🏛️ Case 1: The Nagabhavan Estate Mystery
**Act:** Act I (The Pattern) | **Difficulty:** Easy | **Theme:** Naga Symbol
- **Story Background:** Industrialist Rajveer Rathore is found dead inside his locked study at Nagabhavan Estate. What appears to be suicide reveals signs of synthetic Soma poisoning.
- **Key Clues:** A rare Naga serpent emblem carved into the desk; fingerprinted glassware; altered CCTV timestamps.
- **Canonical Investigation Queries:**
```sql
-- 1. Identify all registered suspects
SELECT * FROM suspects WHERE case_id = 1;

-- 2. Review witness testimonies
SELECT * FROM witnesses WHERE case_id = 1;

-- 3. Examine forensic toxicology and fingerprint reports
SELECT * FROM forensics WHERE case_id = 1;

-- 4. Reconstruct the crime scene timeline
SELECT * FROM timeline WHERE case_id = 1 ORDER BY time ASC;

-- 5. Discover hidden serpent symbol evidence
SELECT * FROM evidence WHERE case_id = 1 AND description LIKE '%serpent%';
```

---

## 🧪 Case 2: The Poisoned Soma
**Act:** Act I (The Pattern) | **Difficulty:** Easy | **Theme:** Soma Ritual
- **Story Background:** Scholar Devendra Mishra collapses during a private symposium after drinking a ceremonial Soma preparation.
- **Key Clues:** Traces of synthetic Somalatha alkaloid; laboratory transfer notes; server alibi gaps.
- **Canonical Investigation Queries:**
```sql
SELECT * FROM suspects WHERE case_id = 2;
SELECT * FROM forensics WHERE case_id = 2 AND toxic_signature = 'Soma-Synthetic';
SELECT * FROM timeline WHERE case_id = 2 ORDER BY time ASC;
```

---

## 🛕 Case 3: The Temple Cipher
**Act:** Act I (The Pattern) | **Difficulty:** Easy | **Theme:** Ancient Temple Records
- **Story Background:** A temple archivist is murdered after decoding an ancient Sanskrit inscription describing the Ninth Mandala.
- **Key Clues:** Encrypted parchment fragment; missing palm-leaf manuscript; temple entry logs.
- **Canonical Investigation Queries:**
```sql
SELECT * FROM evidence WHERE case_id = 3 AND description LIKE '%serpent%';
SELECT * FROM suspects WHERE case_id = 3;
SELECT * FROM forensics WHERE case_id = 3;
```

---

## 🧘 Case 4: The Silent Devotee
**Act:** Act I (The Pattern) | **Difficulty:** Easy | **Theme:** Monastic Secrets
- **Story Background:** A vow-of-silence monk is murdered at Rudra Peeth Monastery. Before dying, he writes a final cipher in sacred ash.
- **Key Clues:** Ash cipher matching Nagabhavan serpent emblem; monastery gate access timestamps.
- **Canonical Investigation Queries:**
```sql
SELECT s.name, t.time, t.event FROM suspects s JOIN timeline t ON s.id = t.suspect_id WHERE s.case_id = 4;
SELECT * FROM evidence WHERE case_id = 4 AND item_name LIKE '%Ash%';
```

---

## 🔥 Case 5: The Ashes of Dharma
**Act:** Act I (The Pattern) | **Difficulty:** Easy | **Theme:** Dharma and Power
- **Story Background:** Politician Devendra Pratap Singh dies in an arson fire hours before exposing Project Vritra to parliament.
- **Key Clues:** Accelerant residues; intercepted radio transmissions mentioning "The Seven Shadows".
- **Canonical Investigation Queries:**
```sql
SELECT * FROM suspects WHERE case_id = 5 AND primary_motive = 'Ninth Mandala';
SELECT * FROM forensics WHERE case_id = 5 AND analysis_type = 'Arson Accelerant';
```

---

## 🏢 Case 6: The Twin Illusion
**Act:** Act II (The Conspiracy) | **Difficulty:** Medium | **Theme:** Maya and Identity
- **Story Background:** A executive declared dead 5 years ago resurfaces in offshore bank ledgers under an alias.
- **Key Clues:** Dual passport records; wire transfers exceeding 1,000,000 INR to Saptarishi accounts.
- **Canonical Investigation Queries:**
```sql
SELECT * FROM financial_ledgers WHERE case_id = 6 AND amount > 1000000;
SELECT * FROM suspects WHERE case_id = 6 AND alias_name IS NOT NULL;
```

---

## ⏳ Case 7: The Wheel of Time
**Act:** Act II (The Conspiracy) | **Difficulty:** Medium | **Theme:** Kalachakra
- **Story Background:** A government data analyst is murdered after uncovering altered historical weather and event logs.
- **Key Clues:** Modified database timestamps; missing server audit trail.
- **Canonical Investigation Queries:**
```sql
SELECT * FROM witness_statements WHERE case_id = 7 AND credibility_score > 8;
SELECT * FROM timeline WHERE case_id = 7 ORDER BY time ASC;
```

---

## 🧠 Case 8: The Forgotten Monk
**Act:** Act II (The Conspiracy) | **Difficulty:** Medium | **Theme:** Memory and Samskara
- **Story Background:** Classified records reveal a monk subjected to psychological memory suppression in a secret laboratory.
- **Key Clues:** Encrypted clinical notes; synthetic neuro-toxin lab reports.
- **Canonical Investigation Queries:**
```sql
SELECT * FROM evidence_locker WHERE case_id = 8 AND is_encrypted = true;
SELECT * FROM forensics WHERE case_id = 8 AND type = 'Neurological';
```

---

## 🐍 Case 9: The Serpent Ledger
**Act:** Act II (The Conspiracy) | **Difficulty:** Medium | **Theme:** Naga Treasury
- **Story Background:** An auditor is murdered after tracing a web of 12 shell corporations back to Dr. Vedant Kashyap.
- **Key Clues:** Off-shore Swiss bank codes; encrypted PDF ledgers.
- **Canonical Investigation Queries:**
```sql
SELECT * FROM forensic_analysis WHERE case_id = 9 AND lab_tech = 'Dr. Vedant Kashyap';
SELECT * FROM financial_ledgers WHERE case_id = 9;
```

---

## 🌫️ Case 10: The Vanishing Disciple
**Act:** Act II (The Conspiracy) | **Difficulty:** Medium | **Theme:** Maya and Identity
- **Story Background:** A key whistleblower disappears from police custody, and his birth records vanish from government servers.
- **Key Clues:** Deleted database rows; synthetic identity certificates.
- **Canonical Investigation Queries:**
```sql
SELECT * FROM suspects WHERE case_id = 10 AND is_guilty = true;
SELECT * FROM evidence WHERE case_id = 10 AND status = 'Erased';
```

---

## 👥 Case 11: The Seven Shadows
**Act:** Act III (The System) | **Difficulty:** Hard | **Theme:** Sapta Rishi Parallel
- **Story Background:** A retired general is assassinated after drafting a dossier on the 7 shadow directors of Project Vritra.
- **Key Clues:** Encrypted council roster; matching ballistic rifling from military weapons.
- **Canonical Investigation Queries:**
```sql
SELECT * FROM suspects WHERE case_id = 11 AND rank_title = 'Shadow Council';
SELECT * FROM forensics WHERE case_id = 11 AND type = 'Ballistics';
```

---

## 👁️ Case 12: The Maya Protocol
**Act:** Act III (The System) | **Difficulty:** Hard | **Theme:** Maya AI
- **Story Background:** A digital investigator discovers an AI system that generates synthetic crime scene evidence automatically.
- **Key Clues:** AI deepfake audio files; manufactured fingerprint records.
- **Canonical Investigation Queries:**
```sql
SELECT * FROM ai_surveillance_logs WHERE case_id = 12;
SELECT * FROM evidence_locker WHERE case_id = 12 AND is_synthetic = true;
```

---

## 🩸 Case 13: The Crimson Yagna
**Act:** Act III (The System) | **Difficulty:** Hard | **Theme:** Sacrifice and Order
- **Story Background:** A sociologist is murdered after proving that 15 public riots over 20 years were orchestrated by the Ninth Mandala.
- **Key Clues:** Psychological profiling ledgers; financial pay-offs to riot leaders.
- **Canonical Investigation Queries:**
```sql
SELECT * FROM predictive_cases WHERE case_id = 13;
SELECT * FROM suspects WHERE case_id = 13 AND role = 'Orchestrator';
```

---

## 🔮 Case 14: The Oracle Network
**Act:** Act III (The System) | **Difficulty:** Hard | **Theme:** Trikal Darshan
- **Story Background:** An engineer on the Oracle Predictive System is found dead inside the server vault after leaking predictive algorithms.
- **Key Clues:** Server rack access logs; encrypted predictive code repository.
- **Canonical Investigation Queries:**
```sql
SELECT * FROM evidence_locker WHERE case_id = 14 AND is_synthetic = true;
SELECT * FROM timeline WHERE case_id = 14 ORDER BY time ASC;
```

---

## 📜 Case 15: The Hidden Manuscript
**Act:** Act III (The System) | **Difficulty:** Hard | **Theme:** Mahabharata - Sutradhar
- **Story Background:** A historian is killed while translating a 300-year-old manuscript outlining the philosophical blueprint for Project Vritra.
- **Key Clues:** Sanskrit parchment folio; ancient wax seal.
- **Canonical Investigation Queries:**
```sql
SELECT * FROM suspects WHERE case_id = 15 AND high_treason = true;
SELECT * FROM evidence WHERE case_id = 15 AND type = 'Manuscript';
```

---

## 🐉 Case 16: The Vritra Cycle
**Act:** Act IV (The Architect) | **Difficulty:** Hard | **Theme:** Cycle of Creation and Destruction
- **Story Background:** An archivist is murdered inside the master vault, leaving behind a hard drive linking all 18 cases.
- **Key Clues:** Master case index; biometric access logs.
- **Canonical Investigation Queries:**
```sql
SELECT * FROM suspects WHERE case_id = 16 AND codename = 'Sutradhar';
SELECT * FROM forensics WHERE case_id = 16;
```

---

## 🏛️ Case 17: The Ninth Realm
**Act:** Act IV (The Architect) | **Difficulty:** Hard | **Theme:** Navam Loka
- **Story Background:** Prasoon Task Force raids the underground command bunker of the Ninth Mandala in New Delhi.
- **Key Clues:** Mainframe server logs; encrypted self-destruct countdown timer.
- **Canonical Investigation Queries:**
```sql
SELECT * FROM ciphers WHERE case_id = 17 AND key_length = 256;
SELECT * FROM suspects WHERE case_id = 17;
```

---

## 👑 Case 18: The Last Witness
**Act:** Act IV (The Architect) | **Difficulty:** Hard | **Theme:** End of Kali Yuga
- **Story Background:** Dr. Vedant Kashyap (*The Sutradhar*) makes his final move before escaping India. You must execute final SQL queries to indict the mastermind behind Project Vritra.
- **Key Clues:** Direct wire transfers from Kashyap's private account; matching Somalatha poison formula signature; biometric security video.
- **Canonical Investigation Queries:**
```sql
-- Step 1: Query primary suspect Dr. Vedant Kashyap
SELECT * FROM suspects WHERE case_id = 18 AND name = 'Dr. Vedant Kashyap';

-- Step 2: Cross-reference biometric laboratory evidence
SELECT * FROM forensics WHERE case_id = 18 AND culprit_match = 'Dr. Vedant Kashyap';

-- Step 3: Present final indictment
SELECT s.name, s.role, f.toxic_signature, t.event 
FROM suspects s 
JOIN forensics f ON s.case_id = f.case_id 
JOIN timeline t ON s.case_id = t.case_id 
WHERE s.case_id = 18 AND s.is_guilty = true;
```
