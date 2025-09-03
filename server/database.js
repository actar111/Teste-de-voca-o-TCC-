// database.js (CommonJS)
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "vocacaoplay.db");
const db = new sqlite3.Database(dbPath);

function initDb() {
  db.run(`
    CREATE TABLE IF NOT EXISTS resultados (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      area TEXT NOT NULL,
      score_ti INTEGER DEFAULT 0,
      score_saude INTEGER DEFAULT 0,
      score_exatas INTEGER DEFAULT 0,
      score_humanas INTEGER DEFAULT 0,
      score_artes INTEGER DEFAULT 0,
      score_negocios INTEGER DEFAULT 0,
      score_comunicacao INTEGER DEFAULT 0,
      score_meioambiente INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
}

module.exports = { db, initDb };
