describe('<%= name %>', function() {

	beforeEach(module('<%= appname %>'));

	it('should ...', inject(function($filter) {

        var filter = $filter('<%= name %>');

		expect(filter('input')).toEqual('filter result');

	}));

});