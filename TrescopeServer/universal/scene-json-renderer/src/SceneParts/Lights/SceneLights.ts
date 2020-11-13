interface SceneLightType {
    name: string;
    color: number;
    intensity: number;
    distance: number;
    decay: number;
}

const LightsTypes: Array<SceneLightType> = [
    {
        name: "Pendant Lamp",
        color: 0xffffff,
        intensity: 1,
        distance: 3,
        decay: 2,
    },
    {
        name: "Ceiling Lamp",
        color: 0xffffff,
        intensity: 1,
        distance: 3,
        decay: 2,
    },
];

class SceneLights {
    public static getAllLightsType() {
        return LightsTypes;
    }
}

export default SceneLights;
