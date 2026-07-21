BEGIN;

-- ============================================
-- CASE 18
-- THE LAST WITNESS
-- ACT 4 FINALE : THE ARCHITECT
-- ============================================

DELETE FROM game_clues WHERE case_id = 18;
DELETE FROM game_objectives WHERE case_id = 18;
DELETE FROM timeline WHERE case_id = 18;
DELETE FROM forensics WHERE case_id = 18;
DELETE FROM evidence WHERE case_id = 18;
DELETE FROM witnesses WHERE case_id = 18;
DELETE FROM suspects WHERE case_id = 18;
DELETE FROM case_characters WHERE case_id = 18;
DELETE FROM game_cases WHERE id = 18;

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
18,
'The Last Witness',
'The final surviving founder of Project Vritra is murdered before testifying. His testimony reveals the true purpose behind the entire conspiracy.',
'hard',
120,
'End of Kali Yuga',
'Prasoon confronts the architect of Project Vritra.',
true,
18,
4,
NULL,
'The Architect',
'Dr. Vedant Kashyap'
);

INSERT INTO case_characters
(case_id, character_id, involvement_type, notes)
VALUES
(18,1,'Lead Investigator','Final investigation'),
(18,2,'Digital Forensics','Recovers founder testimony'),
(18,3,'Field Investigator','Tracks surviving members'),
(18,4,'Psychologist','Profiles Vedant Kashyap'),
(18,5,'Journalist','Documents collapse of Project Vritra'),
(18,6,'Police Liaison','Coordinates final operation'),
(18,7,'Expert Consultant','Analyzes founder archives');

INSERT INTO suspects
(case_id,name,age,occupation,motive,alibi,contradiction,connection_to_monastery)
VALUES

(
18,
'Dr. Vedant Kashyap',
72,
'Behavioral Scientist',
'Protect Project Vritra',
'Unknown',
'Appears in multiple recovered archives',
'Founder'
),

(
18,
'Anirudh Sen',
63,
'Former Shadow Member',
'Prevent testimony',
'Claims retirement',
'Communication logs contradict statement',
'Shadow Council'
),

(
18,
'Mahendra Rao',
67,
'Oracle Director',
'Protect system secrets',
'Private residence',
'Server evidence conflicts',
'Oracle Network'
),

(
18,
'Devraj Narayan',
70,
'Founding Financier',
'Prevent exposure',
'Unknown',
'Financial records recovered',
'Founders Circle'
),

(
18,
'Suraj Malhotra',
61,
'Security Coordinator',
'Executed witness elimination',
'Traveling',
'Location data disproves claim',
'Mandala Security'
);

INSERT INTO witnesses
(case_id,name,age,occupation,statement,reliability)
VALUES

(18,'Gowrav Dubey',29,'Cyber Analyst','We finally found the architect.','High'),

(18,'Harsh Shukla',30,'Field Investigator','The Mandala is collapsing everywhere.','High'),

(18,'Tammana Tiwari',28,'Behavioral Analyst','Vedant understood society better than anyone.','High'),

(18,'Amisha Singh',31,'Journalist','The final testimony changes everything.','High'),

(18,'Professor Vedika Rao',52,'Historian','Project Vritra began as an academic idea.','High'),

(18,'Witness Zero Recording',91,'Founder','Vedant believed civilization could be guided.','High');

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(18,'Final Testimony','Last recording of Witness Zero.','Secure Archive','Digital'),

(18,'Founder Correspondence','Letters between founders.','Recovered Vault','Document'),

(18,'Vedant Research Papers','Original behavioral models.','Founder Archive','Document'),

(18,'Project Vritra Charter','Complete doctrine.','Recovered Server','Document'),

(18,'Oracle Core Blueprint','Final system design.','Oracle Archive','Document'),

(18,'Maya Protocol Master File','Evidence manipulation framework.','Recovered Database','Digital'),

(18,'Shadow Council Records','Leadership communications.','Hidden Archive','Document'),

(18,'Behavioral Prediction Models','Civilization simulations.','Research Vault','Digital'),

(18,'Founder Financial Records','Funding history.','Recovered Ledger','Document'),

(18,'Cycle Completion Report','Final Vritra assessment.','Founder Archive','Document'),

(18,'Architect Journal','Personal writings of Vedant Kashyap.','Hidden Chamber','Document'),

(18,'Original Naga Seal','The first Vritra symbol.','Founder Vault','Document');

INSERT INTO forensics
(case_id,name,description,analysis_result,type)
VALUES

(
18,
'Testimony Verification',
'Authentication of final recording',
'Recording authentic',
'Documentary'
),

