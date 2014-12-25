"use strict";

var fs = require('fs');
var async = require('async');
var path = require('path');
var Resizer = require('./libs/resizer');

module.exports = function(grunt) {
    grunt.registerMultiTask('rr', 'Resize Resource', function() {

        var options = this.options({});
        var done = this.async();

        grunt.verbose.writeflags(options, 'Options');

        async.eachLimit(this.files, 10, function(file, callback) {
            var srcFiles;
            var files = [];

            srcFiles = grunt.file.expand(file.src);

            [].forEach.call(srcFiles, function(file) {
                if (fs.statSync(file).isFile()) {
                    files.push(file);
                }
            });

            options.images = files;
            options.outputBasePath = file.dest;

            grunt.verbose.writeflags(files, 'Files');
            grunt.verbose.writeln('Destination: ', file.dest);

            var resizer = new Resizer(options);
            resizer.resize(function(err, configs) {
                done();
            });
        });
    });
};