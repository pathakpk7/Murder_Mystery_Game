BEGIN;

-- ============================================
-- CASE 14
-- THE ORACLE NETWORK
-- ACT 3 : THE SYSTEM
-- ============================================

DELETE FROM game_clues WHERE case_id = 14;
DELETE FROM game_objectives WHERE case_id = 14;
DELETE FROM timeline WHERE case_id = 14;
DELETE FROM forensics WHERE case_id = 14;
DELETE FROM evidence WHERE case_id = 14;
DELETE FROM witnesses WHERE case_id = 14;
DELETE FROM suspects WHERE case_id = 14;
DELETE FROM case_characters WHERE case_id = 14;
DELETE FROM game_cases WHERE id = 14;

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
14,
'The Oracle Network',
'A senior Oracle architect is murdered after attempting to expose the predictive system controlling Project Vritra.',
'hard',
75,
'Trikal Darshan',
'Prasoon uncovers the true purpose and scale of the Oracle Network.',
true,
14,
3,
15,
'The System',
'The Seven Shadows'
);

INSERT INTO case_characters
(case_id, character_id, involvement_type, notes)
VALUES
(14,1,'Lead Investigator','Investigates Oracle Network'),
(14,2,'Digital Forensics','Analyzes predictive systems'),
(14,3,'Field Investigator','Tracks Oracle operators'),
(14,4,'Psychologist','Studies behavioral modeling'),
(14,5,'Journalist','Investigates Oracle influence'),
(14,6,'Police Liaison','Coordinates national agencies'),
(14,7,'Expert Consultant','Studies Oracle architecture');

INSERT INTO witnesses
(case_id,name,age,occupation,statement,reliability)
VALUES

(14,'Saket Sharma',43,'Systems Engineer','Oracle predicted incidents years in advance.','High'),

(14,'Ananya Mishra',38,'Research Analyst','Victim wanted to leak Oracle files.','High'),

(14,'Ritesh Dubey',45,'Data Scientist','Oracle models exceeded expectations.','Medium'),

(14,'Mukul Verma',51,'Network Administrator','Core servers were heavily protected.','High'),

(14,'Pallav Pathak',34,'Statistician','Predictions influenced decisions.','Medium'),

(14,'Aditi Tiwari',40,'Journalist','Victim feared the Seven Shadows.','High');

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(14,'Oracle Blueprint','Master architecture document.','Victim Office','Document'),

(14,'Prediction Engine Logs','Forecast history.','Oracle Server','Digital'),

(14,'Behavioral Dataset','Population modeling data.','Data Center','Digital'),

(14,'National Risk Matrix','Threat prediction system.','Secure Archive','Document'),

(14,'Victim Research Notes','Personal investigation.','Victim Desk','Document'),

(14,'Server Access Logs','Oracle activity records.','Core Server','Digital'),

(14,'Forecast Reports','Future event predictions.','Research Lab','Document'),

(14,'Communication Archive','Internal Oracle messages.','Mail Server','Digital'),

(14,'Oracle Directive','Leadership instructions.','Secure Vault','Document'),

(14,'Shadow Briefing Files','Strategic planning documents.','Encrypted Drive','Document'),

(14,'National Influence Report','Policy impact analysis.','Research Server','Document'),

(14,'Naga Authorization Seal','Oracle approval insignia.','Recovered Archive','Document');

INSERT INTO forensics
(case_id,name,description,analysis_result,type)
VALUES

(
14,
'Prediction Analysis',
'Review of Oracle forecasts',
'Prediction accuracy exceeded 94%',
'Documentary'
),

(
14,
'Behavioral Modeling Review',
'Population simulations examined',
'System predicted social responses',
'Documentary'
),

(
14,
'Communication Recovery',
'Deleted messages restored',
'Victim planned public disclosure',
'Documentary'
),

(
14,
'Server Audit',
'Oracle infrastructure review',
'Massive data collection confirmed',
'Documentary'
),

