Node Parallel Requests
----------------------

Getting Started
===============

```
npm install
```

Running the server
==================
```
node server.js
```

Supported Requests
==================

In order to support a fully dynamic parallel request aspect only post is supported for the urls. Each url object should be sent as an item in an array.

```json
{
    "urls": [
        {"url": "http://localhost:5678/a"},
        {"url": "http://localhost:5678/a?asd=123"},
        {"server": "localhost", "port": 5678, "params": "a"},
        {"server": "localhost", "port": 5678, "params": "a", "query": ["b": 1, "x": "yzx"]}
    ]
}

```


To this URL:

```
http://localhost:3000/x
```

Which will return the body from each of the urls called, along with timings.