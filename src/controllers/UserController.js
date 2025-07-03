const UserService = require('../services/UserService');
const pool = require('../config/database');
const User = require('../models/User');

class UserController {
    // Repository methods (Database operations)
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

    // HTTP Controller methods
    static async initializeTable(req, res) {
        try {
            await UserController.createTable();
            res.json({ message: 'Database tablosu başarıyla oluşturuldu' });
        } catch (error) {
            console.error('Database başlatma hatası:', error);
            res.status(500).json({ error: 'Database başlatma hatası' });
        }
    }

    static async getAllUsers(req, res) {
        try {
            const users = await UserController.findAll();
            res.json(users);
        } catch (error) {
            console.error('Kullanıcı listesi hatası:', error);
            res.status(500).json({ error: 'Kullanıcı listesi alınamadı' });
        }
    }

    static async getUserById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const user = await UserController.findById(id);
            
            if (!user) {
                return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
            }
            
            res.json(user);
        } catch (error) {
            console.error('Kullanıcı getirme hatası:', error);
            res.status(500).json({ error: 'Kullanıcı getirilemedi' });
        }
    }

    static async createUser(req, res) {
        try {
            const userData = req.body;
            
            // Validation
            const validationErrors = User.validate(userData);
            if (validationErrors.length > 0) {
                return res.status(400).json({ error: `Validation error: ${validationErrors.join(', ')}` });
            }

            const newUser = await UserController.create(userData);
            res.status(201).json(newUser);
        } catch (error) {
            console.error('Kullanıcı oluşturma hatası:', error);
            res.status(500).json({ error: 'Kullanıcı oluşturulamadı' });
        }
    }

    static async updateUser(req, res) {
        try {
            const id = parseInt(req.params.id);
            const userData = req.body;
            
            // Validation
            const validationErrors = User.validate(userData);
            if (validationErrors.length > 0) {
                return res.status(400).json({ error: `Validation error: ${validationErrors.join(', ')}` });
            }
            
            const updatedUser = await UserController.update(id, userData);
            if (!updatedUser) {
                return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
            }
            res.json(updatedUser);
        } catch (error) {
            console.error('Kullanıcı güncelleme hatası:', error);
            res.status(500).json({ error: 'Kullanıcı güncellenemedi' });
        }
    }

    static async deleteUser(req, res) {
        try {
            const id = parseInt(req.params.id);
            const deletedUser = await UserController.delete(id);
            
            if (!deletedUser) {
                return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
            }
            
            res.json({ message: 'Kullanıcı başarıyla silindi', user: deletedUser });
        } catch (error) {
            console.error('Kullanıcı silme hatası:', error);
            res.status(500).json({ error: 'Kullanıcı silinemedi' });
        }
    }
}

module.exports = UserController; 