const common = require('./common');
var should = common.should;
var chai = common.chai;
var server = common.server;

describe('Employees Tests', function(){
    it('should get all employees on /employees', function(done){
        chai.request(server)
        .get('/employees')
        .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            done();
        });
    });
});