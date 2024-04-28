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
        keyFeatures TEXT,
        FOREIGN KEY (UCID) REFERENCES useCase(ID)
    )`).run();

    // Interaction table
    db.prepare(`CREATE TABLE IF NOT EXISTS interaction (
        ID INTEGER PRIMARY KEY,
        testID INTEGER,
        human TEXT,
        ai TEXT,
        pertinence INTEGER,
        chosenPromptID INTEGER,
        excludedPromptIDs TEXT,
        FOREIGN KEY (testID) REFERENCES test(ID),
        FOREIGN KEY (chosenPromptID) REFERENCES systemPrompt(ID)
    )`).run();

    // Test table
    db.prepare(`CREATE TABLE IF NOT EXISTS test (
        ID INTEGER PRIMARY KEY,
        loadingTime TEXT,
        model TEXT,
        withTranslation BOOLEAN,
        timestamp DATETIME
    )`).run();

    // Close the database connection
    db.close();
}
//functions for deleting content from tables
const deleteSystemPromptTableContent = () => {
    const db = new Database('database.db', { verbose: console.log });
    db.prepare(`DELETE FROM systemPrompt`).run();
    db.close();
}

const deleteUseCaseTableContent = () => {
    const db = new Database('database.db', { verbose: console.log });
    db.prepare(`DELETE FROM useCase`).run();
    db.close();

}

const deleteInteractionTableContent = () => {
    const db = new Database('database.db', { verbose: console.log });
    db.prepare(`DELETE FROM interaction`).run();
    db.close();

}

const deleteTestTableContent = () => {
    const db = new Database('database.db', { verbose: console.log });
    db.prepare(`DELETE FROM test`).run();
    db.close();


}




// Run the function to create the database
//deleteInteractionTableContent();
//deleteTestTableContent();
//createDatabase()
