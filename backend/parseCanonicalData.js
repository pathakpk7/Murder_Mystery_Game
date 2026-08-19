import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbDir = path.join(__dirname, '../database');
const files = [
  path.join(dbDir, 'easy/case_0_detective_academy.sql'),
  path.join(dbDir, 'easy/case_1_nagabhavan_estate.sql'),
  path.join(dbDir, 'easy/case_2_poisoned_soma.sql'),
  path.join(dbDir, 'easy/case_3_temple_cipher.sql'),
  path.join(dbDir, 'easy/case_4_silent_devotee.sql'),
  path.join(dbDir, 'easy/case_5_ashes_of_dharma.sql'),
  path.join(dbDir, 'medium/case_6_twin_illusion.sql'),
  path.join(dbDir, 'medium/case_7_wheel_of_time.sql'),
  path.join(dbDir, 'medium/case_8_forgotten_monk.sql'),
  path.join(dbDir, 'medium/case_9_serpent_ledger.sql'),
  path.join(dbDir, 'medium/case_10_vanishing_disciple.sql'),
  path.join(dbDir, 'hard/case_11_seven_shadows.sql'),
  path.join(dbDir, 'hard/case_12_maya_protocol.sql'),
  path.join(dbDir, 'hard/case_13_crimson_yagna.sql'),
  path.join(dbDir, 'hard/case_14_oracle_network.sql'),
  path.join(dbDir, 'hard/case_15_hidden_manuscript.sql'),
  path.join(dbDir, 'expert/case_16_vritra_cycle.sql'),
  path.join(dbDir, 'expert/case_17_ninth_realm.sql'),
  path.join(dbDir, 'expert/case_18_last_witness.sql'),
];

function parseSqlStatements(sql) {
  const statements = [];
  let inString = false;
  let currentStmt = '';
  
  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    
    // Ignore line comments
    if (!inString && char === '-' && sql[i+1] === '-') {
      while (i < sql.length && sql[i] !== '\n') {
        i++;
      }
      continue;
    }
    
    if (char === "'") {
      if (inString && sql[i+1] === "'") {
        currentStmt += "''";
        i++;
        continue;
      }
      inString = !inString;
      currentStmt += char;
      continue;
    }
    
    if (char === ';' && !inString) {
      if (currentStmt.trim()) {
        statements.push(currentStmt.trim());
      }
      currentStmt = '';
      continue;
    }
    
    currentStmt += char;
  }
  
  return statements;
}

function parseSqlInserts(sql) {
  const result = {};
  const statements = parseSqlStatements(sql);
  
  for (const stmt of statements) {
    const insertMatch = stmt.match(/^INSERT\s+INTO\s+([a-zA-Z0-9_]+)\s*(?:\(([^)]+)\))?\s*VALUES\s*([\s\S]*)$/i);
    if (!insertMatch) continue;
    
    const table = insertMatch[1].toLowerCase();
    const colsStr = insertMatch[2];
    const valsStr = insertMatch[3];
    
    let cols = [];
    if (colsStr) {
      cols = colsStr.split(',').map(c => c.trim().toLowerCase());
    }
    
    const rows = [];
    let inTuple = false;
    let inString = false;
    let currentVal = '';
    let currentTuple = [];
    
    for (let i = 0; i < valsStr.length; i++) {
      const char = valsStr[i];
      if (char === "'") {
        if (inString && valsStr[i+1] === "'") {
          currentVal += "'";
          i++;
          continue;
        }
        inString = !inString;
        continue;
      }
      
      if (!inString) {
        if (char === '(' && !inTuple) {
          inTuple = true;
          currentTuple = [];
          currentVal = '';
          continue;
        } else if (char === ')' && inTuple) {
          inTuple = false;
          currentTuple.push(currentVal.trim());
          rows.push(currentTuple);
          currentTuple = [];
          currentVal = '';
          continue;
        } else if (char === ',' && inTuple) {
          currentTuple.push(currentVal.trim());
          currentVal = '';
          continue;
        }
      }
      if (inTuple) {
        currentVal += char;
      }
    }
    
    if (!result[table]) result[table] = [];
    
    rows.forEach(r => {
      if (cols.length > 0) {
        const obj = {};
        cols.forEach((col, idx) => {
          let val = r[idx] !== undefined ? r[idx] : null;
          if (val === 'true') val = true;
          else if (val === 'false') val = false;
          else if (val === 'NULL' || val === 'null') val = null;
          else if (val !== null && !isNaN(val) && val !== '') {
            if (!val.startsWith('0') || val === '0') val = Number(val);
          }
          obj[col] = val;
        });
        result[table].push(obj);
      } else {
        result[table].push(r);
      }
    });
  }
  return result;
}

