import CompositeEntity from "./CompositeEntity";
import { Vector3 } from "three";

class CompositeFurniture extends CompositeEntity {
    public aid: string;
    public extendid: string;
    public sourceCategoryId: string;
    public title: string;
    public type: string = "Furniture";
    public size: Vector3 = new Vector3();

    constructor() {
        super();
        this.aid = "";
        this.extendid = "";
        this.sourceCategoryId = "";
        this.title = "";
    }

    public parseCustomProp(data: any): void {
        super.parseCustomProp(data);
        this.aid = data.aid;
        this.extendid = data.extendid;
        this.sourceCategoryId = data.sourceCategoryId;
        this.title = data.title;
        this.size.fromArray(data.size);
    }

    public dispose() {}
}

export default CompositeFurniture;
