BEGIN;

-- ============================================
-- CASE 7
-- THE WHEEL OF TIME
-- ACT 2 : THE CONSPIRACY
-- ============================================

DELETE FROM game_clues WHERE case_id = 7;
DELETE FROM game_objectives WHERE case_id = 7;
DELETE FROM timeline WHERE case_id = 7;
DELETE FROM forensics WHERE case_id = 7;
DELETE FROM evidence WHERE case_id = 7;
DELETE FROM witnesses WHERE case_id = 7;
DELETE FROM suspects WHERE case_id = 7;
DELETE FROM case_characters WHERE case_id = 7;
DELETE FROM game_cases WHERE id = 7;

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
7,
'The Wheel of Time',
'A government analyst is murdered after discovering impossible discrepancies in national event records.',
'medium',
45,
'Kalachakra',
'Prasoon uncovers evidence suggesting someone is manipulating historical timelines.',
true,
7,
2,
8,
'The Conspiracy',
'Unknown'
);

INSERT INTO case_characters
(case_id, character_id, involvement_type, notes)
VALUES
(7,1,'Lead Investigator','Investigates timeline anomalies'),
(7,2,'Digital Forensics','Analyzes databases'),
(7,3,'Field Investigator','Interviews witnesses'),
(7,4,'Psychologist','Studies suspect behavior'),
(7,5,'Journalist','Investigates historical records'),
(7,6,'Police Liaison','Coordinates investigation'),
(7,7,'Expert Consultant','Analyzes symbolic references');

INSERT INTO suspects
(case_id,name,age,occupation,motive,alibi,contradiction,connection_to_monastery)
VALUES

(
7,
'Abhinav Kapoor',
46,
'Data Scientist',
'Victim discovered predictive systems',
'Claims conference attendance',
'Conference ended earlier',
'Prediction Program'
),

(
7,
'Keshav Rao',
55,
'Government Archivist',
'Manipulated official records',
'Working overnight',
'Logs modified later',
'Historical Records'
),

(
7,
'Dhruv Menon',
38,
'Software Architect',
'Built timeline software',
'Remote work',
'System access confirms involvement',
'Oracle Prototype'
),

(
7,
'Tarun Bhardwaj',
49,
'Policy Advisor',
'Protected influential individuals',
'Private meeting',
'Witnesses contradict statement',
'Political Connection'
),

(
7,
'Arvind Shukla',
43,
'Research Director',
'Prevented exposure of project',
'Research facility',
'Access logs altered',
'Project Vritra'
);

INSERT INTO witnesses
(case_id,name,age,occupation,statement,reliability)
VALUES

(7,'Nitin Pathak',42,'Government Clerk','Records changed overnight.','High'),

(7,'Rekha Sharma',37,'Analyst','Victim was frightened before death.','High'),

(7,'Suresh Mishra',59,'Archivist','Timeline reports were classified.','Medium'),

(7,'Aman Verma',31,'Programmer','Victim accessed restricted files.','Medium'),

(7,'Deepa Tiwari',46,'Research Officer','Predictions matched real events.','High'),

(7,'Varun Joshi',39,'Security Officer','Server room accessed after hours.','Medium');

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(7,'Prediction Report','Events predicted before occurrence.','Victim Office','Document'),

(7,'Timeline Database','Historical records archive.','Data Center','Digital'),

(7,'Server Access Logs','Unauthorized access records.','Server Room','Digital'),

(7,'Encrypted Forecast File','Future event projections.','Secure Server','Digital'),

(7,'Victim Notes','Investigation journal.','Victim Desk','Document'),

(7,'Security Footage','Building surveillance.','Security Room','Digital'),

(7,'Government Memorandum','Restricted instructions.','Archive Vault','Document'),

(7,'Deleted Reports','Removed timeline studies.','Backup Server','Digital'),

(7,'Statistical Model','Prediction algorithm.','Research Lab','Digital'),

(7,'Classified Presentation','Internal briefing.','Conference Room','Document'),

(7,'Communication Archive','Emails between suspects.','Mail Server','Digital'),

(7,'Naga Reference Sheet','Contains serpent insignia.','Victim Office','Document');

INSERT INTO forensics
(case_id,name,description,analysis_result,type)
VALUES

(
7,
'Digital Audit',
'Database investigation',
'Records altered repeatedly',
'Documentary'
),

