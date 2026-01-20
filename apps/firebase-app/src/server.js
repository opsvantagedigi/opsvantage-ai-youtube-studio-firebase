import express from 'express'
import bullBoardApp from './bull-board/server.js'
const app = express()
// ...existing code...
// ...existing code for job endpoints...
app.use('/admin/queues', bullBoardApp)
app.listen(process.env.PORT || 3001, () => {
  console.log('API server running')
})
//# sourceMappingURL=server.js.map
