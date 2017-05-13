const SystemController = require('../controllers/system_controller')

module.exports = (app) => {
  app.get('/api/system', SystemController.getAll)
  app.get('/api/system/:id', SystemController.getOne)
  app.post('/api/system', SystemController.create)
  app.put('/api/system/:id', SystemController.edit)
  app.delete('/api/system/:id', SystemController.delete)
}
