import {
    AmbientLight,
    Box3,
    BufferAttribute,
    BufferGeometry,
    Color,
    DataTexture,
    HemisphereLight, Material,
    Matrix3,
    Mesh, MeshDepthMaterial,
    MeshLambertMaterial, MeshNormalMaterial,
    Object3D,
    Scene,
    Vector3,
} from "three";
import SceneMesh from "./SceneParts/SceneMesh";
import SceneMaterial from "./SceneParts/SceneMaterial";
import SceneRoom from "./SceneParts/SceneRoom";
import SceneFurniture from "./SceneParts/SceneFurniture";
import BaseChunk from "./SceneParts/BaseParts/BaseChunk";
import BaseFurniture from "./SceneParts/BaseParts/BaseFurniture";
import CompositeFurniture from "./SceneParts/CompositeParts/CompositeFurniture";
import {MaterialData, MeshData, ModelData} from "./DataFormat";
import {fetchObj, fetchTexture} from "./Utils/Utils";
import createCamera from './CameraCreateor';
import {join} from "path";
import {Response} from "node-fetch";

const nodeFetch = require("node-fetch");

const BufferGeometryUtils = require("./ThirdLib/BufferGeometryUtils").BufferGeometryUtils;

export interface ShapeRemoteSource {
    objUrls: Array<string>;
    textureUrls: Array<string>;
}

function toFetchAPI(remoteOrLocalFile: string, serverHost: any): string {
    return `http://${serverHost}/fetch?file=${remoteOrLocalFile}`;
}

async function fetchResourceFromRemoteOrLocal(jid: string, localSource: string, remoteSource: Array<string>, serverHost: string, fileName: string) {
    let fetchMethod;
    if ('texture.png' === fileName) fetchMethod = fetchTexture;
    else if ('raw_model.obj' === fileName) fetchMethod = fetchObj;
    else return undefined;

    const localFiles = localSource ? [join(localSource, jid, fileName)] : [];
    const remoteFiles = remoteSource ? remoteSource.map(e => e.replace('@{id}@', jid)) : [];
    const files = [...localFiles, ...remoteFiles];
    for (const file of files) {
        const result = await fetchMethod(toFetchAPI(file, serverHost));
        if (result) return result;
    }
    return undefined;
}

async function loadModelData(uid: string, sceneModelData: Map<string, ModelData>, furnitureScale: number,
                             shapeLocalSource: string, shapeRemoteSource: ShapeRemoteSource, renderType: string, serverHost: string,
                             entityMap: Map<string, BaseChunk | BaseFurniture | CompositeFurniture>,
                             depthMaterial: MeshDepthMaterial, normalMaterial: MeshNormalMaterial) {
    const modelData = sceneModelData.get(uid) as ModelData;
    let objModel = await fetchResourceFromRemoteOrLocal(modelData.extendid, shapeLocalSource, shapeRemoteSource.objUrls, serverHost, 'raw_model.obj') as Object3D;

    if (objModel && objModel.children.length > 0) {
        let geometryArray: Array<any> = [];

        objModel.children.forEach((value) => {
            const meshValue = value as Mesh;
            if (furnitureScale !== 1) {
                const bGeometry = meshValue.geometry as BufferGeometry;
                const position = bGeometry.attributes.position.array;
                const newArray = new Float32Array(position.length);
                for (let index = 0; index < position.length; index++) {
                    let value = position[index];
                    value *= furnitureScale;
                    newArray[index] = value;
                }
                bGeometry.setAttribute("position", new BufferAttribute(newArray, 3));
            }

            geometryArray.push(meshValue.geometry);
        });

        const bufferGeometry = BufferGeometryUtils.mergeBufferGeometries(geometryArray, false);

        const model = modelData.geometry;
        model.status = 2;
        model.value = bufferGeometry;

        let material: Material | undefined;
        if (renderType === 'depth') {
            material = depthMaterial;
        } else if (renderType === 'normal') {
            material = normalMaterial;
        } else {
            let texture = await fetchResourceFromRemoteOrLocal(modelData.extendid, shapeLocalSource, shapeRemoteSource.textureUrls, serverHost, 'texture.png') as DataTexture;
            if (texture) {
                material = new MeshLambertMaterial({map: texture});
                material.transparent = true;
            }
        }


        const instanceids = modelData.instanceids;
        for (let i = 0, j = instanceids.length; i < j; i++) {
            const instancedId = instanceids[i];
            const baseFurniture = entityMap.get(instancedId) as BaseFurniture;
            baseFurniture.geometry = bufferGeometry;

            if (material) baseFurniture.material = material;
        }
    }
}

async function loadMaterialForMesh(materialData: MaterialData,
                                   shapeLocalSource: string, shapeRemoteSource: ShapeRemoteSource, serverHost: string,
                                   entityMap: Map<string, BaseChunk | BaseFurniture | CompositeFurniture>) {
    const material = new MeshLambertMaterial();
    const colorData = materialData.color;
    const color = colorData.length > 0
        ? new Color(colorData[0] / 255, colorData[1] / 255, colorData[2] / 255)
        : new Color(1, 1, 1);
    const opacity = colorData.length > 0 ? colorData[3] : 1;
    material.color = color;
    material.opacity = opacity;
    material.transparent = opacity < 1;

    const texture = await fetchResourceFromRemoteOrLocal(materialData.extendid, shapeLocalSource, shapeRemoteSource.textureUrls, serverHost, 'texture.png') as DataTexture;

    if (texture) {
        material.map = texture;
        if (materialData.UVTransform) {
            let uvTransformMatrix = new Matrix3();
            uvTransformMatrix = uvTransformMatrix.fromArray(materialData.UVTransform);
            texture.matrixAutoUpdate = false;
            texture.updateMatrix();
            texture.matrix = uvTransformMatrix;
            texture.needsUpdate = true;
        }
    }
    materialData.status = 2;
    materialData.value = material;

    const instanceids = materialData.instanceids;
    for (let i = 0, j = instanceids.length; i < j; i++) {
        const instancedId = instanceids[i];
        const temp = entityMap.get(instancedId);
        if (temp) {
            const baseFurniture = temp as BaseChunk;
            baseFurniture.material = material;
        }
    }
}

