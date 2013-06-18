angular.module('<%= appname %>').directive('<%= _.classify(name) %>', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs, fn) {


		}
	};
});