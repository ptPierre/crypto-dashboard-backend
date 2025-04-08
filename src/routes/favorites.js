const favoritesController = require('../controllers/favoritesController');

async function routes(fastify, options) {
  fastify.get('/', {
    onRequest: [fastify.authenticate]
  }, favoritesController.getFavorites);
  
  fastify.post('/', {
    onRequest: [fastify.authenticate]
  }, favoritesController.addFavorite);
  
  fastify.delete('/:cryptoId', {
    onRequest: [fastify.authenticate]
  }, favoritesController.removeFavorite);
}

module.exports = routes; 