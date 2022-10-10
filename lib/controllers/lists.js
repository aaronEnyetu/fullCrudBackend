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

  .put('/delete/:id', authenticate, async (req, res, next) => {
    try {
      const deleteItem = await List.delete(req.params.id, {
        description: 'item is not in database',
      });
      res.json(deleteItem);
    } catch (e) {
      next(e);
    }
  });
