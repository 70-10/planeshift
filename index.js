#!/usr/bin/env node

const prog = require("caporal");
const pkg = require("./package.json");
const readline = require("readline");
const co = require("co");
const ora = require("ora");
const downloadGitRepository = require("download-git-repo");
const path = require("path");
const fs = require("fs-extra");
const rm = require("rimraf").sync;
const logSymbols = require("log-symbols");
const home = require("user-home");

prog
  .version(pkg.version)
  .description("Generate project for template")
  .argument("[app]", "App to deploy")
  .argument("[path]", "Generate Directory path")
  .action(action);

prog.parse(process.argv);

function action(args, options, logger) {
  co(function*() {
    if (!args.app) {
      args.app = yield askProject();
    }

    const destPath = args.path
      ? path.join(process.cwd(), args.path)
      : process.cwd();
    if (args.path && fs.existsSync(destPath)) {
      throw `${destPath} alredy exists`;
    }

    const tmpPath = path.join(home, ".project-generator", args.app);
    if (fs.existsSync(tmpPath)) {
      rm(tmpPath);
    }
    yield download(args.app, tmpPath);
    logger.info(logSymbols.success, "Download is success");
    fs.copySync(tmpPath, destPath);
    rm(tmpPath);
    logger.info(logSymbols.success, `Generate ${destPath}`);
  }).catch(err => logger.error(logSymbols.error, err));
}

function askProject() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    rl.question("Please project name: ", answer => {
      rl.close();
      resolve(answer);
    });
  });
}

function download(repository, dirPath) {
  const spinner = ora(`Download ${repository}`);
  spinner.start();
  return new Promise((resolve, reject) => {
    downloadGitRepository(repository, dirPath, err => {
      spinner.stop();
      if (err) {
        reject("Download is failed");
        return;
      }
      resolve();
    });
  });
}
