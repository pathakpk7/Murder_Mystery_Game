BEGIN;

-- ============================================
-- CASE 6
-- THE TWIN ILLUSION
-- ACT 2 : THE CONSPIRACY
-- ============================================

DELETE FROM game_clues WHERE case_id = 6;
DELETE FROM game_objectives WHERE case_id = 6;
DELETE FROM timeline WHERE case_id = 6;
DELETE FROM forensics WHERE case_id = 6;
DELETE FROM evidence WHERE case_id = 6;
DELETE FROM witnesses WHERE case_id = 6;
DELETE FROM suspects WHERE case_id = 6;
DELETE FROM case_characters WHERE case_id = 6;
DELETE FROM game_cases WHERE id = 6;

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
6,
'The Twin Illusion',
'A man officially declared dead five years ago suddenly appears in financial records under a different identity.',
'medium',
40,
'Maya and Identity',
'Prasoon investigates how a dead man returned to life.',
true,
6,
2,
7,
'The Conspiracy',
'Unknown'
);

INSERT INTO case_characters
(case_id, character_id, involvement_type, notes)
VALUES
(6,1,'Lead Investigator','Investigates identity fraud'),
(6,2,'Digital Forensics','Tracks government records'),
(6,3,'Field Investigator','Locates witnesses'),
(6,4,'Psychologist','Studies identity manipulation'),
(6,5,'Journalist','Investigates past death records'),
(6,6,'Police Liaison','Coordinates agencies'),
(6,7,'Expert Consultant','Studies symbolic references');

INSERT INTO suspects
(case_id,name,age,occupation,motive,alibi,contradiction,connection_to_monastery)
VALUES

(
6,
'Aditya Menon',
45,
'Identity Consultant',
'Financial gain through forged identities',
'Claims legal consulting work',
'Client records missing',
'Document Fabrication Network'
),

(
6,
'Raghunath Iyer',
58,
'Registrar Officer',
'Accepted bribes to alter records',
'Government office',
'Digital logs altered',
'Record Management'
),

(
6,
'Siddharth Rao',
39,
'Cyber Security Expert',
'Controlled access to databases',
'Working remotely',
'System activity contradicts statement',
'Database Access'
),

(
6,
'Neeraj Kulkarni',
47,
'Insurance Executive',
'Fraudulent death claims',
'Business meeting',
'Meeting records incomplete',
'Insurance Network'
),

(
6,
'Pankaj Trivedi',
42,
'Private Investigator',
'Discovered conspiracy and exploited it',
'Field assignment',
'Location records inconsistent',
'Victim Connection'
);

INSERT INTO witnesses
(case_id,name,age,occupation,statement,reliability)
VALUES

(6,'Alok Sharma',51,'Bank Manager','The dead man opened a new account recently.','High'),

(6,'Priya Pathak',34,'Government Clerk','Several identity records were modified.','High'),

(6,'Vikas Soni',44,'Insurance Agent','A death certificate appears fraudulent.','Medium'),

(6,'Ramesh Verma',61,'Retired Officer','Victim was officially declared dead years ago.','High'),

(6,'Sneha Tiwari',29,'Data Analyst','Database access occurred after midnight.','Medium'),

(6,'Anurag Mishra',37,'Lawyer','The identity transfer was illegal.','High');

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(6,'Death Certificate','Official death record.','Civil Registry','Document'),

(6,'New Identity Card','Issued under another name.','Government Database','Document'),

(6,'Bank Account Records','Recently opened account.','National Bank','Document'),

(6,'Insurance Claim','Large payout after death.','Insurance Office','Document'),

(6,'Travel Records','Victim travelled after death.','Airport Authority','Document'),

(6,'Database Logs','Unauthorized access history.','Data Center','Digital'),

(6,'Encrypted Emails','Communication between suspects.','Recovered Server','Digital'),

(6,'Property Purchase Documents','Assets bought under new identity.','Land Registry','Document'),

(6,'Phone Metadata','Location tracking information.','Telecom Provider','Digital'),

(6,'Deleted Registry Entry','Removed citizen record.','Government Server','Digital'),

(6,'Hidden Ledger','Payments for identity creation.','Private Office','Document'),

(6,'Naga Symbol Document','Contains familiar serpent insignia.','Recovered Archive','Document');

INSERT INTO forensics
(case_id,name,description,analysis_result,type)
VALUES

(
6,
'Document Analysis',
'Identity documents examined',
'Multiple forged records detected',
'Documentary'
),

