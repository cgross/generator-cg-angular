angular.module('<%= appname %>').filter('<%= _.camelize(name) %>', function() {
	return function(input,arg) {
		return 'output';
	};
});