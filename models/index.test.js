const indexModule = require('./index');
const constants = require('../constants');

describe('models/index', () => {
  it('should export the list of models', () => {
    const mongoose = {
      model: () => {},
      Schema: class Schema {},
    };
    const index = indexModule(mongoose, constants);
    expect(index).toMatchSnapshot();
  });
});
