🕵️ Project Vritra

A story-driven SQL detective thriller where every query uncovers a piece of the conspiracy.

Project Vritra turns learning and practicing SQL into an investigation. You are not simply solving database exercises—you are an investigator inside the Vritra Task Force, progressing through a connected 18-case conspiracy.

Every suspect, witness, forensic report, timeline entry, and piece of evidence lives inside a database.

Your SQL queries are your investigative tools.

✦ The Premise

A suspicious death at Nagabhavan Estate appears to be an isolated murder.

It isn't.

As you investigate, seemingly unrelated cases begin revealing the same symbols, organizations, financial trails, forensic signatures, and manipulated records.

The investigation gradually exposes:

ONE MURDER
     ↓
A PATTERN
     ↓
A CONSPIRACY
     ↓
A SYSTEM
     ↓
THE ARCHITECT

At the center of it all is:

Dr. Vedant Kashyap — "The Sutradhar"

But reaching him requires surviving all 18 investigations.

🎮 How the Game Works

Project Vritra combines three things:

🕵️ Investigation

Read the case, inspect evidence, interview witnesses and identify suspects.

💻 SQL

Use SQL queries to retrieve the information hidden inside the investigation database.

📖 Story

Every completed investigation advances the larger Project Vritra narrative.

Your progression is therefore:

Read
 ↓
Investigate
 ↓
Query
 ↓
Discover
 ↓
Connect
 ↓
Solve
 ↓
Unlock
 ↓
Advance
🧑‍💻 Your Role

You begin as:

Investigation Intern

You are assigned to the Vritra Task Force and initially handle database research and evidence analysis.

As you solve cases, you earn:

⭐ Stars
XP
Case completions
Rank promotions
Story progression
New investigations

Your objective is not merely to finish the game.

It is to become the investigator capable of exposing the entire Vritra conspiracy.

🏫 Case 0 — Detective Academy

Before entering the real investigation, you are introduced to the SQL system.

Case 0 is your training ground.

You learn how to:

inspect a table
retrieve records
filter records
count records
group information
sort results
First Query
SELECT * FROM evidence_locker;

This retrieves every item currently recorded in the evidence locker.

Filter Missing Evidence
SELECT *
FROM evidence_locker
WHERE status = 'Missing';
Count Evidence by Type
SELECT item_type, COUNT(*)
FROM evidence_locker
GROUP BY item_type;
Sort Evidence Chronologically
SELECT *
FROM evidence_locker
ORDER BY date_added ASC;

These four queries introduce the basic investigation workflow:

SELECT
WHERE
GROUP BY
ORDER BY

Once you understand these, you are ready for the field.

🗂️ The Investigation Database

The game revolves around interconnected investigation tables.

Some of the most important are:

Table	Purpose
suspects	People connected to the case
witnesses	Witness statements and reliability
evidence	Physical, digital and documentary evidence
forensics	Laboratory and forensic findings
timeline	Chronological events
game_objectives	Investigation missions
game_clues	Narrative clues
evidence_locker	Training and evidence inventory

The database isn't just a technical exercise.

The database is the crime scene.

🧩 The Four Acts

The 18 investigations form one continuous story divided into four acts.

ACT I — THE PATTERN
Cases 1–5

The investigation begins with apparently isolated crimes.

You encounter:

suspicious deaths
poisonings
strange symbols
temple connections
unexplained evidence
recurring investigative patterns

The first question emerges:

Why do these cases look connected?

ACT II — THE CONSPIRACY
Cases 6–10

The investigation moves beyond individual crimes.

The Task Force begins uncovering:

financial networks
hidden identities
disappearing witnesses
manipulated records
offshore connections
coordinated operations

The question changes:

Who is coordinating these events?

ACT III — THE SYSTEM
Cases 11–15

The investigation reveals that the conspiracy isn't simply a criminal organization.

It is a system.

You encounter:

The Seven Shadows
Maya Protocol
manipulated evidence
predictive systems
information warfare
hidden archives
institutional corruption

The question becomes:

How deep does the system go?

ACT IV — THE ARCHITECT
Cases 16–18

The Task Force finally closes in on the organization behind the entire operation.

The investigation leads toward:

the Vritra Cycle
the Ninth Realm
the final archive
the mastermind

The final question:

Who built the system?

The answer:

