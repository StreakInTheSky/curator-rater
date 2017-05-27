const UserController = require('../controllers/user_controller')

module.exports = (app) => {
  const apiUrl = '/api/user'
  // User routes
  app.get(apiUrl, UserController.getAll)
  app.get(`${apiUrl}/:username`, UserController.getOne)
  app.post(apiUrl, UserController.create)
  app.post(`${apiUrl}/follow`, UserController.follow)
  app.post(`${apiUrl}/unfollow`, UserController.unfollow)
  app.put(`${apiUrl}/:userid`, UserController.update)
}
