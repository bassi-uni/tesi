const sql = require('better-sqlite3');
const db = sql('tests.db');



export const getCurrentSystemPrompt = () => {
    const stmt = db.prepare(`
      SELECT system_prompt FROM current_system_prompt INNER JOIN system_prompt ON current_system_prompt.system_prompt_id = system_prompt.id
    `).get();

    const {system_prompt} = stmt;
    return system_prompt;
}

export const newSystemPrompt = (prompt) => {
    //update the value in current_system_prompt table and add a new value in system_prompt table
    const prompts = getAllSystemPrompts();

    if(!prompts.some(p => p.system_prompt === prompt)){
        const stmt = db.prepare(`
          INSERT INTO system_prompt VALUES (
             null,
             @system_prompt
          )
        `);
        stmt.run({system_prompt: prompt});
    }

    const stmt1 = db.prepare(`
      UPDATE current_system_prompt SET system_prompt_id = (SELECT id FROM system_prompt WHERE system_prompt = @prompt)
    `);
    stmt1.run({prompt});
}

export const addTestRecord = (question, answer, pertinence) => {
    const stmt = db.prepare(`
      INSERT INTO tests VALUES (
         @question,
         @answer,
         @pertinence,
         (SELECT system_prompt_id FROM current_system_prompt)
      )
    `);
    stmt.run({question, answer, pertinence});
}

export const getAllSystemPrompts = () => {
    const stmt = db.prepare(`
      SELECT * FROM system_prompt
    `);
    return stmt.all();
}

//initData();

