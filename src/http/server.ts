import fastify from 'fastify';
import cookie from '@fastify/cookie';

import { createPoll } from '../routes/create-poll';
import { getPoll } from '../routes/get-poll';
import { voteOnPoll } from '../routes/vote-on-poll';
import websocket from '@fastify/websocket';
import { pollResults } from '../ws/poll-results';

const server = fastify();

server.register(cookie, {
  secret: "2e82ab4dc556519c68b505a51229b5f0", //for cookie-signature
  hook: "onRequest",
});

server.register(websocket);

server.register(createPoll);
server.register(getPoll);
server.register(voteOnPoll);
server.register(pollResults);




server.listen({ host: '0.0.0.0', port: 3333 }, () => {
  console.log('HTTP server is up and running!');
});