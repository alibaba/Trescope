import {Material, BufferGeometry} from "three";

export interface MaterialData {
    uid: string;
    aid: string;
    extendid: string;
    instanceids: Array<string>;
    // customizedSubNodes: Array<BaseChunk>;
    color: Array<number>;
    //0未下载，1正在下载+加载，2下载完成
    status: number;
    width: number;
    height: number;
    value: Material | null;
    UVTransform: Array<number> | null;
}

export interface MeshData {
    uid: string;
    type: string;
    geometry: BufferGeometry;
    width: number;
    height: number;
    uvRotation: number;
    uvOffset: Array<number>;
    materialId: string;
}

export interface ModelData {
    uid: string;
    aid: string;
    extendid: string;
    category: string;
    sourceCategoryId: string;
    size: Array<number>;
    title: string;
    instanceids: Array<string>;
    geometry: {
        //0未下载，1正在下载+加载，2下载完成
        status: number;
        groupNames: Array<string>;
        value: BufferGeometry | null;
    };
    material: {
        value: Array<Material>;
    };
}
