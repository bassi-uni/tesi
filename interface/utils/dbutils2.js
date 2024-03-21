const sql = require('better-sqlite3');
const db = sql('database.db');
export const getAllSystemPrompts = () => {
    const stmt = db.prepare(`
      SELECT * FROM systemPrompt
    `);
    return stmt.all();
}

export const getAllUCs = (withActivePrompt) => {
    let stmt;
    if(withActivePrompt){
        stmt = db.prepare(`
      SELECT useCase.*, systemPrompt.prompt, systemPrompt.ID AS promptID
      FROM useCase INNER JOIN systemPrompt ON useCase.ID = systemPrompt.UCID
      WHERE systemPrompt.isSelected = TRUE
    `);
    }else{
        stmt = db.prepare(`
            SELECT * FROM useCase
    `);
    }

    return stmt.all();
}
export const createUC = (name) => {
    const stmt = db.prepare(`
      INSERT INTO useCase VALUES (
         null,
         @name
      )
    `);
    stmt.run({name});
}
export const newSystemPrompt = (prompt, useCase) => {

    const prompts = getAllSystemPrompts();
    const UCs = getAllUCs();

    console.log({prompts, UCs, prompt, useCase})

    /**
     * This block of code checks if the provided useCase exists in the UCs array.
     * If the useCase does not exist, it prepares a SQL statement to insert a new useCase into the 'useCase' table.
     * The new useCase has a null ID (which will be auto-incremented by the database) and the provided useCase name.
     * After preparing the statement, it executes the statement with the provided useCase as a parameter.
     *
     */
    if(!UCs.some(c => c.name === useCase)){
        // Prepare SQL statement to insert a new useCase
        createUC(useCase)
    }

    console.log({prompt, useCase})

    const UCID = db.prepare(`
        SELECT ID FROM useCase WHERE name = @useCase
    `).get({useCase}).ID;

    console.log({UCID})




    if(!prompts.some(p => p.prompt === prompt && p.UCID === UCID)){
        const stmt = db.prepare(`
          INSERT INTO systemPrompt VALUES (
             null,
             @prompt,
              @isSelected,
             @UCID      
          )
        `);
        stmt.run({prompt, UCID,isSelected:1});
    }

    //set as selected the new prompt and unselect the previous one
    const stmt = db.prepare(`
      UPDATE systemPrompt SET isSelected = FALSE WHERE UCID = @UCID
    `);
    stmt.run({UCID});

    const stmt2 = db.prepare(`
      UPDATE systemPrompt SET isSelected = TRUE WHERE prompt = @prompt
    `);
    stmt2.run({prompt});

    return db.prepare(`
        SELECT ID FROM systemPrompt WHERE prompt = @prompt
    `).get({prompt}).ID;
}

export const addTestRecord = ({interactions, pertinence, promptID, loadingTime, model, withTranslation}) => {
    const info = db.prepare(`
        INSERT INTO test VALUES (
            null,
            @promptID,
            @pertinence,
            @loadingTime,
            @model,
            @withTranslation,
            @timestamp
        )
    `).run({
        promptID,
        pertinence,
        loadingTime,
        model,
        withTranslation,
        timestamp: new Date().toISOString()
    })

    const testID = info.lastInsertRowid;

    console.log({testID})

    for (const interaction of interactions){

        const interactionToString = JSON.stringify(interaction);

        db.prepare(`
            INSERT INTO interaction VALUES (
                null,
                @testID,
                @interaction
            )
        `).run({
            testID : info.lastInsertRowid,
            interaction: interactionToString
        });
    }
}

export const deletePromptByID = (promptID) => {
    const stmt = db.prepare(`
      DELETE FROM systemPrompt WHERE ID = @promptID
    `);
    stmt.run({promptID});
}

export const getCurrentSystemPrompt = ({promptID}) => {


    const stmt = db.prepare(`
      SELECT prompt FROM systemPrompt WHERE ID = @promptID
    `).get({promptID});

    const {prompt} = stmt;
    return prompt;
}