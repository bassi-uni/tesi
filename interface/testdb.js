const sql = require('better-sqlite3');
const db = sql('tests.db');

const initialPrompt ="You are a helpful assistant, please answer this question being respectful. Provide always concise responses"


/*db.prepare(`
   CREATE TABLE IF NOT EXISTS system_prompt (
    id INTEGER PRIMARY KEY,
    prompt TEXT NOT NULL,
    categoryID INTEGER,
     isSelected BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (categoryID) REFERENCES category(id)
);
`).run();

db.prepare(`
 CREATE TABLE IF NOT EXISTS test (
    id INTEGER PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    pertinenceIndicator INTEGER,
    promptID INTEGER NOT NULL,
    FOREIGN KEY (promptID) REFERENCES system_prompt(id)
);
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS category (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
    );
`).run();*/

async function initData() {

    db.prepare(`
        INSERT INTO category VALUES (
            @id,
            @name
        )
    `).run({id:1, name: "General"});


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
        DELETE FROM test
    `).run();

    db.prepare(`
        ALTER TABLE test
        RENAME TO test_old
    `).run();

    db.prepare(`
        CREATE TABLE test (
            id INTEGER PRIMARY KEY,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            pertinenceIndicator INTEGER,
            promptID INTEGER NOT NULL,
            FOREIGN KEY (promptID) REFERENCES system_prompt(id)
        )
    `).run();

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