function createSceneInternal(jsonData: any,
                             shapeLocalSource: string, shapeRemoteSource: ShapeRemoteSource,
                             view: string, camera: any, aspect: number,
                             unit: string, hiddenMeshes: Array<string>,
                             renderType: string,
                             serverHost: string) {
    const furnitureScale = unit === 'cm' ? 0.01 : 1;

    const
        defaultGeometry: BufferGeometry = new BufferGeometry(),
        defaultMaterial: MeshLambertMaterial = new MeshLambertMaterial(),
        depthMaterial: MeshDepthMaterial = new MeshDepthMaterial(),
        normalMaterial: MeshNormalMaterial = new MeshNormalMaterial();
    const loadingPromises: Array<Promise<any>> = [];
    const entityMap: Map<string, BaseChunk | BaseFurniture | CompositeFurniture> = new Map();

    const sceneMesh = new SceneMesh(jsonData, hiddenMeshes);
    const sceneFurniture = new SceneFurniture(jsonData);
    const sceneMaterial = new SceneMaterial(jsonData);

    const scene = new Scene();
    const sceneMeshBox: Box3 = new Box3();

    const rooms = jsonData.scene.room as Array<any>;
    rooms.forEach((roomData) => {
        const room = new SceneRoom();
        room.parse(roomData);
        const children = roomData.children as Array<any>;
        children.forEach((childData) => {
            const uid = childData.ref;
            const instanceid = childData.instanceid;
            let child: | BaseChunk | BaseFurniture | CompositeFurniture | null = null;
            let customData: MeshData | ModelData | null = null;
            if (sceneMesh.sceneMeshData.has(uid)) {
                customData = sceneMesh.sceneMeshData.get(uid) as MeshData;
                const materialId = customData.materialId;
                const materialData = sceneMaterial.materialData.get(materialId) as MaterialData;
                if ('color' === renderType && materialData) {
                    const meshMat = materialData.value;
                    const material = meshMat ? meshMat : defaultMaterial;
                    child = new BaseChunk(customData.geometry, material);
                    materialData.instanceids.push(instanceid);
                    if (!meshMat && materialData.status === 0) {
                        materialData.status = 1;
                        loadingPromises.push(loadMaterialForMesh(materialData, shapeLocalSource, shapeRemoteSource, serverHost, entityMap));
                    }
                } else {
                    const material: Material = 'depth' === renderType ? depthMaterial : ('normal' === renderType ? normalMaterial : defaultMaterial);
                    child = new BaseChunk(customData.geometry, material);
                }
                sceneMeshBox.union(new Box3().setFromObject(child));
            } else if (sceneFurniture.sceneModelData.has(uid)) {
                customData = sceneFurniture.sceneModelData.get(uid) as ModelData;
                const model = customData.geometry;
                const modelGeometry = model.value;
                const geometry = modelGeometry ? modelGeometry : defaultGeometry;
                child = new BaseFurniture(geometry, defaultMaterial);
                customData.instanceids.push(instanceid);
                if (!modelGeometry && model.status === 0) {
                    model.status = 1;
                    loadingPromises.push(loadModelData(uid, sceneFurniture.sceneModelData, furnitureScale, shapeLocalSource, shapeRemoteSource, renderType, serverHost, entityMap,
                        depthMaterial, normalMaterial));
                }
                child.parseCustomProp(customData);
            }

            if (child) {
                entityMap.set(instanceid, child);
                child.parse(childData);
                child.roomId = room.instanceid;
                room.add(child);

                if (child.entityType === "BaseFurniture") {
                    // const fChild = child as BaseFurniture;
                    // const category = fChild.category ? fChild.category : "";
                    // const lightTypes = SceneLights.getAllLightsType();
                    // lightTypes.forEach((light) => {
                    //     if (light.name === category) {
                    //         const pointLight = new PointLight(light.color, light.intensity, light.distance, light.decay);
                    //         pointLight.position.set(fChild.position.x, fChild.position.y, fChild.position.z);
                    //         room.add(pointLight);
                    //     }
                    // });
                }
            }
        });
        room.updateMatrixWorld(true);
        scene.add(room);
    });

    if ('color' === renderType) {
        scene.add(new AmbientLight(new Color(0xffffff), .3));
        const hemisphereLight = new HemisphereLight(0xffffff, 0x000000, .8);
        hemisphereLight.position.set(0, sceneMeshBox.getSize(new Vector3()).y / 2, 0);
        scene.add(hemisphereLight);
    }
    const cameraInfo = createCamera(view, camera, sceneMeshBox, aspect);
    return {scene, ...cameraInfo, loadingPromises};
}

export function createScene(houseLayoutFile: string,
                            shapeLocalSource: string, shapeRemoteSource: ShapeRemoteSource,
                            view: string, camera: any, aspect: number,
                            unit: string, hiddenMeshes: Array<string>, renderType: string,
                            serverHost: string) {
    return nodeFetch(`http://${serverHost}/fetch?file=${houseLayoutFile}`)
        .then((response: Response) => response.json())
        .then((jsonData: any) => createSceneInternal(jsonData, shapeLocalSource, shapeRemoteSource, view, camera, aspect, unit, hiddenMeshes, renderType, serverHost));
}