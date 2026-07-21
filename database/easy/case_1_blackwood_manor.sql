-- ============================================
-- CASE 1: THE NAGABHAVAN ESTATE MYSTERY
-- ============================================
-- This file contains all data for Case 1.
-- Run core_schema.sql BEFORE running this file.
-- ============================================


BEGIN;

DELETE FROM game_clues WHERE case_id = 1;
DELETE FROM game_objectives WHERE case_id = 1;
DELETE FROM timeline WHERE case_id = 1;
DELETE FROM forensics WHERE case_id = 1;
DELETE FROM evidence WHERE case_id = 1;
DELETE FROM witnesses WHERE case_id = 1;
DELETE FROM suspects WHERE case_id = 1;
DELETE FROM case_characters WHERE case_id = 1;
DELETE FROM game_cases WHERE id = 1;

INSERT INTO game_cases (
id,
title,
description,
difficulty,
estimated_duration_minutes,
mythology_theme,
story_background,
is_active,
chapter,
act,
unlocks_case,
story_arc,
primary_villain
)
VALUES
(
1,
'The Blackwood Manor Mystery',
'Industrialist Rajveer Rathore is found dead inside his locked study at Blackwood Manor. What initially appears to be suicide soon reveals signs of murder.',
'easy',
20,
'Naga Symbol',
'Prasoon Pathak is called to Blackwood Manor after ACP Rudransh Pathak suspects foul play in a seemingly impossible locked-room death.',
true,
1,
1,
2,
'The Pattern',
'Unknown'
);

-- ============================================
-- CORE TEAM PARTICIPATION
-- ============================================

INSERT INTO case_characters
(case_id, character_id, involvement_type, notes)
VALUES
(1,1,'Lead Investigator','Assigned by ACP Rudransh'),
(1,2,'Forensics','Digital and forensic analysis'),
(1,3,'Field Investigator','Witness interviews'),
(1,4,'Psychologist','Behavioral profiling'),
(1,5,'Journalist','Background investigation'),
(1,6,'Police Liaison','Official investigation lead');

INSERT INTO suspects
(case_id,name,age,occupation,motive,alibi,contradiction,connection_to_monastery)
VALUES

(
1,
'Vikram Rathore',
31,
'Business Executive',
'Heavy debt and inheritance dispute',
'Claims he was asleep',
'Phone records show activity during the murder window',
'Son of victim'
),

(
1,
'Naina Rathore',
48,
'Socialite',
'Primary inheritance beneficiary',
'Claims she was attending a charity call',
'Call ended before murder time',
'Wife of victim'
),

(
1,
'Karan Malhotra',
45,
'Business Partner',
'Corporate dispute worth crores',
'Claims he left the estate early',
'Vehicle GPS places him nearby',
'Business associate'
),

(
1,
'Raghav Sethi',
38,
'Personal Secretary',
'Unauthorized financial transfers discovered',
'Claims he never entered the study',
'Fingerprint found on medicine cabinet',
'Victims trusted aide'
),

(
1,
'Dev Sharma',
42,
'Security Chief',
'Possible blackmail involvement',
'Monitoring CCTV',
'CCTV footage contains unexplained gaps',
'Head of estate security'
);

INSERT INTO witnesses
(case_id,name,age,occupation,statement,reliability)
VALUES

(
1,
'Meera Joshi',
58,
'Housekeeper',
'Saw Raghav near the study shortly before midnight',
'High'
),

(
1,
'Anil Verma',
52,
'Gardener',
'Observed unusual vehicle movement near the estate',
'Medium'
),

(
1,
'Pooja Sethi',
33,
'Chef',
'Prepared Rajveer''s evening herbal drink',
'High'
),

(
1,
'Rohit Kapoor',
29,
'Driver',
'Heard an argument between Rajveer and Raghav',
'Medium'
),

(
1,
'Shalini Rao',
44,
'Family Doctor',
'Victim appeared healthy earlier that day',
'High'
),

(
1,
'Ashok Tandon',
61,
'Neighbor',
'Observed study lights active after midnight',
'Low'
);

-- ============================================
-- EVIDENCE
-- ============================================

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(
1,
'Herbal Medicine Bottle',
'Bottle used by victim before death',
'Victim Study',
'Physical'
),

(
1,
'Financial Ledger',
'Contains unexplained transfers',
'Study Safe',
'Document'
),

(
1,
'Burned Paper Fragment',
'Partially destroyed note containing a serpent sketch',
'Fireplace',
'Document'
),

(
1,
'Medicine Spoon',
'Contains chemical residue',
'Study Desk',
'Physical'
),

(
1,
'Victim Mobile Phone',
'Last communications before death',
'Study Desk',
'Digital'
),

(
1,
'Study Key',
'Found in victim pocket',
'Victim Body',
'Physical'
),

(
1,
'CCTV Storage Drive',
'Contains missing footage',
'Security Room',
'Digital'
),

(
1,
'Transfer Authorization Form',
'Signed shortly before death',
'Office Drawer',
'Document'
),

(
1,
'Desk Scratch Mark',
'Serpent-like symbol carved beneath desk',
'Study Desk',
'Physical'
),

(
1,
'Business Contract',
'Dispute involving Karan Malhotra',
'Victim Study',
'Document'
),

