module.exports = function configJSON(req) {

  console.log('config ', req.headers.host);
  return {
    "workflowApiVersion": "1.1",
    "metaData": {
      "icon": "images/icon.png",
      "iconSmall": "images/iconSmall.png",
      "category": "message"
    },
    "type": "REST",
    "lang": {
      "en-US": {
        "name": "Send SMS",
        "description": "A Template for a custom Journey Builder activity",
        "step1Label": "Configure Activity"
      }
    },
    "arguments": {
      "execute": {
        "inArguments": [{
          Mobile_Number: 9003351911
        }
        ],
        "outArguments": [],
        "url": `https://${req.headers.host}/modules/sms-activity/execute`,
        "verb": "POST",
        "body": "",
        "header": "",
        "format": "json",
        "useJwt": true,
        "timeout": 10000
      }
    },
    "configurationArguments": {
      "save": {
        "url": `https://${req.headers.host}/modules/sms-activity/save`,
        "verb": "POST",
        "useJwt": true
      },
      "publish": {
        "url": `https://${req.headers.host}/modules/sms-activity/publish`,
        "verb": "POST",
        "useJwt": true
      },
      "stop": {
        "url": `https://${req.headers.host}/modules/sms-activity/stop`,
        "verb": "POST",
        "useJwt": true
      },
      "validate": {
        "url": `https://${req.headers.host}/modules/sms-activity/validate`,
        "verb": "POST",
        "useJwt": true
      }
    },
    "wizardSteps": [{ "label": "Personalize Message", "key": "step1" }],
    "userInterfaces": {
      "configModal": {
        "height": 450,
        "width": 800,
        "fullscreen": false
      }
    }
  };
};
