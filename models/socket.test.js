const socketModule = require('./socket');

describe('models/socket', () => {
  it('should export the schema', () => {
    const constants = {
      socket: {
        a: 'A',
        b: 'B',
        c: 'C',
        d: 'D',
      },
    };
    const events = {
      a: 'A',
      b: 'B',
      c: 'C',
      d: 'D',
      e: 'E',
      f: 'F',
      g: 'G',
    };

    const mongoose = {
      model: () => {},
      Schema: class Schema {},
    };
    const socketModel = socketModule(mongoose, events, constants);
    expect(socketModel.schema).toMatchSnapshot();
  });

  it('should export the model', () => {
    const constants = {
      socket: {
        a: 'A',
        b: 'B',
        c: 'C',
        d: 'D',
      },
    };
    const events = {
      a: 'A',
      b: 'B',
      c: 'C',
      d: 'D',
      e: 'E',
      f: 'F',
      g: 'G',
    };

    const modelMock = {};
    const mongoose = {
      model: jest.fn().mockReturnValue(modelMock),
      Schema: class Schema {
        constructor(props) {
          this.props = props;
        }
      },
    };
    const socketModel = socketModule(mongoose, events, constants);

    expect(socketModel.model).toEqual(modelMock);
    expect(mongoose.model).toHaveBeenCalledTimes(1);
    expect(mongoose.model.mock.calls[0][0]).toEqual('Socket');
    const initialisedSchema = mongoose.model.mock.calls[0][1];
    expect(initialisedSchema instanceof mongoose.Schema).toEqual(true);
    expect(initialisedSchema.props).toMatchSnapshot();
  });
});
