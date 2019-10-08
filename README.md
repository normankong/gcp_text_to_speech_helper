# Google Cloud Function - Text to Speech API
Cloud Function to proceed text to speech

# Request Parameter
Content-Type : "application/json"

```Body 
{
	"identify": "YOUR IDENTIFY",
	"text":"こんにちは",
    "languageCode":"JAPANESE"
}
```

Response
```
{
    code : "000",
    message : Base64 encoded MP3 file
}
```
Failure case
If no URL passed : Bad request

If the image is not contains any text
```
{
    code : "409",
    message : "Error message"
}
```


# Setup
Require a .env file and credential.json which is download from Google Vision API

* .env
GOOGLE_APPLICATION_CREDENTIALS=credential.json
CONFIG_FILE=./translate_config.json
DEFAULT_LANGUAGE_CODE=ENGLISH
```

* credential.json
```
{
    "type": "service_account",
    "project_id": "",
    "private_key_id": "",
    "private_key": "-----BEGIN PRIVATE KEY-----\\nDn6T1LbNI8Z+Wwc7z52tY=\n-----END PRIVATE KEY-----\n",
    "client_email": "xxxxx@appspot.gserviceaccount.com",
    "client_id": "xxxx",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/%40appspot.gserviceaccount.com"
}
```

* translate_config.json
```
{
    "data": [
        {
            "code": "CHINESE",
            "desc": "中文",
            "translateCode": "zh-TW",
            "speechCode": "zh"
        },
        {
            "code": "ENGLISH",
            "desc": "英文",
            "translateCode": "en",
            "speechCode": "en-US"
        }
    ]
}
```
# Deployment
* Local Simulator  (With functions-framework)
    npm start

# Improved Security
* Require to provide JWT token which is pre-generated offline
