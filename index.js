require('dotenv').config();

const textToSpeech = require('@google-cloud/text-to-speech');

const authHelper = require("./lib/authHelper.js");
const fs = require("fs");
const util = require("util");
let GCP_CLIENT = null; // Lazy Initialzation
let languageMap = [];

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.processTextToSpeech = async (req, res) => {
  console.log(`Process processTextToSpeech`, JSON.stringify(req.body));

  var opts = {
    req: req,
    res: res
  }
  if (!authHelper().verifyToken(opts)) return;

  var text = req.body.text;
  var languageCode = req.body.languageCode;
  if (text == null) res.end("Bad request");

  console.log(`Synthesis ${text} ${languageCode}`)

  initialize();

  // Performs the Text-to-Speech request
  const request = prepareRequest(text, languageCode);
  const [response] = await GCP_CLIENT.synthesizeSpeech(request);
  
  // const writeFile = util.promisify(fs.writeFile);
  // await writeFile('output.mp3', response.audioContent, 'binary');

  let message = Buffer.from(response.audioContent).toString('base64');

  let result = {
    code: "000",
    message: message
  };

  // Send Response
  opts.res.status(200).send(JSON.stringify(result));
}

function initialize() {
  if (GCP_CLIENT == null) {
    console.log("=============================================================");
    console.log("Google Application Credentials : " + process.env.GOOGLE_APPLICATION_CREDENTIALS);
    GCP_CLIENT = new textToSpeech.TextToSpeechClient();
    console.log("=============================================================");
  }
  let config = require(process.env.CONFIG_FILE);
  for (let i = 0; i < config.data.length; i++) {
    let object = config.data[i];
    languageMap[object.code] = object.speechCode;
  }
  console.log(languageMap)
}

function prepareRequest(text, languageCode)
{
  if (languageCode == null) languageCode = process.env.DEFAULT_LANGUAGE_CODE;;

  // Construct the request
  const request = {
    input: {
      text: text
    },
    // Select the language and SSML Voice Gender (optional)
    voice: {
      languageCode: languageMap[languageCode],
      ssmlGender: 'NEUTRAL'
    },
    // Select the type of audio encoding
    audioConfig: {
      audioEncoding: 'MP3'
    },
  };

  return request;
}