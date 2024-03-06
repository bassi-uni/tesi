
const sql = require('better-sqlite3');
const db = sql('tests.db');



export const getCurrentSystemPrompt = ({promptID}) => {


    const stmt = db.prepare(`
      SELECT prompt FROM system_prompt WHERE ID = @promptID
    `).get({promptID});

    const {prompt} = stmt;
    return prompt;
}

export const newSystemPrompt = (prompt, category) => {

    const prompts = getAllSystemPrompts();
    const categories = getAllCategories();

   /**
     * This block of code checks if the provided category exists in the categories array.
     * If the category does not exist, it prepares a SQL statement to insert a new category into the 'category' table.
     * The new category has a null ID (which will be auto-incremented by the database) and the provided category name.
     * After preparing the statement, it executes the statement with the provided category as a parameter.
     *
     */
    if(!categories.some(c => c.name === category)){
        // Prepare SQL statement to insert a new category
        createCategory(category)
    }

    console.log({prompt, category})

    const categoryID = db.prepare(`
        SELECT ID FROM category WHERE name = @category
    `).get({category}).ID;


    if(!prompts.some(p => p.prompt === prompt && p.categoryID === categoryID)){
        const stmt = db.prepare(`
          INSERT INTO system_prompt VALUES (
             null,
             @prompt,
             @categoryID,
             null
          
          )
        `);
        stmt.run({prompt, categoryID});
    }

    //set as selected the new prompt and unselect the previous one
    const stmt = db.prepare(`
      UPDATE system_prompt SET isSelected = FALSE WHERE categoryID = @categoryID
    `);
    stmt.run({categoryID});

    const stmt2 = db.prepare(`
      UPDATE system_prompt SET isSelected = TRUE WHERE prompt = @prompt
    `);
    stmt2.run({prompt});

    return db.prepare(`
        SELECT ID FROM system_prompt WHERE prompt = @prompt
    `).get({prompt}).ID;
}

export const addTestRecord = ({question, answer, pertinenceIndicator, promptID, loadingTime, model, withTranslation}) => {
    const stmt = db.prepare(`
      INSERT INTO test VALUES (
           null,
         @question,
         @answer,
         @promptID,
         @pertinenceIndicator,
         @loadingTime,
         @model,
         @withTranslation
      )
    `);
    stmt.run({question, answer, pertinenceIndicator, promptID, loadingTime, model, withTranslation});
}

export const getAllSystemPrompts = () => {
    const stmt = db.prepare(`
      SELECT * FROM system_prompt
    `);
    return stmt.all();
}

export const getAllCategories = (withActivePrompt) => {
    let stmt;
    if(withActivePrompt){
        stmt = db.prepare(`
      SELECT category.*, system_prompt.prompt, system_prompt.ID AS promptID
      FROM category INNER JOIN system_prompt ON category.ID = system_prompt.categoryID
      WHERE system_prompt.isSelected = TRUE
    `);
    }else{
        stmt = db.prepare(`
            SELECT * FROM category
    `);
    }

    return stmt.all();
}

export const getTestRecords = () => {
    const stmt = db.prepare(`
      SELECT * FROM tests
    `);
    return stmt.all();
}

export const createCategory = (name) => {
    const stmt = db.prepare(`
      INSERT INTO category VALUES (
         null,
         @name
      )
    `);
    stmt.run({name});
}

export const getPromptsByCategory = (categoryID) => {
    const stmt = db.prepare(`
      SELECT * FROM system_prompt WHERE categoryID = @categoryID
    `);
    return stmt.all({categoryID});
}

export const deletePromptByID = (promptID) => {
    const stmt = db.prepare(`
      DELETE FROM system_prompt WHERE ID = @promptID
    `);
    stmt.run({promptID});
}

//initData();