Dr. Vedant Kashyap — The Sutradhar.

📁 Complete Case Archive
ACT I — THE PATTERN
Case 1 — The Nagabhavan Estate Mystery

Prime suspect: Raghav Sethi

The investigation begins with a murder at Nagabhavan Estate.

Start with:

SELECT * FROM suspects WHERE case_id = 1;

Then examine witnesses:

SELECT * FROM witnesses WHERE case_id = 1;

Inspect evidence:

SELECT * FROM evidence WHERE case_id = 1;

Analyze forensics:

SELECT * FROM forensics WHERE case_id = 1;

Reconstruct the timeline:

SELECT *
FROM timeline
WHERE case_id = 1
ORDER BY time ASC;

Finally, cross-reference the forensic evidence:

SELECT
    s.name,
    s.motive,
    f.analysis_result
FROM suspects s
JOIN forensics f
    ON s.case_id = f.case_id
WHERE s.case_id = 1
AND f.analysis_result LIKE '%Raghav Sethi%';
Case 2 — The Poisoned Soma

Prime suspect: Dr. Madhavan Joshi

SELECT * FROM suspects WHERE case_id = 2;

SELECT *
FROM forensics
WHERE case_id = 2
AND type = 'Chemical';

SELECT *
FROM timeline
WHERE case_id = 2
ORDER BY time ASC;
Case 3 — The Temple Cipher

Prime suspect: Kallol Sen

SELECT * FROM evidence WHERE case_id = 3;

SELECT * FROM suspects WHERE case_id = 3;
Case 4 — The Silent Devotee

Prime suspect: Swami Shankarananda

SELECT * FROM suspects WHERE case_id = 4;

SELECT * FROM witnesses WHERE case_id = 4;
Case 5 — Ashes of Dharma

Prime suspect: Devabrata Ray

SELECT * FROM suspects WHERE case_id = 5;

SELECT * FROM forensics WHERE case_id = 5;
ACT II — THE CONSPIRACY
Case 6 — The Twin Illusion

Prime suspects: Vikram & Vivek Malhotra

SELECT * FROM suspects WHERE case_id = 6;

SELECT *
FROM timeline
WHERE case_id = 6
ORDER BY time ASC;
Case 7 — Wheel of Time

Prime suspect: Kalyan Sen

SELECT * FROM suspects WHERE case_id = 7;

SELECT * FROM evidence WHERE case_id = 7;
Case 8 — The Forgotten Monk

Prime suspect: Swami Dayanand

SELECT * FROM suspects WHERE case_id = 8;

SELECT * FROM witnesses WHERE case_id = 8;
Case 9 — The Serpent Ledger

Prime suspect: Sudhir Varma

SELECT * FROM suspects WHERE case_id = 9;

SELECT * FROM forensics WHERE case_id = 9;
Case 10 — The Vanishing Disciple

Prime suspect: Aniket Deshpande

SELECT * FROM suspects WHERE case_id = 10;

SELECT *
FROM timeline
WHERE case_id = 10
ORDER BY time ASC;
ACT III — THE SYSTEM
Case 11 — The Seven Shadows

Prime suspect: Varun Somayaji

SELECT * FROM suspects WHERE case_id = 11;

SELECT * FROM evidence WHERE case_id = 11;
Case 12 — The Maya Protocol

Prime suspect: Dr. Siddharth Nair

SELECT * FROM suspects WHERE case_id = 12;

SELECT * FROM forensics WHERE case_id = 12;
Case 13 — Crimson Yagna

Prime suspect: Keshava Namboodiri

SELECT * FROM suspects WHERE case_id = 13;

SELECT * FROM witnesses WHERE case_id = 13;
Case 14 — The Oracle Network

Prime suspect: Dr. Alok Sen

SELECT * FROM suspects WHERE case_id = 14;

SELECT *
FROM timeline
WHERE case_id = 14
ORDER BY time ASC;
Case 15 — The Hidden Manuscript

Prime suspect: Prof. Radhamadhav Tripathi

SELECT * FROM suspects WHERE case_id = 15;

SELECT * FROM evidence WHERE case_id = 15;
ACT IV — THE ARCHITECT
Case 16 — The Vritra Cycle

Prime suspect: Indrajit Bhattacharya

SELECT * FROM suspects WHERE case_id = 16;

