'use strict';
var path = require('path');

module.exports = exports = function getFilepath(sourceFile, targetFile, opt) {
  var base = opt.relative ? path.dirname(targetFile.path) : sourceFile.cwd;

  var filepath = unixify(path.relative(base, sourceFile.path));

  if (opt.ignorePath.length) {
    filepath = removeBasePath(opt.ignorePath, filepath);
  }

  if (opt.addPrefix) {
    filepath = addPrefix(filepath, opt.addPrefix);
  }

  if (opt.addRootSlash) {
    filepath = addRootSlash(filepath);
  } else if (!opt.addPrefix) {
    filepath = removeRootSlash(filepath);
  }

  if (opt.addSuffix) {
    filepath = addSuffix(filepath, opt.addSuffix);
  }

  return filepath;
};

function unixify(filepath) {
  return filepath.replace(/\\/g, '/');
}
function addRootSlash(filepath) {
  return filepath.replace(/^\/*([^\/])/, '/$1');
}
function removeRootSlash(filepath) {
  return filepath.replace(/^\/+/, '');
}
function addPrefix(filepath, prefix) {
  return prefix + addRootSlash(filepath);
}
function addSuffix(filepath, suffix) {
  return filepath + suffix;
}

function removeBasePath(basedirs, filepath) {
  return basedirs.map(unixify).reduce(function (path, remove) {
    if (path[0] === '/' && remove[0] !== '/') {
      remove = '/' + remove;
    }
    if (path[0] !== '/' && remove[0] === '/') {
      path = '/' + path;
    }
    if (remove && path.indexOf(remove) === 0) {
      return path.slice(remove.length);
    }
    return path;
  }, filepath);
}