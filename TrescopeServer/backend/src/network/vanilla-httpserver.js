const http = require("http");
const fs = require('fs');
const path = require('path');
const nodeFetch = require('node-fetch');
const isUrl = require('is-url');
const crypto = require('crypto');

let _center;

class PathFunctionMap {
    _keys = [];
    _values = [];

    put(path_, func) {
        this._keys.push(path_);
        this._values.push(func);
    }

    get(path_) {
        for (let i = 0; i < this._keys.length; i++) {
            let p = this._keys[i];
            if (p instanceof RegExp && p.test(path_)) return this._values[i];
            if (p === path_) return this._values[i];
        }
        return null;
    }
}

const basePathFuncMap = new PathFunctionMap();
basePathFuncMap.put(/^\/.*\.js/, (url_, response) => respondStaticResources(path.resolve(__dirname, `../../public/${url_.substring(1)}`), response));
basePathFuncMap.put(/^\/.*\.json/, (url_, response) => respondStaticResources(path.resolve(__dirname, `../../public/${url_.substring(1)}`), response));
basePathFuncMap.put(/^\/.*\.css/, (url_, response) => respondStaticResources(path.resolve(__dirname, `../../public/${url_.substring(1)}`), response));
basePathFuncMap.put(/^\/.*\.map/, (url_, response) => respondStaticResources(path.resolve(__dirname, `../../public/${url_.substring(1)}`), response));
basePathFuncMap.put(/^\/.*\.woff2/, (url_, response) => respondStaticResources(path.resolve(__dirname, `../../public/${url_.substring(1)}`), response));
basePathFuncMap.put(/^\/.*\.ico/, (url_, response) => respondStaticResources(path.resolve(__dirname, `../../public/${url_.substring(1)}`), response));
basePathFuncMap.put("/index.html", (url_, response) => respondStaticResources(path.resolve(__dirname, "../../public/index.html"), response));
basePathFuncMap.put("/", (url_, response) => respondStaticResources(path.resolve(__dirname, "../../public/index.html"), response, "text/html"));

const customPathFuncMap = new PathFunctionMap();
customPathFuncMap.put(/\/fetch\?/, (url, response) => {
    url = `http://localhost:9000` + url;//TODO
    const remoteOrLocalFile = new URL(url).searchParams.get('file');
    if (!isUrl(remoteOrLocalFile)) {
        respondStaticResources(remoteOrLocalFile, response);
        return;
    }

    const ext = remoteOrLocalFile.split('.').pop();
    const md5sum = crypto.createHash('sh256');
    const fileName = `${md5sum.update(remoteOrLocalFile).digest('hex')}.${ext}`;
    const fileTempPath = path.join(_center.taskTemporaryDirectory(), fileName);

    if (fs.existsSync(fileTempPath)) {
        respondStaticResources(fileTempPath, response);
        return;
    }
    nodeFetch(remoteOrLocalFile)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => arrayBuffer && fs.appendFile(fileTempPath, Buffer.from(arrayBuffer), () => respondStaticResources(fileTempPath, response)))
});


const contentTypeMap = new Map(
    Object.entries({
        ".js": "text/javascript",
        ".json": "application/json",
        ".css": "text/css",
        ".map": "text/plain",
        ".obj": "text/plain",
        ".woff2": "font/woff2",
        ".ico": "image/x-icon",
        ".html": "text/html",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
    })
);

function respondStaticResources(fileLocalPath, response, contentType) {
    fs.exists(fileLocalPath, (exists) => {
        if (!exists) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n");
            response.end();
            console.error(`respondStaticResources.fail [404 resource:${fileLocalPath} not found]`);
            return;
        }

        fs.readFile(fileLocalPath, (error, file) => {
            if (error) {
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write(`Error: ${error}\n`);
                response.end();
                console.log("respondStaticResources.fail", `Error: ${error}`);
                return;
            }

            response.writeHead(200, {
                "Content-Type": contentType ? contentType : contentTypeMap.get(path.extname(fileLocalPath)),
            });
            response.write(file);
            response.end();
        });
    });
}

let server = null;

function create(center) {
    if (null !== server) return server;
    _center = center;

    server = http.createServer((request, response) => {
        try {
            const func = customPathFuncMap.get(request.url);
            if (null != func) {
                func(request.url, response);
                return;
            }
            basePathFuncMap.get(request.url)(request.url, response);
        } catch (e) {
            console.log("error", e, request.url);
        }
    });
    return server;
}


module.exports = {
    create,
    respondStaticResources,
    pathFilter: customPathFuncMap,
};
