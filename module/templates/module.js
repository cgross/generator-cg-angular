angular.module('<%= _.slugify(name) %>', ['ui.bootstrap','ui.utils','<%= routerModuleName %>','ngAnimate']);
<% if (!uirouter) { %>
angular.module('<%= _.slugify(name) %>').config(function($routeProvider) {

    /* Add New Routes Above */

});
<% } %><% if (uirouter) { %>
angular.module('<%= _.slugify(name) %>').config(function($stateProvider) {

    /* Add New States Above */

});
<% } %>
