/*
 * OpenZWave test program.
 */

const ZWave = require('openzwave-shared');
const zwave = new ZWave({
    ConsoleOuput: true,
    Logging: false
});

const nodes = [];

zwave.on('driver ready', (homeid) => {
    console.log('scanning homeid=0x%s...', homeid.toString(16));
});

zwave.on('driver failed', () => {
    console.log('failed to start driver');
    zwave.disconnect();
    process.exit();
});

zwave.on('node added', (nodeid) => {
    console.log('node added', nodeid);
    nodes[nodeid] = {
        manufacturer: '',
        manufacturerid: '',
        product: '',
        producttype: '',
        productid: '',
        type: '',
        name: '',
        loc: '',
        classes: {},
        ready: false
    };
});

zwave.on('value added', (nodeid, comclass, value) => {
	// console.log('value added', nodeid, comclass, value);
    if (!nodes[nodeid].classes[comclass]) { nodes[nodeid].classes[comclass] = {}; }
    nodes[nodeid].classes[comclass][value.index] = value;
});

zwave.on('node event', (nodeid, nodeEvt) => {
    console.log('node event', nodeid, nodeEvt);
});

zwave.on('value changed', (nodeid, comclass, value) => {
	// console.log('value changed', nodeid, comclass, value);
    if (nodes[nodeid].ready) {
        console.log('node%d: changed: %d:%s:%s->%s', nodeid, comclass,
			value.label,
			nodes[nodeid].classes[comclass][value.index].value,
			value.value);
    }
    nodes[nodeid].classes[comclass][value.index] = value;
});

zwave.on('value removed', (nodeid, comclass, index) => {
    if (nodes[nodeid].classes[comclass] &&
		nodes[nodeid].classes[comclass][index]) { delete nodes[nodeid].classes[comclass][index]; }
});

zwave.on('node ready', (nodeid, nodeinfo) => {
    nodes[nodeid].manufacturer = nodeinfo.manufacturer;
    nodes[nodeid].manufacturerid = nodeinfo.manufacturerid;
    nodes[nodeid].product = nodeinfo.product;
    nodes[nodeid].producttype = nodeinfo.producttype;
    nodes[nodeid].productid = nodeinfo.productid;
    nodes[nodeid].type = nodeinfo.type;
    nodes[nodeid].name = nodeinfo.name;
    nodes[nodeid].loc = nodeinfo.loc;
    nodes[nodeid].ready = true;
    console.log('node%d: %s, %s', nodeid,
		nodeinfo.manufacturer ? nodeinfo.manufacturer : `id=${nodeinfo.manufacturerid}`,
		nodeinfo.product ? nodeinfo.product : `product=${nodeinfo.productid
		}, type=${nodeinfo.producttype}`);
    console.log('node%d: name="%s", type="%s", location="%s"', nodeid,
		nodeinfo.name,
		nodeinfo.type,
		nodeinfo.loc);
    for (const comclass in nodes[nodeid].classes) {
        switch (comclass) {
        case 0x25: // COMMAND_CLASS_SWITCH_BINARY
        case 0x26: // COMMAND_CLASS_SWITCH_MULTILEVEL
            zwave.enablePoll(nodeid, comclass);
            break;
        }
        const values = nodes[nodeid].classes[comclass];
        console.log('node%d: class %d', nodeid, comclass);
        const indexes = {
            101: true,
            111: true,
            102: true,
            112: true,
            3: true,
            4: true,
            5: true,
            6: true,
            7: true,
            201: true,
            202: true,
            203: true,
            204: true
        };
        for (const idx in values) {
			// if (indexes[idx] === true) {
            console.log(values[idx].label);
            console.log(`{node_id: ${nodeid},class_id: ${values[idx].class_id},instance: ${values[idx].instance},index: ${idx}}, ${values[idx].value}`);
			// }
        }
    }
});

zwave.on('notification', (nodeid, notif) => {
    switch (notif) {
    case 0:
        console.log('node%d: message complete', nodeid);
        break;
    case 1:
        console.log('node%d: timeout', nodeid);
        break;
    case 2:
        console.log('node%d: nop', nodeid);
        break;
    case 3:
        console.log('node%d: node awake', nodeid);
        break;
    case 4:
        console.log('node%d: node sleep', nodeid);
        break;
    case 5:
        console.log('node%d: node dead', nodeid);
        break;
    case 6:
        console.log('node%d: node alive', nodeid);
        break;
    }
});

zwave.on('scan complete', () => {
    console.log('====> scan complete, hit ^C to finish.');
    console.log(nodes);

	// Add a new device to the ZWave controller
	// if (zwave.hasOwnProperty('beginControllerCommand')) {
	// 	// using legacy mode (OpenZWave version < 1.3) - no security
	// 	zwave.beginControllerCommand('AddDevice', true);
	// } else {
	// 	// using new security API
	// 	// set this to 'true' for secure devices eg. door locks
	// 	zwave.addNode(false);
	// }

	// Group 1 Reports
    zwave.setValue({
        node_id: 4,
        class_id: 112,
        instance: 1,
        index: 101
    }, 241);

	// Group 1 Interval
    zwave.setValue({
        node_id: 4,
        class_id: 112,
        instance: 1,
        index: 111
    }, 60);

	// Group 2 Reports
    zwave.setValue({
        node_id: 4,
        class_id: 112,
        instance: 1,
        index: 102
    }, 1);

	// Group 2 Interval
    zwave.setValue({
        node_id: 4,
        class_id: 112,
        instance: 1,
        index: 112
    }, 72000);

	// On time
    zwave.setValue({
        node_id: 4,
        class_id: 112,
        instance: 1,
        index: 3
    }, 60);

	// Enable Motion Sensor
    zwave.setValue({
        node_id: 4,
        class_id: 112,
        instance: 1,
        index: 4
    }, 1);

	// PIR sensitivity
    zwave.setValue({
        node_id: 4,
        class_id: 112,
        instance: 1,
        index: 5
    }, 1);
});


zwave.on('controller command', (r, s) => {
    console.log('controller commmand feedback: r=%d, s=%d', r, s);
});

zwave.connect('/dev/cu.usbmodem1421');

process.on('SIGINT', () => {
    console.log('disconnecting...');
    zwave.disconnect('/dev/cu.usbmodem1421');
    process.exit();
});
