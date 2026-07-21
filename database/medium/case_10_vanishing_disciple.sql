BEGIN;

-- ============================================
-- CASE 10
-- THE VANISHING DISCIPLE
-- ACT 2 : THE CONSPIRACY
-- ============================================

DELETE FROM game_clues WHERE case_id = 10;
DELETE FROM game_objectives WHERE case_id = 10;
DELETE FROM timeline WHERE case_id = 10;
DELETE FROM forensics WHERE case_id = 10;
DELETE FROM evidence WHERE case_id = 10;
DELETE FROM witnesses WHERE case_id = 10;
DELETE FROM suspects WHERE case_id = 10;
DELETE FROM case_characters WHERE case_id = 10;
DELETE FROM game_cases WHERE id = 10;

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
10,
'The Vanishing Disciple',
'A key witness connected to the Inner Circle disappears and all official records begin vanishing with him.',
'medium',
55,
'Maya and Identity',
'Prasoon discovers that Project Vritra can erase people from existence.',
true,
10,
2,
11,
'The Conspiracy',
'Unknown'
);

INSERT INTO case_characters
(case_id, character_id, involvement_type, notes)
VALUES
(10,1,'Lead Investigator','Protects witness'),
(10,2,'Digital Forensics','Tracks erased records'),
(10,3,'Field Investigator','Searches physical locations'),
(10,4,'Psychologist','Analyzes witness testimony'),
(10,5,'Journalist','Investigates institutional corruption'),
(10,6,'Police Liaison','Coordinates agencies'),
(10,7,'Expert Consultant','Studies Ninth Mandala references');

INSERT INTO suspects
(case_id,name,age,occupation,motive,alibi,contradiction,connection_to_monastery)
VALUES

(
10,
'Ashwin Kapoor',
48,
'National Records Officer',
'Controlled citizen databases',
'Claims administrative duties',
'Access logs altered',
'Government Records'
),

(
10,
'Sameer Deshpande',
44,
'Cyber Intelligence Analyst',
'Deleted witness records',
'Remote monitoring',
'Server activity conflicts',
'Data Operations'
),

(
10,
'Raghavendra Rao',
57,
'Home Ministry Advisor',
'Protected Inner Circle',
'Official meetings',
'Travel records inconsistent',
'Political Network'
),

(
10,
'Kartik Menon',
41,
'Identity Management Specialist',
'Built record manipulation tools',
'Technical audit',
'System logs contradict statement',
'Identity Program'
),

(
10,
'Vivek Bhardwaj',
50,
'Archive Director',
'Destroyed historical evidence',
'Archive inspection',
'Witnesses disagree',
'National Archives'
);

INSERT INTO witnesses
(case_id,name,age,occupation,statement,reliability)
VALUES

(10,'Aditi Sharma',34,'Bank Officer','Witness accounts disappeared overnight.','High'),

(10,'Naveen Pathak',46,'Government Clerk','Records were manually deleted.','High'),

(10,'Pooja Tiwari',31,'Database Engineer','Access permissions were overridden.','Medium'),

(10,'Sanjay Verma',52,'School Administrator','Student records vanished.','High'),

(10,'Nikhil Joshi',43,'Passport Officer','Identity files disappeared completely.','Medium'),

(10,'Anita Dubey',39,'Journalist','Witness feared a hidden council.','High');

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(10,'Deleted Citizen Record','Witness official record.','National Registry','Digital'),

(10,'Passport Archive','Removed identity files.','Passport Office','Digital'),

(10,'Bank Account Closure Logs','Financial records erased.','Bank Server','Digital'),

(10,'School Registration File','Educational records removed.','Education Board','Document'),

(10,'Hospital Records','Medical history deleted.','Health Archive','Document'),

(10,'Witness Audio Recording','Final testimony.','Investigation Server','Digital'),

(10,'Access Control Report','Database access logs.','Data Center','Digital'),

(10,'Identity Rewrite Manual','Internal operational guide.','Recovered Server','Document'),

(10,'Communication Archive','Messages between suspects.','Mail Server','Digital'),

(10,'Government Directive','Classified instruction document.','Secure Archive','Document'),

(10,'Inner Circle Reference','Witness notes.','Recovered Notebook','Document'),

(10,'Naga Authorization Seal','Official symbol used in operations.','Secure File','Document');

INSERT INTO forensics
(case_id,name,description,analysis_result,type)
VALUES

