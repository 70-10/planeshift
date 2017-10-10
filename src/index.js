#!/usr/bin/env node

import prog from "caporal";
import pkg from "../package.json";
// const prog = require("caporal");
// const pkg = require("../package.json");
import readline from "readline";
import ora from "ora";
import path from "path";
import fs from "fs-extra";
import rm from "rimraf";
import logSymbols from "log-symbols";
import home from "user-home";
import download from "./download";

prog
  .version(pkg.version)
  .description("Generate project for template")
  .argument("[app]", "App to deploy")
  .argument("[path]", "Generate Directory path")
  .action(action);

prog.parse(process.argv);

async function action(args, options, logger) {
  // co(function*() {
  if (!args.app) {
    args.app = await askProject();
  }

  const destPath = args.path
    ? path.join(process.cwd(), args.path)
    : process.cwd();
  if (destPath !== process.cwd() && args.path && fs.existsSync(destPath)) {
    throw `${destPath} alredy exists`;
  }

  const tmpPath = path.join(home, ".project-generator", args.app);
  if (fs.existsSync(tmpPath)) {
    rm.sync(tmpPath);
  }

  const spinner = ora(`Download ${args.app}`);
  spinner.start();
  await download(args.app, tmpPath);
  spinner.stop();

  logger.info(logSymbols.success, "Download is success");
  fs.copySync(tmpPath, destPath);
  rm.sync(tmpPath);
  logger.info(logSymbols.success, `Generate ${destPath}`);
  // }).catch(err => logger.error(logSymbols.error, err));
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
