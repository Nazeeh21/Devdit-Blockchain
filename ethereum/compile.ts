// import path from 'path';
// import solc from 'solc';
// import fs from 'fs-extra';

const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');


const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const postPath = path.resolve(__dirname, 'contracts', 'Post.sol');
const source = fs.readFileSync(postPath, 'utf-8');
const output = solc.compile(source, 1);

fs.ensureDirSync(buildPath);

// console.log(output.contracts);
for (let post in output.contracts) {
  console.log(post)
  fs.outputJsonSync(
    path.resolve(buildPath, post.replace(/:/g, '') + '.json'),
    output.contracts[post]
  );
}
