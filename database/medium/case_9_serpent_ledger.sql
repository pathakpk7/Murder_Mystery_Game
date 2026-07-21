BEGIN;

-- ============================================
-- CASE 9
-- THE SERPENT LEDGER
-- ACT 2 : THE CONSPIRACY
-- ============================================

DELETE FROM game_clues WHERE case_id = 9;
DELETE FROM game_objectives WHERE case_id = 9;
DELETE FROM timeline WHERE case_id = 9;
DELETE FROM forensics WHERE case_id = 9;
DELETE FROM evidence WHERE case_id = 9;
DELETE FROM witnesses WHERE case_id = 9;
DELETE FROM suspects WHERE case_id = 9;
DELETE FROM case_characters WHERE case_id = 9;
DELETE FROM game_cases WHERE id = 9;

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
9,
'The Serpent Ledger',
'An accountant linked to multiple shell organizations is murdered after discovering a hidden financial network funding Project Vritra.',
'medium',
50,
'Naga Treasury',
'Prasoon follows a financial trail connecting every previous case.',
true,
9,
2,
10,
'The Conspiracy',
'Unknown'
);

INSERT INTO case_characters
(case_id, character_id, involvement_type, notes)
VALUES
(9,1,'Lead Investigator','Tracks financial network'),
(9,2,'Digital Forensics','Analyzes transactions'),
(9,3,'Field Investigator','Interviews witnesses'),
(9,4,'Psychologist','Profiles suspects'),
(9,5,'Journalist','Investigates shell companies'),
(9,6,'Police Liaison','Coordinates agencies'),
(9,7,'Expert Consultant','Studies historical links');

INSERT INTO suspects
(case_id,name,age,occupation,motive,alibi,contradiction,connection_to_monastery)
VALUES

(
9,
'Rajat Bhandari',
54,
'Chartered Accountant',
'Financial fraud exposure risk',
'Claims client meeting',
'Meeting duration inconsistent',
'Shell Company Network'
),

(
9,
'Dev Malhotra',
47,
'Corporate Lawyer',
'Protected illegal transfers',
'Court appearance',
'Timeline conflict',
'Legal Front'
),

(
9,
'Nikhil Vaidya',
43,
'Investment Manager',
'Managed hidden accounts',
'Business travel',
'Flight records altered',
'Financial Operations'
),

(
9,
'Harshad Mehta',
51,
'Trust Administrator',
'Controlled donation network',
'Temple inspection',
'Location data contradicts claim',
'Trust Network'
),

(
9,
'Raman Kulkarni',
39,
'Data Auditor',
'Deleted transaction evidence',
'Office work',
'Server logs conflict',
'Audit Department'
);

INSERT INTO witnesses
(case_id,name,age,occupation,statement,reliability)
VALUES

(9,'Prerna Tiwari',36,'Accountant','Victim discovered unusual transactions.','High'),

(9,'Vivek Sharma',45,'Bank Officer','Several accounts used identical patterns.','High'),

(9,'Sonal Dubey',31,'Financial Analyst','Transactions routed internationally.','Medium'),

(9,'Gautam Joshi',52,'Auditor','Records disappeared before inspection.','High'),

(9,'Nitin Rao',48,'Compliance Officer','Victim feared for his life.','High'),

(9,'Ananya Pathak',34,'Researcher','Funding links connect previous cases.','Medium');

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(9,'Serpent Ledger','Master financial ledger.','Victim Office','Document'),

(9,'Shell Company List','Network of front organizations.','Secure Drive','Document'),

(9,'Bank Transfers','Suspicious transactions.','Financial Server','Digital'),

(9,'Donation Records','Temple funding routes.','Trust Archive','Document'),

(9,'Corporate Contracts','Hidden agreements.','Law Firm','Document'),

(9,'Encrypted Spreadsheet','Protected financial data.','Laptop','Digital'),

(9,'Transaction Timeline','Movement of funds.','Audit Office','Document'),

(9,'Recovered Emails','Financial coordination.','Mail Server','Digital'),

(9,'Investment Reports','Long-term funding strategy.','Office Vault','Document'),

(9,'Deleted Audit Logs','Removed evidence.','Database Server','Digital'),

(9,'Ninth Mandala Accounts','Secret banking records.','Secure Archive','Document'),

(9,'Naga Seal Document','Official serpent insignia.','Ledger Vault','Document');

INSERT INTO forensics
(case_id,name,description,analysis_result,type)
VALUES

(
9,
'Financial Audit',
'Review of hidden transactions',
'Over ₹400 crore transferred through shell entities',
'Documentary'
),

