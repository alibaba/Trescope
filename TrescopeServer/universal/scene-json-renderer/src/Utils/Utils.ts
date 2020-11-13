import {PNG} from "pngjs";
import {decode} from "jpeg-js";
import {DataTexture, Object3D, RepeatWrapping, RGBAFormat} from "three";
import {OBJLoader2} from "../ThirdLib/OBJLoader2";
import {Response} from "node-fetch";
const nodeFetch = require("node-fetch");

function castToUint8Buffer(buffer: ArrayBuffer) {
    const result = Buffer.alloc(buffer.byteLength);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < result.length; ++i) result[i] = view[i];
    return result;
}

function decodeBufferToImage(arrayBuffer: Buffer, path: string) {
    const ext = path.split(".").pop();
    if (!ext) return undefined;
    switch (ext) {
        case "png":
            return PNG.sync.read(arrayBuffer);
        case "jpg":
            return decode(arrayBuffer, {useTArray: false, formatAsRGBA: true,});
        default:
            return undefined;
    }
}

export function fetchTexture(fetchAPI: string): Promise<DataTexture | undefined> {
    return new Promise((resolve) => nodeFetch(fetchAPI, {timeout: 20000})
        .then((response: Response) => response.arrayBuffer())
        .then((arrayBuffer: ArrayBuffer) => decodeBufferToImage(castToUint8Buffer(arrayBuffer), fetchAPI))
        .then((image: any) => {
            const texture = new DataTexture(image.data, image.width, image.height, RGBAFormat);
            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;
            texture.flipY = true;
            texture.needsUpdate = true;
            resolve(texture);
        })
        .catch((error: Error) => resolve(undefined)));
}

export function fetchObj(fetchAPI: string): Promise<Object3D | undefined> {
    const objLoader = new OBJLoader2();
    return new Promise((resolve) => nodeFetch(fetchAPI, {timeout: 20000})
        .then((response: Response) => response.arrayBuffer())
        .then((arrayBuffer: ArrayBuffer) => resolve(objLoader.parse(arrayBuffer)))
        .catch((error: Error) => resolve(undefined)));
}