/*global module:false*/

var env = require("./.env.js"),
    s3 = require("./.s3.js");

module.exports = function (grunt) {

  var message = grunt.option('m');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
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
            dest: ".",
            cwd: "dist/",
            src: ["**"],
            action: "upload",
            differential: true
          }
        ]
      }
    },

    push: {
      options: {
        tagName: "%VERSION%",
        commitMessage: "Release v%VERSION%" + (message ? ' - ' + message : '')
      }
    },

    shell: {
      build: {
        command: function (project) {
          return "cd ../" + project + "; grunt build;";
        }
      },
      bump: {
        command: function (project, release) {
          return "cd ../" + project + "; grunt bumpup:" + release;
        }
      }
    },

    "merge-copy": {
      release: {
        options: {
          destination: "dist/",
          directories: [ "../main/dist/", "../lab/dist/" ]
        }
      }
    }

  });

  // These plugins provide necessary tasks.

  grunt.loadNpmTasks("grunt-shell");
  grunt.loadNpmTasks("grunt-aws-s3");
  grunt.loadNpmTasks("grunt-merge-copy");
  grunt.loadNpmTasks("grunt-push-release");
  grunt.loadNpmTasks("grunt-contrib-clean");

  // Default task.

  // Setup tasks will clean the release directory, build the main
  // project then the lab project and merge the two into the release
  grunt.registerTask("deploy:setup", ["clean", "shell:build:main", "shell:build:lab",  "merge-copy:release"]);
  grunt.registerTask("deploy:setup", ["clean", "shell:build:main", "shell:build:lab",  "merge-copy:release"]);

  // Deploy tasks perform shell bumps for patch/minor/major versions,
  // then calls setup before pushing patch/minor/major versions and
  // then releasing the static page to AWS S3 bucket
  grunt.registerTask("deploy:major", ["shell:bump:main:major", "deploy:setup", "push:major", "aws_s3:release"]);
  grunt.registerTask("deploy:minor", ["shell:bump:main:minor", "deploy:setup", "push:minor", "aws_s3:release"]);
  grunt.registerTask("deploy:patch", ["shell:bump:main:patch", "deploy:setup", "push:patch", "aws_s3:release"]);
  grunt.registerTask("deploy", ["deploy:patch"]);

};
