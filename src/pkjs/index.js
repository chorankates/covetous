// Configuration page for Covetous watchface

var Clay = require('pebble-clay');
var clayConfig = [
  {
    "type": "heading",
    "defaultValue": "Covetous Settings"
  },
  {
    "type": "toggle",
    "messageKey": "KEY_INVERTED",
    "label": "Inverted Colors",
    "defaultValue": false,
    "description": "Swap black and white colors"
  },
  {
    "type": "submit",
    "defaultValue": "Save"
  }
];

var clay = new Clay(clayConfig);

