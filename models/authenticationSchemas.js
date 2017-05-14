const AuthenticationSchemas = {
    requested: {
        RequestData: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
                type: {
                    type: 'string'
                },
                message: {
                    type: 'string'
                },
                button: {
                    type: 'object',
                    properties: {
                        url: {
                            type: 'string'
                        },
                        label: {
                            type: 'string'
                        }
                    },
                    required: [
                        'url',
                        'label'
                    ]
                },
                dataLabel: {
                    type: 'string'
                },
                next: {
                    type: 'object',
                    properties: {
                        http: {
                            type: 'string'
                        },
                        socket: {
                            type: 'object',
                            properties: {
                                event: {
                                    type: 'string'
                                },
                                step: {
                                    type: 'integer'
                                }
                            },
                            required: [
                                'event',
                                'step'
                            ]
                        }
                    },
                    required: [
                        'http',
                        'socket'
                    ]
                }
            },
            required: [
                'type',
                'message',
                'dataLabel',
                'next'
            ]
        },
        ManualAction: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
                type: {
                    type: 'string'
                },
                message: {
                    type: 'string'
                },
                next: {
                    type: 'string'
                }
            },
            required: [
                'type',
                'message',
                'next'
            ]
        }
    },
    returned: {
        RequestData: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
                data: {
                    type: 'string'
                }
            },
            required: [
                'data'
            ]
        },
        ManualAction: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {

            },
            required: [

            ]
        }
    }

};


module.exports = AuthenticationSchemas;
