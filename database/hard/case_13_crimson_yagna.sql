BEGIN;

-- ============================================
-- CASE 13
-- THE CRIMSON YAGNA
-- ACT 3 : THE SYSTEM
-- ============================================

DELETE FROM game_clues WHERE case_id = 13;
DELETE FROM game_objectives WHERE case_id = 13;
DELETE FROM timeline WHERE case_id = 13;
DELETE FROM forensics WHERE case_id = 13;
DELETE FROM evidence WHERE case_id = 13;
DELETE FROM witnesses WHERE case_id = 13;
DELETE FROM suspects WHERE case_id = 13;
DELETE FROM case_characters WHERE case_id = 13;
DELETE FROM game_cases WHERE id = 13;

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
13,
'The Crimson Yagna',
'A sociologist is murdered after discovering that decades of disasters, murders and political crises were intentionally engineered as part of a social experiment.',
'hard',
70,
'Sacrifice and Order',
'Prasoon uncovers the true purpose behind Project Vritra.',
true,
13,
3,
14,
'The System',
'The Seven Shadows'
);

INSERT INTO case_characters
(case_id, character_id, involvement_type, notes)
VALUES
(13,1,'Lead Investigator','Investigates the Crimson Yagna'),
(13,2,'Digital Forensics','Analyzes historical datasets'),
(13,3,'Field Investigator','Interviews former insiders'),
(13,4,'Psychologist','Studies behavioral experiments'),
(13,5,'Journalist','Investigates historical events'),
(13,6,'Police Liaison','Coordinates agencies'),
(13,7,'Expert Consultant','Studies ancient references');

INSERT INTO suspects
(case_id,name,age,occupation,motive,alibi,contradiction,connection_to_monastery)
VALUES

(
13,
'Dr. Vikram Sanyal',
58,
'Behavioral Scientist',
'Protected Project Vritra research',
'Claims conference attendance',
'Travel records altered',
'Research Division'
),

(
13,
'Rudra Menon',
52,
'Statistical Director',
'Managed population models',
'Research facility',
'Server access contradicts statement',
'Oracle Program'
),

(
13,
'Naveen Kulkarni',
47,
'Policy Strategist',
'Prevented publication of findings',
'Official meeting',
'Meeting logs incomplete',
'Government Liaison'
),

(
13,
'Arjun Chatterjee',
55,
'Corporate Financier',
'Funded social experiments',
'Business conference',
'Financial logs inconsistent',
'Funding Network'
),

(
13,
'Sameer Vaidya',
49,
'Historical Analyst',
'Removed historical evidence',
'Archive inspection',
'Witness testimony conflicts',
'Historical Operations'
);

INSERT INTO witnesses
(case_id,name,age,occupation,statement,reliability)
VALUES

(13,'Niharika Sharma',42,'Research Associate','Victim discovered a repeating pattern.','High'),

(13,'Abhishek Pathak',38,'Statistician','Historical crises followed identical models.','High'),

(13,'Kiran Dubey',51,'Former Analyst','Project Vritra monitored public reactions.','High'),

(13,'Ritika Verma',35,'Data Researcher','Victim planned publication.','Medium'),

(13,'Omkar Mishra',57,'Retired Officer','Several events were manipulated.','High'),

(13,'Vishal Tiwari',46,'Historian','Records were altered after major incidents.','Medium');

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(13,'Crimson Yagna File','Master social experiment report.','Victim Office','Document'),

(13,'Population Response Dataset','Behavioral statistics.','Research Server','Digital'),

(13,'Twenty Year Timeline','Major incidents mapping.','Victim Archive','Document'),

(13,'Prediction Correlation Study','Oracle comparison report.','Research Lab','Document'),

(13,'Funding Authorization','Experiment approvals.','Secure Vault','Document'),

(13,'Behavioral Model','Population prediction engine.','Research Server','Digital'),

(13,'Recovered Notes','Victim findings.','Victim Desk','Document'),

(13,'Deleted Research Papers','Suppressed publications.','Backup Archive','Digital'),

(13,'Communication Logs','Internal discussions.','Mail Server','Digital'),

(13,'Shadow Directives','Leadership instructions.','Recovered Drive','Document'),

(13,'Project Vritra Charter','Foundational doctrine.','Secure Archive','Document'),

(13,'Naga Seal Archive','Official symbols and approvals.','Vault','Document');

INSERT INTO forensics
(case_id,name,description,analysis_result,type)
VALUES

