import { beforeAll, afterAll, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import { execSync } from 'node:child_process';

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

beforeEach(() => {
  execSync('npm run knex migrate:rollback --all');
  execSync('npm run knex migrate:latest');
});

it('Create New Transaction', async () => {
  await request(app.server)
    .post('/transactions')
    .send({
      title: 'Salary',
      amount: 1000,
      type: 'credit',
    })
    .expect(201);
});

it('List All Transactions', async () => {
  const createTransactionResponse = await request(app.server)
    .post('/transactions')
    .send({
      title: 'Salary',
      amount: 1000,
      type: 'credit',
    })
    .expect(201);

  const cookies = createTransactionResponse.get('Set-Cookie');

  const listTransactionsResponse = await request(app.server)
    .get('/transactions')
    .set('Cookie', cookies || [])
    .expect(200);

  expect(listTransactionsResponse.body.transactions).toEqual([
    expect.objectContaining({
      title: 'Salary',
      amount: 1000,
    }),
  ]);
});

it('Get Transaction By Id', async () => {
  const createTransactionResponse = await request(app.server)
    .post('/transactions')
    .send({
      title: 'Salary',
      amount: 1000,
      type: 'credit',
    })
    .expect(201);

  const cookies = createTransactionResponse.get('Set-Cookie');

  const listTransactionsResponse = await request(app.server)
    .get('/transactions')
    .set('Cookie', cookies || [])
    .expect(200);

  const transactionId = listTransactionsResponse.body.transactions[0].id;

  const getTransactionsResponse = await request(app.server)
    .get(`/transactions/${transactionId}`)
    .set('Cookie', cookies || [])
    .expect(200);

  expect(getTransactionsResponse.body.transaction).toEqual(
    expect.objectContaining({
      title: 'Salary',
      amount: 1000,
    }),
  );
});

it('Get Summary', async () => {
  const createTransactionResponse = await request(app.server)
    .post('/transactions')
    .send({
      title: 'Credit Transaction',
      amount: 5000,
      type: 'credit',
    })
    .expect(201);

  const cookies = createTransactionResponse.get('Set-Cookie');

  const createTransactionResponse2 = await request(app.server)
    .post('/transactions')
    .set('Cookie', cookies || [])
    .send({
      title: 'Debit Transaction',
      amount: 4000,
      type: 'debit',
    })
    .expect(201);

  const summaryResponse = await request(app.server)
    .get('/transactions/summary')
    .set('Cookie', cookies || [])
    .expect(200);

  expect(summaryResponse.body.summary).toEqual({
    amount: 1000,
  });
});
