var Clay = require('pebble-clay');
var clayConfig = [
  {
    "type": "heading",
    "defaultValue": "Covetous Settings"
  },
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "defaultValue": "Color Scheme"
      },
      {
        "type": "radiogroup",
        "messageKey": "KEY_INVERTED",
        "label": "Theme",
        "defaultValue": "0",
        "options": [
          {
            "label": "Default (Dark)",
            "value": "0"
          },
          {
            "label": "Inverted (Light)",
            "value": "1"
          }
        ]
      }
    ]
  },
  {
    "type": "submit",
    "defaultValue": "Save"
  }
];

var clay = new Clay(clayConfig);
