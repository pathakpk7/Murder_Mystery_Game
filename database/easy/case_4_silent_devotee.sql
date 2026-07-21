BEGIN;

-- ============================================
-- CASE 4
-- THE SILENT DEVOTEE
-- ACT 1 : THE PATTERN
-- ============================================

DELETE FROM game_clues WHERE case_id = 4;
DELETE FROM game_objectives WHERE case_id = 4;
DELETE FROM timeline WHERE case_id = 4;
DELETE FROM forensics WHERE case_id = 4;
DELETE FROM evidence WHERE case_id = 4;
DELETE FROM witnesses WHERE case_id = 4;
DELETE FROM suspects WHERE case_id = 4;
DELETE FROM case_characters WHERE case_id = 4;
DELETE FROM game_cases WHERE id = 4;

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
4,
'The Silent Devotee',
'A monk who had not spoken for eight years is found murdered at Rudra Peeth Monastery. Before his death, he leaves behind a cryptic message linked to the serpent symbol.',
'easy',
30,
'Monastic Secrets',
'The investigation uncovers a hidden connection between ancient manuscripts and a modern conspiracy.',
true,
4,
1,
5,
'The Pattern',
'Unknown'
);

INSERT INTO case_characters
(case_id, character_id, involvement_type, notes)
VALUES
(4,1,'Lead Investigator','Investigates monastery murder'),
(4,2,'Digital Forensics','Analyzes monastery records'),
(4,3,'Field Investigator','Interviews monks'),
(4,4,'Psychologist','Profiles suspects'),
(4,5,'Journalist','Investigates monastery history'),
(4,6,'Police Liaison','Coordinates investigation'),
(4,7,'Expert Consultant','Studies monastery archives');

INSERT INTO suspects
(case_id,name,age,occupation,motive,alibi,contradiction,connection_to_monastery)
VALUES

(
4,
'Swami Aditya',
62,
'Senior Monk',
'Feared exposure of hidden records',
'Claims meditation during murder',
'Witnesses place him elsewhere',
'Senior monastery authority'
),

(
4,
'Nikhil Tandon',
41,
'Treasurer',
'Financial irregularities discovered',
'Working in office',
'Ledger times do not match',
'Monastery finances'
),

(
4,
'Pranav Bhatt',
34,
'Disciple',
'Personal conflict with victim',
'Claims evening prayer',
'Several witnesses disagree',
'Direct student'
),

(
4,
'Harinarayan Joshi',
55,
'Archivist',
'Victim discovered hidden documents',
'Archive maintenance',
'Access logs altered',
'Keeper of records'
),

(
4,
'Rakesh Kulkarni',
46,
'Property Manager',
'Illegal land transactions',
'Outside monastery',
'Vehicle records contradict claim',
'Administrative staff'
);

INSERT INTO witnesses
(case_id,name,age,occupation,statement,reliability)
VALUES

(
4,
'Swami Nityanand',
58,
'Monk',
'Victim appeared fearful during final days.',
'High'
),

(
4,
'Arjun Mishra',
27,
'Disciple',
'Saw someone near victim quarters.',
'Medium'
),

(
4,
'Ritu Pathak',
36,
'Accountant',
'Victim requested financial records.',
'High'
),

(
4,
'Om Prakash',
51,
'Caretaker',
'Observed unusual archive activity.',
'Medium'
),

(
4,
'Keshav Sharma',
48,
'Priest',
'Victim secretly met visitors.',
'High'
),

(
4,
'Sonal Verma',
31,
'Researcher',
'Victim investigated historical manuscripts.',
'Medium'
);

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(4,'Monk Journal','Hidden diary entries.','Victim Quarters','Document'),

(4,'Blood-Stained Prayer Beads','Recovered near body.','Meditation Hall','Physical'),

(4,'Monastery Ledger','Financial transactions.','Treasury Office','Document'),

(4,'Archive Key','Opens restricted vault.','Victim Quarters','Physical'),

(4,'Temple Map','Contains marked locations.','Archive','Document'),

(4,'Burned Letter','Partially destroyed warning.','Fire Pit','Document'),

(4,'Visitor Register','Names of monastery visitors.','Reception','Document'),

(4,'Security Footage','Monastery surveillance.','Security Room','Digital'),

(4,'Encrypted Notes','Victim coded observations.','Victim Desk','Document'),

(4,'Ancient Scroll Fragment','Contains serpent symbol.','Archive Vault','Document'),

(4,'Financial Receipts','Suspicious transactions.','Treasury Office','Document'),

(4,'Wooden Box','Secret compartment discovered.','Archive Vault','Physical');

INSERT INTO forensics
(case_id,name,description,analysis_result,type)
VALUES

(
4,
'Autopsy Report',
'Victim examination',
'Death caused by blunt force trauma',
'Physical'
),

(
4,
'Fingerprint Analysis',
'Prayer bead examination',
'Matches Pranav Bhatt',
'Physical'
),

(
4,
'Document Recovery',
'Burned letter reconstruction',
'Victim was threatened',
'Documentary'
),

(
4,
'Ledger Audit',
'Financial review',
'Unexplained transfers discovered',
'Documentary'
),

(
4,
'Archive Analysis',
'Restricted records examined',
'References Ninth Mandala',
'Documentary'
),

(
4,
'Timeline Reconstruction',
'Final movements of victim',
'Victim met unknown visitor',
'Temporal'
),

(
4,
'Video Analysis',
'Security footage review',
'Archive accessed after midnight',
'Temporal'
),

