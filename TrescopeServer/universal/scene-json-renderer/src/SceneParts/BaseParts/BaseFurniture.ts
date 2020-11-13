import BaseEntity from "./BaseEntity";
import { BufferGeometry, Material, Vector3, Box3 } from "three";

class BaseFurniture extends BaseEntity {
    public aid: string;
    public extendid: string;
    public category: string;
    public sourceCategoryId: string;
    public title: string;
    public type: string = "Furniture";
    public size: Vector3 = new Vector3();

    constructor(
        geometry: BufferGeometry,
        material: Material,
        mainBodyId: string = ""
    ) {
        super(geometry, material, mainBodyId);
        this.aid = "";
        this.extendid = "";
        this.sourceCategoryId = "";
        this.title = "";
        this.category = "";
        this.entityType = "BaseFurniture";
    }

    public parse(data: any): void {
        super.parse(data);
    }

    public parseCustomProp(data: any): void {
        super.parseCustomProp(data);
        this.aid = data.aid;
        this.extendid = data.extendid;
        this.category = data.category;
        this.sourceCategoryId = data.sourceCategoryId;
        this.title = data.title;
        data.size && this.size.fromArray(data.size);
    }

    public getBoundingBox(): Box3 | null {
        if (this.geometry) {
            return this.geometry.boundingBox;
        }
        return null;
    }

    public cloneEntity() {
        const bf = new BaseFurniture(
            this.geometry as BufferGeometry,
            this.material as Material
        );
        bf.aid = this.aid;
        bf.extendid = this.extendid;
        bf.sourceCategoryId = this.sourceCategoryId;
        bf.title = this.title;
        bf.size = this.size;
        return bf;
    }

    public dispose() {}
}

export default BaseFurniture;
