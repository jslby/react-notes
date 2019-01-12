const fs = require('fs');
const needle = require('needle');
const open = require('open');
const path = require('path');
const unzip = require('unzip');


const HOST = 'http://fontello.com';

const getSession = function(options, requestOptions, successCallback, errorCallback) {
  console.log('Creating a new session'.green);
  const data = {
    config: {
      file: options.config,
      content_type: 'application/json'
    }
  };

  return needle.post(options.host, data, requestOptions, function(error, response, body) {
    if (error) { throw error; }
    const sessionId = body;

    if (response.statusCode === 200) {
      fs.writeFile(options.session, sessionId, function(err) {
          if (!err) {
            return console.log(`Session was saved as ${options.session} \n`.green);
          } else {
            return console.log(err + "\n");
          }
      });
      const sessionUrl = `${options.host}/${sessionId}`;
      return (typeof successCallback === 'function' ? successCallback(sessionUrl) : undefined);
    } else {
      return (typeof errorCallback === 'function' ? errorCallback(response) : undefined);
    }
  });
};

const apiRequest = function(options, successCallback, errorCallback) {
  if (options.host == null) { options.host = HOST; }

  const requestOptions = { multipart: true };
  if (options.proxy != null) { requestOptions.proxy = options.proxy; }
  if (fs.existsSync(options.session)) {
    const stats = fs.statSync(options.session);

    const timeDiff = Math.abs(new Date().getTime() - stats.mtime.getTime());

    if (timeDiff < (1000 * 3600 * 24)) {
      console.log(`Using ${options.session}`.green);
      const sessionId = fs.readFileSync(options.session);
      const sessionUrl = `${options.host}/${sessionId}`;
      return (typeof successCallback === 'function' ? successCallback(sessionUrl) : undefined);
    }
  }


  return getSession(options, requestOptions, successCallback, errorCallback);
};



const fontello = {

  install(options) {

    // Begin the download
    //
    return apiRequest(options, function(sessionUrl) {
      const requestOptions = {};
      if (options.proxy != null) { requestOptions.proxy = options.proxy; }

      const zipFile = needle.get(`${sessionUrl}/get`, requestOptions, function(error, response, body) {
        if (error) { throw error; }
      });

      // If css and font directories were provided, extract the contents of
      // the download to those directories. If not, extract the zip file as normal.
      //
      if (options.css && options.font) {
        return zipFile
          .pipe(unzip.Parse())
          .on('entry', (function(entry) {
            const {path:pathName, type} = entry;

            if (type === 'File') {
              const dirName = __guard__(path.dirname(pathName).match(/\/([^\/]*)$/), x => x[1]);
              const fileName = path.basename(pathName);

              switch (dirName) {
                case 'css':
                  const cssPath = path.join(options.css, fileName);
                  return entry.pipe(fs.createWriteStream(cssPath));
                case 'font':
                  const fontPath = path.join(options.font, fileName);
                  return entry.pipe(fs.createWriteStream(fontPath));
                default:
                  return entry.autodrain();
              }
            }
          }))
          .on('finish', (() => console.log('Install complete.\n'.green)));

      } else {
        return zipFile
          .pipe(unzip.Extract({ path: '.' }))
          .on('finish', (() => console.log('Install complete.\n'.green)));
      }
    });
  },


  open(options) {
    return apiRequest(options, sessionUrl => open(sessionUrl));
  }
};


module.exports = fontello;
function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}