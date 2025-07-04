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

        // Use db.serialize para garantir que as operações de inicialização ocorram em ordem.
        db.serialize(() => {
            // 1. Cria a tabela de usuários
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT,
                profile TEXT,
                name TEXT
            )`, (err) => {
                if (err) {
                    console.error('Erro ao criar tabela users:', err.message);
                    return;
                }
                console.log('Tabela users criada/verificada.');

                // Funções para criptografar senhas (fora do insertUserIfNotExists para evitar recalculo)
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
                insertUserIfNotExists('sargento', hashedPasswordSargento, 'Sargento', ' Sgt Capellari');
                insertUserIfNotExists('aluno', hashedPasswordAluno, 'Aluno', 'Castro');
                insertUserIfNotExists('instrutor', hashedPasswordInstrutor, 'Instrutor', 'Pedro');
                insertUserIfNotExists('sens', hashedPasswordSens, 'SENS', 'Ana SENS');

                // 2. Cria a tabela de elogios (APÓS a tabela users)
                db.run(`CREATE TABLE IF NOT EXISTS elogios (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    alunoId INTEGER,
                    sargentoId INTEGER,
                    sargentoNome TEXT,
                    descricao TEXT,
                    data TEXT DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (alunoId) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (sargentoId) REFERENCES users(id) ON DELETE CASCADE
                )`, (err) => {
                    if (err) {
                        console.error('Erro ao criar tabela elogios:', err.message);
                    } else {
                        console.log('Tabela elogios criada/verificada.');
                    }
                });

                // 3. Adicione este bloco para listar todos os usuários após as inserções
                // Um pequeno atraso é necessário para garantir que as inserções assíncronas terminaram
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
                }, 1500); // Aumentei um pouco mais para garantir as inserções
            });
        }
        ); // Fim do db.serialize
    }
});

// Rota de Login
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err) {
            console.error('Erro no DB durante login:', err.message);
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
            console.error('Erro no DB durante /auth/me:', err.message);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
        if (!user) {
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

// NOVO: Rota para listar todos os alunos (para ElogiosSargentoPage)
app.get('/api/alunos', (req, res) => {
    db.all(`SELECT id, username, name AS nome, 'ID_FUNC_' || id AS idFunc, profile FROM users WHERE profile = 'Aluno'`, [], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar alunos:', err.message);
            return res.status(500).json({ message: 'Erro interno do servidor ao buscar alunos.' });
        }
        const alunosData = rows.map(row => ({
            id: row.id,
            nome: row.nome,
            idFunc: row.idFunc // ID funcional simulado
        }));
        res.status(200).json({ alunos: alunosData });
    });
});

// NOVO: Rota para buscar elogios de um aluno específico
app.get('/api/elogios/:alunoId', (req, res) => {
    const { alunoId } = req.params;

    db.all(`SELECT id, alunoId, sargentoId, sargentoNome, descricao, data FROM elogios WHERE alunoId = ? ORDER BY data DESC`, [alunoId], (err, rows) => {
        if (err) {
            console.error(`Erro ao buscar elogios para aluno ${alunoId}:`, err.message);
            return res.status(500).json({ message: 'Erro interno do servidor ao buscar elogios.' });
        }
        res.status(200).json({ elogios: rows });
    });
});

// NOVO: Rota para adicionar um novo elogio
app.post('/api/elogios', (req, res) => {
    const { alunoId, descricao, sargentoId, sargentoNome } = req.body;

    if (!alunoId || !descricao || !sargentoId || !sargentoNome) {
        return res.status(400).json({ message: 'Dados incompletos para o elogio.' });
    }

    db.run(`INSERT INTO elogios (alunoId, sargentoId, sargentoNome, descricao) VALUES (?, ?, ?, ?)`,
        [alunoId, sargentoId, sargentoNome, descricao],
        function(err) {
            if (err) {
                console.error('Erro ao adicionar elogio:', err.message);
                return res.status(500).json({ message: 'Erro interno do servidor ao adicionar elogio.' });
            }
            res.status(201).json({
                message: 'Elogio adicionado com sucesso!',
                elogioId: this.lastID
            });
        }
    );
});


// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Backend rodando em http://localhost:${PORT}`);
});