(
7,
'Algorithm Analysis',
'Prediction system review',
'Model predicted real events',
'Documentary'
),

(
7,
'Communication Recovery',
'Deleted emails restored',
'Victim planned exposure',
'Documentary'
),

(
7,
'Access Log Review',
'Server investigation',
'Unauthorized modifications confirmed',
'Temporal'
),

(
7,
'Document Verification',
'Historical record audit',
'Dates were manipulated',
'Documentary'
),

(
7,
'Timeline Reconstruction',
'Victim final movements',
'Victim discovered anomaly before death',
'Temporal'
),

(
7,
'Statistical Analysis',
'Prediction accuracy review',
'Success rate exceeds 90%',
'Documentary'
),

(
7,
'Network Mapping',
'Connection analysis',
'Links to Project Vritra confirmed',
'Documentary'
);

INSERT INTO timeline
(case_id,time,event,description)
VALUES

('7','6 Months Ago','Prediction System Created','Oracle prototype activated'),

('7','4 Months Ago','First Successful Prediction','System predicts public event'),

('7','2 Months Ago','Victim Begins Investigation','Anomalies discovered'),

('7','2 Weeks Ago','Restricted Access','Victim enters classified archive'),

('7','5 Days Ago','Prediction File Found','Future event report recovered'),

('7','2 Days Ago','Threat Issued','Victim warned to stop'),

('7','21:00','Server Access','Unauthorized modifications'),

('7','22:15','Murder','Victim killed'),

('7','23:00','Evidence Deleted','Records altered again');

INSERT INTO game_objectives
(case_id,title,description,expected_query,hint,hint_threshold,order_index,points,is_optional)
VALUES

(7,'Review Suspects','Identify all persons of interest.','SELECT * FROM suspects WHERE case_id=7;','Start with motives.',3,1,100,false),

(7,'Analyze Witnesses','Compare statements.','SELECT * FROM witnesses WHERE case_id=7;','Look for timeline clues.',3,2,100,false),

(7,'Review Evidence','Study collected records.','SELECT * FROM evidence WHERE case_id=7;','Focus on prediction files.',3,3,150,false),

(7,'Analyze Forensics','Review technical findings.','SELECT * FROM forensics WHERE case_id=7;','Algorithm analysis is critical.',3,4,150,false),

(7,'Reconstruct Timeline','Determine event sequence.','SELECT * FROM timeline WHERE case_id=7;','Look for manipulation.',3,5,200,false),

(7,'Investigate Oracle System','Understand predictions.','SELECT * FROM evidence WHERE case_id=7;','Review forecast files.',2,6,250,false),

(7,'Discover Timeline Manipulation','Find altered records.','SELECT * FROM forensics WHERE case_id=7;','Check audits.',2,7,250,false),

(7,'Identify Killer','Solve the murder.','SELECT * FROM suspects WHERE case_id=7;','Combine access and motive.',1,8,500,false);

INSERT INTO game_clues
(case_id,objective_id,title,description,clue_type,icon,order_index)
VALUES

(7,NULL,'Impossible Prediction','Events were predicted before occurring.','special','⏳',1),

(7,NULL,'Altered Records','Historical data was modified.','evidence','📄',2),

(7,NULL,'Oracle Prototype','An experimental prediction system exists.','special','🖥️',3),

(7,NULL,'Deleted Evidence','Records disappeared overnight.','information','🗂️',4),

(7,NULL,'90 Percent Accuracy','Predictions are alarmingly accurate.','hint','📈',5),

(7,NULL,'Government Involvement','Officials helped hide information.','information','🏛️',6),

(7,NULL,'Project Vritra Expansion','The conspiracy is growing.','special','📂',7),

(7,NULL,'Ninth Mandala','The organization directs operations.','special','⚜️',8),

(7,NULL,'Naga Symbol','The serpent appears in prediction reports.','special','🐍',9),

(7,NULL,'Wheel Of Time','Someone appears to control information flow.','special','🕉️',10);

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(
7,
'Oracle Project Briefing',
'Internal document describing a predictive engine capable of forecasting human behavior and social events.',
'Recovered Secure Server',
'Document'
);

INSERT INTO game_clues
(case_id,objective_id,title,description,clue_type,icon,order_index)
VALUES

(
7,
NULL,
'The Forgotten Monk',
'A classified Oracle report references an unidentified monk whose memories were deliberately erased.',
'special',
'🧠',
11
);

COMMIT;