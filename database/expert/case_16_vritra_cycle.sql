BEGIN;

-- ============================================
-- CASE 16
-- THE VRITRA CYCLE
-- ACT 4 : THE ARCHITECT
-- ============================================

DELETE FROM game_clues WHERE case_id = 16;
DELETE FROM game_objectives WHERE case_id = 16;
DELETE FROM timeline WHERE case_id = 16;
DELETE FROM forensics WHERE case_id = 16;
DELETE FROM evidence WHERE case_id = 16;
DELETE FROM witnesses WHERE case_id = 16;
DELETE FROM suspects WHERE case_id = 16;
DELETE FROM case_characters WHERE case_id = 16;
DELETE FROM game_cases WHERE id = 16;

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
16,
'The Vritra Cycle',
'A former Ninth Mandala archivist is murdered after revealing a master archive connecting every Project Vritra operation.',
'hard',
90,
'Cycle of Creation and Destruction',
'Prasoon uncovers the complete architecture behind Project Vritra.',
true,
16,
4,
17,
'The Architect',
'The Sutradhar'
);

INSERT INTO case_characters
(case_id, character_id, involvement_type, notes)
VALUES
(16,1,'Lead Investigator','Connects all previous cases'),
(16,2,'Digital Forensics','Analyzes recovered archive'),
(16,3,'Field Investigator','Tracks Mandala members'),
(16,4,'Psychologist','Studies organizational design'),
(16,5,'Journalist','Investigates historical operations'),
(16,6,'Police Liaison','Coordinates national raids'),
(16,7,'Expert Consultant','Studies recovered doctrine');

INSERT INTO suspects
(case_id,name,age,occupation,motive,alibi,contradiction,connection_to_monastery)
VALUES

(
16,
'Mahesh Kulshreshtha',
63,
'Former Mandala Archivist',
'Protected hidden archives',
'Claims retirement residence',
'Secret meetings discovered',
'Ninth Mandala Archives'
),

(
16,
'Dr. Arvind Kashyap',
58,
'Systems Theorist',
'Protected Vritra structure',
'Research symposium',
'Attendance manipulated',
'Strategic Planning'
),

(
16,
'Suresh Narang',
61,
'Financial Coordinator',
'Managed long-term operations',
'Private conference',
'Travel records altered',
'Funding Network'
),

(
16,
'Ketan Bhadoria',
54,
'Historical Curator',
'Suppressed founder records',
'Archive restoration',
'Access logs conflict',
'Historical Division'
),

(
16,
'Nalin Verma',
49,
'Intelligence Liaison',
'Protected surviving members',
'Government meeting',
'Witness contradiction',
'Security Operations'
);

INSERT INTO witnesses
(case_id,name,age,occupation,statement,reliability)
VALUES

(16,'Vedika Rao',52,'Historian','All previous cases connect to one archive.','High'),

(16,'Gowrav Dubey',29,'Cyber Analyst','Recovered links between all investigations.','High'),

(16,'Harsh Shukla',30,'Field Investigator','Mandala safehouses are being abandoned.','High'),

(16,'Tammana Tiwari',28,'Behavioral Analyst','Every operation followed identical principles.','High'),

(16,'Amisha Singh',31,'Journalist','The archivist feared someone called the Architect.','High'),

(16,'Rajeev Menon',57,'Former Bureaucrat','Project Vritra outlived multiple governments.','Medium');

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(16,'The Vritra Cycle Archive','Master operational archive.','Recovered Server','Document'),

(16,'Mandala Membership Registry','Historical leadership records.','Hidden Vault','Document'),

(16,'Cycle Map','Diagram connecting all previous cases.','Archive Terminal','Document'),

(16,'Founder Communications','Recovered correspondence.','Secure Archive','Document'),

(16,'Oracle Integration Report','Links Oracle to all operations.','Data Center','Digital'),

(16,'Maya Integration Report','Links evidence manipulation network.','Recovered Server','Digital'),

(16,'Shadow Council Minutes','Leadership meeting records.','Encrypted Archive','Document'),

(16,'Victim Testimony Recording','Final archivist statement.','Recovered Device','Digital'),

(16,'Operational Timeline','70 years of activities.','Archive Vault','Document'),

(16,'Identity Erasure Records','Historical disappearances.','Secure Database','Digital'),

(16,'Project Vritra Charter','Complete doctrine.','Founder Archive','Document'),

