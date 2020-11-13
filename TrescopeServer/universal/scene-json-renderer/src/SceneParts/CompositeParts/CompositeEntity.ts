import { Object3D } from "three";

class CompositeEntity extends Object3D {
    public instanceid: string;
    public uid: string;
    public roomId: string;
    public type: string;
    public entityType: string = "CompositeEntity";

    constructor() {
        super();
        this.instanceid = "";
        this.uid = "";
        this.roomId = "";
        this.type = "";
    }

    public parse(data: any): void {
        this.instanceid = data.instanceid;
        this.position.fromArray(data.pos);
        this.quaternion.fromArray(data.rot);
        this.scale.fromArray(data.scale);
        data.type && (this.type = data.type);
        data.name && (this.name = data.name);
        data.visible && (this.visible = data.visible);
    }

    public parseCustomProp(data: any): void {
        this.uid = data.uid;
    }

    public dispose() {}
}

export default CompositeEntity;
