import json
import os

import numpy as np

from trescope import Trescope, Layout
from trescope.config import (PerspectiveCamera, FRONT3DConfig)
from trescope.toolbox import simpleFileOutputs


def visualize_front3d_color(output_id, front3d_scene_file, camera):
    Trescope().selectOutput(output_id).updateLayout(
        Layout().camera(PerspectiveCamera().up(*camera['up']).center(*camera['target']).eye(*camera['pos']).fovy(camera['fov']).near(camera['near']).far(
            camera['far'])))

    (Trescope().selectOutput(output_id)
     .plotFRONT3D(front3d_scene_file)
     .withConfig(FRONT3DConfig()
                 .shapeLocalSource(os.path.abspath(os.path.join(os.path.dirname(__file__), '../data/res/3D-FRONT-samples/3D-FUTURE-model/')))
                 .renderer('blender')
                 .baseLightStrength(8)
                 .renderType('color')))


def main():
    front3d_scene_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../data/res/3D-FRONT-samples/scenes/'))
    camera_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '../data/res/3D-FRONT-samples/camera_data.json'))
    with open(camera_file) as f:
        cameras = list(json.load(f).items())
        np.random.shuffle(cameras)
        cameras = cameras[:10]

    output_ids = [f'{name[:-4]}.color' for name, _ in cameras]
    Trescope().initialize(True, simpleFileOutputs(directory=os.path.abspath(os.path.join(os.path.dirname(__file__), '../data/gen/plot_front3d_blender')),
                                                  fileNames=output_ids, widthPixel=256, heightPixel=256))

    for name, camera_info in cameras:
        scene_id, index = name[:-4].split('_')
        print(scene_id, index, name)
        file = os.path.join(front3d_scene_path, f'{scene_id}.json')
        visualize_front3d_color(f'{name[:-4]}.color', file, camera_info['camera'])
        Trescope().selectOutput(f'{name[:-4]}.color').flush()


if __name__ == '__main__':
    main()
