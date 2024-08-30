import { fastify } from 'fastify';
import { knex } from './database';
import { env } from './env';

const server = fastify();

server.get('/', async (request, reply) => {
  const transactions = await knex('transactions')
    .where('id', 'f2cb80a6-a9d8-4afd-80b7-7b7e67089275')
    .select('*');
  return transactions;
});

server.listen({ port: env.PORT }).then(() => {
  console.log('Server is running');
});
