import { Object3D } from "three";

class SceneRoom extends Object3D {
    public instanceid: string;
    public type: string;
    public size: number;
    constructor() {
        super();
        this.instanceid = "";
        this.type = "";
        this.size = 0;
    }

    public parse(data: any): void {
        this.instanceid = data.instanceid;
        this.type = data.type;
        this.size = data.size;
        this.position.fromArray(data.pos);
        this.quaternion.fromArray(data.rot);
        this.scale.fromArray(data.scale);
    }

    public dispose() {}
}

export default SceneRoom;
