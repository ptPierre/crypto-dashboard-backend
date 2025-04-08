const User = require('../models/User');

const getFavorites = async (req, reply) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return reply.code(404).send({ message: 'User not found' });
    }
    
    return reply.send({ favorites: user.favorites });
  } catch (error) {
    console.error('Get favorites error:', error);
    return reply.code(500).send({ message: 'Failed to retrieve favorites' });
  }
};

const addFavorite = async (req, reply) => {
  try {
    const userId = req.user.id;
    const { cryptoId } = req.body;
    
    if (!cryptoId) {
      return reply.code(400).send({ message: 'Crypto ID is required' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return reply.code(404).send({ message: 'User not found' });
    }
    
    // Check if already in favorites
    if (user.favorites.includes(cryptoId)) {
      return reply.send({ message: 'Already in favorites', favorites: user.favorites });
    }
    
    // Add to favorites
    user.favorites.push(cryptoId);
    await user.save();
    
    return reply.send({ 
      message: 'Added to favorites', 
      favorites: user.favorites 
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    return reply.code(500).send({ message: 'Failed to add favorite' });
  }
};

const removeFavorite = async (req, reply) => {
  try {
    const userId = req.user.id;
    const { cryptoId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return reply.code(404).send({ message: 'User not found' });
    }
    
    // Remove from favorites
    user.favorites = user.favorites.filter(id => id !== cryptoId);
    await user.save();
    
    return reply.send({ 
      message: 'Removed from favorites', 
      favorites: user.favorites 
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    return reply.code(500).send({ message: 'Failed to remove favorite' });
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite
}; 