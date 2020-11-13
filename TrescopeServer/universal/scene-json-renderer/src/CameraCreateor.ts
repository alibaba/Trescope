import {Box3} from "three/src/math/Box3";
import {OrthographicCamera, PerspectiveCamera, Vector3} from "three";

const viewType = {
    left: 'left',
    right: 'right',
    top: 'top',
    bottom: 'bottom',
    front: 'front',
    back: 'back',
};

function getCenterPointAndMaxSide(view: string, maxPoint: Vector3, minPoint: Vector3) {
    let maxPointInView = {x: 0, y: 0, z: 0}, minPointInView = {x: 0, y: 0, z: 0};

    switch (view) {
        case viewType.front:
            maxPointInView = {x: maxPoint.x, y: maxPoint.y, z: maxPoint.z};
            minPointInView = {x: minPoint.x, y: minPoint.y, z: maxPoint.z};
            break;
        case viewType.back:
            maxPointInView = {x: maxPoint.x, y: maxPoint.y, z: minPoint.z};
            minPointInView = {x: minPoint.x, y: minPoint.y, z: minPoint.z};
            break;
        case viewType.left:
            maxPointInView = {x: maxPoint.x, y: maxPoint.y, z: maxPoint.z};
            minPointInView = {x: maxPoint.x, y: minPoint.y, z: minPoint.z};
            break;
        case viewType.right:
            maxPointInView = {x: minPoint.x, y: maxPoint.y, z: maxPoint.z};
            minPointInView = {x: minPoint.x, y: minPoint.y, z: minPoint.z};
            break;
        case viewType.top:
            maxPointInView = {x: maxPoint.x, y: maxPoint.y, z: maxPoint.z};
            minPointInView = {x: minPoint.x, y: maxPoint.y, z: minPoint.z};
            break;
        case viewType.bottom:
            maxPointInView = {x: maxPoint.x, y: minPoint.y, z: maxPoint.z};
            minPointInView = {x: minPoint.x, y: minPoint.y, z: minPoint.z};
            break;
        default:
            break;
    }

    const centerX = minPointInView.x + (maxPointInView.x - minPointInView.x) / 2.0;
    const centerY = minPointInView.y + (maxPointInView.y - minPointInView.y) / 2.0;
    const centerZ = minPointInView.z + (maxPointInView.z - minPointInView.z) / 2.0;

    const maxSide = Math.max(
        maxPointInView.x - minPointInView.x,
        maxPointInView.y - minPointInView.y,
        maxPointInView.z - minPointInView.z);
    return {
        center: {x: centerX, y: centerY, z: centerZ},
        maxSide,
    };
}

function getLowerAngle(aspect: number, fovAngle: number) {
    const halfFov = fovAngle / 2.0;
    const otherSideRadian = Math.atan(aspect * Math.tan(halfFov * (Math.PI / 180.0)));
    return Math.min(halfFov, otherSideRadian * (180.0 / Math.PI));
}

function getPerspectiveCameraLocationAndNearFar(view: string, sceneCenter: any, maxSide: number, lowerFovAngle: number, bbox: Box3) {
    const radian = lowerFovAngle * (Math.PI / 180.0);
    const halfSide = maxSide / 2.0;
    const distance = halfSide / Math.tan(radian);
    let result = {x: sceneCenter.x, y: sceneCenter.y, z: sceneCenter.z};
    let near = 0, far = 0;
    switch (view) {
        case viewType.front:
            result.z += distance;
            near = (result.z - bbox.max.z) / 4;
            far = (result.z - bbox.min.z) * 4;
            break;
        case viewType.back:
            result.z += -distance;
            near = (bbox.min.z - result.z) / 4;
            far = (bbox.max.z - result.z) * 4;
            break;
        case viewType.left:
            result.x += distance;
            near = (result.x - bbox.max.x) / 4;
            far = (result.x - bbox.min.x) * 4;
            break;
        case viewType.right:
            result.x += -distance;
            near = (bbox.min.x - result.x) / 4;
            far = (bbox.max.x - result.x) * 4;
            break;
        case viewType.top:
            result.y += distance;
            near = (result.y - bbox.max.y) / 4;
            far = (result.y - bbox.min.y) * 4;
            break;
        case viewType.bottom:
            result.y += -distance;
            near = (bbox.min.y - result.y) / 4;
            far = (bbox.max.y - result.y) * 4;
            break;
        default:
            break;
    }

    return {location: result, near, far};
}

