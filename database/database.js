const Database = require("better-sqlite3");

const db = new Database("database/economy.db");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
    userId TEXT PRIMARY KEY,
    balance INTEGER DEFAULT 0,
    bank INTEGER DEFAULT 0,
    inventory TEXT DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS cooldowns (
    userId TEXT,
    command TEXT,
    expires INTEGER,
    PRIMARY KEY(userId, command)
);
`);

function createUser(userId) {

    const exists = db.prepare(
        "SELECT userId FROM users WHERE userId = ?"
    ).get(userId);

    if (!exists) {

        db.prepare(`
            INSERT INTO users (userId)
            VALUES (?)
        `).run(userId);

    }

}

function getUser(userId) {

    createUser(userId);

    return db.prepare(`
        SELECT *
        FROM users
        WHERE userId = ?
    `).get(userId);

}

function setBalance(userId, amount) {

    createUser(userId);

    db.prepare(`
        UPDATE users
        SET balance = ?
        WHERE userId = ?
    `).run(amount, userId);

}

function addBalance(userId, amount) {

    createUser(userId);

    db.prepare(`
        UPDATE users
        SET balance = balance + ?
        WHERE userId = ?
    `).run(amount, userId);

}

module.exports = {
    db,
    getUser,
    addBalance,
    setBalance
};
