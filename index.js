var es = require('event-stream');
var spawn = require('child_process').spawn;
var glob = require('simple-glob');
var fs = require('fs');

var CucumberCLI = require('cucumber').Cli;

var binPath = (process.platform === 'win32') ? '.\node_modules\.bin\cucumber-js.cmd' : './node_modules/cucumber/bin/cucumber.js';

binPath = fs.existsSync(binPath) ? binPath : __dirname + ((process.platform === 'win32') ? '\\' : '/') + binPath;

var cucumber = function(options) {
    var runOptions = [];

    // load support files and step_definitions from options
    var files = [];
    if (options.support) {
        files.concat(glob([].concat(options.support)));
    }

    if (options.steps) {
        files.concat(glob([].concat(options.steps)));
    }

    files.forEach(function(file) {
        runOptions.push('-r');
        runOptions.push(file);
    });

    runOptions.push('-f');
    var format = options.format || 'pretty';
    runOptions.push(format);


    var run = function(argument, callback) {
        var filename = argument.path;
        if (filename.indexOf(".feature") === -1) {
            return callback();
        }

        var processOptions = runOptions.slice(0);
        processOptions.push(filename);

        var cli = CucumberCLI(processOptions);
        cli.run(function(code) {

        });
        return callback();
    };

    return es.map(run);
};

module.exports = cucumber;
