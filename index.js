// index.js

const fastify = require('fastify')();
const { Client } = require('pg');

// Step 3: Create a database connection
const pool = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "password",
  database: "postgres"
});

// Test the database connection
pool.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Step 4: Define routes and handlers
fastify.get('/', async (request, reply) => {
  try {
    const { rows } = await pool.query('SELECT * FROM detail');
    console.log('check', rows)
    reply.send(rows);
  } catch (err) {
    console.error('Error fetching details:', err);
    reply.status(500).send({ error: 'Internal server error' });
  }
});

fastify.post('/data', async (request, reply) => {
  const { id, name, age } = request.body;
  if (!name || !age || !id) {
    console.log('post error')
    return reply.status(400).send({ error: 'Name, age, and id are required fields' });
  }

  try {
    const query = 'INSERT INTO detail (id, name, age) VALUES ($1, $2, $3) ';
    const values = [id, name, age];
    const { rows } = await pool.query(query, values);
    console.log('rows', rows)
    console.log('post', rows[0])
    reply.send(rows[0]);
  } catch (err) {
    console.error('Error creating detail:', err);
    reply.status(500).send({ error: 'Internal server error' });
  }
});



fastify.put('/data/:id', async (request, reply) => {
    const { id } = request.params;
    const { name, age } = request.body;
    if (!name || !age ) {
      return reply.status(400).send({ error: 'Name, age, and id are required fields' });
    }
  
    try {
      const query = 'UPDATE detail SET name = $1, age = $2 WHERE id = $3';
      const values = [name, age, id];
      const { rows } = await pool.query(query,values);
      reply.send(rows[0]);
    } catch (err) {
      console.error('Error updating detail:', err);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });


  fastify.delete('/data/:id',async(req,res)=>{
    const {id}= req.params;
  try{
const query ='DELETE FROM detail WHERE id =$1';
const value =[id];
const {rows} =await pool.query(query,value);
res.send(rows);

  }
  catch(err){
res.status(500).send({error:'internal server'})
  }
  })

// Add other routes for updating and deleting details if needed

// Step 5: Run the Fastify server
const start = async () => {
  try {
    await fastify.listen(3000);
    console.log('Server started on port 3000');
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

start();
