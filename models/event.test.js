const eventModule = require('./event');

describe('models/event', () => {
  it('should export the schema', () => {
    const mongoose = {
      model: () => {},
      Schema: class Schema {},
    };
    const eventModel = eventModule(mongoose);
    expect(eventModel.schema).toMatchSnapshot();
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
    const eventModel = eventModule(mongoose);

    expect(eventModel.model).toEqual(modelMock);
    expect(mongoose.model).toHaveBeenCalledTimes(1);
    expect(mongoose.model.mock.calls[0][0]).toEqual('Event');
    const initialisedSchema = mongoose.model.mock.calls[0][1];
    expect(initialisedSchema instanceof mongoose.Schema).toEqual(true);
    expect(initialisedSchema.props).toMatchSnapshot();
  });
});
