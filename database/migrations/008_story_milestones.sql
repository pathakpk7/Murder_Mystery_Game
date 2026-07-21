-- ============================================
-- STORY MILESTONES - NARRATIVE INTEGRATION
-- ============================================
-- Adds story integration messages at key case milestones
-- ============================================

-- Insert story milestone communications
INSERT INTO team_communications (sender, message, trigger_type, trigger_case_id, unlock_condition) VALUES
-- Case 0: Welcome Recruit
('Prasoon Pathak', 'Welcome to the Investigation Division, recruit. You have completed your training and are now ready to begin your first real investigation. The path ahead will be challenging, but I believe you have what it takes to uncover the truth.', 'case_solved', 0, 'Complete Case 0'),

-- Case 5: Project Vritra Mentioned
('Professor Vedika Rao', 'The name "Project Vritra" has appeared in the evidence. This is significant. In Hindu mythology, Vritra was a serpent who hoarded water and brought suffering. This organization appears to be hoarding truth and manipulating information on a massive scale.', 'case_solved', 5, 'Complete Case 5'),

('Prasoon Pathak', 'We are no longer investigating isolated murders. We have uncovered the existence of a larger conspiracy. Project Vritra is real, and they have been operating in the shadows for decades. Stay vigilant, recruit.', 'case_solved', 5, 'Complete Case 5'),

-- Case 10: Conspiracy Confirmed
('Amisha Singh', 'My sources have confirmed what we suspected. The Ninth Mandala is not just a myth - it is a real organization with immense power. They control financial markets, influence elections, and eliminate anyone who threatens their operations.', 'case_solved', 10, 'Complete Case 10'),

('ACP Rudransh Pathak', 'I have accessed classified police records. The Ninth Mandala has compromised officials at the highest levels. We cannot trust the system anymore. We are on our own in this investigation.', 'case_solved', 10, 'Complete Case 10'),

-- Case 15: The Sutradhar Revealed
('Gowrav Dubey', 'I have traced the digital footprint to a single individual - The Sutradhar. This is the architect behind Project Vritra. They have been manipulating events from the shadows for over two decades. The pattern we have been following leads directly to them.', 'case_solved', 15, 'Complete Case 15'),

('Tammana Tiwari', 'The psychological profile of The Sutradhar is chilling. They believe they are creating a better world through controlled chaos. The deaths, the manipulation - to them, it is all necessary for their vision of order.', 'case_solved', 15, 'Complete Case 15'),

-- Case 18: Final Briefing
('Prasoon Pathak', 'The final truth has been revealed. Project Vritra was never about power or money - it was about control. The Sutradhar believed that by manipulating human behavior on a massive scale, they could prevent chaos. But in doing so, they became the very chaos they sought to prevent.', 'case_solved', 18, 'Complete Case 18'),

('Prasoon Pathak', 'You have done what no one else could. You have exposed the Ninth Mandala, dismantled Project Vritra, and brought The Sutradhar to justice. The investigation is complete, but your work as a detective is far from over. There will always be those who seek to hide the truth.', 'case_solved', 18, 'Complete Case 18'),

('The Entire Team', 'Thank you for everything. You have proven yourself to be not just an investigator, but a true defender of truth. The Project Vritra Investigation Division is proud to call you one of our own. You have earned the rank of Vritra Task Force Commander.', 'case_solved', 18, 'Complete Case 18')
ON CONFLICT DO NOTHING;

-- Update story milestones table with communication IDs
UPDATE story_milestones 
SET unlock_communication_ids = ARRAY(
    SELECT id FROM team_communications 
    WHERE trigger_case_id = story_milestones.case_id 
    AND trigger_type = 'case_solved'
    ORDER BY id
)
WHERE story_milestones.case_id IN (0, 5, 10, 15, 18);

-- ============================================
-- END OF STORY MILESTONES MIGRATION
-- ============================================