(
13,
'Behavioral Analysis',
'Population study review',
'Human responses were measured systematically',
'Documentary'
),

(
13,
'Data Correlation',
'Historical event comparison',
'Strong statistical pattern detected',
'Documentary'
),

(
13,
'Document Recovery',
'Deleted papers restored',
'Victim identified experimental structure',
'Documentary'
),

(
13,
'Funding Audit',
'Financial review',
'Experiments funded for two decades',
'Documentary'
),

(
13,
'Timeline Reconstruction',
'Historical sequence review',
'Events appear intentionally coordinated',
'Temporal'
),

(
13,
'Communication Recovery',
'Deleted messages restored',
'Leadership approved operations',
'Documentary'
),

(
13,
'Oracle Integration Analysis',
'Prediction system review',
'Oracle guided social experiments',
'Documentary'
),

(
13,
'Network Mapping',
'Relationship analysis',
'Project Vritra functions as a controlled system',
'Documentary'
);

INSERT INTO timeline
(case_id,time,event,description)
VALUES

('13','20 Years Ago','Project Expansion','Behavioral studies begin'),

('13','18 Years Ago','First Large Experiment','Population response measured'),

('13','15 Years Ago','Oracle Development','Prediction systems integrated'),

('13','10 Years Ago','Maya Integration','Narrative manipulation added'),

('13','5 Years Ago','National Scaling','Experiments expand'),

('13','1 Year Ago','Victim Research Begins','Pattern discovered'),

('13','2 Weeks Ago','Publication Prepared','Victim prepares report'),

('13','22:00','Murder','Victim killed'),

('13','23:30','Evidence Recovery','Research files recovered');

INSERT INTO game_objectives
(case_id,title,description,expected_query,hint,hint_threshold,order_index,points,is_optional)
VALUES

(13,'Review Suspects','Identify possible conspirators.','SELECT * FROM suspects WHERE case_id=13;',3,1,100,false),

(13,'Analyze Witnesses','Review testimony.','SELECT * FROM witnesses WHERE case_id=13;',3,2,100,false),

(13,'Review Evidence','Study the Crimson Yagna files.','SELECT * FROM evidence WHERE case_id=13;',3,3,150,false),

(13,'Analyze Forensics','Review recovered findings.','SELECT * FROM forensics WHERE case_id=13;',3,4,150,false),

(13,'Reconstruct Timeline','Follow the experiment history.','SELECT * FROM timeline WHERE case_id=13;',3,5,200,false),

(13,'Discover Project Purpose','Understand the objective of Vritra.','SELECT * FROM evidence WHERE case_id=13;',2,6,250,false),

(13,'Expose The Experiment','Reveal the social engineering system.','SELECT * FROM forensics WHERE case_id=13;',2,7,250,false),

(13,'Solve The Murder','Identify the killer.','SELECT * FROM suspects WHERE case_id=13;',1,8,500,false);

INSERT INTO game_clues
(case_id,objective_id,title,description,clue_type,icon,order_index)
VALUES

(13,NULL,'Twenty Year Pattern','Events follow a hidden design.','special','📈',1),

(13,NULL,'Social Experiment','Population behavior was studied.','special','🧠',2),

(13,NULL,'Oracle Guidance','Predictions shaped operations.','special','🖥️',3),

(13,NULL,'Maya Influence','Narratives were manipulated.','special','🎭',4),

(13,NULL,'Suppressed Research','Victim was silenced.','information','📚',5),

(13,NULL,'Project Charter','The true purpose is documented.','special','📂',6),

(13,NULL,'Seven Shadows','Leadership approved experiments.','special','👥',7),

(13,NULL,'Ninth Mandala','The organization remains hidden.','special','⚜️',8),

(13,NULL,'Naga Seal','The serpent marks every operation.','special','🐍',9),

(13,NULL,'Crimson Yagna','Society itself became the laboratory.','special','🔥',10);

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(
13,
'Oracle Network Blueprint',
'Recovered blueprint describing a nationwide predictive infrastructure capable of forecasting crimes, elections, protests and social unrest before they occur.',
'Recovered Shadow Archive',
'Document'
);

INSERT INTO game_clues
(case_id,objective_id,title,description,clue_type,icon,order_index)
VALUES

(
13,
NULL,
'The Oracle Network',
'Project Vritra possesses a nationwide prediction engine capable of forecasting future events with extraordinary accuracy.',
'special',
'🔮',
11
);

COMMIT;
