// Script para promover un usuario a Administrador
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');

const makeAdmin = async () => {
    const email = process.argv[2];

    if (!email) {
        console.error('Por favor, proporciona el correo electrónico del usuario.');
        console.log('Uso: node makeAdmin.js correo@ejemplo.com');
        process.exit(1);
    }

    try {
        // Conectar a MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a MongoDB (' + process.env.MONGODB_URI.split('@')[1] + ')');

        // Buscar al usuario
        const user = await User.findOne({ email });

        if (!user) {
            console.error('❌ Usuario no encontrado con el correo:', email);
            process.exit(1);
        }

        // Actualizar el rol
        user.role = 'admin';
        await user.save();

        console.log('🎉 ¡Éxito! El usuario', email, 'ahora es ADMINISTRADOR.');
        console.log('Por favor, cierra sesión en tu dashboard de Vercel y vuelve a ingresar para ver la vista de Admin.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error al actualizar el usuario:', error);
        process.exit(1);
    }
};

makeAdmin();
