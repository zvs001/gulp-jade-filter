
var minimatch = require("minimatch");

function Updater(option){

	this.tree = option.tree;
	this.match = option.match;

	if(!this.cashe) this.cashe = [];
	if(!this.updateList) this.updateList = [];
	
	context = this;
	return this;
}

Updater.prototype.getID = function(relative) {
	var i = 0;
	for(i; i < this.cashe.length; i++){
		if(this.cashe[i].relative === relative){
			return i;
		}
	}
	return -1;
}

Updater.prototype.saveCashe = function(relative, file){
	if(minimatch(relative, this.match)){

		this.cashe.push({
			relative: relative,
			file: file
		});

	}
}

Updater.prototype.clearCashe = function(){
	this.cashe = [];
	this.updateList = [];
}


Updater.prototype.update = function (id) {
	var context = this;

	if(minimatch(context.tree[id].relative, context.match)) safePush(context.updateList, id);

	this.tree.getParent(id, function(parentID){
		if(minimatch(context.tree[parentID].relative, context.match)) safePush(context.updateList, parentID);
	});
}

Updater.prototype.push = function (context) {
	var i;
	for(i=0; i < this.updateList.length; i++){
		var rel = this.tree[this.updateList[i]].relative
		var id = this.getID(rel);
		if(this.cashe[id].file) context.push(this.cashe[id].file);
	}
}



module.exports = function(option) {
	return new Updater(option);
} 


var safePush = function(arr, value) {
	if(!arr) return [value];
	if(arr.indexOf(value) == -1) arr.push(value);
	return arr;
}