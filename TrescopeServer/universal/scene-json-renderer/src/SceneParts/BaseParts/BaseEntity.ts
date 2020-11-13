import { Mesh, BufferGeometry, Material } from "three";

class BaseEntity extends Mesh {
    public instanceid: string;
    public uid: string;
    public roomId: string;
    public mainBodyId: string;
    public entityType: string = "BaseEntity";

    constructor(
        geometry: BufferGeometry,
        material: Material,
        mainBodyId: string
    ) {
        super(geometry, material);
        this.mainBodyId = mainBodyId;
        this.instanceid = "";
        this.uid = "";
        this.roomId = "";
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

    public dispose() {
        if (this.geometry) {
            this.geometry.dispose();
            (this.geometry as any) = null;
        }
        if (!this.material) return;
        if (this.material instanceof Material) {
            this.material.dispose();
            (this.material as any) = null;
        } else {
            for (let i = 0, j = this.material.length; i < j; i++) {
                this.material[i].dispose();
                (this.material[i] as any) = null;
            }
        }
    }
}

export default BaseEntity;
