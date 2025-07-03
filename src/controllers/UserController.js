const UserService = require('../services/UserService');
const User = require('../models/User');

class UserController {
    // HTTP Controller methods
    static async initializeTable(req, res) {
        try {
            await UserService.createTable();
            res.json({ message: 'Database tablosu başarıyla oluşturuldu' });
        } catch (error) {
            console.error('Database başlatma hatası:', error);
            res.status(500).json({ error: 'Database başlatma hatası' });
        }
    }

    static async getAllUsers(req, res) {
        try {
            const users = await UserService.findAll();
            res.json(users);
        } catch (error) {
            console.error('Kullanıcı listesi hatası:', error);
            res.status(500).json({ error: 'Kullanıcı listesi alınamadı' });
        }
    }

    static async getUserById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const user = await UserService.findById(id);
            
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
            const validationErrors = UserService.validateUserData(userData);
            if (validationErrors.length > 0) {
                return res.status(400).json({ error: `Validation error: ${validationErrors.join(', ')}` });
            }

            const newUser = await UserService.create(userData);
            res.status(201).json(newUser);
        } catch (error) {
            console.error('Kullanıcı oluşturma hatası:', error);
            if (error.message.includes('TC kimlik numarası zaten kullanımda')) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Kullanıcı oluşturulamadı' });
            }
        }
    }

    static async updateUser(req, res) {
        try {
            const id = parseInt(req.params.id);
            const userData = req.body;
            
            // Validation
            const validationErrors = UserService.validateUserData(userData);
            if (validationErrors.length > 0) {
                return res.status(400).json({ error: `Validation error: ${validationErrors.join(', ')}` });
            }
            
            const updatedUser = await UserService.update(id, userData);
            if (!updatedUser) {
                return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
            }
            res.json(updatedUser);
        } catch (error) {
            console.error('Kullanıcı güncelleme hatası:', error);
            if (error.message.includes('TC kimlik numarası değiştirilemez')) {
                res.status(400).json({ error: error.message });
            } else if (error.message.includes('Kullanıcı bulunamadı')) {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Kullanıcı güncellenemedi' });
            }
        }
    }

    static async deleteUser(req, res) {
        try {
            const id = parseInt(req.params.id);
            const deletedUser = await UserService.delete(id);
            
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