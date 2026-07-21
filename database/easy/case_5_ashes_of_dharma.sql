BEGIN;

-- ============================================
-- CASE 5
-- THE ASHES OF DHARMA
-- ACT 1 : THE PATTERN
-- ============================================

DELETE FROM game_clues WHERE case_id = 5;
DELETE FROM game_objectives WHERE case_id = 5;
DELETE FROM timeline WHERE case_id = 5;
DELETE FROM forensics WHERE case_id = 5;
DELETE FROM evidence WHERE case_id = 5;
DELETE FROM witnesses WHERE case_id = 5;
DELETE FROM suspects WHERE case_id = 5;
DELETE FROM case_characters WHERE case_id = 5;
DELETE FROM game_cases WHERE id = 5;

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
5,
'The Ashes of Dharma',
'Politician Devendra Pratap Singh dies in a suspicious fire hours before exposing a powerful organization known as Project Vritra.',
'easy',
35,
'Dharma and Power',
'The investigation reveals the first modern conspiracy linked directly to Project Vritra.',
true,
5,
1,
6,
'The Pattern',
'Unknown'
);

INSERT INTO case_characters
(case_id, character_id, involvement_type, notes)
VALUES
(5,1,'Lead Investigator','Investigates politician death'),
(5,2,'Digital Forensics','Examines digital evidence'),
(5,3,'Field Investigator','Interviews witnesses'),
(5,4,'Psychologist','Profiles suspects'),
(5,5,'Journalist','Tracks political links'),
(5,6,'Police Liaison','Coordinates official investigation'),
(5,7,'Expert Consultant','Analyzes recovered documents');

INSERT INTO suspects
(case_id,name,age,occupation,motive,alibi,contradiction,connection_to_monastery)
VALUES

(
5,
'Rajat Chauhan',
48,
'Political Advisor',
'Victim planned to expose corruption',
'Claims he was at a public event',
'Event footage timeline inconsistent',
'Political Associate'
),

(
5,
'Manish Tiwari',
44,
'Campaign Manager',
'Feared career destruction',
'Claims office work',
'Access records missing',
'Campaign Staff'
),

(
5,
'Aniket Sharma',
38,
'Corporate Lobbyist',
'Victim threatened financial interests',
'Business meeting',
'Meeting ended hours earlier',
'Financial Beneficiary'
),

(
5,
'Kunal Deshmukh',
52,
'Industrialist',
'Large contracts at risk',
'Outside city',
'Flight records conflict',
'Business Associate'
),

(
5,
'Rohit Vashisht',
36,
'Security Officer',
'Accepted bribes',
'Security patrol',
'Security logs altered',
'Victim Protection Team'
);

INSERT INTO witnesses
(case_id,name,age,occupation,statement,reliability)
VALUES

(
5,
'Anjali Verma',
41,
'Journalist',
'Victim planned a major disclosure.',
'High'
),

(
5,
'Prakash Dubey',
57,
'Driver',
'Saw unusual visitors before death.',
'High'
),

(
5,
'Neha Kapoor',
33,
'Secretary',
'Victim received threats.',
'High'
),

(
5,
'Mahesh Rao',
51,
'Fire Officer',
'Fire appears suspicious.',
'Medium'
),

(
5,
'Sunil Pathak',
47,
'Political Worker',
'Victim was under pressure.',
'Medium'
),

(
5,
'Vivek Mishra',
39,
'Security Staff',
'Observed security breaches.',
'Medium'
);

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(5,'Burned Laptop','Partially recovered computer.','Office','Digital'),

(5,'Project Vritra File','Confidential dossier.','Private Safe','Document'),

(5,'Financial Records','Suspicious transfers.','Office Vault','Document'),

(5,'Campaign Ledger','Political funding records.','Campaign Office','Document'),

(5,'Fire Residue Sample','Collected from scene.','Office','Physical'),

(5,'Mobile Phone','Victim communications.','Office','Digital'),

(5,'Encrypted USB','Contains hidden files.','Safe','Digital'),

(5,'Security Footage','Building surveillance.','Security Room','Digital'),

(5,'Threat Letters','Anonymous warnings.','Office Desk','Document'),

(5,'Insurance Documents','Recently updated policy.','Office','Document'),

(5,'Meeting Schedule','Victim appointments.','Office','Document'),

(5,'Hidden Notebook','Personal investigation notes.','Safe','Document');

