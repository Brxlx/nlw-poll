import fastify from 'fastify';

const server = fastify();

server.listen({ host: '0.0.0.0', port: 3333 }, () => {
  console.log('HTTP server is up and running!');
})