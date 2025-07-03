// backend/server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Para criptografar senhas

const app = express();
const PORT = 3000; // Porta do seu backend

// Middlewares
app.use(cors()); // Permite requisições de origens diferentes (seu frontend)
app.use(express.json()); // Permite que o Express leia JSON no corpo das requisições

// Configuração do Banco de Dados SQLite
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
        // Cria a tabela de usuários se ela não existir
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            profile TEXT,
            name TEXT
        )`, (err) => { // Callback para garantir que a tabela foi criada antes de inserir
            if (err) {
                console.error('Erro ao criar tabela users:', err.message);
                return;
            }

            // Funções para criptografar senhas
            const hashedPasswordSargento = bcrypt.hashSync('senha123', 8);
            const hashedPasswordAluno = bcrypt.hashSync('aluno123', 8);
            const hashedPasswordInstrutor = bcrypt.hashSync('instrutor123', 8);
            const hashedPasswordSens = bcrypt.hashSync('sens123', 8);

            // Função auxiliar para inserir usuário se não existir
            const insertUserIfNotExists = (username, hashedPassword, profile, name) => {
                db.get(`SELECT username FROM users WHERE username = ?`, [username], (err, row) => {
                    if (err) {
                        console.error(`Erro ao verificar usuário ${username}:`, err.message);
                        return;
                    }
                    if (!row) { // Se o usuário NÃO foi encontrado, insere
                        db.run(`INSERT INTO users (username, password, profile, name) VALUES (?, ?, ?, ?)`,
                            [username, hashedPassword, profile, name],
                            function(err) {
                                if (err) {
                                    console.error(`Erro ao criar usuário ${username}:`, err.message);
                                } else {
                                    console.log(`Usuário ${username} criado com ID: ${this.lastID}`);
                                }
                            }
                        );
                    } else {
                        console.log(`Usuário ${username} já existe.`);
                    }
                });
            };

            // Chame a função para cada usuário que deseja criar
            insertUserIfNotExists('sargento', hashedPasswordSargento, 'Sargento', 'João Sargento');
            insertUserIfNotExists('aluno', hashedPasswordAluno, 'Aluno', 'Maria');
            insertUserIfNotExists('instrutor', hashedPasswordInstrutor, 'Instrutor', 'Pedro Instrutor');
            insertUserIfNotExists('sens', hashedPasswordSens, 'SENS', 'Ana SENS');

            // **ADICIONE ESTE BLOCO PARA LISTAR TODOS OS USUÁRIOS APÓS A CRIAÇÃO**
            // Um pequeno atraso é necessário porque as inserções são assíncronas e podem não ter terminado imediatamente
            setTimeout(() => {
                db.all(`SELECT id, username, profile, name FROM users`, [], (err, rows) => {
                    if (err) {
                        console.error('Erro ao listar usuários:', err.message);
                        return;
                    }
                    console.log('\n--- Usuários no Banco de Dados ---');
                    if (rows.length === 0) {
                        console.log('Nenhum usuário encontrado.');
                    } else {
                        rows.forEach(row => {
                            console.log(`ID: ${row.id}, Username: ${row.username}, Perfil: ${row.profile}, Nome: ${row.name}`);
                        });
                    }
                    console.log('----------------------------------\n');
                });
            }, 1000); // Aumentei para 1 segundo para garantir que as inserções terminem
        });
    }
});

// Rota de Login
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err) {
            console.error('Erro no DB durante login:', err.message); // Log mais detalhado
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
        if (!user) {
            return res.status(400).json({ message: 'Usuário não encontrado.' });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(400).json({ message: 'Senha inválida.' });
        }

        res.status(200).json({
            message: 'Login bem-sucedido!',
            token: 'fake-jwt-token-para-' + user.username,
            user: {
                id: user.id,
                username: user.username,
                profile: user.profile,
                nome: user.name
            }
        });
    });
});

// Rota para validar token (usada pelo AuthContext para manter o usuário logado)
app.get('/api/auth/me', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    let usernameFromToken = 'desconhecido';
    if (token.includes('sargento')) usernameFromToken = 'sargento';
    else if (token.includes('aluno')) usernameFromToken = 'aluno';
    else if (token.includes('instrutor')) usernameFromToken = 'instrutor';
    else if (token.includes('sens')) usernameFromToken = 'sens';
    else {
        return res.status(401).json({ message: 'Token com formato desconhecido.' });
    }

    db.get(`SELECT * FROM users WHERE username = ?`, [usernameFromToken], (err, user) => {
        if (err) {
            console.error('Erro no DB durante /auth/me:', err.message); // Log mais detalhado
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
        if (!user) {
            // Isso pode acontecer se o token é válido mas o usuário foi deletado depois
            return res.status(401).json({ message: 'Token válido, mas usuário não encontrado no BD.' });
        }
        res.status(200).json({
            user: {
                id: user.id,
                username: user.username,
                profile: user.profile,
                nome: user.name
            }
        });
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Backend rodando em http://localhost:${PORT}`);
});