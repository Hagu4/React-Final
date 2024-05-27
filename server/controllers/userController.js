const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function register(req, res) {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });

        const token = generateToken(user);
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Failed to register user' });
    }
}

async function login(req, res) {
    const { username, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        const token = generateToken(user);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Failed to login' });
    }
}

function generateToken(user) {
    return jwt.sign({ id: user.id,username: user.username }, 'your_secret_key', { expiresIn: '1h' });
}
async function updateUser(req, res) {
    const { username, newPassword } = req.body;
    const token = req.headers.authorization.split(' ')[1]; // Получаем токен из заголовка запроса

    try {
        // Расшифровываем токен, чтобы получить идентификатор пользователя
        const decodedToken = jwt.verify(token, 'your_secret_key');
        const userId = decodedToken.id;

        // Проверяем, существует ли пользователь с указанным ID
        const existingUser = await prisma.user.findUnique({ where: { id: userId } });
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Хэшируем новый пароль, если он был передан
        let updatedData = {};
        if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updatedData.password = hashedPassword;
        }

        // Обновляем данные пользователя
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { ...updatedData, username },
        });

        // Генерируем новый токен с данными о пользователе
        const newToken = generateToken(updatedUser);

        res.json({ token: newToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update user' });
    }
}


module.exports = { register, login, updateUser };
