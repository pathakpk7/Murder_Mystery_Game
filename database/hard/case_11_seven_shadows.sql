BEGIN;

-- ============================================
-- CASE 11
-- THE SEVEN SHADOWS
-- ACT 3 : THE SYSTEM
-- ============================================

DELETE FROM game_clues WHERE case_id = 11;
DELETE FROM game_objectives WHERE case_id = 11;
DELETE FROM timeline WHERE case_id = 11;
DELETE FROM forensics WHERE case_id = 11;
DELETE FROM evidence WHERE case_id = 11;
DELETE FROM witnesses WHERE case_id = 11;
DELETE FROM suspects WHERE case_id = 11;
DELETE FROM case_characters WHERE case_id = 11;
DELETE FROM game_cases WHERE id = 11;

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
11,
'The Seven Shadows',
'A retired intelligence officer is murdered after attempting to expose the secret leadership behind Project Vritra.',
'hard',
60,
'Sapta Rishi Parallel',
'Prasoon discovers the hidden architects behind decades of manipulation.',
true,
11,
3,
12,
'The System',
'The Seven Shadows'
);

INSERT INTO case_characters
(case_id, character_id, involvement_type, notes)
VALUES
(11,1,'Lead Investigator','Tracks the Seven Shadows'),
(11,2,'Digital Forensics','Analyzes intelligence files'),
(11,3,'Field Investigator','Interviews sources'),
(11,4,'Psychologist','Profiles Shadow members'),
(11,5,'Journalist','Investigates historical influence'),
(11,6,'Police Liaison','Coordinates national agencies'),
(11,7,'Expert Consultant','Studies symbolic references');

INSERT INTO suspects
(case_id,name,age,occupation,motive,alibi,contradiction,connection_to_monastery)
VALUES

(
11,
'Viraj Khatri',
63,
'Former Intelligence Director',
'Prevented exposure of Shadow Network',
'Claims retirement retreat',
'Travel records altered',
'Shadow Candidate'
),

(
11,
'Samar Pradhan',
58,
'Media Executive',
'Controlled public narratives',
'Board meeting',
'Timeline discrepancy',
'Influence Network'
),

(
11,
'Mahadev Venkataraman',
66,
'Industrial Magnate',
'Protected financial operations',
'Private conference',
'Security logs conflict',
'Funding Network'
),

(
11,
'Ishaan Trivedi',
52,
'Technology Consultant',
'Maintained surveillance systems',
'Remote work',
'Server activity contradicts statement',
'Oracle Operations'
),

(
11,
'Rudraksh Sen',
60,
'Political Strategist',
'Protected Inner Circle members',
'Official engagement',
'Witness contradiction',
'Political Influence'
);

INSERT INTO witnesses
(case_id,name,age,occupation,statement,reliability)
VALUES

(11,'Aniket Rao',48,'Retired Analyst','Victim feared the Seven Shadows.','High'),

(11,'Nidhi Sharma',37,'Journalist','Victim possessed classified files.','High'),

(11,'Rajeev Pathak',55,'Security Officer','Safehouse access was restricted.','Medium'),

(11,'Kunal Mishra',42,'Intelligence Clerk','Files disappeared after death.','High'),

(11,'Aarti Verma',39,'Researcher','Victim tracked influence operations.','Medium'),

(11,'Pawan Joshi',58,'Former Bureaucrat','Shadow members held enormous power.','High');

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(11,'Shadow Transcript','Recovered Inner Circle testimony.','Safehouse','Document'),

(11,'Classified Intelligence File','Victim investigation notes.','Safehouse Vault','Document'),

(11,'Seven Circle Diagram','Symbolic representation of leadership structure.','Crime Scene','Document'),

(11,'Encrypted Hard Drive','Protected intelligence archive.','Victim Locker','Digital'),

(11,'Threat Communications','Warnings received by victim.','Secure Email','Digital'),

(11,'Influence Network Chart','Connections between powerful figures.','Recovered Archive','Document'),

(11,'Political Contact List','High-level connections.','Secure File','Document'),

(11,'Financial Routing Records','Hidden transaction history.','Archive Server','Document'),

(11,'Deleted Intelligence Reports','Suppressed investigations.','Government Backup','Digital'),

(11,'Safehouse Entry Logs','Access records.','Security System','Digital'),

(11,'Ninth Mandala Registry','Leadership references.','Recovered Database','Document'),

(11,'Naga Leadership Seal','Unique serpent insignia.','Victim Desk','Document');

