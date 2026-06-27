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
    const user = db.prepare("SELECT * FROM users WHERE userId = ?").get(userId);

    if (!user) {
        db.prepare(`
            INSERT INTO users (userId, balance, bank, inventory)
            VALUES (?, 0, 0, '[]')
        `).run(userId);
    }
}

function getUser(userId) {
    createUser(userId);
    return db.prepare("SELECT * FROM users WHERE userId = ?").get(userId);
}

function addMoney(userId, amount) {
    createUser(userId);

    db.prepare(`
        UPDATE users
        SET balance = balance + ?
        WHERE userId = ?
    `).run(amount, userId);
}

function removeMoney(userId, amount) {
    createUser(userId);

    db.prepare(`
        UPDATE users
        SET balance = MAX(balance - ?, 0)
        WHERE userId = ?
    `).run(amount, userId);
}

function setMoney(userId, amount) {
    createUser(userId);

    db.prepare(`
        UPDATE users
        SET balance = ?
        WHERE userId = ?
    `).run(amount, userId);
}

module.exports = {
    getUser,
    addMoney,
    removeMoney,
    setMoney,
    db
};
