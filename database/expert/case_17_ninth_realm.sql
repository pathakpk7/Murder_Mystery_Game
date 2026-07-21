BEGIN;

-- ============================================
-- CASE 17
-- THE NINTH REALM
-- ACT 4 : THE ARCHITECT
-- ============================================

DELETE FROM game_clues WHERE case_id = 17;
DELETE FROM game_objectives WHERE case_id = 17;
DELETE FROM timeline WHERE case_id = 17;
DELETE FROM forensics WHERE case_id = 17;
DELETE FROM evidence WHERE case_id = 17;
DELETE FROM witnesses WHERE case_id = 17;
DELETE FROM suspects WHERE case_id = 17;
DELETE FROM case_characters WHERE case_id = 17;
DELETE FROM game_cases WHERE id = 17;

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
17,
'The Ninth Realm',
'Prasoon infiltrates the hidden command structure of the Ninth Mandala and discovers evidence of a systematic internal collapse.',
'hard',
95,
'Navam Loka',
'The final operational center of Project Vritra is uncovered.',
true,
17,
4,
18,
'The Architect',
'The Sutradhar'
);

INSERT INTO case_characters
(case_id, character_id, involvement_type, notes)
VALUES
(17,1,'Lead Investigator','Leads Realm infiltration'),
(17,2,'Digital Forensics','Recovers destroyed servers'),
(17,3,'Field Investigator','Searches abandoned facilities'),
(17,4,'Psychologist','Profiles surviving members'),
(17,5,'Journalist','Documents Mandala collapse'),
(17,6,'Police Liaison','Coordinates national raids'),
(17,7,'Expert Consultant','Studies recovered doctrine');

INSERT INTO suspects
(case_id,name,age,occupation,motive,alibi,contradiction,connection_to_monastery)
VALUES

(
17,
'Vikrant Kashyap',
62,
'Realm Administrator',
'Destroyed evidence before exposure',
'Claims evacuation duties',
'Server logs conflict',
'Ninth Realm'
),

(
17,
'Arvind Menon',
56,
'Operations Director',
'Protected leadership identities',
'Remote command center',
'Access records inconsistent',
'Oracle Operations'
),

(
17,
'Prakash Narayanan',
59,
'Security Chief',
'Ordered facility purge',
'Security review',
'Witness testimony conflicts',
'Realm Security'
),

(
17,
'Devraj Kapoor',
51,
'Archive Supervisor',
'Destroyed founder records',
'Archive lockdown',
'Recovered files contradict statement',
'Historical Division'
),

(
17,
'Ritvik Sharma',
47,
'Data Controller',
'Deleted Oracle infrastructure',
'Server maintenance',
'Digital evidence disproves claim',
'Data Systems'
);

INSERT INTO witnesses
(case_id,name,age,occupation,statement,reliability)
VALUES

(17,'Gowrav Dubey',29,'Cyber Analyst','Entire databases were erased intentionally.','High'),

(17,'Harsh Shukla',30,'Field Investigator','The facility was abandoned in a hurry.','High'),

(17,'Tammana Tiwari',28,'Behavioral Analyst','Members believed the system had failed.','High'),

(17,'Amisha Singh',31,'Journalist','Several leaders disappeared before raids began.','High'),

(17,'Vedika Rao',52,'Historian','Founder archives were targeted first.','High'),

(17,'Rakesh Menon',61,'Former Mandala Member','Someone ordered a complete shutdown.','Medium');

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(17,'Ninth Realm Blueprint','Complete facility map.','Command Center','Document'),

(17,'Evacuation Directive','Order to abandon operations.','Recovered Server','Document'),

(17,'Destroyed Oracle Cluster','Damaged prediction infrastructure.','Server Hall','Digital'),

(17,'Burned Archive Files','Destroyed founder records.','Archive Wing','Document'),

(17,'Realm Access Logs','Facility movement records.','Security Center','Digital'),

(17,'Shadow Council Transmission','Final leadership message.','Communication Hub','Digital'),

(17,'Internal Panic Reports','Operational collapse reports.','Recovered Terminal','Document'),

(17,'Identity Purge Orders','Instructions to erase personnel histories.','Data Vault','Document'),

(17,'Victim Statement Archive','Testimonies from defectors.','Recovered Storage','Document'),

(17,'Operational Shutdown Timeline','Collapse chronology.','Command Center','Document'),

(17,'Founder Correspondence','Recovered communications.','Hidden Vault','Document'),

(17,'Naga Authority Seal','Highest-level authorization symbol.','Executive Chamber','Document');

