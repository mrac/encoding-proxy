# encoding-proxy

Proxy for converting binary body payload (a buffer) to string with custom encoding.
If encoding is not specified, it doesn't convert a buffer to string.

Used to workaround default nodejs http encoding to utf-8 (e.g. in Mountebank).

#### Arguments (with default values):

 * `--url=https://localhost:3000`
 * `--port=3001`
 * `--insecure=false`
 * `--encoding=`

#### Encodings:

 *  `utf8`
 *  `binary`
 *  `base64`
 *  `hex`
 *  `ucs2`
 *  `utf16le`
 *  `ascii`
 *

