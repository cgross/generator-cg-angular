describe('<%= _.camelize(name) %>', function() {

	beforeEach(module('<%= appname %>'));

	it('should ...', inject(function($filter) {

        var filter = $filter('<%= _.camelize(name) %>');

		expect(filter('input')).toEqual('output');

	}));

});