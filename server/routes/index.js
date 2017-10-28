const passport = require('passport')

const AuthController = require('../controllers/auth_controller')
const UserController = require('../controllers/user_controller')
const FetchController = require('../controllers/fetch_controller')
const GalleryController = require('../controllers/gallery_controller')
const ImageController = require('../controllers/image_controller')
// const NotificationController = require('../controllers/notification_controller')

module.exports = (app) => {
  // Auth routes
  const authOptions = {
    session: false
  }

  const apiAuth = '/api/auth'
  app.post(`${apiAuth}/login`, passport.authenticate('basic', authOptions), AuthController.login)
  app.post(`${apiAuth}/refresh`, passport.authenticate('jwt', authOptions), AuthController.refresh)

  // TODO: add auth middleware to protected endpoints (most non get endpoints)

  // User routes
  const apiUser = '/api/user'
  app.get(apiUser, UserController.getByQuery)
  app.get(`${apiUser}/:username`, UserController.getOne)
  app.get(`${apiUser}/:userId`, UserController.getOneById)
  app.post(apiUser, UserController.create)
  app.post(`${apiUser}/follow`,  UserController.follow)
  app.post(`${apiUser}/unfollow`, UserController.unfollow)
  app.put(`${apiUser}/:userId`, UserController.update)
  app.delete(`${apiUser}/:userId`, UserController.delete)

 // Allows fetching images from internet
  const apiFetch = '/api/fetch'
  app.get(`${apiFetch}/image-url`, FetchController.fetchUrl)
  app.get(`${apiFetch}/instagram`, FetchController.fetchInstagram)

  // Gallery routes
  const apiGallery = '/api/gallery'
  app.get(apiGallery, GalleryController.getByQuery)
  app.get(`${apiGallery}/:galleryId`, GalleryController.getOne)
  app.post(apiGallery, GalleryController.create)
  // app.post(`${apiGallery}/:galleryId/favorite`, GalleryController.addFavorite)
  // app.post(`${apiGallery}/:galleryId/unfavorite`, GalleryController.removeFavorite)
  app.put(`${apiGallery}/:galleryId`, GalleryController.update)
  app.delete(`${apiGallery}/:galleryId`, GalleryController.delete)

  // Image routes
  const apiImage = '/api/image'
  app.post(`${apiImage}/`, ImageController.create)
  // app.get(apiImage, ImageController.get)
  // app.get(`${apiImage}/:imageId`, ImageController.getOne)
  // app.post(`${apiImage}/:imageId/vote`, ImageController.vote)
  // app.delete(`${apiImage}/:imageId`, ImageController.delete)

  // // Notification routes
  // const apiNotification = '/api/notification'
  // app.put(`${apiNotification}/:notificationId`, NotificationController.markRead)
}