INSERT INTO forensics
(case_id,name,description,analysis_result,type)
VALUES

(
11,
'Scene Reconstruction',
'Analysis of murder location',
'Victim knew attacker',
'Physical'
),

(
11,
'Intelligence File Recovery',
'Deleted records restored',
'Seven Shadow references found',
'Documentary'
),

(
11,
'Hard Drive Analysis',
'Digital archive review',
'Leadership structure identified',
'Documentary'
),

(
11,
'Communication Recovery',
'Threat messages restored',
'Victim targeted after investigation',
'Documentary'
),

(
11,
'Network Mapping',
'Relationship analysis',
'Seven key figures identified',
'Documentary'
),

(
11,
'Timeline Reconstruction',
'Victim final movements',
'Meeting occurred before murder',
'Temporal'
),

(
11,
'Financial Analysis',
'Funding review',
'Shadow members connected to Project Vritra',
'Documentary'
),

(
11,
'Access Audit',
'Safehouse entry investigation',
'Authorized credentials used',
'Temporal'
);

INSERT INTO timeline
(case_id,time,event,description)
VALUES

('11','6 Months Ago','Shadow Investigation','Victim begins inquiry'),

('11','4 Months Ago','Transcript Acquired','Inner Circle evidence recovered'),

('11','2 Months Ago','Leadership Mapping','Seven figures identified'),

('11','2 Weeks Ago','Threats Begin','Victim receives warnings'),

('11','3 Days Ago','Safehouse Relocation','Victim enters protection'),

('11','1 Day Ago','Secret Meeting','Unknown visitor arrives'),

('11','21:30','Murder','Victim killed'),

('11','22:00','Files Deleted','Evidence removed'),

('11','23:00','Investigation Begins','Prasoon arrives');

INSERT INTO game_objectives
(case_id,title,description,expected_query,hint,hint_threshold,order_index,points,is_optional)
VALUES

(11,'Review Suspects','Identify possible Shadow members.','SELECT * FROM suspects WHERE case_id=11;',3,1,100,false),

(11,'Analyze Witnesses','Review testimony.','SELECT * FROM witnesses WHERE case_id=11;',3,2,100,false),

(11,'Review Evidence','Study intelligence records.','SELECT * FROM evidence WHERE case_id=11;',3,3,150,false),

(11,'Analyze Forensics','Review recovered findings.','SELECT * FROM forensics WHERE case_id=11;',3,4,150,false),

(11,'Reconstruct Timeline','Follow final events.','SELECT * FROM timeline WHERE case_id=11;',3,5,200,false),

(11,'Identify Shadow Network','Map leadership structure.','SELECT * FROM evidence WHERE case_id=11;',2,6,250,false),

(11,'Expose Influence System','Discover institutional control.','SELECT * FROM forensics WHERE case_id=11;',2,7,250,false),

(11,'Identify The Killer','Solve the murder.','SELECT * FROM suspects WHERE case_id=11;',1,8,500,false);

INSERT INTO game_clues
(case_id,objective_id,title,description,clue_type,icon,order_index)
VALUES

(11,NULL,'Seven Circles','A diagram shows seven leaders.','special','⭕',1),

(11,NULL,'Shadow Network','Powerful individuals operate in secret.','special','👥',2),

(11,NULL,'Deleted Files','Evidence was removed quickly.','information','🗂️',3),

(11,NULL,'Authorized Access','The killer had clearance.','hint','🔑',4),

(11,NULL,'Influence Operations','Major institutions were infiltrated.','special','🏛️',5),

(11,NULL,'Project Vritra Leadership','The conspiracy has commanders.','special','📂',6),

(11,NULL,'Ninth Mandala Council','Leadership group confirmed.','special','⚜️',7),

(11,NULL,'One Shadow Missing','One member is crossed out.','special','❌',8),

(11,NULL,'Naga Leadership Seal','Unique serpent insignia recovered.','special','🐍',9),

(11,NULL,'The System','Project Vritra is larger than any individual.','special','🌐',10);

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(
11,
'Project Maya Directive',
'Recovered document proving that evidence itself can be manufactured, altered, or fabricated through a protocol called Maya.',
'Encrypted Hard Drive',
'Document'
);


INSERT INTO game_clues
(case_id,objective_id,title,description,clue_type,icon,order_index)
VALUES

(
11,
NULL,
'The Maya Protocol',
'Recovered files suggest Project Vritra can manufacture evidence and create entirely false realities.',
'special',
'🎭',
11
);

COMMIT;
