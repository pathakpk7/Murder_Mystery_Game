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
    console.log('🗄️  Initializing database with Supabase client...');
    
    // First, let's add some sample cases directly
    console.log('Adding sample cases...');
    
    const cases = [
      {
        id: 1,
        title: 'The Midnight Murder',
        description: 'A wealthy businessman was found dead in his study at midnight. The door was locked from the inside, and no signs of forced entry. Was it suicide, or was there a hidden killer?',
        difficulty: 'easy',
        estimated_duration_minutes: 20,
        is_active: true
      },
      {
        id: 2,
        title: 'The Poisoned Chalice',
        description: 'During a royal banquet, the king suddenly collapses after drinking from his golden chalice. Multiple nobles had access to the wine. Who poisoned the king?',
        difficulty: 'medium',
        estimated_duration_minutes: 30,
        is_active: true
      },
      {
        id: 3,
        title: 'The Vanishing Heir',
        description: 'The sole heir to a vast fortune disappeared on the eve of their 21st birthday. Three suspects were seen near the estate that night. Solve the mystery before the inheritance is lost.',
        difficulty: 'hard',
        estimated_duration_minutes: 45,
        is_active: true
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
    console.log('Adding objectives for case 1...');
    const objectives1 = [
      {
        case_id: 1,
        title: 'Identify the Victim',
        description: 'Query the witnesses table to find out who was found dead.',
        expected_query: 'SELECT * FROM witnesses WHERE case_id = 1',
        hint: 'Look for witnesses with no verified alibi',
        hint_threshold: 3,
        order_index: 1,
        points: 100,
        is_optional: false
      },
      {
        case_id: 1,
        title: 'Find the Murder Weapon',
        description: 'Search the forensics table for the weapon used in the crime.',
        expected_query: 'SELECT * FROM forensics WHERE case_id = 1 AND type = \'Weapon\'',
        hint: 'Check for weapons in the study',
        hint_threshold: 3,
        order_index: 2,
        points: 150,
        is_optional: false
      },
      {
        case_id: 1,
        title: 'Identify the Killer',
        description: 'Cross-reference suspects with forensics to find the murderer.',
        expected_query: 'SELECT s.* FROM suspects s JOIN forensics f ON s.case_id = f.case_id WHERE s.case_id = 1 AND f.match = s.name',
        hint: 'Look for suspects whose DNA matches the evidence',
        hint_threshold: 2,
        order_index: 3,
        points: 200,
        is_optional: false
      }
    ];
    
    for (const obj of objectives1) {
      const { error } = await supabase
        .from('game_objectives')
        .upsert(obj, { onConflict: ['case_id', 'order_index'] });
      
      if (error) {
        console.error(`Failed to add objective:`, error.message);
      } else {
        console.log(`✓ Added objective: ${obj.title}`);
      }
    }
    
    // Add clues for case 1
    console.log('Adding clues for case 1...');
    const clues1 = [
      {
        case_id: 1,
        title: 'Locked Door',
        description: 'The study door was locked from the inside. This suggests the killer knew how to lock it from outside or had a key.',
        clue_type: 'information',
        icon: '🚪',
        order_index: 1
      },
      {
        case_id: 1,
        title: 'Broken Window',
        description: 'A small window in the study was slightly ajar. Could this be the entry point?',
        clue_type: 'evidence',
        icon: '🪟',
        order_index: 2
      }
    ];
    
    for (const clue of clues1) {
      const { error } = await supabase
        .from('game_clues')
        .upsert(clue, { onConflict: ['case_id', 'title'] });
      
      if (error) {
        console.error(`Failed to add clue:`, error.message);
      } else {
        console.log(`✓ Added clue: ${clue.title}`);
      }
    }
    
    // Verify the data
    console.log('Verifying data...');
    const { data: casesData, error: casesError } = await supabase
      .from('game_cases')
      .select('*');
    
    if (casesError) {
      console.error('Failed to verify cases:', casesError.message);
    } else {
      console.log(`✅ Database initialized successfully!`);
      console.log(`📊 Total cases: ${casesData.length}`);
      casesData.forEach(c => console.log(`   - ${c.title} (${c.difficulty})`));
    }
    
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
