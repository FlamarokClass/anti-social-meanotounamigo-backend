const fs = require('fs');
const path = require('path');

const models = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file !== 'index.js' &&
      file.endsWith('.js')
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file));
    const modelName = model.modelName || path.basename(file, '.js');
    models[modelName] = model;
  });

module.exports = models;