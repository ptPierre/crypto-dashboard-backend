const User = require('../models/User');

const register = async (req, reply) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (userExists) {
      return reply.code(400).send({ 
        message: 'User with that email or username already exists' 
      });
    }
    
    // Create new user
    const user = new User({ username, email, password });
    await user.save();
    
    // Generate token
    const token = req.server.jwt.sign({ 
      id: user._id, 
      username: user.username 
    });
    
    return reply.code(201).send({ 
      message: 'User registered successfully',
      user: { id: user._id, username: user.username, email: user.email },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    return reply.code(500).send({ message: 'Registration failed' });
  }
};

const login = async (req, reply) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return reply.code(401).send({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return reply.code(401).send({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = req.server.jwt.sign({ 
      id: user._id, 
      username: user.username 
    });
    
    return reply.send({
      message: 'Login successful',
      user: { id: user._id, username: user.username, email: user.email },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return reply.code(500).send({ message: 'Login failed' });
  }
};

module.exports = {
  register,
  login
}; 