(
9,
'Email Recovery',
'Deleted communications restored',
'Funding instructions discovered',
'Documentary'
),

(
9,
'Server Analysis',
'Digital evidence review',
'Records intentionally erased',
'Documentary'
),

(
9,
'Ledger Authentication',
'Verification of documents',
'Ledger is authentic',
'Documentary'
),

(
9,
'Timeline Reconstruction',
'Financial movement analysis',
'Funding active for over 20 years',
'Temporal'
),

(
9,
'Network Mapping',
'Relationship analysis',
'Links every previous case',
'Documentary'
),

(
9,
'Bank Analysis',
'Account investigation',
'Multiple offshore transfers found',
'Documentary'
),

(
9,
'Access Review',
'Who viewed ledger',
'Victim accessed restricted files before death',
'Temporal'
);

INSERT INTO timeline
(case_id,time,event,description)
VALUES

('9','20 Years Ago','Network Creation','Funding structure established'),

('9','15 Years Ago','Expansion','Shell companies created'),

('9','10 Years Ago','Political Funding','Major influence operations begin'),

('9','5 Years Ago','Oracle Funding','Prediction systems financed'),

('9','1 Year Ago','Victim Investigation','Ledger review begins'),

('9','2 Weeks Ago','Threat Received','Victim warned to stop'),

('9','3 Days Ago','Ledger Copied','Evidence secured'),

('9','22:00','Murder','Victim killed'),

('9','23:30','Evidence Recovery','Ledger recovered');

INSERT INTO game_objectives
(case_id,title,description,expected_query,hint,hint_threshold,order_index,points,is_optional)
VALUES

(9,'Review Suspects','Identify financial conspirators.','SELECT * FROM suspects WHERE case_id=9;','Follow the money.',3,1,100,false),

(9,'Analyze Witnesses','Review testimony.','SELECT * FROM witnesses WHERE case_id=9;','Focus on transactions.',3,2,100,false),

(9,'Review Evidence','Study financial records.','SELECT * FROM evidence WHERE case_id=9;','The ledger is key.',3,3,150,false),

(9,'Analyze Forensics','Review audit findings.','SELECT * FROM forensics WHERE case_id=9;','Check network mapping.',3,4,150,false),

(9,'Reconstruct Timeline','Follow the money trail.','SELECT * FROM timeline WHERE case_id=9;','Track funding history.',3,5,200,false),

(9,'Trace Shell Companies','Identify hidden organizations.','SELECT * FROM evidence WHERE case_id=9;','Review company lists.',2,6,250,false),

(9,'Expose Ninth Mandala Funding','Find financial links.','SELECT * FROM forensics WHERE case_id=9;','Analyze account records.',2,7,250,false),

(9,'Identify Financial Architect','Find who controlled the system.','SELECT * FROM suspects WHERE case_id=9;','Combine audit and access data.',1,8,500,false);

INSERT INTO game_clues
(case_id,objective_id,title,description,clue_type,icon,order_index)
VALUES

(9,NULL,'Hidden Ledger','A master ledger controls the network.','special','📖',1),

(9,NULL,'Shell Companies','Fake organizations hide transactions.','evidence','🏢',2),

(9,NULL,'Offshore Accounts','Money crossed borders.','evidence','💰',3),

(9,NULL,'Deleted Audits','Someone erased financial history.','information','📊',4),

(9,NULL,'Twenty Year Network','The operation is decades old.','special','⏳',5),

(9,NULL,'Political Influence','Funding shaped decisions.','special','🏛️',6),

(9,NULL,'Oracle Funding','Prediction systems received financing.','special','🖥️',7),

(9,NULL,'Project Vritra','The ledger funds the entire project.','special','📂',8),

(9,NULL,'Ninth Mandala','The organization controls the money.','special','⚜️',9),

(9,NULL,'Serpent Treasury','The Naga symbol marks financial operations.','special','🐍',10);

INSERT INTO evidence
(case_id,name,description,location,type)
VALUES

(
9,
'Inner Circle Ledger',
'Recovered pages reveal the existence of an elite leadership group known as the Inner Circle of the Ninth Mandala.',
'Secure Vault',
'Document'
);

INSERT INTO game_clues
(case_id,objective_id,title,description,clue_type,icon,order_index)
VALUES

(
9,
NULL,
'The Vanishing Disciple',
'A witness connected to the Inner Circle disappears completely. Government records begin changing within hours.',
'special',
'👤',
11
);

COMMIT;