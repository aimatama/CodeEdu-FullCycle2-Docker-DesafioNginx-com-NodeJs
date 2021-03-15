const express = require('express')
const app = express()
const cors = require("cors");

const port = 3000
var nameArray = [];

app.use(cors());

async function GenerateRandomName() {
    let nomesArray = require('./lib/nomes.json')
    let sobrenomesArray  = require('./lib/sobrenomes.json')
    const randomNome = nomesArray[Math.floor(Math.random() * nomesArray.length)];
    const randomSobrenome1 = sobrenomesArray[Math.floor(Math.random() * sobrenomesArray.length)];
    const randomSobrenome2 = sobrenomesArray[Math.floor(Math.random() * sobrenomesArray.length)];
    return `${randomNome} ${randomSobrenome1} ${randomSobrenome2}`;
}

async function ConnectDatabase() {
    
    const config = {
        host: 'db',
        user: 'root',
        password: 'root',
        database: 'nodedb'
    }
    
    const mysql = require('mysql')

    const connection = mysql.createConnection(config)

    var sql = "create table if not exists `people` (id int auto_increment, `name` VARCHAR(255), PRIMARY KEY (`id`))";
    connection.query(sql);

    const randomName = await GenerateRandomName();

    sql = `INSERT INTO people (name) VALUES ('${randomName}');` 
    connection.query(sql)
    
    sql = "select * from people order by id desc limit 30";
    connection.query(sql, function (err, result, fields) {
        nameArray = result.map(pessoa => `<li>${pessoa.name}</li>`).join('');
    });

    connection.end()
};

app.get('/', async (req,res) => {
    ConnectDatabase();
    res.send( `
        <h1>Bem-vindo ao curso Full Cycle da Code Education1! Abaixo a lista dos últimos alunos matriculados:</h1>
        ${nameArray}
    `);
})

app.listen(port, async () => {
    console.log('Rodando no container APP por meio da porta ' + port)
})
