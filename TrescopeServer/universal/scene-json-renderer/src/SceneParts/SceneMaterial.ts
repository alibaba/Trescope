import {MaterialData} from "../DataFormat";

class SceneMaterial {
    public materialData: Map<string, MaterialData>;

    constructor(jsonData: any) {
        this.materialData = this.loadMaterialData(jsonData.material);
    }

    loadMaterialData(jsonData: any): Map<string, MaterialData> {
        const material = jsonData as Array<any>;
        const result = new Map<string, MaterialData>();
        material.forEach((materialData) => {
            const uid = materialData.uid;
            const aid = materialData.aid;
            const resultData: MaterialData = {
                uid: uid,
                aid: aid && aid.length > 0 ? aid : "",
                extendid: materialData.sid ? materialData.sid : materialData.jid,
                instanceids: [],
                color: materialData.color ? materialData.color : [],
                status: 0,
                width: materialData.width ? materialData.width : 0,
                height: materialData.height ? materialData.height : 0,
                value: null,
                UVTransform: materialData.UVTransform ? materialData.UVTransform : null,
            };

            result.set(uid, resultData);
        });

        return result;
    }
}

export default SceneMaterial;