SELECT * FROM forensics WHERE case_id = 16;
Case 17 — The Ninth Realm

Prime suspect: Naveen Kashyap

SELECT * FROM suspects WHERE case_id = 17;

SELECT *
FROM timeline
WHERE case_id = 17
ORDER BY time ASC;
👑 Case 18 — The Last Witness
THE ARCHITECT

Final target: Dr. Vedant Kashyap
Codename: The Sutradhar

The final investigation.

Begin with:

SELECT *
FROM suspects
WHERE case_id = 18;

Examine the final evidence:

SELECT *
FROM evidence
WHERE case_id = 18;

Then cross-reference the forensic evidence:

SELECT
    s.name,
    s.motive,
    f.analysis_result
FROM suspects s
JOIN forensics f
    ON s.case_id = f.case_id
WHERE s.case_id = 18
AND f.analysis_result LIKE '%Vedant Kashyap%';

The investigation ends where it began:

with the database.

⭐ Progression System

Every case contributes to your investigator profile.

Your performance can earn:

⭐
⭐⭐
⭐⭐⭐

Stars represent investigation quality.

XP contributes toward your rank.

Your progression:

INVESTIGATION INTERN
        ↓
JUNIOR ANALYST
        ↓
INVESTIGATION OFFICER
        ↓
CRIME ANALYST
        ↓
SENIOR INVESTIGATOR
        ↓
LEAD INVESTIGATOR
        ↓
SPECIAL OPERATIONS LEAD
        ↓
VRITRA TASK FORCE COMMANDER
🎖️ Task Force Ranks
Rank	Cases	XP
Investigation Intern	0	0
Junior Analyst	2	1,000
Investigation Officer	5	3,000
Crime Analyst	8	6,000
Senior Investigator	11	10,000
Lead Investigator	14	15,000
Special Operations Lead	17	20,000
Vritra Task Force Commander	18	25,000

The ultimate objective:

Complete all 18 cases and reach Vritra Task Force Commander.

🧠 SQL Is Your Investigative Weapon

You will progressively use SQL concepts such as:

SELECT
WHERE
ORDER BY
GROUP BY
COUNT
JOIN
LIKE
Filtering
Aggregation
Cross-referencing
Timeline analysis

The game is designed so that SQL isn't separated from the story.

A query isn't simply:

SELECT * FROM suspects;

It represents:

"Show me everyone who could have committed this crime."

A JOIN isn't just a database operation.

It represents:

"Connect these two pieces of evidence."

A WHERE clause isn't merely filtering.

It represents:

"Show me only the evidence relevant to this investigation."

🏗️ Technical Architecture

Project Vritra currently uses:

Frontend
React / Vite / Tailwind CSS
        │
        ▼
Node.js + Express
        │
        ▼
Supabase PostgreSQL

The investigation interface includes:

SQL query editor
case selection
objectives
clues
evidence
forensic reports
witness records
suspects
timelines
detective board
progression
XP
stars
ranks
Task Force communications

The application also maintains a canonical data fallback for offline/preview scenarios.

🚀 Running Project Vritra
1. Start the backend
cd backend
node app.js

The API runs on:

http://localhost:5433
2. Start the frontend

Launch the Vite frontend using the project's configured development command.

Typically:

npm install
npm run dev

Then open the Vite development URL shown in the terminal.

🗺️ The Complete Journey
CASE 0
Detective Academy
      │
      ▼
CASE 1–5
THE PATTERN
      │
      ▼
CASE 6–10
THE CONSPIRACY
      │
      ▼
CASE 11–15
THE SYSTEM
      │
      ▼
CASE 16–17
THE ARCHITECT
      │
      ▼
CASE 18
THE LAST WITNESS
      │
      ▼
DR. VEDANT KASHYAP
"THE SUTRADHAR"
      │
      ▼
VRITRA TASK FORCE COMMANDER
🔍 The Philosophy

Project Vritra is built around one idea:

Information becomes evidence when you know how to interrogate it.

The game therefore turns database exploration into detective work.

You don't simply read the answer.

You query for it.

You don't simply receive clues.

You discover connections.

And you don't simply complete isolated SQL exercises.

You uncover a conspiracy that has been hiding inside the data all along.

🕵️ Enter the Investigation

The evidence is in the database.

The clues are waiting.

The query is yours.

BEGIN INVESTIGATION;
