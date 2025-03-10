/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

var should = require("should");
var request = require("supertest");
var express = require("express");
var bodyParser = require("body-parser");
var sinon = require("sinon");

var NR_TEST_UTILS = require("nr-test-utils");

var projects = NR_TEST_UTILS.require("@node-red/editor-api/lib/editor/projects");

describe("api/editor/projects", function() {
    var app;
    var mockRuntime = {
        projects: {
            get: function() {},
            create: function() {},
            delete: function() {},
            update: function() {}
        }
    };

    before(function() {
        projects.init({}, mockRuntime);
        app = express();
        app.use(bodyParser.json());
        app.use("/projects", projects.app());
    });

    beforeEach(function() {
        sinon.stub(mockRuntime.projects, "get");
        sinon.stub(mockRuntime.projects, "create");
        sinon.stub(mockRuntime.projects, "delete");
        sinon.stub(mockRuntime.projects, "update");
    });

    afterEach(function() {
        mockRuntime.projects.get.restore();
        mockRuntime.projects.create.restore();
        mockRuntime.projects.delete.restore();
        mockRuntime.projects.update.restore();
    });

    it('GET /projects --- return empty list', function(done) {
        mockRuntime.projects.get.returns(Promise.resolve([]));
        request(app)
        .get("/projects")
        .expect(200)
        .end(function(err, res) {
            if (err) {
                return done(err);
            }
            res.body.should.have.property('projects');
            res.body.projects.should.be.empty();
            done();
        });
    });

    it('GET /projects --- return normal list', function(done) {
        var projectList = [
            { name: 'project1' },
            { name: 'project2' }
        ];
        mockRuntime.projects.get.returns(Promise.resolve(projectList));
        request(app)
        .get("/projects")
        .expect(200)
        .end(function(err, res) {
            if (err) {
                return done(err);
            }
            res.body.should.have.property('projects');
            res.body.projects.should.deepEqual(projectList);
            done();
        });
    });

    it('POST /projects --- create project', function(done) {
        var newProject = { name: 'newProject' };
        mockRuntime.projects.create.returns(Promise.resolve(newProject));
        request(app)
        .post("/projects")
        .send(newProject)
        .expect(201)
        .end(function(err, res) {
            if (err) {
                return done(err);
            }
            res.body.should.deepEqual(newProject);
            done();
        });
    });

    it('DELETE /projects/:name --- delete project', function(done) {
        var projectName = 'projectToDelete';
        mockRuntime.projects.delete.returns(Promise.resolve(true));
        request(app)
        .delete("/projects/" + projectName)
        .expect(204)
        .end(function(err, res) {
            if (err) {
                return done(err);
            }
            res.body.should.deepEqual({});
            done();
        });
    });

    it('PUT /projects/:name --- update project', function(done) {
        var updatedProject = { name: 'updatedProject' };
        mockRuntime.projects.update.returns(Promise.resolve(updatedProject));
        request(app)
        .put("/projects/" + updatedProject.name)
        .send(updatedProject)
        .expect(200)
        .end(function(err, res) {
            if (err) {
                return done(err);
            }
            res.body.should.deepEqual(updatedProject);
            done();
        });
    });
});
