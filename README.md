# encoding-proxy

Proxy for converting binary body payload (a buffer) to string with custom encoding.
If encoding is not specified, it doesn't convert a buffer to string.

Used to workaround default nodejs http encoding to utf-8 (e.g. in Mountebank).

### Installation

#### To install:

```
npm install encoding-proxy
````

#### To run:

```
./bin/encoding-proxy --target=https://localhost:8000 --port=8001 --insecure=true --encoding=binary
```

### Arguments (with default values):

 * `--target=http://localhost:3000`
 * `--port=3001`
 * `--insecure=false`
 * `--encoding=`

### Encodings:

 *  `utf8`
 *  `binary`
 *  `base64`
 *  `hex`
 *  `ucs2`
 *  `utf16le`
 *  `ascii`

