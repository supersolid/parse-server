const auth = require('../src/Auth');
const Config = require('../src/Config');
const rest = require('../src/rest');

describe('Persist schema cache', () => {
	beforeEach((done) => {
		reconfigureServer({
			persistSchemaCache: true,
			schemaCacheTTL: 30000
		}).then(() => {
			done();
		});
	});

  it('can perform multiple create and query operations', (done) => {
	  let config = fakeRequestForConfig();
	  let nobody = auth.nobody(config);
	  rest.create(config, nobody, 'Foo', {type: 1}).then(() => {
		  config = fakeRequestForConfig();
		  nobody = auth.nobody(config);
		  return rest.create(config, nobody, 'Foo', {type: 2});
	  }).then(() => {
		  config = fakeRequestForConfig();
		  nobody = auth.nobody(config);
		  return rest.create(config, nobody, 'Bar');
	  }).then(() => {
		  config = fakeRequestForConfig();
		  nobody = auth.nobody(config);
		  return rest.find(config, nobody, 'Bar', {type: 1});
	  }).then((response) => {
		  fail('Should throw error');
		  done();
	  }, (error) => {
		  config = fakeRequestForConfig();
		  nobody = auth.nobody(config);
		  expect(error).toBeDefined();
		  return rest.find(config, nobody, 'Foo', {type: 1});
	  }).then((response) => {
		  config = fakeRequestForConfig();
		  nobody = auth.nobody(config);
		  expect(response.results.length).toEqual(1);
		  done();
	  });
	});
});

const fakeRequestForConfig = function() {
	return new Config('test');
};