(
10,
'Database Audit',
'National registry review',
'Mass deletion confirmed',
'Documentary'
),

(
10,
'Identity Reconstruction',
'Attempt to rebuild records',
'Original identity existed',
'Documentary'
),

(
10,
'Server Analysis',
'System access review',
'Unauthorized administrative access',
'Documentary'
),

(
10,
'Communication Recovery',
'Deleted messages restored',
'Witness targeted deliberately',
'Documentary'
),

(
10,
'Timeline Reconstruction',
'Sequence of deletion events',
'Records erased within hours',
'Temporal'
),

(
10,
'Access Log Review',
'Privilege escalation analysis',
'Government credentials used',
'Temporal'
),

(
10,
'Network Mapping',
'Relationship analysis',
'Inner Circle involvement confirmed',
'Documentary'
),

(
10,
'Data Recovery',
'Recovery of deleted files',
'Partial witness history restored',
'Documentary'
);

INSERT INTO timeline
(case_id,time,event,description)
VALUES

('10','7 Days Ago','Witness Located','Inner Circle witness found'),

('10','5 Days Ago','Protective Custody','Witness secured'),

('10','4 Days Ago','First Record Deleted','Registry changes begin'),

('10','3 Days Ago','Bank Accounts Removed','Financial identity erased'),

('10','2 Days Ago','Government Files Deleted','Official records vanish'),

('10','1 Day Ago','Witness Disappears','Physical disappearance'),

('10','22:00','Investigation Begins','Digital audit launched'),

('10','23:30','Inner Circle Link Found','Witness notes recovered'),

('10','Today','Conspiracy Confirmed','Institutional infiltration exposed');

INSERT INTO game_objectives
(case_id,title,description,expected_query,hint,hint_threshold,order_index,points,is_optional)
VALUES

(10,'Review Suspects','Identify conspirators.','SELECT * FROM suspects WHERE case_id=10;',3,1,100,false),

(10,'Analyze Witnesses','Review testimony.','SELECT * FROM witnesses WHERE case_id=10;',3,2,100,false),

(10,'Review Evidence','Study erased records.','SELECT * FROM evidence WHERE case_id=10;',3,3,150,false),

(10,'Analyze Forensics','Review technical findings.','SELECT * FROM forensics WHERE case_id=10;',3,4,150,false),

(10,'Reconstruct Timeline','Follow disappearance events.','SELECT * FROM timeline WHERE case_id=10;',3,5,200,false),

(10,'Investigate Identity Erasure','Understand deletion system.','SELECT * FROM evidence WHERE case_id=10;',2,6,250,false),

(10,'Expose The Inner Circle','Identify hidden controllers.','SELECT * FROM forensics WHERE case_id=10;',2,7,250,false),

(10,'Solve The Case','Determine who erased the witness.','SELECT * FROM suspects WHERE case_id=10;',1,8,500,false);

INSERT INTO game_clues
(case_id,objective_id,title,description,clue_type,icon,order_index)
VALUES

(10,NULL,'Missing Witness','The witness vanished completely.','special','👤',1),

(10,NULL,'Deleted Identity','Government records disappeared.','evidence','📄',2),

(10,NULL,'Bank Records Removed','Financial history erased.','evidence','💰',3),

(10,NULL,'Government Credentials','Official systems were abused.','information','🏛️',4),

(10,NULL,'Inner Circle','A hidden leadership group exists.','special','⚜️',5),

(10,NULL,'Identity Rewrite Manual','A system exists to rewrite lives.','special','📚',6),

(10,NULL,'Project Vritra Expansion','The conspiracy has infiltrated institutions.','special','📂',7),

(10,NULL,'Ninth Mandala','The organization remains hidden.','special','⚜️',8),

(10,NULL,'Naga Seal','The serpent marks official operations.','special','🐍',9),

(10,NULL,'The Vanishing','Someone can erase people completely.','special','🌫️',10);

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(
10,
'Inner Circle Transcript',
'Recovered testimony mentions seven individuals collectively referred to as The Seven Shadows.',
'Recovered Witness Backup',
'Document'
);

INSERT INTO game_clues
(case_id,objective_id,title,description,clue_type,icon,order_index)
VALUES

(
10,
NULL,
'The Seven Shadows',
'Seven influential figures appear repeatedly across Project Vritra operations and Inner Circle records.',
'special',
'👥',
11
);

COMMIT;
