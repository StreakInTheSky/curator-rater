const UserController = require('../controllers/user_controller')
const FetchController = require('../controllers/fetch_controller')
// const GalleryController = require('../controllers/gallery_controller')
// const PhotoController = require('../controllers/photo_controller')
// const NotificationController = require('../controllers/notification_controller')

module.exports = (app) => {
  // User routes
  const apiUser = '/api/user'
  app.get(apiUser, UserController.getAll)
  app.get(`${apiUser}/:username`, UserController.getOne)
  app.post(apiUser, UserController.create)
  app.post(`${apiUser}/follow`, UserController.follow)
  app.post(`${apiUser}/unfollow`, UserController.unfollow)
  app.put(`${apiUser}/:userid`, UserController.update)
  app.delete(`${apiUser}/:userid`, UserController.delete)

  const apiFetch = '/api/fetch'
  app.get(`${apiFetch}/image-url`, FetchController.fetchUrl)

  // // Gallery routes
  // const apiGallery = '/api/gallery'
  // app.get(apiGallery, GalleryController.get)
  // app.get(`${apiGallery}/:galleryId`, GalleryController.getOne)
  // app.post(apiGallery, GalleryController.create)
  // app.post(`${apiGallery}/:galleryId/favorite`, GalleryController.addFavorite)
  // app.put(`${apiGallery}/:galleryId`, GalleryController.update)
  // app.delete(`${apiGallery}/:galleryId`, GalleryController.delete)
  //
  // // Photo routes
  // const apiPhoto = '/api/photo'
  // app.get(apiPhoto, PhotoController.get)
  // app.get(`${apiPhoto}/:photoId`, PhotoController.getOne)
  // app.post(`${apiPhoto}/:photoId/vote`, PhotoController.vote)
  // app.delete(`${apiPhoto}/:photoId`, PhotoController.delete)
  //
  // // Notification routes
  // const apiNotification = '/api/notification'
  // app.put(`${apiNotification}/:notificationId`, NotificationController.markRead)
}
