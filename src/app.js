const express = require("express")
const pool = require("./database")
const UserController = require("./controllers/UserController")
const port = 3000

const app = express();
app.use(express.json())

console.log('Server başlatılıyor...')

console.log('Database bağlantı ayarları:')
console.log('  Host: db')
console.log('  Port: 5432')
console.log('  User: postgres')
console.log('  Database: postgres')

// Routes
app.get('/', UserController.initializeTable);
app.get('/users', UserController.getAllUsers);
app.get('/user/:id', UserController.getUserById);
app.post('/insert', UserController.createUser);
app.put('/users/:id', UserController.updateUser);
app.delete('/delete/:id', UserController.deleteUser);

// Root endpoint


// 404 handler


// Server başlat

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
    console.log(`Docker PostgreSQL bağlantısı kuruluyor...`)
})

