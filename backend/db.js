import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFile = path.resolve(__dirname, '..', 'database', 'game.db');
const schemaFile = path.resolve(__dirname, '..', 'database', 'game_data.sql');

let dbInstance;

export async function getDb() {
  if (dbInstance) return dbInstance;
  const dir = path.dirname(dbFile);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  dbInstance = await open({ filename: dbFile, driver: sqlite3.Database });
  await initSchema();
  return dbInstance;
}

async function initSchema() {
  if (!dbInstance) {
    throw new Error('Database instance not initialized');
  }
  
  // Check if schema needs to be initialized by checking if tables exist
  try {
    const tablesCheck = await dbInstance.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='levels' LIMIT 1"
    );
    
    // Only initialize schema if tables don't exist
    if (!tablesCheck) {
      if (!fs.existsSync(schemaFile)) {
        const errorMsg = `Schema file not found: ${schemaFile}`;
        console.error(errorMsg);
        console.error('Current working directory:', process.cwd());
        console.error('Database directory exists:', fs.existsSync(path.dirname(dbFile)));
        throw new Error(errorMsg);
      }
      
      try {
        const sql = fs.readFileSync(schemaFile, 'utf8');
        
        // Execute SQL statements one by one to handle errors better
        // Split by semicolon but preserve multi-line statements
        const statements = sql
          .replace(/\r\n/g, '\n')
          .replace(/\r/g, '\n')
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0 && !s.startsWith('--'))
          .map(s => s + ';'); // Add semicolon back
        
        // Execute each statement separately
        for (let i = 0; i < statements.length; i++) {
          const statement = statements[i];
          if (statement) {
            try {
              await dbInstance.exec(statement);
            } catch (stmtErr) {
              // Log which statement failed for debugging
              console.error(`Error executing statement ${i + 1}:`, statement.substring(0, 150));
              console.error('Error details:', stmtErr.message);
              throw stmtErr;
            }
          }
        }
        
        console.log(`Database schema initialized successfully (${statements.length} statements executed)`);
      } catch (err) {
        console.error('Error initializing schema:', err);
        console.error('Schema file path:', schemaFile);
        console.error('Database file path:', dbFile);
        throw err;
      }
    } else {
      console.log('Database schema already initialized');
    }
  } catch (err) {
    console.error('Error checking/initializing schema:', err);
    throw err;
  }
}

// Database will be initialized when first accessed via getDb()

export async function all(sql, params = []) {
  const db = await getDb();
  return db.all(sql, params);
}

export async function get(sql, params = []) {
  const db = await getDb();
  return db.get(sql, params);
}

export async function run(sql, params = []) {
  const db = await getDb();
  return db.run(sql, params);
}

export const db = { all, get, run };
