import BaseEntity from "./BaseEntity";
import { BufferGeometry, Material } from "three";

class BaseChunk extends BaseEntity {
    public type: string;
    public materialUid: string;

    constructor(
        geometry: BufferGeometry,
        material: Material,
        mainBodyId: string = ""
    ) {
        super(geometry, material, mainBodyId);
        this.type = "";
        this.materialUid = "";
        this.entityType = "BaseChunk";
    }

    public parseCustomProp(data: any): void {
        super.parseCustomProp(data);
        this.type = data.type;
        this.materialUid = data.materialId;
    }

    public dispose() {}
}

export default BaseChunk;