const allData = {
  game_cases: [],
  case_characters: [],
  suspects: [],
  witnesses: [],
  evidence: [],
  forensics: [],
  timeline: [],
  game_objectives: [],
  game_clues: [],
  evidence_locker: []
};

files.forEach(f => {
  if (!fs.existsSync(f)) {
    console.error('File not found:', f);
    return;
  }
  const content = fs.readFileSync(f, 'utf8');
  const parsed = parseSqlInserts(content);
  for (const table in parsed) {
    if (allData[table]) {
      allData[table].push(...parsed[table]);
    } else {
      allData[table] = parsed[table];
    }
  }
});

// Characters table
allData.characters = [
  {
    id: 1,
    name: 'Prasoon Pathak',
    role: 'Lead Investigator',
    department: 'Investigation Task Force',
    expertise: 'Deduction, Crime Scene Analysis, Leadership',
    personality: 'Calm, highly analytical, observant, ethical',
    icon: 'fas fa-user-secret',
    color: '#d4af37'
  },
  {
    id: 2,
    name: 'Gowrav Dubey',
    role: 'Digital Forensics Specialist',
    department: 'Digital Forensics Division',
    expertise: 'SQL, Cyber Investigation, Database Analysis, CCTV Examination',
    personality: 'Intelligent, quiet, methodical, detail-oriented',
    icon: 'fas fa-laptop-code',
    color: '#3b82f6'
  },
  {
    id: 3,
    name: 'Harsh Shukla',
    role: 'Field Investigator',
    department: 'Field Operations',
    expertise: 'Physical Evidence Collection, Tactical Ops, Surveillance',
    personality: 'Courageous, action-oriented, resourceful, practical',
    icon: 'fas fa-user-shield',
    color: '#22c55e'
  },
  {
    id: 4,
    name: 'Tammana Tiwari',
    role: 'Behavioral Analyst',
    department: 'Behavioral Analysis Division',
    expertise: 'Criminal Psychology, Motive Profiling, Interrogation',
    personality: 'Insightful, empathetic, patient, psychological',
    icon: 'fas fa-brain',
    color: '#ec4899'
  },
  {
    id: 5,
    name: 'Amisha Singh',
    role: 'Investigative Journalist',
    department: 'Intelligence Division',
    expertise: 'Archives, Open-Source Intelligence, Public Records',
    personality: 'Fearless, persistent, curious, independent',
    icon: 'fas fa-newspaper',
    color: '#f59e0b'
  },
  {
    id: 6,
    name: 'Professor Vedika Rao',
    role: 'Ancient Manuscript Expert',
    department: 'Historical Archives',
    expertise: 'Ancient India, Symbolism, Sanskrit, Historical Inscriptions',
    personality: 'Scholarly, wise, calm, analytical',
    icon: 'fas fa-chalkboard-teacher',
    color: '#8b5cf6'
  },
  {
    id: 7,
    name: 'ACP Rudransh Pathak',
    role: 'Police Liaison',
    department: 'Police Coordination Division',
    expertise: 'Police Operations, Legal Procedure, Warrants, Strategy',
    personality: 'Disciplined, authoritative, protective, experienced',
    icon: 'fas fa-shield-alt',
    color: '#ef4444'
  },
  {
    id: 8,
    name: 'Dr. Vedant Kashyap',
    role: 'The Sutradhar',
    department: 'Unknown / The Ninth Mandala',
    expertise: 'Information Control, Institutional Manipulation, Conspiracy Architecture',
    personality: 'Calculating, visionary, enigmatic, ruthless',
    icon: 'fas fa-chess-king',
    color: '#a52a2a'
  }
];

