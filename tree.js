var tree = [];

var safePush = function(arr, value) {
	if(!arr) return [value];
	if(arr.indexOf(value) == -1) arr.push(value);
	return arr;
}

tree.setParent = function(parent, children) {
	if( !children ) return
	var i
	for( i = 0; i < children.length; i++ ){
		var id = this.getID(children[i]);
		if(id == -1) {
			var index = this.create(children[i]);
			this[index].parent = safePush(this[index].parent, parent);
		}
		else this[id].parent = safePush(this[id].parent, parent)
	}
}


tree.getID = function(relative) {
	var i = 0;
	for(i; i < this.length; i++){
		if(this[i].relative === relative){
			return i;
		}
	}
	return -1;
}

//one by one get all parents by child id
tree.getParent = function (id, callback) {
	
	if(!this[id].parent) return

	var i;
	for( i = 0; i < this[id].parent.length; i++ ){
		var parentId = this.getID(this[id].parent[i]);
		callback(parentId);
		if(this[parentId].parent) this.getParent(parentId, callback);
	}

}

/*
vars: 
1: relative string
2: childrens array
3: date string
*/
tree.create = function(rel, children, mtime){
	var index = tree.push({
		relative: rel,
		childern: children,
		mtime: mtime
	}) - 1;
	this.setParent(rel, children);
	return index;
}

tree.update = function(index, rel, children, mtime){
	this[index].relative = rel;
	this[index].children = children;
	this[index].mtime = mtime;

	this.setParent(rel, children);
	return index;
}

module.exports = tree