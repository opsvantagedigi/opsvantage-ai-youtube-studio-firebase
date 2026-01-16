import * as functions from 'firebase-functions';
import fastify from 'fastify';

const server = fastify();

server.get('/', async (request, reply) => {
  reply.send({ hello: 'world' });
});

export const api = functions.https.onRequest((req, res) => {
  server.ready(err => {
    if (err) throw err;
    server.server.emit('request', req, res);
  });
});