allData.rank_progression = [
  { rank: 'Investigation Intern', minCases: 0, minXP: 0, badge: '🔰', description: 'New recruit at the Detective Academy' },
  { rank: 'Junior Analyst', minCases: 2, minXP: 500, badge: '🥉', description: 'Assisting in initial case analysis' },
  { rank: 'Investigation Officer', minCases: 5, minXP: 1500, badge: '🥈', description: 'Field operative on active murder investigations' },
  { rank: 'Crime Analyst', minCases: 8, minXP: 3000, badge: '🥇', description: 'Cross-referencing Ninth Mandala forensic patterns' },
  { rank: 'Senior Investigator', minCases: 11, minXP: 6000, badge: '🎖️', description: 'Leading high-profile multi-jurisdictional probes' },
  { rank: 'Lead Investigator', minCases: 14, minXP: 10000, badge: '⭐', description: 'Directing Task Force operations across institutions' },
  { rank: 'Special Operations Lead', minCases: 17, minXP: 15000, badge: '🌟', description: 'Infiltrating core conspiracy networks' },
  { rank: 'Vritra Task Force Commander', minCases: 18, minXP: 22000, badge: '👑', description: 'Exposed the Sutradhar and brought justice to Project Vritra' }
];

allData.achievements = [
  { id: 1, name: 'Academy Graduate', description: 'Complete the Detective Academy training', icon: '🎓', requirement: 'Complete Case 0', points: 100, category: 'general' },
  { id: 2, name: 'First Breakthrough', description: 'Solve your first active crime investigation', icon: '🔍', requirement: 'Complete Case 1', points: 150, category: 'general' },
  { id: 3, name: 'Pattern Analyst', description: 'Complete Act I (The Pattern)', icon: '🧩', requirement: 'Complete Cases 1-5', points: 500, category: 'story' },
  { id: 4, name: 'Conspiracy Unraveler', description: 'Complete Act II (The Conspiracy)', icon: '🗝️', requirement: 'Complete Cases 6-10', points: 750, category: 'story' },
  { id: 5, name: 'System Infiltrator', description: 'Complete Act III (The System)', icon: '🏛️', requirement: 'Complete Cases 11-15', points: 1000, category: 'story' },
  { id: 6, name: 'Vritra Mastermind Solved', description: 'Expose the Sutradhar in Act IV', icon: '👑', requirement: 'Complete all 18 cases', points: 2000, category: 'story' },
  { id: 7, name: 'SQL Specialist', description: 'Execute 50 successful queries with zero syntax errors', icon: '⚡', requirement: '50 accurate queries', points: 300, category: 'accuracy' },
  { id: 8, name: 'Forensic Legend', description: 'Discover all critical forensic evidence across investigations', icon: '🔬', requirement: 'Unlock all forensic reports', points: 400, category: 'explorer' }
];

console.log('Parsed database tables summary:');
for (const table in allData) {
  console.log(`${table}: ${allData[table].length} records`);
}

const outputPath = path.join(__dirname, '../frontend/canonical_database.json');
fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2));
console.log('Saved to', outputPath);

const jsOutputPath = path.join(__dirname, '../frontend/canonicalData.js');
fs.writeFileSync(jsOutputPath, 'window.CANONICAL_DATABASE = ' + JSON.stringify(allData, null, 2) + ';\n');
console.log('Saved to', jsOutputPath);
