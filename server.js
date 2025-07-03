const express = require("express")
const pool = require("./db")
const port = 3000

const app = express();
app.use(express.json())

console.log('Server başlatılıyor...')

console.log('Database bağlantı ayarları:')
console.log('  Host: db')
console.log('  Port: 5432')
console.log('  User: 123')
console.log('  Database: db1')

// Root endpoint
app.get("/",  async (req, res) => {
     console.log('Root endpoint çağrıldı')
     try {
        await pool.query('DROP TABLE IF EXISTS users')
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                isim CHAR(99) NOT NULL,
                yas INTEGER NOT NULL,
                tc CHAR(11) UNIQUE NOT NULL
            );
        `);
        console.log('Tablo oluşturuldu')
        res.send("Table created");
    } catch (err) {
        console.error('Root endpoint hatası:', err.message)
        res.status(500).send("Database error: " + err.message)
    }
});

// Create users table if not exists
app.get("/setup",  async (req, res)=> {
    try {
        await pool.query('DROP TABLE IF EXISTS users')
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                isim CHAR(99) NOT NULL,
                yas INTEGER NOT NULL,
                tc CHAR(11) UNIQUE NOT NULL
            );
        `);
        res.send("Table created");
    } catch (err) {
        console.error(err)
        res.status(500).send("çavo")
    }
});

// Insert user
app.post("/insert", async (req, res) => {
    const { isim, yas, tc } = req.body;
    console.log('Insert işlemi başladı:')
    console.log('İsim:', isim)
    console.log('Yaş:', yas)
    console.log('TC:', tc)
    
    try {
        await pool.query(
            "INSERT INTO users (isim, yas, tc) VALUES ($1, $2, $3)",
            [isim, yas, tc]
        )
        console.log('Kullanıcı eklendi')
        res.send("User inserted")
    } catch (err) {
        console.error('Insert hatası:', err.message)
        res.status(500).send("Error inserting user: " + err.message)
    }
});

// Get user by ID
app.get("/users/:id", async (req, res) => {
    const { id } = req.params;
    console.log('Kullanıcı aranıyor, ID:', id)
    
    try {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        
        if (result.rows.length === 0) {
            console.log('Kullanıcı bulunamadı')
            return res.status(404).json({ error: "Kullanıcı bulunamadı" });
        }
        
        console.log('Kullanıcı bulundu:', result.rows[0].isim)
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Kullanıcı getirme hatası:', err.message)
        res.status(500).send("Error getting user: " + err.message)
    }
});

// Update user - TC değişirse hata ver
app.put("/update/:id", async (req, res) => {
    const { id } = req.params;
    const { isim, yas, tc } = req.body;
    
    console.log('Update işlemi başladı:')
    console.log('ID:', id)
    console.log('Yeni isim:', isim)
    console.log('Yeni yaş:', yas)
    console.log('Yeni TC:', tc)
    
    try {
        console.log('Mevcut kullanıcı aranıyor')
       
        const currentUser = await pool.query(
            "SELECT tc FROM users WHERE id = $1",
            [id]
        );
        
        
        if (currentUser.rows.length === 0) {
            console.log('Kullanıcı bulunamadı!')
            return res.status(404).send("User not found");
        }
        
        const currentTc = currentUser.rows[0].tc;
        console.log('Mevcut TC:', currentTc)
        console.log('Yeni TC:', tc)
        console.log('TCler:', currentTc === tc ? 'Aynı' : 'Farklı')
        
        if (currentTc !== tc) {
            console.log('TC değiştirme')
            return res.status(400).send("TC kimlik numarası değiştirilemez!");
        }
        
        console.log('TC aynı, güncelleme yapılıyor...')
        // TC değişmemişse güncelle
        await pool.query(
            "UPDATE users SET isim = $1, yas = $2 WHERE id = $3",
            [isim, yas, id]
        );
        
        console.log('Güncelleme başarılı!')
        res.send("User updated successfully");
    } catch (err) {
        console.error('Update hatası:', err.message)
        console.error('Hata detayı:', err)
        res.status(500).send("Error updating user: " + err.message)
    }
});

// ID ile kullanıcı siliyom
app.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    
    console.log('Delete işlemi başladı:')
    console.log('ID:', id)
    
    try {
        console.log('Kullanıcı aranıyor...')
        
        // Önce kullanıcının var olup olmadığını kontrol et
        const user = await pool.query(
            "SELECT * FROM users WHERE id = $1",
            [id]
        );
        
        if (user.rows.length === 0) {
            console.log('Kullanıcı bulunamadı!')
            return res.status(404).json({ error: "User not found"});
        }
        
        console.log('Kullanıcı:', user.rows[0].isim)
        console.log('Siliyom')
        
        // Kullanıcıyı sil
        await pool.query(
            "DELETE FROM users WHERE id = $1",
            [id]
        );
        
        console.log('Sildim')
        res.json({ message: "User deleted", deletedUser: user.rows[0] });
        
    } catch (err) {
        console.error('Delete hatası:', err.message)
        console.error('Hata detayı:', err)
        res.status(500).send("Error deleting user: " + err.message)
    }
});

// Get all users (JSON format)
app.get("/users", async (req, res) => {
    console.log('Tüm kullanıcılar getiriliyor')
    try {
        const result = await pool.query("SELECT * FROM users ORDER BY id");
        console.log('Kullanıcı sayısı:', result.rows.length)
        res.json(result.rows);
    } catch (err) {
        console.error('Kullanıcı listesi hatası:', err.message)
        res.status(500).send("Error getting users: " + err.message)
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
    console.log(`Docker PostgreSQL bağlantısı kuruluyor...`)
})

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
    console.log(`Docker PostgreSQL bağlantısı kuruluyor...`)
})
