import { BufferGeometry, BufferAttribute } from "three";
import { MeshData } from "../DataFormat";

// meshDataCallback:(uid:String,meshData:MeshData)=> void;

function createGeometryByData(
    position: Array<number>,
    uv: Array<number>,
    faces: Array<number>,
    normal: Array<number> | null = null
): BufferGeometry | null {
    try {
        const bufferGeometry = new BufferGeometry();

        const indexs = new Uint16Array(faces);
        const indexAttribute = new BufferAttribute(indexs, 1);
        bufferGeometry.setIndex(indexAttribute);

        const positions = new Float32Array(position);
        const positionAttribute = new BufferAttribute(positions, 3);
        bufferGeometry.setAttribute("position", positionAttribute);
        if (normal && normal.length > 0) {
            const normals = new Float32Array(normal);
            const normalAttribute = new BufferAttribute(normals, 3);
            bufferGeometry.setAttribute("normal", normalAttribute);
        } else {
            const normals = new Float32Array(position);
            const normalAttribute = new BufferAttribute(normals, 3);
            bufferGeometry.setAttribute("normal", normalAttribute);
            bufferGeometry.computeVertexNormals();
        }

        const uvs = new Float32Array(uv);
        const uvAttribute = new BufferAttribute(uvs, 2);
        bufferGeometry.setAttribute("uv", uvAttribute);

        bufferGeometry.computeBoundingBox();
        bufferGeometry.computeBoundingSphere();

        return bufferGeometry;
    } catch (error) {
        console.log("CreateGeometryByData Failed:" + error);
        return null;
    }
}

class SceneMesh {
    public sceneMeshData: Map<string, MeshData>;

    constructor(jsonData: any, hiddenMeshes: Array<string>) {
        this.sceneMeshData = this.loadMeshData(jsonData.mesh, hiddenMeshes);
    }

    loadMeshData(
        jsonData: any,
        hiddenMeshes: Array<string>
    ): Map<string, MeshData> {
        const result: Map<string, MeshData> = new Map<string, MeshData>();

        for (let i = 0, j = jsonData.length; i < j; i++) {
            const _meshData = jsonData[i];
            const uid = _meshData.uid;
            if (result.has(uid)) {
                continue;
            }

            let checkHiddenMeshes = false;

            for (let index = 0; index < hiddenMeshes.length; index++) {
                const meshType = hiddenMeshes[index];
                if (_meshData.type === meshType) {
                    checkHiddenMeshes = true;
                    break;
                }
            }

            if (checkHiddenMeshes) {
                continue;
            }

            const bufferGeometry = createGeometryByData(
                _meshData.xyz,
                _meshData.uv,
                _meshData.faces,
                _meshData.normal
            );
            if (!bufferGeometry) continue;

            const meshData: MeshData = {
                uid: uid,
                geometry: bufferGeometry,
                type: _meshData.type,
                width: _meshData.width ? _meshData.width : 0,
                height: _meshData.height ? _meshData.height : 0,
                uvRotation: _meshData.uvRotation ? _meshData.uvRotation : 0,
                uvOffset: _meshData.uvOffset
                    ? _meshData.uvOffset
                    : new Array<number>(),
                materialId: _meshData.material,
            };

            result.set(uid, meshData);
        }

        return result;
    }
}

export default SceneMesh;
