module.exports = function (grunt) {
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-openui5");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-zip");
  grunt.loadNpmTasks("grunt-nwabap-ui5uploader");
  grunt.loadNpmTasks("grunt-connect-proxy");

  // Parameters for deploy (comes from console command)
  var sApp = grunt.option("app");
  var sLevel = grunt.option("level");
  var sLib = grunt.option("lib");
  // var sPlugin = grunt.option("plugin");

  if (sApp === undefined) {
    sApp = "zjira_project_register";
  }

  if (sLevel === undefined) {
    sLevel = "0";
  }

  if (sLib === undefined) {
    sLib = "zjiralib";
  }

  // Structure of MOL
  var oAuth = {
    server: "http://sap-tm.inthemelab.com:8000",
    login: "VILSONAYU",
    pass: "QAZwsx123!",
    packages: [
      {
        package: "ZJIRA",
        transportno: "TMDK910450",
        project: "zjira",
        apps: {
          zjira_project_register: {
            bspContainer: "ZJIRA_PROJECT",
            bspDescription: "Jira Project UI5 application",
            prefix: "intheme/zjira_project_register",
          },
        },
      },
    ],

    libs: {
      zjiralib: {
        package: "ZJIRA",
        bspContainer: "ZJIRALIB",
        transportno: "TMDK910450",
        bspDescription: "JIRA LIB FOR UI5 APPLICATION",
      },
    },
  };

  grunt.initConfig({
    zip: {
      "src.zip": ["src/**/*.*", "Gruntfile.js"],
    },

    unzip: {
      "./": "src.zip",
    },

    clean: ["src/dist"],

    connect: {
      server: {
        options: {
          port: 8000,
          hostname: "localhost",
          livereload: false,
          keepalive: true,
          middleware: function (connect, options, middlewares) {
            middlewares.unshift(
              require("grunt-connect-proxy/lib/utils").proxyRequest
            );
            return middlewares;
          },
        },
        proxies: [
          {
            context: "/sap/bc/ui5_ui5/sap/zjiralib/",
            host: "localhost",
            port: 8000,
            https: false,
            rewrite: {
              "^/sap/bc/ui5_ui5/sap/zjiralib/": "/ui/zjira/zjiralib/src/",
            },
          },

          {
            context: "/sap/",
            host: "10.11.12.4",
            port: 8000,
            secure: false,
            https: false,
            header: "Basic " + new Buffer.from("VILSONAYU:QAZwsx123!"),
          },
        ],
      },
    },

    openui5_connect: {
      server: {
        options: {
          appresources: "src",
          resources:
            "C:/Users/АнтонВильсон/Desktop/Work/InThemJira/UI5/sapui5-sdk-1.65.16/resources",
          testresources:
            "C:/Users/АнтонВильсон/Desktop/Work/InThemJira/UI5/sapui5-sdk-1.65.16/test-resources",
          proxypath: "proxy",
        },
      },
    },

    openui5_preload: {
      zjiralib: {
        options: {
          resources: {
            cwd: "src/ui/zjira/zjiralib/src",
            prefix: "jira/lib",
          },
          dest: "src/dist/ui/zjira/zjiralib/",
        },
        components: true,
        libraries: true,
      },
    },

    nwabap_ui5uploader: {
      options: {
        conn: {
          server: oAuth.server,
        },
        auth: {
          user: oAuth.login,
          pwd: oAuth.pass,
        },
      },
      upload_build: {
        options: {
          ui5: {
            package: oAuth.packages[sLevel].package,
            transportno: oAuth.packages[sLevel].transportno,
            bspcontainer: oAuth.packages[sLevel].apps[sApp].bspContainer,
            bspcontainer_text: oAuth.packages[sLevel].apps[sApp].bspDescription,
          },
          resources: {
            cwd:
              "src/dist/ui/" +
              oAuth.packages[sLevel].project +
              "/" +
              sApp +
              "/webapp",
            src: "**/*.*",
          },
        },
      },

      upload_library: {
        options: {
          ui5: {
            package: oAuth.libs[sLib].package,
            transportno: oAuth.libs[sLib].transportno,
            bspcontainer: oAuth.libs[sLib].bspContainer,
            bspcontainer_text: oAuth.libs[sLib].bspDescription,
          },
          resources: {
            cwd: "src/dist/ui/zjira/" + sLib,
            src: "**/*.*",
          },
        },
      },
    },
  });

  grunt.registerTask("initBuild", function () {
    oAuth.packages.forEach(function (oPackage) {
      Object.keys(oPackage.apps).forEach(function (sAppName) {
        var sProject = oPackage.project;
        var sPrefix = oPackage.apps[sAppName].prefix;
        grunt.config.set("openui5_preload." + sAppName, {
          options: {
            resources: {
              cwd: "src/ui/" + sProject + "/" + sAppName + "/webapp",
              prefix: sPrefix,
            },
            dest: "src/dist/ui/" + sProject + "/" + sAppName + "/webapp",
            compress: true,
          },
          components: true,
        });
      });
    });
  });

  grunt.registerTask("copy", function () {
    // Copying remaining files of apps
    oAuth.packages.forEach(function (oPackage) {
      for (var app in oPackage.apps) {
        grunt.file.copy(
          "src/ui/" + oPackage.project + "/" + app + "/webapp",
          "src/dist/ui/" + oPackage.project + "/" + app + "/webapp"
        );
      }
    });

    // Copying remaining files of libs
    for (var lib in oAuth.libs) {
      grunt.file.copy("src/ui/zjira/" + lib + "/src", "src/dist/ui/zjira/" + lib);
    }

  });

  grunt.registerTask("serve", function () {
    grunt.task.run(["configureProxies:server", "openui5_connect:server"]);
  });

  grunt.registerTask("deploy", ["nwabap_ui5uploader:upload_build"]);
  
  grunt.registerTask("deploy_lib", ["nwabap_ui5uploader:upload_library"]);

  grunt.registerTask("build", [
    "clean",
    "initBuild",
    "openui5_preload",
    "copy",
  ]);
};
