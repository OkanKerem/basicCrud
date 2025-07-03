// User Model - Sadece veri yapısı
class User {
    constructor(data) {
        this.id = data.id;
        this.isim = data.isim;
        this.yas = data.yas;
        this.tc = data.tc;
    }

    // Validation methods
    static validate(userData) {
        const errors = [];
        
        if (!userData.isim || userData.isim.trim().length === 0) {
            errors.push('İsim alanı zorunludur');
        }
        
        if (!userData.yas || userData.yas < 0 || userData.yas > 150) {
            errors.push('Yaş 0-150 arasında olmalıdır');
        }
        
        if (!userData.tc || userData.tc.length !== 11) {
            errors.push('TC kimlik numarası 11 haneli olmalıdır');
        }
        
        return errors;
    }

    // Create user instance from database row
    static fromDatabaseRow(row) {
        return new User({
            id: row.id,
            isim: row.isim,
            yas: row.yas,
            tc: row.tc
        });
    }

    // Convert to plain object
    toJSON() {
        return {
            id: this.id,
            isim: this.isim,
            yas: this.yas,
            tc: this.tc
        };
    }
}

module.exports = User; 