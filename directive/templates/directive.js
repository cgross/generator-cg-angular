angular.module('<%= appname %>').directive('<%= _.classify(name) %>', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {

		},
		templateUrl: 'directives/<%= name %>/<%= name %>.html',
		link: function(scope, element, attrs, fn) {


		}
	};
});
