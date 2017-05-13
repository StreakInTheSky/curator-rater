const System = require('../models/system')

module.exports = {
  getAll(req, res, next) {
    System.find({})
      .then(systems => res.json(systems.map(system => system.apiRepr())))
      .catch(next)
  },
  getOne(req, res, next) {
    const systemId = req.params.id
    System.findById(systemId)
      .then(system => {
        res.json(system.apiRepr())
      })
      .catch(next)
  },
  create(req, res, next) {
    const systemProps = req.body
    // verify correct keys being passed
    const system = new System(systemProps)
    system.save()
      .then((savedSystem) => {
        System.findById(savedSystem._id)
          .then(() => {
            res.status(201).send(system.apiRepr())
          })
          .catch(next)
      })
      .catch(next)
  },
  edit(req, res, next) {
    const systemId = req.params.id
    const systemProps = req.body
    // verify correct keys are being passed
    System.findByIdAndUpdate(systemId, systemProps)
      .then(() => System.findById(systemId))
      .then(system => res.send(system.apiRepr()))
      .catch(next)
  },
  delete(req, res, next) {
    const systemId = req.params.id
    System.findByIdAndRemove(systemId)
      .then(system => res.status(204).send(system.apiRepr()))
      .catch(next)
  }
}
