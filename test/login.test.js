const { login } = require('../auth/auth'); 
const User = require('../models/Users'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../models/Users');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Login API', () => {
  it('should log in successfully', async () => {
    const mockReq = {
      body: {
        username: 'admin',
        password: 'admin',
      },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };

    const mockUser = {
      _id: '65b9df5f1a18bcedd8bd6ccc',
      email:'admin@mail',
      username: 'admin',
      password: '$2a$10$iKmEGSGkpp5b3QyEiUsvNOU8.Fz.bJCuExayN5D.pmuK251qxozOi',
      role: 'admin',
    };

    // Set up mocks
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('mockedtoken');

    // Execute the login function
    await login(mockReq, mockRes);

    // Assertions
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'User successfully Logged in',
      userid: '65b9df5f1a18bcedd8bd6ccc',
      role: 'admin',
    });
    expect(mockRes.cookie).toHaveBeenCalledWith('jwt', 'mockedtoken', {
      httpOnly: true,
      maxAge: 3 * 60 * 60 * 1000, // 3hrs in ms
    });
  });

  it('should handle login failure', async () => {
    const mockReq = {
      body: {
        username: 'nonexistentuser',
        password: 'wrongpassword',
      },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Set up mocks
    User.findOne.mockResolvedValue(null);
    bcrypt.compare.mockResolvedValue(false);

    // Execute the login function
    await login(mockReq, mockRes);

    // Assertions
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Login not successful',
      error: 'User not found',
    });
  });

  it('should handle errors during login', async () => {
    const mockReq = {
      body: {
        username: 'admin',
        password: 'admin',
      },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Set up mocks
    User.findOne.mockRejectedValue(new Error('Mocked database error'));
    bcrypt.compare.mockResolvedValue(true);

    await login(mockReq, mockRes);

    // // Assertions
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Mocked database error',
      error: 'An error occurred',
    });
  });

  it('should handle missing username or password', async () => {
    const mockReq = {
      body: {},
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Execute the login function
    await login(mockReq, mockRes);

    // Assertions
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Username or Password not present',
    });
  });
});