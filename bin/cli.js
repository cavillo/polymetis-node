#!/usr/bin/env node
const cp = require('child_process');
const fs = require('fs');
const path = require('path');

let SERVICE_NAME;
let SERVICE_DIR;
let TMP_NAME;
let TMP_DIR;

const log = (...args) => console.log('|-> ', ...args);
const logError = (...args) => console.error('Error: ', ...args);

const cleanup = () => {
  if (fs.existsSync(SERVICE_DIR)) {
    cp.execSync(`rm -rf ${SERVICE_DIR}`);
  }
  if (fs.existsSync(TMP_DIR)) {
    cp.execSync(`rm -rf ${TMP_DIR}`);
  }
};

const handleError = (error) => {
  logError('An error was encountered while executing', error.message);
  cleanup();
  process.exit(1);
};

const init = () => {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    logError('SERVICE_NAME required');
    process.exit();
  }
  SERVICE_NAME = args[0];
  SERVICE_DIR = path.join(process.cwd(), SERVICE_NAME);
  TMP_NAME = `.${SERVICE_NAME}-tmp${new Date().getTime()}`;
  TMP_DIR = path.join(process.cwd(), TMP_NAME);

  // check if a folder already exists with this name and fail gracefully
  if (fs.existsSync(SERVICE_DIR)) {
    logError('SERVICE_NAME already exists');
    process.exit();
  }
};

const cloneTemplate = () => {
  cp.execSync(`git clone https://github.com/cavillo/polymetis-node.git ${TMP_NAME} --quiet`);
  cp.execSync(`mv ${TMP_DIR}/template ${SERVICE_NAME}`);

  // remove tmp folder
  cp.execSync(`rm -rf .${SERVICE_NAME}`);
};

const setupServiceProject = () => {
  // getting polymetis current version
  const polymetisPackageJson = path.join(process.cwd(), TMP_NAME, 'package.json');
  const polymetisJson = JSON.parse(fs.readFileSync(polymetisPackageJson, 'utf8'));
  log('Installing polymetis-node version:', polymetisJson.version);

  const packageJson = path.join(SERVICE_DIR, 'package.json');
  const json = JSON.parse(fs.readFileSync(packageJson, 'utf8'));
  json.name = SERVICE_NAME;
  json.description = "";
  json.version = "1.0.0";
  json.author = "";
  json.license = "";
  json.bin = {};
  json.dependencies['polymetis-node'] = polymetisJson.version;

  fs.writeFileSync(packageJson, JSON.stringify(json, null, 2), 'utf8');

  // removing git directory and package lock
  const packageLockJson = path.join(SERVICE_DIR, 'package-lock.json');
  const binDir = path.join(SERVICE_DIR, 'bin');
  const gitDir = path.join(SERVICE_DIR, '.git');
  cp.execSync(`rm -rf ${packageLockJson}`);
  cp.execSync(`rm -rf ${binDir}`);
  cp.execSync(`rm -rf ${gitDir}`);
  cp.execSync(`rm -rf ${TMP_DIR}`);

  // moving env file
  cp.execSync(
    `echo "ENVIRONMENT='local'\nSERVICE='${SERVICE_NAME}'\n\n# Logger mode\n# ALL='0', DEBUG='1', INFO='2', WARN='3', ERROR='4', OFF='5'\nLOGGER_MODE='0'\n\nAPI_PORT='8000'\nAPI_BASE_ROUTE='/api'\n\nRABBITMQ_HOST='localhost'\nRABBITMQ_PORT='5672'\nRABBITMQ_USERNAME='guest'\nRABBITMQ_PASSWORD='guest'" >> ${path.join(SERVICE_DIR, '.env')}`
  );
};

const installPackages = () => {
  cp.execSync(`npm i --prefix ${SERVICE_DIR} --silent`);
};

const printHelp = (SERVICE_NAME) => {
  log(`\tcd ${SERVICE_NAME}`);
  log('');
  log('\tnpm run start       start service');
  log('\tnpm run start-dev   start service with nodemon');
  log('\tnpm run lint        lint');
  log('\tnpm run test        run tests');
  log('\tnpm run build       build');
};

const createService = () => {
  try {
    // clone service folder
    log('Creating service directory');
    cloneTemplate();

    // updating package.json
    log('Setting up service');
    setupServiceProject();

    // installing dependendies
    log('Installing dependendies');
    installPackages();

    log(`Service [${SERVICE_NAME}] created succesfully! ✅\nHappy ts coding! 💪\n`);
    printHelp(SERVICE_NAME);
  } catch (error) {
    handleError(error);
  }
};

// Create service
init();
createService();

