describe('<%= name %>', function() {

	beforeEach(module('<%= appname %>'));

	it('should ...', inject(function(<%= name %>Filter) {

		expect(<%= name %>Filter('filter input')).toEqual('filter result');

	}));

});