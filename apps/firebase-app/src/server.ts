import Fastify from 'fastify'
// import { bullBoardApp } from './bull-board/server'

const server = Fastify({
  logger: true
})

// server.register(bullBoardApp, { prefix: '/admin/queues' })

server.listen({ port: process.env.PORT || 3001 }, (err, address) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
  console.log(`API server running at ${address}`)
})
