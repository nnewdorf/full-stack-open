const express = require('express');
const {getAsync} = require('../redis')
const router = express.Router();

router.get('/', async (_, response) => {
  const numTodos = await getAsync('numTodos')

  const returnJson = {
    added_todos: numTodos
  }

  response.send(returnJson);
});

module.exports = router;