const sql = require('better-sqlite3');
const db = sql('tests.db');

const initialPrompt ="You are a helpful assistant, please answer this question being respectful. Provide always concise responses"

const createDB = () => {
    db.prepare(`
   CREATE TABLE system_prompt(
        ID INTEGER PRIMARY KEY,
        prompt TEXT,
        categoryID INTEGER,
        isSelected INTEGER,
        FOREIGN KEY (categoryID) REFERENCES category(ID),
        UNIQUE(prompt, categoryID)
    );

`).run();

    db.prepare(`
 CREATE TABLE test(
        ID INTEGER PRIMARY KEY,
        question TEXT,
        answer TEXT,
        promptID INTEGER,
        pertinenceIndicator INTEGER,
        loadingTime INTEGER,
        model TEXT,
        UNIQUE(question, answer, promptID),
        FOREIGN KEY (promptID) REFERENCES system_prompt(ID)
    );

`).run();

    db.prepare(`
    CREATE TABLE category(
        ID INTEGER PRIMARY KEY,
        name TEXT UNIQUE
    );
`).run();
}


async function initData() {

    db.prepare(`
        INSERT INTO category VALUES (
            @ID,
            @name
        )
    `).run({ID:1, name: "General"});


    db.prepare(`
      INSERT INTO system_prompt VALUES (
         null,
         @prompt,
         @categoryID,
         @isSelected
      )
   `).run({prompt: initialPrompt, categoryID: 1, isSelected: 1});


}


(async()=>{

    //await initData();



    //delete all the content int test table and modify its pertinenceIndicator to be INTEGER with no CHECKS
    db.prepare(`
        DELETE FROM system_prompt
    `).run();

    /*db.prepare(`
        ALTER TABLE test
        RENAME TO test_old_1
    `).run();

    db.prepare(`
        CREATE TABLE test (
            id INTEGER PRIMARY KEY,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            pertinenceIndicator INTEGER,
            promptID INTEGER NOT NULL,
            model TEXT NOT NULL,
            loadingTime INTEGER NOT NULL,
            FOREIGN KEY (promptID) REFERENCES system_prompt(id)
        )
    `).run();
*/
    const res = db.prepare(`
        SELECT * FROM test
    `).all();

    console.log({res});

    const res1 = db.prepare(`
        SELECT * FROM system_prompt
    `).all();

    console.log({res1});

    const res2 = db.prepare(`
        SELECT * FROM category
    `).all();

    console.log({res2});

})();