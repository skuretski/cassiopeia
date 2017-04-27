const common = require('./common');
var should = common.should;
var chai = common.chai;
var server = common.server;
var insertId;
var table = 'employees'

describe('Employees Tests', function(){
    
    it('get all records in table `' + table + '`', function(done){
        console.log('--------------------------------');
        chai.request(server)
            .get('/employees')
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                console.log(res.body.length + ' records returned');
                console.log('last record:');
                console.log(res.body[res.body.length - 1]);
                insertId = res.body[res.body.length - 1].id;
                done();
            });
    });

    it('get just one record in table `' + table + '`', function(done){
        console.log('--------------------------------');
        chai.request(server)
            .get('/employees/' + insertId)
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                console.log(res.body.length + ' records returned');
                console.log('last record:');
                console.log(res.body[res.body.length - 1]);
                done();
            });
    });

    it('insert new record in table `' + table + '`', function(done){
        console.log('--------------------------------');
        chai.request(server)
            .post('/employees')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                    first: 'Amy',
                    last: 'Miller',
                    discipline_id: 7
                })
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                insertId = res.body.insertId;
                console.log('insertId = ' + insertId);
                done();
            });
    });
    
    it('get all records in table `' + table + '`', function(done){
        console.log('--------------------------------');
        chai.request(server)
            .get('/employees')
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                console.log(res.body.length + ' records returned');
                console.log('last record:');
                console.log(res.body[res.body.length - 1]);
                done();
            });
    });

    it('update new record in table `' + table + '`', function(done){
        console.log('--------------------------------');
        chai.request(server)
            .put('/employees')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                    id: insertId,
                    first: 'Anita',
                    last: 'Baker',
                    discipline_id: 8
                })
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                done();
            });
    });

    it('get all records in table `' + table + '`', function(done){
        console.log('--------------------------------');
        chai.request(server)
            .get('/employees')
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                console.log(res.body.length + ' records returned');
                console.log('last record:');
                console.log(res.body[res.body.length - 1]);
                done();
            });
    });

    it('delete new record in table `' + table + '`', function(done){
        console.log('--------------------------------');
        chai.request(server)
            .delete('/employees/' + insertId)
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                done();
            });
    });

    it('get all records in table `' + table + '`', function(done){
        console.log('--------------------------------');
        chai.request(server)
            .get('/employees')
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                console.log(res.body.length + ' records returned');
                console.log('last record:');
                console.log(res.body[res.body.length - 1]);
                done();
            });
    });
});