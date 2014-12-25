"use strict";

var async = require('async');
var fs = require('fs');
var path = require('path');
var gm = require('gm');
var mkdirp = require('mkdirp');

var Resizer = (function() {
    function Resizer(options) {
        this.options = {};

        this.options._images = options.images;
        this.options.sourceRatio = options.sourceRatio;
        this.options.output = resolveOutputPath(options.output, options.outputBasePath);
        this.options.output = calculateActualRatio(this.options.output, options.sourceRatio);
    }

    function resolveOutputPath(outputConfig, outputBaseDirectory) {
        var keys = Object.keys(outputConfig);

        [].forEach.call(keys, function(key) {
            outputConfig[key].path = path.resolve(outputBaseDirectory + outputConfig[key].dir);
            mkdirp.sync(outputConfig[key].path);
            console.log(outputConfig[key].path);
        });

        return outputConfig;
    }

    function calculateActualRatio(outputConfig, sourceRatio) {
        var keys = Object.keys(outputConfig);

        [].forEach.call(keys, function(key) {
            outputConfig[key].pixelRatio = sourceRatio / outputConfig[key].pixelRatio;
        });

        return outputConfig;
    }

    function getGm(path) {
        return gm(path).options({imageMagick: true});
    }

    /**
     * obtain image size
     * @param files
     * @returns {Function}
     * @param callback
     */
    function analyzeImageSize(files, callback) {
        console.log('analyzeImageSize', files);
        var that = this;
        that.options.images = [];

        async.each(files, function(file, callback) {
            console.log('analyze: ', file);

            getGm(file).size(function(err, size) {
                if (!err) {
                    console.log('analyzed: ', size.width, size.height);

                    that.options.images.push({
                        file: file,
                        width: size.width,
                        height: size.height
                    });
                }
                callback();
            });
        }, callback);
    }

    /**
     * resize image
     * @param config
     * @returns {Function}
     */
    function resizeImage(config) {
        console.log('resizeImage', config);

        return function(callback) {
            console.log('resizeImage inner', config);

            async.each(this.options.images, function(image, callback) {

                var name = path.basename(image.file);
                var targetWidth = image.width / config.pixelRatio;
                var targetHeight = image.height / config.pixelRatio;

                console.log('target: ', config.path + '/' + name, ', width: ', targetWidth, ', height: ', targetHeight);

                getGm(image.file)
                    .resize(targetWidth, targetHeight)
                    .unsharp(2, 1.4, 0.5, 0)
                    .noProfile()
                    .write(config.path + '/' + name, function(err) {
                        if (err) {
                            console.error(err);
                        }
                        callback();
                    });
            }, callback);
        }
    }


    Resizer.prototype.resize = function(callback) {
        var funcArray = [];
        var keys = Object.keys(this.options.output);
        var that = this;

        keys.forEach(function(key) {
            console.log('add resize func: ', key);
            funcArray.push(resizeImage(that.options.output[key]).bind(that));
        });

        analyzeImageSize.apply(that, [that.options._images, function() {
            async.waterfall(funcArray, callback);
        }]);
    };


    return Resizer;
})();

module.exports = Resizer;