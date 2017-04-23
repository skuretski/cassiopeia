const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../server');

chai.use(chaiHttp);

exports.chai = chai;
exports.should = should;
exports.server = server;
exports.chaiHttp = chaiHttp;