module.exports = function configJSON(req) {
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
        "inArguments": [
          {
            "emailAddress": "{{InteractionDefaults.Email}}"
          }
        ],
        "outArguments": [],
        "url": "https://${req.headers.host}/journey/execute",
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
        "url": "https://${req.headers.host}/journey/save",
        "verb": "POST",
        "useJwt": true
      },
      "publish": {
        "url": "https://${req.headers.host}/journey/publish",
        "verb": "POST",
        "useJwt": true
      },
      "stop": {
        "url": "https://${req.headers.host}/journey/stop",
        "verb": "POST",
        "useJwt": true
      },
      "validate": {
        "url": "https://${req.headers.host}/journey/validate",
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
