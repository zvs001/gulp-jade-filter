
var Transform = require('stream').Transform;

var PLUGIN_NAME = 'JadeFilter';
var util = require('util');;
var fs = require("fs");
var path = require("path");



function JadeFilter(options) {
  Transform.call(this, {objectMode: true});
 

  if(!options) options = {};
  this.match = options.minimatch || options.match || "*.jade";
  this.ext = options.ext || "pug";
  this.ext = "." + this.ext.replace(".", "");

  //module
  this.updater = require("./updater")({
    tree: this.tree, 
    match: this.match
  });

  return this;
}

util.inherits(JadeFilter, Transform);

JadeFilter.prototype.tree = require("./tree");

JadeFilter.prototype.getContentString = function(filepath){
  try {
      return fs.readFileSync(filepath).toString();
  } catch (err) {
      console.log("File reading error: " + err);
      return false;
  }
}
JadeFilter.prototype.fixPath = function(arr, srcFile){

  if(path.dirname(this.relative) !== "."){

    var i=0; 
    for(i; i < arr.length; i++){
        arr[i] = path.join( path.dirname(this.relative), arr[i] );
    }
    
  }

  return arr;
}


JadeFilter.prototype.getIncludes = function(fileString){

  var match = fileString.match(/^(?:\s)*(?:include|extends).*/gm);

  if (match) {
    
    match = match.map((match) => match.replace(/\s*(include|extends)./g, ''));
    match = match.map((match) => match.replace(this.ext, '') + this.ext)
    var i = 0;
    for(i = 0; i< match.length; i++){
      match[i] = path.normalize(match[i]);
    }
    return match;
  }
  return ;

}


JadeFilter.prototype.arrayConcat = function(arr1, arr2){
  var i = 0;
  for(i; i < arr2.length; i++){
    if(arr1.indexOf(arr2[i]) == -1 ){
      arr1.push(arr2[i]);
    }
  }
  return arr1;
}

//return parents array
JadeFilter.prototype.getParents = function (relative){
    var isThis = minimatch(relative, this.match);
    var array = [];

    if(minimatch(relative, this.match)){
      array.push(relative);
    }

    var i = 0;
    for(i; i < this.tree.length; i++){
      if(this.tree[i].childrens && this.tree[i].childrens.indexOf(relative) >= 0){
        if(minimatch(this.tree[i].relative, this.match)){
            array = this.arrayConcat(array, this.tree[i].relative);
            array = this.arrayConcat(array, this.getParents(this.tree[i].relative));
        }
      }
    }

    return array;
}
 /*
  base: E:\projects\Projects\005 Eremex\app\jade\
  relative: society-blog-single.jade
  cwd: E:\projects\Projects\005 Eremex
  path: ...
 */
JadeFilter.prototype.readFile = function(srcFile){
    var str = this.getContentString(path.join(srcFile.path));
    var childElements = this.getIncludes(str) || [];
    childElements = this.fixPath(childElements, srcFile);
    return childElements;

}
JadeFilter.prototype._transform = function(srcFile, encoding, done) {
  if (!srcFile || !srcFile.stat) {
    done(new PluginError(PLUGIN_NAME, 'Expected a source file with stats'));
    return;
  }

  this.relative = path.normalize(srcFile.relative);

  // tree >
  var id = this.tree.getID(this.relative)
  if(id === -1){
    var index = this.tree.create(this.relative, this.readFile(srcFile), srcFile.stat.mtime)
    this.updater.update(index);
  }
  else {

    
    //new file or modified
   
    if (!this.tree[id].mtime || this.tree[id].mtime.toString() !== srcFile.stat.mtime.toString()) {
      var index = this.tree.update(id, this.relative, this.readFile(srcFile), srcFile.stat.mtime);
      this.updater.update(index);
    } 
  }


  // cashe >
  this.updater.saveCashe(this.relative, srcFile);


  done();



};


JadeFilter.prototype._flush = function(done) {
  
  this.updater.push(this);
  this.updater.clearCashe();

  done();
};





module.exports = function(options) {
  return new JadeFilter(options);
};
