import { fastify } from 'fastify';
import Cookie from '@fastify/cookie';

import { transactionsRoutes } from './routes/transactions';

export const app = fastify();

app.register(Cookie);
app.register(transactionsRoutes, { prefix: 'transactions' });
