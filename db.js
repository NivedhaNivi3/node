const {Client} = require('pg');

const client =new Client({
    host:"localhost",
    user:"postgres",
    port:5432,
    password:"password",
    database:"postgres"
})

client.connect();
client.query(`select * from employee`,(err,res)=>{
    if(!err){
console.log(res)
    }
    else{
        console.log(err.message);
     
    }
    client.end;
})