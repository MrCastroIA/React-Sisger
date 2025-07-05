// backend/server.js
const express = require('express');
require('dotenv').config();
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Para criptografar senhas

const app = express();
const PORT = 3000; // Porta do seu backend

// Middlewares
app.use(cors()); // Permite requisições de origens diferentes (seu frontend)
app.use(express.json()); // Permite que o Express leia JSON no corpo das requisições

const dbConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

dbConnection.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conexão com o MySQL estabelecida com sucesso!');
});


app.get('/api/alunoscompleta', (req, res) => {
  const query = 'SELECT * FROM aluno;';

  dbConnection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao executar a query:', err);
      // Envia uma resposta de erro para o frontend
      return res.status(500).json({ error: 'Erro ao buscar dados do banco.' });
    }
    // Envia os resultados (a lista de alunos) como JSON para o frontend
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});


// Configuração do Banco de Dados SQLite
// const db = new sqlite3.Database('./database.sqlite', (err) => {
//     if (err) {
//         console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
//     } else {
//         console.log('Conectado ao banco de dados SQLite.');

//         // Use db.serialize para garantir que as operações de inicialização ocorram em ordem.
//         db.serialize(() => {
//             // 1. Cria a tabela de usuários
//             db.run(`CREATE TABLE IF NOT EXISTS users (
//                 id INTEGER PRIMARY KEY AUTOINCREMENT,
//                 username TEXT UNIQUE,
//                 password TEXT,
//                 profile TEXT,
//                 name TEXT
//             )`, (err) => {
//                 if (err) {
//                     console.error('Erro ao criar tabela users:', err.message);
//                     return;
//                 }
//                 console.log('Tabela users criada/verificada.');

//                 // Funções para criptografar senhas (fora do insertUserIfNotExists para evitar recalculo)
//                 const hashedPasswordSargento = bcrypt.hashSync('senha123', 8);
//                 const hashedPasswordAluno = bcrypt.hashSync('aluno123', 8);
//                 const hashedPasswordInstrutor = bcrypt.hashSync('instrutor123', 8);
//                 const hashedPasswordSens = bcrypt.hashSync('sens123', 8);

//                 // Função auxiliar para inserir usuário se não existir
//                 const insertUserIfNotExists = (username, hashedPassword, profile, name) => {
//                     db.get(`SELECT username FROM users WHERE username = ?`, [username], (err, row) => {
//                         if (err) {
//                             console.error(`Erro ao verificar usuário ${username}:`, err.message);
//                             return;
//                         }
//                         if (!row) { // Se o usuário NÃO foi encontrado, insere
//                             db.run(`INSERT INTO users (username, password, profile, name) VALUES (?, ?, ?, ?)`,
//                                 [username, hashedPassword, profile, name],
//                                 function(err) {
//                                     if (err) {
//                                         console.error(`Erro ao criar usuário ${username}:`, err.message);
//                                     } else {
//                                         console.log(`Usuário ${username} criado com ID: ${this.lastID}`);
//                                     }
//                                 }
//                             );
//                         } else {
//                             console.log(`Usuário ${username} já existe.`);
//                         }
//                     });
//                 };

//                 // Chame a função para cada usuário que deseja criar
//                 insertUserIfNotExists('sargento', hashedPasswordSargento, 'Sargento', ' Sgt Capellari');
//                 insertUserIfNotExists('aluno', hashedPasswordAluno, 'Aluno', 'Castro');
//                 insertUserIfNotExists('instrutor', hashedPasswordInstrutor, 'Instrutor', 'Pedro');
//                 insertUserIfNotExists('sens', hashedPasswordSens, 'SENS', 'Ana SENS');

//                 // 2. Cria a tabela de elogios (APÓS a tabela users)
//                 db.run(`CREATE TABLE IF NOT EXISTS elogios (
//                     id INTEGER PRIMARY KEY AUTOINCREMENT,
//                     alunoId INTEGER,
//                     sargentoId INTEGER,
//                     sargentoNome TEXT,
//                     descricao TEXT,
//                     data TEXT DEFAULT CURRENT_TIMESTAMP,
//                     FOREIGN KEY (alunoId) REFERENCES users(id) ON DELETE CASCADE,
//                     FOREIGN KEY (sargentoId) REFERENCES users(id) ON DELETE CASCADE
//                 )`, (err) => {
//                     if (err) {
//                         console.error('Erro ao criar tabela elogios:', err.message);
//                     } else {
//                         console.log('Tabela elogios criada/verificada.');
//                     }
//                 });

//                 // 3. Adicione este bloco para listar todos os usuários após as inserções
//                 // Um pequeno atraso é necessário para garantir que as inserções assíncronas terminaram
//                 setTimeout(() => {
//                     db.all(`SELECT id, username, profile, name FROM users`, [], (err, rows) => {
//                         if (err) {
//                             console.error('Erro ao listar usuários:', err.message);
//                             return;
//                         }
//                         console.log('\n--- Usuários no Banco de Dados ---');
//                         if (rows.length === 0) {
//                             console.log('Nenhum usuário encontrado.');
//                         } else {
//                             rows.forEach(row => {
//                                 console.log(`ID: ${row.id}, Username: ${row.username}, Perfil: ${row.profile}, Nome: ${row.name}`);
//                             });
//                         }
//                         console.log('----------------------------------\n');
//                     });
//                 }, 1500); // Aumentei um pouco mais para garantir as inserções
//             });
//         }
//         ); // Fim do db.serialize
//     }
// });

