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
        clean : ['target/**/*'],
        
        /**
         * Coveralls Task.
         */
        coveralls: {
            options: {
                src: 'coverage/lcov.info',
                force: false
            },
            'default': {
                src: 'coverage/lcov.info'
            }
        },
        
        /**
         * Env Task.
         */
        env : {
            coverage : {
                APP_DIR_FOR_CODE_COVERAGE : '../../coverage/src/'
            }
        },
        
        /**
         * Instrument Task.
         */
        instrument : {
            files : 'src/**/*.js', 
            options : {
                lazy : true,
                basePath : 'coverage'
            }
        },
        
        /**
         * JSHint Task.
         */
        jshint : {
            lint : {
                src : [
                    'Gruntfile.js',
                    'src/**/*.js',
                    'test/**/*.js'
                ]
            }
        },
        
        /**
         * Make Report Task.
         */
        makeReport: {
            src: 'coverage/**/*.json',
            options: {
                type: 'lcov',
                dir: 'coverage',
                print: 'detail'
            }
        },
        
        /**
         * Mocha Test Task.
         */
        mochaTest : {
            spec : {
                options : {
                    require : 'test/setup/node.js',
                    reporter : 'dot',
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
                src : 'src/oauth.js',
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
            'jshint', 
            'preprocess', 
            'mochaTest' 
        ]
    );

    /**
     * Task used to generate a coverage report.
     */
    grunt.registerTask(
        'coverage', 
        'Generate coverage report for the library', 
        [
            'env:coverage',
            'instrument',
            'mochaTest',
            'storeCoverage',
            'makeReport',
            'coveralls'
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
