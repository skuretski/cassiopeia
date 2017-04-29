const common = require('./common');
var should = common.should;
var chai = common.chai;
var server = common.server;
var insertId;
var del_insertId;
var dsc_insertId;
var table = 'tasks'

describe('Tasks Tests', function(){
    
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

    it('get all records in table `' + 'deliverables' + '`', function(done){
        console.log('--------------------------------');
        chai.request(server)
            .get('/' + 'deliverables')
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                console.log(res.body.length + ' records returned');
                console.log('last record:');
                console.log(res.body[res.body.length - 1]);
                del_insertId = res.body[res.body.length - 1].id;
                done();
            });
    });

    it('get all records in table `' + 'disciplines' + '`', function(done){
        console.log('--------------------------------');
        chai.request(server)
            .get('/' + 'disciplines')
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                console.log(res.body.length + ' records returned');
                console.log('last record:');
                console.log(res.body[res.body.length - 1]);
                dsc_insertId = res.body[res.body.length - 1].id;
                done();
            });
    });

    it('insert new record in table `' + table + '`', function(done){
        console.log('--------------------------------');
        chai.request(server)
            .post('/' + table)
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                    title: 'some generic title',
                    description: 'some generic description',
                    committed: 1,
		    deliverable_id: del_insertId,
		    discipline_id: dsc_insertId		    
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
                    title: 'some UPDATED generic title',
                    description: 'some UPDATED generic description',
                    committed: 0,
		    deliverable_id: del_insertId,
		    discipline_id: dsc_insertId		    
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