// Rota de Login
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    console.log('Tentativa de login:', username);
    // 1. Usar a nova conexão (dbConnection) e o método .query
    // A query SQL continua a mesma.
    dbConnection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        // 2. O callback do mysql2 retorna um array (results), não um objeto único
        
        if (err) {
            console.error('Erro no DB durante login:', err.message);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
        
        // 3. Verificar se o array de resultados está vazio
        // Se o tamanho do array for 0, significa que o usuário não foi encontrado.
        if (results.length === 0) {
            return res.status(400).json({ message: 'Usuário não encontrado.' });
        }

        // 4. Se não estiver vazio, pegar o primeiro (e único) usuário do array
        const user = results[0];

        // 5. Verificar a senha usando bcrypt
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

    // AVISO: Esta lógica de token é apenas um placeholder para desenvolvimento.
    // Em produção, você deve usar uma biblioteca como 'jsonwebtoken' (JWT) para verificar o token.
    let usernameFromToken = 'desconhecido';
    if (token.includes('sargento')) usernameFromToken = 'sargento';
    else if (token.includes('aluno')) usernameFromToken = 'aluno';
    else if (token.includes('instrutor')) usernameFromToken = 'instrutor';
    else if (token.includes('sens')) usernameFromToken = 'sens';
    else {
        return res.status(401).json({ message: 'Token com formato desconhecido.' });
    }

    // --- Início da Adaptação para MySQL ---

    // 1. Usar a conexão do MySQL e o método .query
    dbConnection.query('SELECT * FROM users WHERE username = ?', [usernameFromToken], (err, results) => {
        // 2. O callback agora recebe um array 'results'

        if (err) {
            console.error('Erro no DB durante /auth/me:', err.message);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }

        // 3. Verificar se o array de resultados está vazio
        if (results.length === 0) {
            return res.status(401).json({ message: 'Token válido, mas usuário não encontrado no BD.' });
        }

        // 4. Se o usuário foi encontrado, ele é o primeiro item do array
        const user = results[0];

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
    // A consulta SQL foi ajustada para:
    // 1. Usar CONCAT() para juntar strings, que é o padrão do MySQL.
    // 2. Selecionar APENAS as colunas que serão enviadas na resposta (id, nome, idFunc).
    const query = `
        SELECT 
            id, 
            name AS nome, 
            CONCAT('ID_FUNC_', id) AS idFunc 
        FROM users 
        WHERE profile = 'Aluno'
    `;

    // Usamos a conexão do MySQL com o método .query
    dbConnection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar alunos:', err.message);
            return res.status(500).json({ message: 'Erro interno do servidor ao buscar alunos.' });
        }

        // Como a query já retorna os dados no formato correto,
        // podemos enviar 'results' diretamente. O .map() não é mais necessário.
        res.status(200).json({ alunos: results });
    });
});


// NOVO: Rota para buscar elogios de um aluno específico
app.get('/api/elogios/:alunoId', (req, res) => {
    const { alunoId } = req.params;

    // A consulta SQL é totalmente compatível com MySQL, não precisa de alterações.
    const query = 'SELECT id, alunoId, sargentoId, sargentoNome, descricao, data FROM elogios WHERE alunoId = ? ORDER BY data DESC';

    // 1. Trocamos 'db.all' por 'dbConnection.query'
    dbConnection.query(query, [alunoId], (err, results) => {
        // 2. Trocamos 'rows' por 'results' para manter o padrão
        if (err) {
            console.error(`Erro ao buscar elogios para aluno ${alunoId}:`, err.message);
            return res.status(500).json({ message: 'Erro interno do servidor ao buscar elogios.' });
        }
        
        // A resposta continua a mesma, enviando o array de resultados.
        res.status(200).json({ elogios: results });
    });
});

// NOVO: Rota para adicionar um novo elogio
app.post('/api/elogios', (req, res) => {
    const { alunoId, descricao, sargentoId, sargentoNome } = req.body;

    // A validação de entrada continua sendo uma ótima prática.
    if (!alunoId || !descricao || !sargentoId || !sargentoNome) {
        return res.status(400).json({ message: 'Dados incompletos para o elogio.' });
    }

    const query = 'INSERT INTO elogios (alunoId, sargentoId, sargentoNome, descricao) VALUES (?, ?, ?, ?)';
    const params = [alunoId, sargentoId, sargentoNome, descricao];

    // 1. Usamos dbConnection.query em vez de db.run
    dbConnection.query(query, params, (err, results) => {
        // 2. O callback recebe (err, results) como nos outros casos
        if (err) {
            console.error('Erro ao adicionar elogio:', err.message);
            return res.status(500).json({ message: 'Erro interno do servidor ao adicionar elogio.' });
        }

        // 3. A principal mudança: Usamos results.insertId para obter o ID do novo elogio
        // (em vez de this.lastID do SQLite)
        res.status(201).json({
            message: 'Elogio adicionado com sucesso!',
            elogioId: results.insertId 
        });
    });
});


// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Backend rodando em http://localhost:${PORT}`);
});