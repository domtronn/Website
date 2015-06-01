/*global module:false*/

var env = require('./.env.js'), 
		s3 = require('./.s3.js');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		bumpup: 'package.json',
		clean: [ "release/" ], 
		
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
                cwd: 'release/<%= pkg.version %>', 
                src: ['**'], 
                action: 'upload', 
                differential: true
            }
        ]
			}
		},
		
		'merge-copy': {
			release: {
				options: {
					destination: 'release/<%= pkg.version %>',
					directories: [ 'main/dist/', 'lab/dist/' ]
				}
			}
		}
		
  });

  // These plugins provide necessary tasks.

	grunt.loadNpmTasks('grunt-bumpup');
	grunt.loadNpmTasks('grunt-aws-s3');
	grunt.loadNpmTasks('grunt-merge-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	
  // Default task.

	grunt.registerTask('deploy', [ 'clean', 'merge-copy:release', 'aws_s3:release', 'clean', 'bumpup:major' ]);
	
};
