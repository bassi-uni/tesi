const Database = require('better-sqlite3');

function createDatabase() {
    // Create a new database instance. If the file does not exist, it will be created.
    const db = new Database('database.db', { verbose: console.log });

    // UseCase table
    db.prepare(`CREATE TABLE IF NOT EXISTS useCase (
        ID INTEGER PRIMARY KEY,
        name TEXT UNIQUE NOT NULL
    )`).run();

    // SystemPrompt table
    db.prepare(`CREATE TABLE IF NOT EXISTS systemPrompt (
        ID INTEGER PRIMARY KEY,
        prompt TEXT UNIQUE NOT NULL,
        isSelected BOOLEAN NOT NULL,
        UCID INTEGER,
        FOREIGN KEY (UCID) REFERENCES useCase(ID)
    )`).run();

    // Interaction table
    db.prepare(`CREATE TABLE IF NOT EXISTS interaction (
        ID INTEGER PRIMARY KEY,
        testID INTEGER,
        interaction TEXT,
        FOREIGN KEY (testID) REFERENCES test(ID)
    )`).run();

    // Test table
    db.prepare(`CREATE TABLE IF NOT EXISTS test (
        ID INTEGER PRIMARY KEY,
        promptID INTEGER,
        pertinence INTEGER,
        loadingTime TEXT,
        model TEXT,
        withTranslation BOOLEAN,
        timestamp DATETIME,
        FOREIGN KEY (promptID) REFERENCES systemPrompt(ID)
     
    )`).run();

    // Close the database connection
    db.close();
}

const deleteSystemPromptTableContent = () => {
    const db = new Database('database.db', { verbose: console.log });
    db.prepare(`DELETE FROM systemPrompt`).run();
    db.close();
}

// Run the function to create the database
//createDatabase();
deleteSystemPromptTableContent()