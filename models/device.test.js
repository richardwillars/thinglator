const deviceModule = require('./device');

describe('models/device', () => {
  it('should export the schema', () => {
    const mongoose = {
      model: () => {},
      Schema: class Schema {},
    };
    const deviceModel = deviceModule(mongoose);
    expect(deviceModel.schema).toMatchSnapshot();
  });

  it('should export the model', () => {
    const modelMock = {};
    const mongoose = {
      model: jest.fn().mockReturnValue(modelMock),
      Schema: class Schema {
        constructor(props) {
          this.props = props;
        }
      },
    };
    const deviceModel = deviceModule(mongoose);

    expect(deviceModel.model).toEqual(modelMock);
    expect(mongoose.model).toHaveBeenCalledTimes(1);
    expect(mongoose.model.mock.calls[0][0]).toEqual('Device');
    const initialisedSchema = mongoose.model.mock.calls[0][1];
    expect(initialisedSchema instanceof mongoose.Schema).toEqual(true);
    expect(initialisedSchema.props).toMatchSnapshot();
  });
});
