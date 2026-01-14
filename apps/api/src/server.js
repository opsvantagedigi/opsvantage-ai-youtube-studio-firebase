import fastify from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { runPromptToVideo } from './pipeline.js';
import { createVideoJobPlaceholder } from './models.js';

const server = fastify({ logger: true });
const store = new Map();

server.post('/api/v1/video-jobs', async (request, reply) => {
  const body = request.body;
  if (!body || !body.prompt) return reply.status(400).send({ error: 'prompt is required' });
  const id = uuidv4();
  const placeholder = createVideoJobPlaceholder(id, body);
  store.set(id, placeholder);

  runPromptToVideo(id, body)
    .then((job) => store.set(id, job))
    .catch((err) => store.set(id, { ...store.get(id), status: 'failed', error: String(err) }));

  return reply.status(201).send(placeholder);
});

server.get('/api/v1/video-jobs/:id', async (request, reply) => {
  const id = request.params.id;
  const job = store.get(id);
  if (!job) return reply.status(404).send({ error: 'not found' });
  return reply.send(job);
});

const start = async () => {
  try {
    await server.listen({ port: 3001, host: '0.0.0.0' });
    server.log.info('API listening on 3001');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
