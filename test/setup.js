const { expect } = require('chai');
const supertest = require('supertest');

require('dotenv').config();

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';

process.env.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL
  || "postgresql://belly@localhost/belly-test";

global.expect = expect;
global.supertest = supertest;