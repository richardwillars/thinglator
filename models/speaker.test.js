const speakerModule = require('./speaker');

describe('models/speaker', () => {
  it('should export the schema', () => {
    const constants = {
      speaker: {
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
    const speakerModel = speakerModule(mongoose, events, constants);
    expect(speakerModel.schema).toMatchSnapshot();
  });

  it('should export the model', () => {
    const constants = {
      speaker: {
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
    const speakerModel = speakerModule(mongoose, events, constants);

    expect(speakerModel.model).toEqual(modelMock);
    expect(mongoose.model).toHaveBeenCalledTimes(1);
    expect(mongoose.model.mock.calls[0][0]).toEqual('Speaker');
    const initialisedSchema = mongoose.model.mock.calls[0][1];
    expect(initialisedSchema instanceof mongoose.Schema).toEqual(true);
    expect(initialisedSchema.props).toMatchSnapshot();
  });
});
