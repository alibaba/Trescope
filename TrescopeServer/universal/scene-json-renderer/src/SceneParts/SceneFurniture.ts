import {ModelData} from '../DataFormat';

class SceneFurniture {
    public sceneModelData: Map<string, ModelData>;

    constructor(jsonData: any) {
        this.sceneModelData = this.getModelDataMap(jsonData.furniture);
    }

    getModelDataMap(jsonData: any): Map<string, ModelData> {
        const result: Map<string, ModelData> = new Map<string, ModelData>();

        for (let i = 0, j = jsonData.length; i < j; i++) {
            const _modelData = jsonData[i];
            const aid = _modelData.aid;
            const uid = _modelData.uid;
            const jid = _modelData.jid;
            if (result.has(uid)) continue;

            const modelData: ModelData = {
                uid, aid,
                extendid: jid,
                category: _modelData.category,
                sourceCategoryId: _modelData.sourceCategoryId,
                size: _modelData.size,
                title: _modelData.title,
                instanceids: [],
                geometry: {
                    status: 0,
                    groupNames: [],
                    value: null,
                },
                material: {
                    value: [],
                },
            };

            result.set(uid, modelData);
        }
        return result;
    }
}

export default SceneFurniture;