(
14,
'Timeline Reconstruction',
'Victim final actions',
'Leak preparation underway',
'Temporal'
),

(
14,
'Policy Correlation Study',
'Government decisions compared',
'Predictions influenced actions',
'Documentary'
),

(
14,
'Network Mapping',
'System architecture analysis',
'Oracle connected to Maya and Vritra',
'Documentary'
),

(
14,
'Access Investigation',
'Restricted system audit',
'Shadow approval required',
'Temporal'
);

INSERT INTO timeline
(case_id,time,event,description)
VALUES

('14','20 Years Ago','Oracle Foundation','Development begins'),

('14','15 Years Ago','Data Expansion','Nationwide data collection'),

('14','10 Years Ago','Prediction Success','Major forecasting milestone'),

('14','5 Years Ago','National Integration','Oracle influences operations'),

('14','6 Months Ago','Victim Doubts System','Architect questions Oracle'),

('14','1 Month Ago','Leak Preparation','Evidence gathered'),

('14','3 Days Ago','Defection Attempt','Victim plans exposure'),

('14','22:30','Murder','Victim killed'),

('14','23:45','Files Recovered','Oracle documents secured');

INSERT INTO game_objectives
(case_id,title,description,expected_query,hint,hint_threshold,order_index,points,is_optional)
VALUES

(14,'Review Suspects','Identify Oracle insiders.','SELECT * FROM suspects WHERE case_id=14;',3,1,100,false),

(14,'Analyze Witnesses','Review testimony.','SELECT * FROM witnesses WHERE case_id=14;',3,2,100,false),

(14,'Review Evidence','Study Oracle records.','SELECT * FROM evidence WHERE case_id=14;',3,3,150,false),

(14,'Analyze Forensics','Review system findings.','SELECT * FROM forensics WHERE case_id=14;',3,4,150,false),

(14,'Reconstruct Timeline','Follow Oracle development.','SELECT * FROM timeline WHERE case_id=14;',3,5,200,false),

(14,'Understand Oracle','Discover how Oracle operates.','SELECT * FROM evidence WHERE case_id=14;',2,6,250,false),

(14,'Expose Predictive Control','Reveal Oracle influence.','SELECT * FROM forensics WHERE case_id=14;',2,7,250,false),

(14,'Solve The Murder','Identify the killer.','SELECT * FROM suspects WHERE case_id=14;',1,8,500,false);

INSERT INTO game_clues
(case_id,objective_id,title,description,clue_type,icon,order_index)
VALUES

(14,NULL,'94 Percent Accuracy','Oracle predicts events with extreme precision.','special','📈',1),

(14,NULL,'Behavioral Models','Population behavior is simulated.','special','🧠',2),

(14,NULL,'Mass Surveillance','Oracle observes society constantly.','information','📡',3),

(14,NULL,'Prediction Engine','The core forecasting system exists.','special','🖥️',4),

(14,NULL,'Influence Operations','Predictions shape policy decisions.','special','🏛️',5),

(14,NULL,'Shadow Oversight','Seven Shadows supervise Oracle.','special','👥',6),

(14,NULL,'Project Vritra Core','Oracle is central to the system.','special','📂',7),

(14,NULL,'Ninth Mandala','The hidden organization remains active.','special','⚜️',8),

(14,NULL,'Naga Seal','Every Oracle directive bears the serpent insignia.','special','🐍',9),

(14,NULL,'Created Future','Oracle may influence the future it predicts.','special','🔮',10);

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(
14,
'Founders Manuscript',
'A recovered manuscript reveals that the philosophical foundations of Project Vritra predate the Seven Shadows by decades.',
'Encrypted Oracle Archive',
'Document'
);
INSERT INTO game_clues
(case_id,objective_id,title,description,clue_type,icon,order_index)
VALUES

(
14,
NULL,
'The Hidden Manuscript',
'A forgotten document suggests that the creator of Project Vritra was not one of the Seven Shadows.',
'special',
'📜',
11
);

COMMIT;