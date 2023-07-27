const fastify =require ('fastify') ({logger:true});

const knex = require('knex')(require ('./knex_cnct').development);


fastify.get('/', async (request, reply) => {
//http://localhost:3000  without id
    //http://localhost:3000/?id=4 with id
    try {
      const id = request.query.id; 
      console.log('********',request.query)

  if(!id){
    const users = await knex('detail').select('*');
    console.log(users)
    reply.send(users)
  }
     
      else{
        const data = await knex('detail').select('*').where('id', id);
        reply.send(data)
      }
  
      if (data.length === 0) {
        return reply.status(404).send({ error: 'Data not found' });
      }

    } catch (err) {
      console.error('Error fetching details:', err);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });

fastify.post('/kpost',async(req,reply)=>{
    const {id,name,age} = req.body;
    const user = await knex('detail').insert ({id,name,age}).returning('*');
    reply.send(user[0]);
})

fastify.put('/kpost/:id',async(request,reply)=>{
    const userId =request.params.id;
    const {name,age,id} = request.body;

    try{
        const user =await knex ('detail').where({id : userId}).update({id,name,age}).returning('*');
reply.code(200).send(user[0]);
    }
    catch(err){
reply.code(500).send(err,'checkk data')
    }
})




fastify.delete('/kpost/:id', async (request, reply) => {
    const userId = request.params;
  
    try {
      const deletedUser = await knex('detail')
        .where({ id: userId })
        .del()
        .returning('*');
  
      if (deletedUser.length === 0) {
        return reply.code(404).send({ message: 'User not found' });
      }
  reply.send(deletedUser[0])
      return  { message: 'User deleted successfully' };
    } catch (error) {
      return reply.code(500).send({ message: 'Internal server error' });
    }
  });


const start = async ()=>{
    try{
        await fastify.listen(3000);
    }
    catch(err){
        fastify.log.error(err)
        process.exit(1);
    }
};

start();


// fastify.put('/kpost/:id', async (request, reply) => {
//     const userId = request.params.id;
//     const { name, age } = request.body;
  
//     try {
//       const updatedUser = await knex('detail')
//         .where({ id: userId })
//         .update({ name, age })
//         .returning('*');
  
//       if (updatedUser.length === 0) {
//         return reply.code(404).send({ message: 'User not found' });
//       }
  
//       return updatedUser;
//     } catch (error) {
//       return reply.code(500).send({ message: 'Internal server error' });
//     }
//   });