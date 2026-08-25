// Startup script for Project Vritra Express Backend (Standalone Server)
import app from './app.js';

const PORT = process.env.PORT || 5433;

app.listen(PORT, () => {
  console.log(`
====================================
🕵️ PROJECT VRITRA Backend Running
🌐 Port: ${PORT}
📦 Mode: Standalone Server / Dev
====================================
  `);
});