function getOrthographicCameraInfo(view: string, maxPoint: Vector3, minPoint: Vector3, aspect: number) {
    const orthographicCameraDistance = 500;
    let position = {x: 0, y: 0, z: 0};
    let up = {x: 0, y: 1, z: 0};

    const halfX = (maxPoint.x - minPoint.x) / 2.0;
    const halfY = (maxPoint.y - minPoint.y) / 2.0;
    const halfZ = (maxPoint.z - minPoint.z) / 2.0;
    const centerPoint = {
        x: minPoint.x + halfX,
        y: minPoint.y + halfY,
        z: minPoint.z + halfZ,
    };

    let horizontalValue = 1, verticalValue = 1;

    switch (view) {
        case viewType.front:
        case viewType.back:
            horizontalValue = halfX;
            verticalValue = halfY;

            position = {
                x: centerPoint.x,
                y: centerPoint.y,
                z: orthographicCameraDistance * (view === viewType.front ? 1 : -1),
            };
            break;
        case viewType.left:
        case viewType.right:
            horizontalValue = halfX;
            verticalValue = halfY;

            position = {
                x: orthographicCameraDistance * (view === viewType.left ? 1 : -1),
                y: centerPoint.y,
                z: centerPoint.z,
            };
            break;
        case viewType.top:
        case viewType.bottom:
            up = {x: 0, y: 0, z: -1};
            horizontalValue = halfX;
            verticalValue = halfZ;

            position = {
                x: centerPoint.x,
                y: orthographicCameraDistance * (view === viewType.top ? 1 : -1),
                z: centerPoint.z,
            };
            break;
        default:
            break;
    }

    const cameraAspect = verticalValue === 0 ? 1 : horizontalValue / verticalValue;
    let tempWidth = 0, tempHeight = 0;
    if (aspect >= cameraAspect) {
        tempHeight = verticalValue;
        tempWidth = aspect * tempHeight;
    } else {
        tempWidth = horizontalValue;
        tempHeight = tempWidth / aspect;
    }

    return {
        position, up,
        lookAt: {...centerPoint},
        left: -tempWidth, right: tempWidth, top: tempHeight, bottom: -tempHeight,
    };
}

export default function createCamera(view: string, cameraInfo: any, bbox: Box3, aspect: number) {
    aspect = undefined !== cameraInfo.aspect ? cameraInfo.aspect : aspect;
    if (cameraInfo.projection.type === 'orthographic') {
        let {position, lookAt, left, right, top, bottom, up} = getOrthographicCameraInfo(view, bbox.max, bbox.min, aspect);

        let near = undefined !== cameraInfo.near ? cameraInfo.near : 1;
        let far = undefined !== cameraInfo.far ? cameraInfo.far : 1000;

        position = view ? position : cameraInfo.eye;
        up = view ? up : cameraInfo.up;
        lookAt = view ? lookAt : cameraInfo.center;

        const camera = new OrthographicCamera(left, right, top, bottom, near, far);
        camera.position.set(position.x, position.y, position.z);
        camera.up.set(up.x, up.y, up.z);
        camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
        camera.updateMatrix();
        return {camera, cameraTarget: new Vector3(lookAt.x, lookAt.y, lookAt.z)};
    } else {
        let {center, maxSide} = getCenterPointAndMaxSide(view, bbox.max, bbox.min);
        const lowerAngle = getLowerAngle(aspect, cameraInfo.fovy);
        let {location, near, far} = getPerspectiveCameraLocationAndNearFar(view, center, maxSide, lowerAngle, bbox);

        near = view ? near : cameraInfo.near;
        far = view ? far : cameraInfo.far;
        const camera = new PerspectiveCamera(cameraInfo.fovy, aspect, near, far);
        let up = (view === viewType.top || view === viewType.bottom) ? {x: 0, y: 0, z: -1} : {x: 0, y: 1, z: 0};

        location = view ? location : cameraInfo.eye;
        up = view ? up : cameraInfo.up;
        center = view ? center : cameraInfo.center;

        camera.up.set(up.x, up.y, up.z);
        camera.position.set(location.x, location.y, location.z);
        camera.lookAt(center.x, center.y, center.z);
        camera.updateMatrix();
        return {camera, cameraTarget: new Vector3(center.x, center.y, center.z)};
    }
}