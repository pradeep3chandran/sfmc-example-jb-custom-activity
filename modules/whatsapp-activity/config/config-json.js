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
        "name": "WhatsApp Message",
        "description": "A Template for a custom Journey Builder activity",
        "step1Label": "Configure Activity"
      }
    },
    "arguments": {
      "execute": {
        "url": `https://${req.headers.host}/modules/whatsapp-activity/execute`,
        "verb": "POST",
        "body": "",
        "header": "",
        "format": "json",
        "timeout": 50000,
        "concurrentRequests": 1
      }
    },
    "configurationArguments": {
      "save": {
        "url": `https://${req.headers.host}/modules/whatsapp-activity/save`,
        "verb": "POST"
      },
      "publish": {
        "url": `https://${req.headers.host}/modules/whatsapp-activity/publish`,
        "verb": "POST"
      },
      "stop": {
        "url": `https://${req.headers.host}/modules/whatsapp-activity/stop`,
        "verb": "POST"
      },
      "validate": {
        "url": `https://${req.headers.host}/modules/whatsapp-activity/validate`,
        "verb": "POST"
      }
    },
    "wizardSteps": [{ "label": "Personalize Message", "key": "step1" }],
    "userInterfaces": {
      "configModal": {
        "height": 600,
        "width": 800,
        "fullscreen": false
      }
    },
    "schema": {
      "arguments": {
        "execute": {
          "inArguments": [],
          "outArguments": [{
            "errorCode": {
              "dataType": 'Text',
              "direction": 'out',
              "access": 'visible'
            },
            "status": {
              "dataType": 'Text',
              "direction": 'out',
              "access": 'visible'
            },
            "GUID": {
              "dataType": 'Text',
              "direction": 'out',
              "access": 'visible'
            }
          }]
        }
      }
    }
  };
};
