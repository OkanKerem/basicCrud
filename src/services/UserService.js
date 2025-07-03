const User = require('../models/User');
const pool = require('../database');

class UserService {
    // Business logic methods
    static validateUserData(userData) {
        return User.validate(userData);
    }

    static createUserInstance(data) {
        return new User(data);
    }

    static formatUserResponse(user) {
        return user.toJSON();
    }

    // Database operations with business logic
    static async createTable() {
        try {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    isim CHAR(99) NOT NULL,
                    yas INTEGER NOT NULL,
                    tc CHAR(11) UNIQUE NOT NULL
                );
            `);
            console.log('Users tablosu oluşturuldu');
            return true;
        } catch (error) {
            console.error('Tablo oluşturma hatası:', error);
            throw error;
        }
    }

    static async findAll() {
        try {
            const result = await pool.query('SELECT * FROM users ORDER BY id');
            return result.rows.map(row => User.fromDatabaseRow(row));
        } catch (error) {
            console.error('Kullanıcıları getirme hatası:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
            return result.rows[0] ? User.fromDatabaseRow(result.rows[0]) : null;
        } catch (error) {
            console.error('Kullanıcı getirme hatası:', error);
            throw error;
        }
    }

    static async create(userData) {
        try {
            // Business logic: TC kontrolü
            const existingUser = await pool.query('SELECT id FROM users WHERE tc = $1', [userData.tc]);
            if (existingUser.rows.length > 0) {
                throw new Error('Bu TC kimlik numarası zaten kullanımda');
            }

            const { isim, yas, tc } = userData;
            const result = await pool.query(
                'INSERT INTO users (isim, yas, tc) VALUES ($1, $2, $3) RETURNING *',
                [isim, yas, tc]
            );
            return User.fromDatabaseRow(result.rows[0]);
        } catch (error) {
            console.error('Kullanıcı oluşturma hatası:', error);
            throw error;
        }
    }

    static async update(id, userData) {
        try {
            // Business logic: TC değişikliği kontrolü
            const currentUser = await pool.query('SELECT tc FROM users WHERE id = $1', [id]);
            if (currentUser.rows.length === 0) {
                throw new Error('Kullanıcı bulunamadı');
            }

            const currentTc = currentUser.rows[0].tc;
            if (currentTc !== userData.tc) {
                throw new Error('TC kimlik numarası değiştirilemez');
            }

            const { isim, yas, tc } = userData;
            const result = await pool.query(
                'UPDATE users SET isim = $1, yas = $2 WHERE id = $3 RETURNING *',
                [isim, yas, id]
            );
            return result.rows[0] ? User.fromDatabaseRow(result.rows[0]) : null;
        } catch (error) {
            console.error('Kullanıcı güncelleme hatası:', error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            const result = await pool.query(
                'DELETE FROM users WHERE id = $1 RETURNING *',
                [id]
            );
            return result.rows[0] ? User.fromDatabaseRow(result.rows[0]) : null;
        } catch (error) {
            console.error('Kullanıcı silme hatası:', error);
            throw error;
        }
    }
}

module.exports = UserService; 