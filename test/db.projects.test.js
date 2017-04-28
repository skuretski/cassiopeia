const common = require('./common');
var should = common.should;
var chai = common.chai;
var server = common.server;
var insertId;
var table = 'projects'

describe('Projects Tests', function(){
    
    it('get all records in table `' + table + '`', function(done){
        console.log('--------------------------------');
        chai.request(server)
            .get('/' + table)
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
            .get('/' + table + '/' + insertId)
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
            .post('/' + table)
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                    title: 'Big Ole Machine',
                    description: 'Super Duper Amazing Efficient Perpetual Motion Machine'
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
            .get('/' + table)
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
            .put('/' + table)
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                    id: insertId,
                    title: 'Big Ole Machine Redux',
                    description: 'Slight Variation On Super Duper Amazing Efficient Perpetual Motion Machine'
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
            .get('/' + table)
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
            .delete('/' + table + '/' + insertId)
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                done();
            });
    });

    it('get all records in table `' + table + '`', function(done){
        console.log('--------------------------------');
        chai.request(server)
            .get('/' + table)
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