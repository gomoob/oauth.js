module.exports = function(grunt) {

    /**
     * An object which defines the Grunt Project configuration.
     */
    var gruntConfiguration = {

        /**
         * Reads the 'package.json' file and puts its content into a 'pkg' Javascript object.
         */
        pkg : grunt.file.readJSON('package.json'),
        
        /**
         * Clean task.
         */
        clean : ['tmp/**/*'],
        
        /**
         * Coveralls Task.
         */
        coveralls: {
            options: {
                src: 'coverage.lcov',
                force: false
            },
            'default': {
                src: 'coverage.lcov'
            }
        },
        
        /**
         * JSDoc Task.
         */
        jsdoc : {
            dist : {
                src: [
                    'jsdoc/README.md',
                    'src/**/*.js'
                ], 
                options: {
                    configure : 'jsdoc/jsdoc.conf.json',
                    destination: 'tmp/jsdoc',
                    template : 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template'/*,
                    tutorials : 'tmp/replaced/jsdoc/tutorials'*/
                }
            }
        },
        
        /**
         * JSHint Task.
         */
        jshint : {
            src : {
                src : [
                    'Gruntfile.js',
                    'src/**/*.js'
                ]
            },
            test : {
                src : [
                    'test/**/*.js'
                ]
            }
        },

        /**
         * Mocha Test Task.
         */
        mochaTest : {
            spec : {
                options : {
                    require : 'test/setup/node.js',
                    clearRequireCache : true,
                    mocha : require('mocha')
                },
                src : [
                    'test/spec/**/*.js'
                ]
            }
        },
        
        /**
         * Configures task used to pre process files
         */
        preprocess : {  
            lib : {
                src : 'src/umd-wrapper.js',
                dest : 'dist/oauth.js'
            }
        }, 
        
        /**
         * Store coverage Task.
         */
        storeCoverage: {
            options: {
                dir: 'coverage'
            }
        },
        
        /**
         * Task used to minify the library.
         */
        uglify: {   
            lib: {
                src: 'dist/oauth.js',
                dest: 'dist/oauth.min.js',
                options: {
                    sourceMap: true
                }
            }
        },
        
        /**
         * Watch Task.
         */
        watch: {
            tests: {
                options: {
                    spawn: false
                },
                files: ['src/**/*.js', 'test/spec/**/*.js'],
                tasks: ['test']
            }
        }

    };  /* Grunt project configuration object */

    // This has to be done before calling 'initConfig' (see https://github.com/sindresorhus/time-grunt)
    require('time-grunt')(grunt);
    
    // Initialize the Grunt Configuration
    grunt.initConfig(gruntConfiguration);

    // Load the Grunt Plugins
    require('load-grunt-tasks')(grunt);

    /**
     * Task used to execute the unit tests of the project.
     */
    grunt.registerTask(
        'test', 
        'Test the library',
        [
            'jshint:src',
            'jshint:test',
            'preprocess', 
            'mochaTest' 
        ]
    );

    /**
     * Task used to build the library.
     */
    grunt.registerTask(
        'build', 
        'Build the library',
        [
            'test',
            'uglify'
        ]
    );

    /**
     * Default task.
     */
    grunt.registerTask('default', [ 'clean', 'build']);

};
