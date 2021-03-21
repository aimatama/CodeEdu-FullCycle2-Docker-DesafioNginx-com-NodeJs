const express = require('express')
const cors = require('cors');
const mysql = require('promise-mysql');

const port = 3000
var nameArray = [];
const app = express()
var connection = mysql.connection;

app.use(cors());

async function GenerateRandomName() {
    console.log("Gerando um nome aleatório");
    let nomesArray = require('./lib/nomes.json')
    let sobrenomesArray  = require('./lib/sobrenomes.json')
    const randomNome = nomesArray[Math.floor(Math.random() * nomesArray.length)];
    const randomSobrenome1 = sobrenomesArray[Math.floor(Math.random() * sobrenomesArray.length)];
    const randomSobrenome2 = sobrenomesArray[Math.floor(Math.random() * sobrenomesArray.length)];
    return `${randomNome} ${randomSobrenome1} ${randomSobrenome2}`;
}

async function Main() {
    
    console.log("Início da rotina MAIN.");

    const randomName = await GenerateRandomName();

    await ConnectDatabase();

    pessoa = await InsertPeople(randomName);

    await CloseDatabase();

    nameArray = pessoa.map(pessoa => `<li>${pessoa.name}</li>`).join('');

    console.log("Término da rotina MAIN.");

    return nameArray;
  }
 
async function ConnectDatabase() {    
    console.log("Iniciando a conexão com o banco de dados.");
    const config = {
        host: 'db',
        user: 'root',
        password: 'root',
        database: 'nodedb'
    }
    connection = await mysql.createConnection(config);
}; 

async function CloseDatabase() {
    console.log("Finalizando a conexão com o banco de dados.");
    await connection.end()
};

async function InsertPeople(randomName) {
    
    console.log("Verificando se a tabela existe no banco de dados.");
    var sql = "create table if not exists `people` (id int auto_increment, `name` VARCHAR(255), PRIMARY KEY (`id`))";
    await connection.query(sql);

    console.log("Inserindo a pessoa no banco de dados.");
    sql = `INSERT INTO people (name) VALUES ('${randomName}');` 
    await connection.query(sql)
    
    console.log("Listando as pessoas cadastradas no banco de dados.");
    sql = "select * from people order by id desc limit 30";

    return pessoa = await connection.query(sql)
};

app.get('/', async (req,res) => {
    nameArray = await Main();
    res.send( `
        <h1>Full Cycle Rocks!</h1>
        <h2>Bem-vindo ao curso Full Cycle da Code Education! Abaixo a lista dos últimos alunos matriculados:</h2>
        ${nameArray}
    `);
})

app.listen(port, async () => {
    console.log("Server Web iniciado!");
})