(
4,
'Scroll Authentication',
'Ancient fragment dating',
'Approximately 400 years old',
'Documentary'
);

INSERT INTO timeline
(case_id,time,event,description)
VALUES

('4','08:00','Morning Prayer','Victim attends ceremony'),

('4','11:00','Archive Research','Victim examines records'),

('4','14:30','Secret Meeting','Victim meets unknown person'),

('4','17:00','Financial Request','Victim requests monastery ledgers'),

('4','19:00','Evening Prayer','Monastery gathering'),

('4','21:15','Archive Visit','Victim enters restricted archive'),

('4','22:00','Confrontation','Argument overheard'),

('4','22:45','Murder','Victim attacked'),

('4','23:20','Body Found','Monks discover body');

INSERT INTO game_objectives
(case_id,title,description,expected_query,hint,hint_threshold,order_index,points,is_optional)
VALUES

(4,'Review Suspects','Identify possible killers.','SELECT * FROM suspects WHERE case_id=4;','Study motives.',3,1,100,false),

(4,'Interview Witnesses','Analyze statements.','SELECT * FROM witnesses WHERE case_id=4;','Compare accounts.',3,2,100,false),

(4,'Review Evidence','Study collected evidence.','SELECT * FROM evidence WHERE case_id=4;','Focus on archive items.',3,3,150,false),

(4,'Analyze Forensics','Review forensic reports.','SELECT * FROM forensics WHERE case_id=4;','Fingerprints matter.',3,4,150,false),

(4,'Reconstruct Timeline','Determine sequence of events.','SELECT * FROM timeline WHERE case_id=4;','Focus on final hours.',3,5,200,false),

(4,'Investigate Monastery Finances','Discover hidden transactions.','SELECT * FROM evidence WHERE case_id=4;','Check ledgers.',2,6,250,false),

(4,'Decode Victim Notes','Understand victim findings.','SELECT * FROM evidence WHERE case_id=4;','Read encrypted notes.',2,7,250,false),

(4,'Identify Killer','Solve the case.','SELECT * FROM suspects WHERE case_id=4;','Combine evidence and forensics.',1,8,500,false);

INSERT INTO game_clues
(case_id,objective_id,title,description,clue_type,icon,order_index)
VALUES

(4,NULL,'Silent Warning','Victim left a final coded message.','information','📝',1),

(4,NULL,'Prayer Beads','Recovered near body.','evidence','📿',2),

(4,NULL,'Hidden Archive','Restricted records exist.','information','🏛️',3),

(4,NULL,'Financial Irregularities','Money trails appear suspicious.','evidence','💰',4),

(4,NULL,'Fingerprint Match','Forensics link a suspect.','hint','🔍',5),

(4,NULL,'Ancient Scroll','Contains serpent symbol.','special','🐍',6),

(4,NULL,'Ninth Mandala Records','Organization appears again.','special','⚜️',7),

(4,NULL,'Unknown Visitor','Victim met someone secretly.','information','🚶',8),

(4,NULL,'Destroyed Letter','Victim was threatened.','evidence','✉️',9),

(4,NULL,'Final Message','"The serpent guards the ashes of truth."','special','🔥',10);

-- ============================================
-- STORY REVEALS
-- ============================================

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(
4,
'Decoded Monk Journal',
'Recovered diary reveals the victim had uncovered a network operating through religious institutions, political influence and financial donations. Multiple references to Project Vritra appear.',
'Victim Quarters',
'Document'
),

(
4,
'Project Vritra Archive',
'Restricted file recovered from a hidden archive chamber. Marked confidential.',
'Secret Archive',
'Document'
),

(
4,
'Naga Insignia Record',
'Ancient record containing the same serpent symbol found in previous investigations.',
'Secret Archive',
'Document'
),

(
4,
'Political Funding Ledger',
'Records showing donations routed through shell organizations.',
'Treasury Vault',
'Document'
),

(
4,
'Sealed Correspondence',
'Letters exchanged between monastery administrators and unidentified benefactors.',
'Hidden Chamber',
'Document'
);

-- ============================================
-- ADDITIONAL FORENSICS
-- ============================================

INSERT INTO forensics
(case_id,name,description,analysis_result,type)
VALUES

(
4,
'Journal Reconstruction',
'Recovery of damaged diary pages.',
'Victim was actively investigating Project Vritra before death.',
'Documentary'
),

(
4,
'Ink Dating Analysis',
'Examination of final written message.',
'Message written less than one hour before death.',
'Physical'
);

-- ============================================
-- ENDGAME CLUES
-- ============================================

INSERT INTO game_clues
(case_id,objective_id,title,description,clue_type,icon,order_index)
VALUES

(
4,
NULL,
'Project Vritra',
'The first confirmed modern reference to Project Vritra appears in recovered records.',
'special',
'📂',
11
),

(
4,
NULL,
'Hidden Benefactors',
'The monastery received funding from powerful and anonymous patrons.',
'special',
'🏛️',
12
),

(
4,
NULL,
'Ashes Of Dharma',
'The final diary pages repeatedly reference a politician known as The Keeper of Dharma.',
'special',
'🔥',
13
),

(
4,
NULL,
'The Silent Devotees Final Words',
'"When Dharma burns, the serpent shall rise. Seek the ashes and you shall find the architects."',
'special',
'🐍',
14
);

-- ============================================
-- CASE 5 BRIDGE
-- ============================================

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(
4,
'Confidential Political File',
'Contains references to politician Devendra Pratap Singh and suspicious financial transactions connected to Project Vritra.',
'Secret Archive',
'Document'
);

COMMIT;