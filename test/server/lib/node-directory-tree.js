/**
 * Created by sander.struijk on 27.06.14.
 */
'use strict';

var libPath = '../../../lib';

var _ = require('lodash');
var path = require('path');
var should = require('should');
var ndt = require(path.join(libPath, 'node-directory-tree'));

describe('Node Directory Tree', function () {
    describe('When recursive is false', function () {
        it('Should return an object representing the path specified, if a directory it should list its children but no deeper', function () {
            var result = ndt.directoryTreeSync('/tmp', [], false);
            result.should.be.ok;
            result.should.have.property('text');
            result.should.have.property('path');
            result.should.have.property('type');
            result.should.have.property('visible');
            result.should.have.property('children');
            result.children.should.be.instanceof(Array);
            result.children.length.should.be.above(0);

            var child = _.find(result.children, function (child) {
                return child.type === 'directory';
            });
            child.should.be.ok;
            child.should.have.property('text');
            child.should.have.property('path');
            child.should.have.property('type');
            child.should.have.property('visible');
            child.should.not.have.property('children');
        })
    });
    describe('When recursive is true', function(){
        it.skip('Should return an object representing the path specified recursively with children', function () {
            var result = ndt.directoryTreeSync('/Library', [], true);
            result.should.be.ok;
            result.should.have.property('text');
            result.should.have.property('path');
            result.should.have.property('type');
            result.should.have.property('children');
            result.should.have.property('children');
            result.children.should.be.instanceof(Array);
            result.children.length.should.be.above(0);

            var child = _.find(result.children, function (child) {
                return child.type === 'directory';
            });
            child.should.be.ok;
            child.should.have.property('text');
            child.should.have.property('path');
            child.should.have.property('type');
            child.should.have.property('visible');
            child.should.have.property('children');
        })
    });
    describe('When recursive is true and maxDepth is 2', function(){
        it('Should return an object representing the path specified recursively with children with max depth 2', function () {
            var result = ndt.directoryTreeSync('/', [], true, 2);
            result.should.be.ok;
            result.should.have.property('text');
            result.should.have.property('path');
            result.should.have.property('type');
            result.should.have.property('visible');
            result.should.have.property('children');
            result.children.should.be.instanceof(Array);
            result.children.length.should.be.above(0);

            var child = _.find(result.children, function (child) {
                return child.type === 'directory';
            });
            child.should.be.ok;
            child.should.have.property('text');
            child.should.have.property('path');
            child.should.have.property('type');
            child.should.have.property('visible');
            child.should.have.property('children');

            child = _.find(child.children, function (child) {
                return child.type === 'directory';
            });
            child.should.be.ok;
            child.should.have.property('text');
            child.should.have.property('path');
            child.should.have.property('type');
            child.should.have.property('visible');
            child.should.have.property('children');

            child = _.find(child.children, function (child) {
                return child.type === 'directory';
            });
            child.should.be.ok;
            child.should.have.property('text');
            child.should.have.property('path');
            child.should.have.property('type');
            child.should.have.property('visible');
            child.should.not.have.property('children');
        })
    });
});