(
6,
'Database Audit',
'Government server review',
'Unauthorized modifications confirmed',
'Documentary'
),

(
6,
'Communication Recovery',
'Deleted messages restored',
'Identity transfers discussed',
'Documentary'
),

(
6,
'Biometric Verification',
'Identity comparison',
'Dead man and living man are identical',
'Physical'
),

(
6,
'Financial Analysis',
'Money movement investigation',
'Large unexplained payments found',
'Documentary'
),

(
6,
'Timeline Reconstruction',
'Identity creation sequence',
'Fraud began years earlier',
'Temporal'
),

(
6,
'Access Log Review',
'Server activity analysis',
'Registry officer involved',
'Temporal'
),

(
6,
'Network Mapping',
'Connection analysis',
'Links to Project Vritra discovered',
'Documentary'
);

INSERT INTO timeline
(case_id,time,event,description)
VALUES

('6','5 Years Ago','Official Death','Victim declared dead'),

('6','4 Years Ago','Insurance Payment','Claim processed'),

('6','3 Years Ago','Identity Created','New identity established'),

('6','2 Years Ago','Property Purchase','Assets acquired'),

('6','1 Year Ago','Bank Accounts Opened','Financial activity begins'),

('6','2 Months Ago','Database Access','Records modified'),

('6','1 Week Ago','Witness Report','Victim spotted alive'),

('6','Yesterday','Investigation Begins','Evidence collected'),

('6','Today','Conspiracy Exposed','Identity fraud confirmed');

INSERT INTO game_objectives
(case_id,title,description,expected_query,hint,hint_threshold,order_index,points,is_optional)
VALUES

(6,'Review Suspects','Analyze possible conspirators.','SELECT * FROM suspects WHERE case_id=6;','Study motives.',3,1,100,false),

(6,'Review Witnesses','Analyze testimony.','SELECT * FROM witnesses WHERE case_id=6;','Focus on identity records.',3,2,100,false),

(6,'Analyze Documents','Study forged identities.','SELECT * FROM evidence WHERE case_id=6;','Compare records.',3,3,150,false),

(6,'Review Forensics','Examine technical findings.','SELECT * FROM forensics WHERE case_id=6;','Check biometrics.',3,4,150,false),

(6,'Reconstruct Timeline','Follow the fraud timeline.','SELECT * FROM timeline WHERE case_id=6;','Look for creation events.',3,5,200,false),

(6,'Investigate Registry Records','Discover altered data.','SELECT * FROM evidence WHERE case_id=6;','Review deleted entries.',2,6,250,false),

(6,'Discover Project Vritra Link','Find the hidden organization.','SELECT * FROM forensics WHERE case_id=6;','Check network mapping.',2,7,250,false),

(6,'Identify The Architect','Find who enabled the fraud.','SELECT * FROM suspects WHERE case_id=6;','Combine financial and forensic evidence.',1,8,500,false);

INSERT INTO game_clues
(case_id,objective_id,title,description,clue_type,icon,order_index)
VALUES

(6,NULL,'Dead Man Walking','A deceased individual appears alive.','special','👤',1),

(6,NULL,'Forged Identity','Government records were altered.','evidence','📄',2),

(6,NULL,'Deleted Citizen Record','Someone erased history.','information','🗂️',3),

(6,NULL,'Insurance Fraud','Money followed the death.','evidence','💰',4),

(6,NULL,'Biometric Match','The same person appears twice.','hint','🧬',5),

(6,NULL,'Government Access','Internal systems were compromised.','information','🏛️',6),

(6,NULL,'Project Vritra Link','Identity manipulation is part of a larger operation.','special','📂',7),

(6,NULL,'Ninth Mandala','Organization influence expands.','special','⚜️',8),

(6,NULL,'Naga Symbol','The serpent appears in registry documents.','special','🐍',9),

(6,NULL,'The Illusion','Reality itself can be rewritten.','special','🎭',10);

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(
6,
'Project Maya Memorandum',
'Internal document describing identity replacement operations. This is the first appearance of something called the Maya Program.',
'Recovered Server',
'Document'
);

INSERT INTO game_clues
(case_id,objective_id,title,description,clue_type,icon,order_index)
VALUES

(
6,
NULL,
'Wheel Of Time',
'A recovered file contains impossible timelines showing events occurring before they officially happened.',
'special',
'🕉️',
11
);

COMMIT;