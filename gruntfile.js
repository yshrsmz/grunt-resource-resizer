module.exports = function(grunt) {
    grunt.initConfig({
        jsvalidate: {
            options: {
                globals: {},
                esprimaOptions: {},
                verbose: false
            },
            all: {
                src: ['<%=jshint.all%>']
            }
        },
        jshint: {
            options: {
                node: true,
                globalstrict: true
            },
            all: ['tasks/**/*.js']
        },
        clean: ['tmp'],
        rr: {
            test: {
                options: {
                    sourceRatio: 4,
                    output: {
                        xhdpi: {
                            pixelRatio: 2,
                            dir: 'drawable-xhdpi/'
                        },
                        xxhdpi: {
                            pixelRatio: 3,
                            dir: 'drawable-xxhdpi/'
                        },
                        xxxhdpi: {
                            pixelRatio: 4,
                            dir: 'drawable-xxxhdpi/'
                        }
                    }
                },
                files: {
                    './tmp/res/': 'test/res/drawable-xxxhdpi/*.png'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-jsvalidate');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.loadTasks('tasks');

    grunt.registerTask('mkdir', grunt.file.mkdir);
    grunt.registerTask('test', [
        'clean',
        'mkdir:tmp',
        'jshint',
        'jsvalidate',
        'clean'
    ]);
};