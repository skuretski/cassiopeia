process.env.NODE_ENV = 'test';

function importTest(name, path){
    describe(name, function(){
        require(path);
    });
}

const common = require('./common');
var should = common.should;
var chai = common.chai;
var server = common.server;

describe('Basic Server Test', function(){
    it('index page should respond with status 200', function(done){
        chai.request(server)
            .get('/')
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });   
});

describe('Database Tests', function(){
    importTest('Employees', './db.employees.test');
});