var expect    = require("chai").expect;
var supertest = require("supertest");
var should = require("should");
var server = supertest.agent("http://localhost:3000");
require("../app");
require("../models");
var users = require("../routes/users");
var request = require("request");
var Cookies;
describe("user API service testing", function() {
  describe("test login signup", function() {
    it("test get login page", function(done) {
    	var url = "http://127.0.0.1:3000/users/login";
    	request(url, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
      	done();
      });
    });
    it("test login",function(done){
    	server
    	.post('/users/login')
    	.send({username:"mot",password:"m"})
    	.expect("Content-type",/json/)
    	.expect(200)
    	.end(function(err,res){
    		res.status.should.equal(200);
    		// res.session.user.should.equal('1')
            Cookies = res.headers['set-cookie'].pop().split(';')[0];
    	})

        done();
    });
    it("test signup",function(done){
        server.cookies=Cookies;
        console.log(Cookies);
        server
        .get("/article/create_article")
        .expect(200)
        .end(function(err,res){
            res.status.should.equal(200);
        });
        done();
    });
});
});
