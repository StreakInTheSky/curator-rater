const UserController = require('../controllers/user_controller')

module.exports = (app) => {
  // User routes
  app.get('/api/user', UserController.getAll)
  app.post('/api/user', UserController.create)
}