(16,'Ancient Naga Seal','Original symbol authorization.','Founder Vault','Document');

INSERT INTO forensics
(case_id,name,description,analysis_result,type)
VALUES

(
16,
'Archive Reconstruction',
'Recovery of damaged files',
'Every case connected',
'Documentary'
),

(
16,
'Operational Analysis',
'Review of activities',
'Single command structure identified',
'Documentary'
),

(
16,
'Communication Recovery',
'Founder correspondence',
'Architect referenced repeatedly',
'Documentary'
),

(
16,
'Network Mapping',
'System analysis',
'Oracle and Maya integrated',
'Documentary'
),

(
16,
'Historical Correlation',
'70-year event comparison',
'Unified pattern discovered',
'Documentary'
),

(
16,
'Timeline Reconstruction',
'Master chronology',
'Operations followed one doctrine',
'Temporal'
),

(
16,
'Leadership Analysis',
'Chain of command review',
'Seven Shadows were intermediaries',
'Documentary'
),

(
16,
'Identity Review',
'Founder records',
'One name repeatedly removed',
'Documentary'
);

INSERT INTO timeline
(case_id,time,event,description)
VALUES

('16','1952','Doctrine Created','Foundational manuscript written'),

('16','1958','Mandala Expansion','Network grows'),

('16','1975','Influence Operations','Political activities begin'),

('16','1990','Oracle Theory','Predictive research starts'),

('16','2000','Project Vritra Launch','Modern phase begins'),

('16','2010','Maya Protocol','Evidence manipulation integrated'),

('16','1 Week Ago','Archivist Contact','Witness reaches Prasoon'),

('16','22:10','Murder','Archivist killed'),

('16','23:45','Archive Recovery','Master files secured');

INSERT INTO game_objectives
(case_id,title,description,expected_query,hint,hint_threshold,order_index,points,is_optional)
VALUES

(16,'Review Suspects','Identify key operators.','SELECT * FROM suspects WHERE case_id=16;',3,1,100,false),

(16,'Analyze Witnesses','Review testimony.','SELECT * FROM witnesses WHERE case_id=16;',3,2,100,false),

(16,'Review Evidence','Study Vritra Cycle archive.','SELECT * FROM evidence WHERE case_id=16;',3,3,150,false),

(16,'Analyze Forensics','Review recovered findings.','SELECT * FROM forensics WHERE case_id=16;',3,4,150,false),

(16,'Reconstruct Timeline','Follow the complete chronology.','SELECT * FROM timeline WHERE case_id=16;',3,5,200,false),

(16,'Connect Previous Cases','Discover how cases connect.','SELECT * FROM evidence WHERE case_id=16;',2,6,250,false),

(16,'Identify The Architect','Find the hidden controller.','SELECT * FROM forensics WHERE case_id=16;',2,7,250,false),

(16,'Solve The Murder','Identify the killer.','SELECT * FROM suspects WHERE case_id=16;',1,8,500,false);

INSERT INTO game_clues
(case_id,objective_id,title,description,clue_type,icon,order_index)
VALUES

(16,NULL,'The Master Archive','Every operation appears in one document.','special','📚',1),

(16,NULL,'Unified System','All cases are connected.','special','🧩',2),

(16,NULL,'The Architect','A hidden figure exists above the Shadows.','special','🎭',3),

(16,NULL,'Founder Doctrine','The original philosophy survives.','special','📜',4),

(16,NULL,'Oracle Integration','Predictions guide operations.','special','🖥️',5),

(16,NULL,'Maya Integration','Reality can be manipulated.','special','🎭',6),

(16,NULL,'Seven Shadows','They were never the top layer.','special','👥',7),

(16,NULL,'Ninth Mandala','The organization still functions.','special','⚜️',8),

(16,NULL,'Naga Seal','The serpent marks all cycles.','special','🐍',9),

(16,NULL,'The Vritra Cycle','Every case belongs to one design.','special','♾️',10);

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(
16,
'Architect Reference File',
'Recovered correspondence repeatedly references an individual known only as The Sutradhar. Several signatures use the initials V.K.',
'Founder Archive',
'Document'
);

INSERT INTO game_clues
(case_id,objective_id,title,description,clue_type,icon,order_index)
VALUES

(
16,
NULL,
'The Ninth Realm',
'Recovered maps reveal the location of a hidden Ninth Mandala command structure known internally as The Ninth Realm.',
'special',
'🏛️',
11
);

COMMIT;
