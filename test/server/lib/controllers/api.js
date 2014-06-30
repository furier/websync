/**
 * Created by sander.struijk on 27.06.14.
 */
'use strict';

var _ = require('lodash');
var should = require('should');
var request = require('supertest');
var app = require('../../../../server');

describe('POST /api/getDirectoryStructure', function() {
    it('should respond with JSON object representing the directory structure of the specified path', function(done) {
        request(app)
            .post('/api/getDirectoryStructure')
            .send({path: '/'})
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);

                var result = res.body;
                result.should.be.instanceof(Array);

                var child = _.find(result, function (child) {
                    return child.type === 'directory';
                });
                child.should.be.ok;
                child.should.have.property('text');
                child.should.have.property('path');
                child.should.have.property('type');
                child.should.have.property('visible');
                child.should.not.have.property('children');

                done();
            });
    });
});