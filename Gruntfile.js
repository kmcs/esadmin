// requires
var util = require('util');
var qx = require("../../lib/qooxdoo-trunk/tool/grunt");

// grunt
module.exports = function(grunt) {
  var config = {

    generator_config: {
      let: {
      }
    },

    common: {
      "APPLICATION" : "kmcs.esadmin",
      "QOOXDOO_PATH" : "../../lib/qooxdoo-trunk",
      "LOCALES": ["en"],
      "QXTHEME": "kmcs.esadmin.theme.Theme"
    }

    /*
    myTask: {
      options: {},
      myTarget: {
        options: {}
      }
    }
    */
  };

  var mergedConf = qx.config.mergeConfig(config);
  // console.log(util.inspect(mergedConf, false, null));
  grunt.initConfig(mergedConf);

  qx.task.registerTasks(grunt);

  // grunt.loadNpmTasks('grunt-my-plugin');
};
