angular.module('<%= _.slugify(appname) %>', ['ui.bootstrap','ui.utils','<%= routerModuleName %>','ngAnimate']);
<% if (!uirouter) { %>
angular.module('<%= _.slugify(appname) %>').config(function($routeProvider) {

    /* Add New Routes Above */
    $routeProvider.otherwise({redirectTo:'/home'});

});
<% } %><% if (uirouter) { %>
angular.module('<%= _.slugify(appname) %>').config(function($stateProvider, $urlRouterProvider) {

    /* Add New States Above */
    $urlRouterProvider.otherwise('/home');

});
<% } %>
angular.module('<%= _.slugify(appname) %>').run(function($rootScope) {

    $rootScope.safeApply = function(fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

});