(
1,
'Fingerprint Samples',
'Collected from medicine cabinet',
'Study',
'Physical'
),

(
1,
'Bank Transaction Records',
'Suspicious outgoing transfers',
'Office Safe',
'Document'
);

-- ============================================
-- FORENSICS
-- ============================================

INSERT INTO forensics
(case_id,name,description,analysis_result,type)
VALUES

(
1,
'Toxicology Report',
'Analysis of victim blood',
'Rare poison detected',
'Chemical'
),

(
1,
'Medicine Analysis',
'Chemical composition of medicine',
'Poison mixed into nightly dose',
'Chemical'
),

(
1,
'Fingerprint Analysis',
'Fingerprints on medicine cabinet',
'Matches Raghav Sethi',
'Physical'
),

(
1,
'Financial Audit',
'Review of financial records',
'Unauthorized transfers discovered',
'Documentary'
),

(
1,
'Burned Document Recovery',
'Recovered paper fragments',
'Contains serpent symbol',
'Documentary'
),

(
1,
'Phone Analysis',
'Victim communications',
'Threats received before death',
'Documentary'
),

(
1,
'CCTV Examination',
'Review of security footage',
'Missing 34 minutes of footage',
'Temporal'
),

(
1,
'Timeline Reconstruction',
'Reconstruction of final evening',
'Poison administered before death',
'Temporal'
);

-- ============================================
-- TIMELINE
-- ============================================

INSERT INTO timeline
(case_id,time,event,description)
VALUES

(
1,
'18:30',
'Dinner',
'Victim eats with family'
),

(
1,
'20:00',
'Business Call',
'Argument with Karan Malhotra'
),

(
1,
'21:15',
'Secretary Meeting',
'Victim confronts Raghav about transfers'
),

(
1,
'22:00',
'Medicine Delivered',
'Nightly herbal medicine prepared'
),

(
1,
'22:20',
'Victim Enters Study',
'Begins reviewing records'
),

(
1,
'22:45',
'Power Fluctuation',
'Security cameras briefly interrupted'
),

(
1,
'23:10',
'Unknown Activity',
'Movement near study corridor'
),

(
1,
'23:45',
'Victim Death',
'Estimated time of poisoning'
),

(
1,
'00:15',
'Body Found',
'House staff alert authorities'
);

-- ============================================
-- OBJECTIVES
-- ============================================

INSERT INTO game_objectives
(case_id,title,description,expected_query,hint,hint_threshold,order_index,points,is_optional)
VALUES

(
1,
'Identify All Suspects',
'Review all suspects connected to the victim',
'SELECT * FROM suspects WHERE case_id = 1;',
'Start with the suspects table',
3,
1,
100,
false
),

(
1,
'Interview Witnesses',
'Review witness statements',
'SELECT * FROM witnesses WHERE case_id = 1;',
'Witnesses provide timeline clues',
3,
2,
100,
false
),

(
1,
'Review Physical Evidence',
'Examine evidence collected from the scene',
'SELECT * FROM evidence WHERE case_id = 1;',
'Focus on the study',
3,
3,
150,
false
),

(
1,
'Analyze Forensics',
'Review laboratory findings',
'SELECT * FROM forensics WHERE case_id = 1;',
'Toxicology is important',
3,
4,
150,
false
),

(
1,
'Reconstruct Timeline',
'Review chronological events',
'SELECT * FROM timeline WHERE case_id = 1;',
'Sort events by time',
3,
5,
200,
false
),

(
1,
'Find Financial Motive',
'Discover suspicious transfers',
'SELECT * FROM forensics WHERE case_id = 1;',
'Check audit reports',
2,
6,
200,
false
),

(
1,
'Discover Hidden Symbol',
'Find evidence connected to serpent marking',
'SELECT * FROM evidence WHERE case_id = 1;',
'Look beneath the desk',
2,
7,
250,
false
),

(
1,
'Identify The Killer',
'Solve the murder',
'SELECT * FROM suspects WHERE case_id = 1;',
'Combine forensic and motive evidence',
1,
8,
500,
false
);

-- ============================================
-- CLUES
-- ============================================

INSERT INTO game_clues
(case_id,objective_id,title,description,clue_type,icon,order_index)
VALUES

(1,NULL,'Locked Study','The study was locked from inside.','information','🚪',1),

(1,NULL,'Poison Trace','A rare poison was detected.','evidence','☠️',2),

(1,NULL,'Financial Transfers','Money was moved secretly.','evidence','💰',3),

(1,NULL,'Missing CCTV','Security footage vanished.','information','📹',4),

(1,NULL,'Medicine Cabinet','Someone accessed medicine storage.','evidence','🧪',5),

(1,NULL,'Fingerprint Match','Fingerprints belong to a suspect.','hint','🔍',6),

(1,NULL,'Serpent Symbol','A strange serpent symbol was discovered.','special','🐍',7),

(1,NULL,'Threatening Messages','Victim was being pressured.','information','📱',8),

(1,NULL,'Hidden Ledger','Victim was investigating transfers.','evidence','📖',9),

(1,NULL,'Unknown Organization','A payment references Ninth Mandala Foundation.','special','⚜️',10);

COMMIT;