INSERT INTO forensics
(case_id,name,description,analysis_result,type)
VALUES

(
5,
'Fire Analysis',
'Examination of fire origin',
'Accelerant detected',
'Chemical'
),

(
5,
'Laptop Recovery',
'Digital reconstruction',
'Recovered Project Vritra references',
'Documentary'
),

(
5,
'Fingerprint Analysis',
'Scene evidence review',
'Matches Rohit Vashisht',
'Physical'
),

(
5,
'Financial Audit',
'Review of transactions',
'Hidden payments discovered',
'Documentary'
),

(
5,
'Communication Analysis',
'Phone records',
'Threats received before death',
'Documentary'
),

(
5,
'USB Recovery',
'Encrypted data restored',
'Contains Project Vritra documents',
'Documentary'
),

(
5,
'Timeline Reconstruction',
'Victim final movements',
'Victim preparing public disclosure',
'Temporal'
),

(
5,
'Security Review',
'CCTV examination',
'Footage deliberately deleted',
'Temporal'
);

INSERT INTO timeline
(case_id,time,event,description)
VALUES

('5','09:00','Political Meeting','Victim meets advisors'),

('5','11:30','Document Review','Project Vritra files examined'),

('5','14:00','Threat Received','Anonymous warning received'),

('5','16:00','Media Contact','Victim contacts journalists'),

('5','18:30','Security Breach','Unauthorized access detected'),

('5','20:00','Final Preparation','Victim prepares disclosure'),

('5','21:10','Fire Starts','Office catches fire'),

('5','21:25','Victim Death','Fatal incident occurs'),

('5','22:00','Investigation Begins','Authorities arrive');

INSERT INTO game_objectives
(case_id,title,description,expected_query,hint,hint_threshold,order_index,points,is_optional)
VALUES

(5,'Review Suspects','Identify possible killers.','SELECT * FROM suspects WHERE case_id=5;','Start with motives.',3,1,100,false),

(5,'Interview Witnesses','Analyze witness statements.','SELECT * FROM witnesses WHERE case_id=5;','Look for threats.',3,2,100,false),

(5,'Review Evidence','Study physical and digital evidence.','SELECT * FROM evidence WHERE case_id=5;','Focus on Project Vritra files.',3,3,150,false),

(5,'Analyze Forensics','Review forensic reports.','SELECT * FROM forensics WHERE case_id=5;','Fire analysis is critical.',3,4,150,false),

(5,'Reconstruct Timeline','Determine sequence of events.','SELECT * FROM timeline WHERE case_id=5;','Focus on final hours.',3,5,200,false),

(5,'Investigate Funding','Trace suspicious payments.','SELECT * FROM evidence WHERE case_id=5;','Review ledgers.',2,6,250,false),

(5,'Discover Project Vritra','Understand the hidden organization.','SELECT * FROM evidence WHERE case_id=5;','Study recovered files.',2,7,250,false),

(5,'Identify Killer','Solve the murder.','SELECT * FROM suspects WHERE case_id=5;','Combine motive and forensics.',1,8,500,false);

INSERT INTO game_clues
(case_id,objective_id,title,description,clue_type,icon,order_index)
VALUES

(5,NULL,'Suspicious Fire','The fire was not accidental.','information','🔥',1),

(5,NULL,'Deleted Footage','Security recordings were erased.','evidence','📹',2),

(5,NULL,'Hidden Payments','Money trails connect suspects.','evidence','💰',3),

(5,NULL,'Threat Campaign','Victim received warnings.','information','✉️',4),

(5,NULL,'Project Vritra File','Organization appears directly.','special','📂',5),

(5,NULL,'Ninth Mandala','Organization linked to previous cases.','special','⚜️',6),

(5,NULL,'Naga Symbol','Serpent symbol found again.','special','🐍',7),

(5,NULL,'Political Influence','Powerful people involved.','special','🏛️',8),

(5,NULL,'Public Disclosure','Victim planned to reveal everything.','information','🎤',9),

(5,NULL,'The Pattern','Previous murders now appear connected.','special','🧩',10);

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(
5,
'Recovered Disclosure Draft',
'Draft speech prepared by Devendra Pratap Singh. It states that Project Vritra has infiltrated business, politics, religious institutions and academia.',
'Recovered Laptop',
'Document'
);

COMMIT;