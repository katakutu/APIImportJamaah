let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);

describe('1. Login', function () {

    beforeEach(function (done) {
        chai.request(server)
            .post('/api/ib')
            .set('ip_client', '10.107.11.8')
            .set('user_agent', 'Iphone X')
            .send({ 'requestData': '{"action":"logout", "data":{"username":"mangga1212", "password":"jakarta123"}}' })
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('responseCode');
                res.body.responseCode.should.equal('00');
                done();
            });
    });

    it('should receive 00 login response', function (done) {
        chai.request(server)
            .post('/api/ib')
            .set('ip_client', '10.107.11.8')
            .set('user_agent', 'Iphone X')
            .send({ 'requestData': '{"action":"login", "data":{"username":"mangga1212", "password":"jakarta123"}}' })
            .end(function (err, res) {
                console.log(res.body);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('responseCode');
                res.body.responseCode.should.equal('00');
                done();
            });
    });
});

describe.only('2. Inquiry Transfer BRI', function () {

    this.timeout(7000);
    this.retries(2);
    it('should receive TF inquiry response', function (done) {
        chai.request(server)
            .post('/api/ib')
            .set('ip_client', '10.107.11.8')
            .set('user_agent', 'Iphone X')
            .send({ 'requestData': '{"data" : {"username":"mangga1212", "source_account": "020601046274508", "destination_account" :"020601003892509", "transfer_amount" : 1000, "currency" : "IDR", "trf_type" : "SCHEDULER", "sch_type": "ONCE", "sch_date" : "2017-11-30", "notes":"Beli Pisang Goreng"}, "action" : "inquiry_transfer_bri"}' })
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('responseCode');
                res.body.responseCode.should.equal('TF');
                done();
            });
    });

    it('should receive 00 inquiry response', function (done) {
        setTimeout(done, 1500);
        chai.request(server)
            .post('/api/ib')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MTEzMzQ5MTIsImRhdGEiOiI2ZmJiNDA0OTgwY2M1OTIxNzExMjA3ZDM4NjE5ZTgxZTlmN2RiN2UiLCJhbGdvcml0aG0iOiJSUzI1NiIsImlhdCI6MTUxMTMzMTMxMn0.Nx8wDotP1YwM7ffjsa_T1yuGn5g1LGj9VjltABAUp6I')
            .set('ip_client', '10.107.11.8')
            .set('user_agent', 'Iphone X')
            .send({ 'requestData': '{"data" : {"username":"mangga1212", "source_account": "020601046274508", "destination_account" :"020601003892509", "transfer_amount" : 1000, "currency" : "IDR", "trf_type" : "SCHEDULER", "sch_type": "ONCE", "sch_date" : "2017-11-30", "notes":"Beli Pisang Goreng"}, "action" : "inquiry_transfer_bri"}' })
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('responseCode');
                res.body.responseCode.should.equal('00');
                done();
            });
    });
});