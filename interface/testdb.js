const sql = require('better-sqlite3');
const db = sql('tests.db');

const initialPrompt = [
    {
        system_prompt: "You are a helpful assistant, please answer this question being respectful. Provide always concise responses"
    }
]

db.prepare(`
   CREATE TABLE IF NOT EXISTS system_prompt (
        id INTEGER PRIMARY KEY,
        system_prompt TEXT NOT NULL
   );
`).run();

db.prepare(`
 CREATE TABLE IF NOT EXISTS tests (
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        pertinence INTEGER NOT NULL,
        system_prompt_id INTEGER,
        FOREIGN KEY (system_prompt_id) REFERENCES system_prompt(id)
    );
`).run();

db.prepare(`
 CREATE TABLE IF NOT EXISTS current_system_prompt (
        system_prompt_id INTEGER,
        FOREIGN KEY (system_prompt_id) REFERENCES system_prompt(id)
    );
`).run();

async function initData() {
    const stmt = db.prepare(`
      INSERT INTO system_prompt VALUES (
         null,
         @system_prompt
      )
   `);

    for (const pr of initialPrompt){
        stmt.run(pr);
    }

    const stmt1 = db.prepare(`
      INSERT INTO current_system_prompt VALUES (
         @system_prompt_id
      )
    `);
    stmt1.run({system_prompt_id: 1});
}

(async()=>{

    //await initData();

    const res = db.prepare(`
    SELECT * FROM tests
`).all();

    console.log({res});

    const res1 = db.prepare(`
    SELECT * FROM system_prompt
`).all();

    console.log({res1});

    const res2 = db.prepare(`
    SELECT * FROM current_system_prompt
`).all();

    console.log({res2});
})();