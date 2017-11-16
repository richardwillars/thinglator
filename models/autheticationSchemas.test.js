const authenticationSchemas = require('./authenticationSchemas');

describe('models/authenticationSchemas', () => {
  it('should export the schemas', () => {
    expect(authenticationSchemas).toMatchSnapshot();
  });
});
