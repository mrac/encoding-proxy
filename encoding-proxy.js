/**
 * Proxy for converting binary body payload (a buffer) to string with custom encoding.
 * If encoding is not specified, it doesn't convert a buffer to string.
 *
 * Used to workaround default nodejs http encoding to utf-8 (e.g. in Mountebank).
 *
 * Arguments:
 *   --url=https://localhost:3000
 *   --port=3001
 *   --insecure=false
 *   --encoding=
 *
 * Encodings:
 *  utf8
 *  binary
 *  base64
 *  hex
 *  ucs2
 *  utf16le
 *  ascii
 */
var http = require('http');
var request = require('request');

// PARSE ARGUMESTS
const args = {};
process.argv.forEach(arg => {
  const match = arg.match(/--([^=]+)=(.*)/);
  if (match) {
    const key = match[1];
    const value = match[2];
    args[key] = value;
  }
});

// DEFAULT ARGUMENTS
if (!args.port) {
  args.port = 3001;
}
if (!args.url) {
  args.url = 'http://localhost:3000';
}
if (!args.encoding === 'null') {
  args.encoding = null; // nodejs http default encoding = utf8
}
args.insecure = args.insecure === 'true';

// PROXY SERVER
http
  .createServer(function(req, res) {
    let noEncoding = args.encoding === undefined;
    let requestBody = noEncoding ? [] : '';
    const contentType = req.headers['content-type'] || req.headers['Content-Type'];

    if (args.encoding !== undefined) {
      req.setEncoding(args.encoding);
    }

    req.on('data', chunk => {
      if (noEncoding) {
        requestBody.push(chunk);
      } else {
        requestBody += chunk;
      }
    });

    req.on('end', () => {
      const body = noEncoding ? Buffer.concat(requestBody) : requestBody;
      const headers = {
        ...req.headers,
        'content-length': undefined,
        'Content-Length': undefined
      };
      const origin = args.url.replace(/\/$/, '');
      const path = req.url;
      const url = origin + path;
      const requestOptions = {
        method: req.method,
        url,
        body,
        headers,
        strictSSL: !args.insecure
      };
      request(requestOptions)
        .on('error', error => {
          console.error('encoding-proxy response: ', error);
          res.statusCode = 500;
          res.end(JSON.stringify(error, undefined, 1));
        })
        .pipe(res);
    });

    req.on('error', error => {
      console.error('encoding-proxy request: ', error);
      res.statusCode = 500;
      res.end(JSON.stringify(error, undefined, 1));
    });
  })
  .listen(args.port);

console.log(`encoding-proxy - ${args.encoding} - listening on port ${args.port} proxying to ${args.url}`);
