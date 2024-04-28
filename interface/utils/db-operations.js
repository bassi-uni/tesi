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
export const newSystemPrompt = (prompt, useCase, keyFeatures) => {

    const prompts = getAllSystemPrompts();
    const UCs = getAllUCs();

    console.log({prompts, UCs, prompt, useCase})

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
             @UCID,
             @keyFeatures     
          )
        `);
        stmt.run({prompt, UCID,isSelected:0, keyFeatures});
    }


    return db.prepare(`
        SELECT ID FROM systemPrompt WHERE prompt = @prompt
    `).get({prompt}).ID;
}

function addInteraction(interaction, testID) {
    const {human, ai, pertinence, chosenPromptID, excludedPromptIDs} = interaction;

    db.prepare(`
            INSERT INTO interaction VALUES (
                null,
                @testID,
                @human,
                @ai,
                @pertinence,
                @chosenPromptID,
                @excludedPromptIDs
            )
        `).run({
        testID,
        human,
        ai,
        chosenPromptID,
        pertinence,
        excludedPromptIDs: excludedPromptIDs.join(',')
    });
}

export const addTestRecord = ({interactions, pertinence, promptID, loadingTime, model, withTranslation}) => {
    const info = db.prepare(`
        INSERT INTO test VALUES (
            null,
            @loadingTime,
            @model,
            @withTranslation,
            @timestamp
        )
    `).run({
        loadingTime,
        model,
        withTranslation,
        timestamp: new Date().toISOString()
    })

    const testID = info.lastInsertRowid;

    console.log({testID})

    for (const interaction of interactions){
        addInteraction(interaction, testID);
    }
}

export const deletePromptByID = (promptID) => {
    //TODO: se era isSelected, selezionare un altro prompt come isSelected

    const prompt = getPromptByID({promptID});

    const {isSelected } = prompt;

    const stmt = db.prepare(`
      DELETE FROM systemPrompt WHERE ID = @promptID
    `);

    const res = stmt.run({promptID});

    if(isSelected){
        const stmt2 = db.prepare(`
            SELECT ID FROM systemPrompt WHERE UCID = @UCID LIMIT 1
        `).get({UCID: prompt.UCID});

        if(!stmt2){
            return;
        }

        const newPromptID = stmt2.ID;
        const stmt3 = db.prepare(`
            UPDATE systemPrompt SET isSelected = TRUE WHERE ID = @newPromptID
        `).run({newPromptID});
    }
    
}

export const setIsSelected = ({promptID, isSelected}) => {
    console.log({promptID, isSelected})
    const stmt = db.prepare(`
        UPDATE systemPrompt SET isSelected = @isSelected WHERE ID = @promptID
    `).run({promptID, isSelected:isSelected ? 1 : 0});
}

export const getPromptByID = ({promptID}) => {


    const stmt = db.prepare(`
      SELECT prompt FROM systemPrompt WHERE ID = @promptID
    `).get({promptID});

    const {prompt} = stmt;
    return prompt;
}

