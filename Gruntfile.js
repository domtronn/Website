/*global module:false*/

var env = require('./.env.js'), 
		s3 = require('./.s3.js');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: [ "dist/" ], 
		
		aws_s3: {
			release: {
				options: {
					accessKeyId: s3.accessKeyId,          
          secretAccessKey: s3.secretAccessKey,
          bucket: env.s3.bucket,    
          region: env.s3.region,        
          sslEnabled: false
				},
				files: [
          {
            expand: true, 
            dest: '.', 
            cwd: 'dist/', 
            src: ['**'], 
            action: 'upload', 
            differential: true
          }
        ]
			}
		},

		push: {
			options: { tagName: '%VERSION%' }
		}, 
		
		'merge-copy': {
			release: {
				options: {
					destination: 'dist/',
					directories: [ '../main/dist/', '../lab/dist/' ]
				}
			}
		}
		
  });

  // These plugins provide necessary tasks.

	grunt.loadNpmTasks('grunt-aws-s3');
	grunt.loadNpmTasks('grunt-merge-copy');
	grunt.loadNpmTasks('grunt-push-release');
	grunt.loadNpmTasks('grunt-contrib-clean');
	
  // Default task.

	grunt.registerTask('deploy:major', [ 'clean', 'merge-copy:release', 'push:major', 'aws_s3:release']);
	grunt.registerTask('deploy:minor', [ 'clean', 'merge-copy:release', 'push:minor', 'aws_s3:release']);
	
};
