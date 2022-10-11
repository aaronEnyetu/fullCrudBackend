const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
// const authorize = require('../middleware/authorize');
const { List } = require('../models/List');

module.exports = Router()
  .post('/', authenticate, async (req, res, next) => {
    try {
      const items = await List.insertItem({
        user_id: req.user.id,
        ...req.body,
      });
      res.json(items);
    } catch (e) {
      next(e);
    }
  })

  .get('/', authenticate, async (req, res, next) => {
    try {
      const items = await List.getAllItems(req.user.id);
      res.json(items);
    } catch (e) {
      next(e);
    }
  })

  .put('/:id', [authenticate], async (req, res, next) => {
    try {
      const data = await List.updateItemById(req.params.id, req.body);
      res.json(data);
    } catch (e) {
      next(e);
    }
  })

  .delete('/:id', [authenticate], async (req, res, next) => {
    try {
      const data = await List.delete(req.params.id, req.body);
      res.json(data);
    } catch (e) {
      next(e);
    }
  });
