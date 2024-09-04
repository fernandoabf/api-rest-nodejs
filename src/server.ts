import { fastify } from 'fastify';
import { knex } from './database';
import { env } from './env';
import { transactionsRoutes } from './routes/transactions';
import Cookie from '@fastify/cookie';
import { checkSessionIdExists } from './middlewares/check-session-id-exists';

const app = fastify();

app.register(Cookie);
app.register(transactionsRoutes, { prefix: 'transactions' });

app.listen({ port: env.PORT }).then(() => {
  console.log('Server is running');
});
