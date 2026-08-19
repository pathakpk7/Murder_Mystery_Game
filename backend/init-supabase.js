import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase client with service role key for admin access
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY
);

async function initializeDatabase() {
  try {
    console.log('🗄️  Initializing Project Vritra database with Supabase client...');
    
    // Canonical Project Vritra Cases
    const cases = [
      {
        id: 0,
        title: 'Detective Academy: Missing Evidence',
        description: 'Welcome to the Project Vritra Investigation Division. Complete training by solving a missing evidence case to master SQL investigation techniques.',
        difficulty: 'easy',
        estimated_duration_minutes: 15,
        mythology_theme: 'Training',
        story_background: 'You have joined the Investigation Task Force under Prasoon Pathak. Prove your analytical skills by auditing the evidence locker.',
        is_active: true,
        chapter: 0,
        act: 0,
        unlocks_case: 1,
        story_arc: 'Training',
        primary_villain: 'None'
      },
      {
        id: 1,
        title: 'The Nagabhavan Estate Mystery',
        description: 'Industrialist Rajveer Rathore is found dead inside his locked study at Nagabhavan Estate. What initially appears to be suicide soon reveals signs of murder.',
        difficulty: 'easy',
        estimated_duration_minutes: 20,
        mythology_theme: 'Naga Symbol',
        story_background: 'Prasoon Pathak is called to Nagabhavan Estate after ACP Rudransh Pathak suspects foul play in a seemingly impossible locked-room death.',
        is_active: true,
        chapter: 1,
        act: 1,
        unlocks_case: 2,
        story_arc: 'The Pattern',
        primary_villain: 'Unknown'
      },
      {
        id: 2,
        title: 'The Poisoned Soma',
        description: 'A prominent researcher dies of poisoning during a cultural heritage summit. The fatal toxin mirrors ancient formulations.',
        difficulty: 'easy',
        estimated_duration_minutes: 25,
        mythology_theme: 'Soma Mystery',
        story_background: 'The Task Force uncovers deliberate poison tampering connecting back to Nagabhavan Estate.',
        is_active: true,
        chapter: 2,
        act: 1,
        unlocks_case: 3,
        story_arc: 'The Pattern',
        primary_villain: 'Unknown'
      },
      {
        id: 3,
        title: 'The Temple Cipher',
        description: 'An ancient cipher hidden within the Sun Temple inscriptions is stolen after the curator is silenced.',
        difficulty: 'easy',
        estimated_duration_minutes: 30,
        mythology_theme: 'Surya Mandala',
        story_background: 'The stolen cipher references early records of the Ninth Mandala.',
        is_active: true,
        chapter: 3,
        act: 1,
        unlocks_case: 4,
        story_arc: 'The Pattern',
        primary_villain: 'Unknown'
      }
    ];
    
    for (const caseData of cases) {
      const { error } = await supabase
        .from('game_cases')
        .upsert(caseData, { onConflict: 'id' });
      
      if (error) {
        console.error(`Failed to add case ${caseData.id}:`, error.message);
      } else {
        console.log(`✓ Added case: ${caseData.title}`);
      }
    }
    
    // Add objectives for case 1
    const objectives1 = [
      {
        case_id: 1,
        title: 'Identify All Suspects',
        description: 'Review all suspects connected to the victim',
        expected_query: 'SELECT * FROM suspects WHERE case_id = 1;',
        hint: 'Start with the suspects table',
        hint_threshold: 3,
        order_index: 1,
        points: 100,
        is_optional: false
      },
      {
        case_id: 1,
        title: 'Interview Witnesses',
        description: 'Review witness statements',
        expected_query: 'SELECT * FROM witnesses WHERE case_id = 1;',
        hint: 'Witnesses provide timeline clues',
        hint_threshold: 3,
        order_index: 2,
        points: 100,
        is_optional: false
      },
      {
        case_id: 1,
        title: 'Review Physical Evidence',
        description: 'Examine evidence collected from the scene',
        expected_query: 'SELECT * FROM evidence WHERE case_id = 1;',
        hint: 'Focus on the study',
        hint_threshold: 3,
        order_index: 3,
        points: 150,
        is_optional: false
      },
      {
        case_id: 1,
        title: 'Analyze Forensics',
        description: 'Review laboratory findings',
        expected_query: 'SELECT * FROM forensics WHERE case_id = 1;',
        hint: 'Toxicology is important',
        hint_threshold: 3,
        order_index: 4,
        points: 150,
        is_optional: false
      },
      {
        case_id: 1,
        title: 'Reconstruct Timeline',
        description: 'Review chronological events',
        expected_query: 'SELECT * FROM timeline WHERE case_id = 1;',
        hint: 'Sort events by time',
        hint_threshold: 3,
        order_index: 5,
        points: 200,
        is_optional: false
      },
      {
        case_id: 1,
        title: 'Identify The Killer',
        description: 'Solve the murder',
        expected_query: 'SELECT * FROM suspects WHERE case_id = 1;',
        hint: 'Combine forensic and motive evidence',
        hint_threshold: 1,
        order_index: 6,
        points: 500,
        is_optional: false
      }
    ];
    
    for (const obj of objectives1) {
      const { error } = await supabase
        .from('game_objectives')
        .upsert(obj, { onConflict: 'case_id,order_index' });
      
      if (error) {
        console.error(`Failed to add objective:`, error.message);
      } else {
        console.log(`✓ Added objective: ${obj.title}`);
      }
    }
    
    // Add clues for case 1
    const clues1 = [
      {
        case_id: 1,
        title: 'Locked Study',
        description: 'The study was locked from inside.',
        clue_type: 'information',
        icon: '🚪',
        order_index: 1
      },
      {
        case_id: 1,
        title: 'Poison Trace',
        description: 'A rare poison was detected in the herbal medicine.',
        clue_type: 'evidence',
        icon: '☠️',
        order_index: 2
      },
      {
        case_id: 1,
        title: 'Fingerprint Match',
        description: 'Fingerprints on medicine cabinet match Raghav Sethi.',
        clue_type: 'hint',
        icon: '🔍',
        order_index: 3
      },
      {
        case_id: 1,
        title: 'Serpent Symbol',
        description: 'A strange serpent symbol carved beneath the study desk.',
        clue_type: 'special',
        icon: '🐍',
        order_index: 4
      }
    ];
    
    for (const clue of clues1) {
      const { error } = await supabase
        .from('game_clues')
        .upsert(clue, { onConflict: 'case_id,order_index' });
      
      if (error) {
        console.error(`Failed to add clue:`, error.message);
      } else {
        console.log(`✓ Added clue: ${clue.title}`);
      }
    }
    
    console.log('✅ Canonical Project Vritra Database seeded successfully!');
    
  } catch (err) {
    console.error('❌ Failed to initialize database:', err);
    throw err;
  }
}

// Run if called directly
initializeDatabase()
  .then(() => {
    console.log('Database initialization complete');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Database initialization failed:', err);
    process.exit(1);
  });