(
18,
'Journal Analysis',
'Review of Vedant writings',
'He believed civilization follows predictable patterns',
'Documentary'
),

(
18,
'Behavioral Model Review',
'Oracle foundations examined',
'Predictions were mathematically valid',
'Documentary'
),

(
18,
'Communication Recovery',
'Founder messages restored',
'Vedant directed operations for decades',
'Documentary'
),

(
18,
'Timeline Reconstruction',
'Project history review',
'Seventy years of continuous operation',
'Temporal'
),

(
18,
'Network Analysis',
'Final hierarchy mapping',
'Vedant remained hidden throughout',
'Documentary'
),

(
18,
'Financial Audit',
'Funding history',
'Project expanded across generations',
'Documentary'
),

(
18,
'Identity Review',
'Founder records examined',
'Multiple identities used by Vedant',
'Documentary'
);

INSERT INTO timeline
(case_id,time,event,description)
VALUES

('18','1952','Doctrine Created','Vedant develops original theory'),

('18','1958','Founders Circle','Project begins'),

('18','1975','Mandala Expansion','Influence network grows'),

('18','1990','Oracle Theory','Prediction systems emerge'),

('18','2000','Project Vritra','Modern implementation begins'),

('18','2020','System Peak','Maximum influence reached'),

('18','3 Days Ago','Witness Located','Founder agrees to testify'),

('18','22:00','Witness Murdered','Final witness killed'),

('18','23:59','Truth Revealed','Final archive decrypted');

INSERT INTO game_objectives
(case_id,title,description,expected_query,hint,hint_threshold,order_index,points,is_optional)
VALUES

(18,'Review Suspects','Identify remaining conspirators.','SELECT * FROM suspects WHERE case_id=18;',3,1,100,false),

(18,'Analyze Witnesses','Review final testimony.','SELECT * FROM witnesses WHERE case_id=18;',3,2,100,false),

(18,'Review Evidence','Study founder archives.','SELECT * FROM evidence WHERE case_id=18;',3,3,150,false),

(18,'Analyze Forensics','Review final findings.','SELECT * FROM forensics WHERE case_id=18;',3,4,150,false),

(18,'Reconstruct Timeline','Review seventy years of history.','SELECT * FROM timeline WHERE case_id=18;',3,5,200,false),

(18,'Understand Project Vritra','Determine its true purpose.','SELECT * FROM evidence WHERE case_id=18;',2,6,250,false),

(18,'Identify The Sutradhar','Expose the architect.','SELECT * FROM forensics WHERE case_id=18;',2,7,250,false),

(18,'Complete The Investigation','Solve the final case.','SELECT * FROM suspects WHERE case_id=18;',1,8,1000,false);

INSERT INTO game_clues
(case_id,objective_id,title,description,clue_type,icon,order_index)
VALUES

(18,NULL,'Witness Zero','The final founder has spoken.','special','🕯️',1),

(18,NULL,'Architect Journal','Vedant documented everything.','special','📓',2),

(18,NULL,'Oracle Truth','Prediction was always the goal.','special','🖥️',3),

(18,NULL,'Maya Truth','Reality could be shaped.','special','🎭',4),

(18,NULL,'The Vritra Cycle','Every case was connected.','special','♾️',5),

(18,NULL,'The Seven Shadows','They were never the true leaders.','special','👥',6),

(18,NULL,'The Ninth Mandala','Only a tool for a larger vision.','special','⚜️',7),

(18,NULL,'The Architect','Vedant remained invisible for decades.','special','🎭',8),

(18,NULL,'Original Doctrine','Civilization can be predicted.','special','📜',9),

(18,NULL,'End Of Vritra','The system is collapsing.','special','🔥',10);

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(
18,
'Witness Zero Testimony',
'Dr. Vedant Kashyap never sought power. He sought proof. He believed humanity followed patterns that could be predicted, modeled and guided. Project Vritra was his lifelong experiment.',
'Final Recording',
'Document'
);

INSERT INTO game_clues
(case_id,objective_id,title,description,clue_type,icon,order_index)
VALUES

(
18,
NULL,
'Cycle One Completed',
'Months later, Prasoon discovers an encrypted archive containing an unfamiliar symbol and a message: "Cycle One Completed."',
'special',
'∞',
11
),

(
18,
NULL,
'Unknown Architects',
'The archive suggests Vedant Kashyap may have been only one of several architects operating globally.',
'special',
'🌍',
12
),

(
18,
NULL,
'The Next Cycle',
'The story is over. The pattern may not be.',
'special',
'🔺',
13
);

COMMIT;