INSERT INTO forensics
(case_id,name,description,analysis_result,type)
VALUES

(
17,
'Server Recovery',
'Destroyed systems restored',
'Shutdown was intentional',
'Documentary'
),

(
17,
'Archive Reconstruction',
'Burned files recovered',
'Founder records deliberately targeted',
'Documentary'
),

(
17,
'Communication Analysis',
'Leadership transmissions examined',
'Panic spread through organization',
'Documentary'
),

(
17,
'Network Mapping',
'Final command structure review',
'Sutradhar remained above all layers',
'Documentary'
),

(
17,
'Timeline Reconstruction',
'Collapse sequence analyzed',
'Shutdown began weeks earlier',
'Temporal'
),

(
17,
'Identity Audit',
'Personnel records review',
'Hundreds of identities erased',
'Documentary'
),

(
17,
'Oracle Recovery',
'Prediction systems analyzed',
'Future projections suddenly stopped',
'Documentary'
),

(
17,
'Leadership Analysis',
'Hierarchy reconstruction',
'Seven Shadows reported upward',
'Documentary'
);

INSERT INTO timeline
(case_id,time,event,description)
VALUES

('17','6 Months Ago','Internal Disputes','Leadership divisions emerge'),

('17','3 Months Ago','Oracle Failure','Prediction anomalies appear'),

('17','1 Month Ago','Evacuation Orders','Shutdown begins'),

('17','2 Weeks Ago','Archive Destruction','Historical records burned'),

('17','1 Week Ago','Identity Purges','Personnel erased'),

('17','3 Days Ago','Realm Abandoned','Operations cease'),

('17','22:00','Facility Breached','Prasoon enters Realm'),

('17','23:00','Evidence Recovered','Critical files secured'),

('17','23:45','Final Discovery','Founder vault opened');

INSERT INTO game_objectives
(case_id,title,description,expected_query,hint,hint_threshold,order_index,points,is_optional)
VALUES

(17,'Review Suspects','Identify Realm operators.','SELECT * FROM suspects WHERE case_id=17;',3,1,100,false),

(17,'Analyze Witnesses','Review testimony.','SELECT * FROM witnesses WHERE case_id=17;',3,2,100,false),

(17,'Review Evidence','Study Realm archives.','SELECT * FROM evidence WHERE case_id=17;',3,3,150,false),

(17,'Analyze Forensics','Review collapse findings.','SELECT * FROM forensics WHERE case_id=17;',3,4,150,false),

(17,'Reconstruct Timeline','Follow shutdown events.','SELECT * FROM timeline WHERE case_id=17;',3,5,200,false),

(17,'Investigate The Realm','Understand command structure.','SELECT * FROM evidence WHERE case_id=17;',2,6,250,false),

(17,'Find The Sutradhar','Trace leadership chain.','SELECT * FROM forensics WHERE case_id=17;',2,7,250,false),

(17,'Solve The Case','Determine who ordered the collapse.','SELECT * FROM suspects WHERE case_id=17;',1,8,500,false);

INSERT INTO game_clues
(case_id,objective_id,title,description,clue_type,icon,order_index)
VALUES

(17,NULL,'The Ninth Realm','The hidden command center exists.','special','🏛️',1),

(17,NULL,'Intentional Collapse','The organization destroyed itself.','special','🔥',2),

(17,NULL,'Identity Purges','Personnel were erased.','evidence','📄',3),

(17,NULL,'Destroyed Oracle','Prediction systems were dismantled.','special','🖥️',4),

(17,NULL,'Burned Archives','Founder records were targeted.','information','📚',5),

(17,NULL,'Seven Shadows','Leadership structure confirmed.','special','👥',6),

(17,NULL,'The Architect','A hidden superior still exists.','special','🎭',7),

(17,NULL,'Project Vritra Endgame','The system is collapsing.','special','📂',8),

(17,NULL,'Ninth Mandala Fall','The organization is dying.','special','⚜️',9),

(17,NULL,'Final Door','One final archive remains unopened.','special','🚪',10);

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(
17,
'Founder Vault Recording',
'Recovered video recording identifies the Sutradhar by name for the first time: Dr. Vedant Kashyap.',
'Founder Vault',
'Digital'
);

INSERT INTO game_clues
(case_id,objective_id,title,description,clue_type,icon,order_index)
VALUES

(
17,
NULL,
'The Last Witness',
'A surviving founder has agreed to testify. He claims he personally knew Dr. Vedant Kashyap and can reveal the truth behind Project Vritra.',
'special',
'🕯️',
11
);

COMMIT;