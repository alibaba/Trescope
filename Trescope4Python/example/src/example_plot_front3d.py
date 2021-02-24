import json
import os

import numpy as np

from trescope import Trescope, Layout
from trescope.config import (Mesh3DConfig, PerspectiveCamera, FRONT3DConfig)
from trescope.toolbox import simpleDisplayOutputs, color_from_label, simpleFileOutputs

front3d_base = os.path.abspath(os.path.join(
    os.path.dirname(__file__), '../data/res/3D-FRONT-samples'))


def visualize_front3d_mesh_type(output_id, front3d_scene_file):
    with open(front3d_scene_file) as file:
        front3d_scene = json.load(file)
    type_cluster = {}
    for mesh in front3d_scene['mesh']:
        mesh_type = mesh['type']
        if mesh_type not in type_cluster:
            type_cluster[mesh_type] = {'xyz': np.array(mesh['xyz']).reshape((-1, 3)), 'faces': np.array(mesh['faces'], dtype=np.int).reshape((-1, 3))}
        else:
            xyz = np.array(mesh['xyz']).reshape((-1, 3))
            faces = (np.array(mesh['faces'], dtype=np.int) + len(type_cluster[mesh_type]['xyz'])).reshape((-1, 3))
            type_cluster[mesh_type]['xyz'] = np.vstack((type_cluster[mesh_type]['xyz'], xyz))
            type_cluster[mesh_type]['faces'] = np.vstack((type_cluster[mesh_type]['faces'], faces))

    for index, (mesh_type, mesh) in enumerate(type_cluster.items()):
        Trescope().selectOutput(output_id).updateLayout(Layout().showLegend(False).camera(PerspectiveCamera().up(0, 1, 0).eye(0, 2.3, 0)))
        (Trescope()
         .selectOutput(output_id)
         .plotMesh3D(*mesh['xyz'].T)
         .withConfig(Mesh3DConfig().indices(*mesh['faces'].T).color(color_from_label(index)).name(mesh_type)))
    Trescope().selectOutput(output_id).flush()


def visualize_front3d_color(output_id, front3d_scene_file):
    (Trescope().selectOutput(output_id)
     .plotFRONT3D(front3d_scene_file)
     .withConfig(FRONT3DConfig()
                 .view('top')
                 .shapeLocalSource(os.path.join(front3d_base, '3D-FUTURE-model'))
                 .hiddenMeshes(['Ceiling', 'CustomizedCeiling', 'WallInner', 'WallOuter'])
                 .renderType('color')))
    Trescope().selectOutput(output_id).flush()


def visualize_front3d_depth(output_id, front3d_scene_file):
    (Trescope().selectOutput(output_id)
     .plotFRONT3D(front3d_scene_file)
     .withConfig(FRONT3DConfig()
                 .view('top')
                 .shapeLocalSource(os.path.join(front3d_base, '3D-FUTURE-model'))
                 .hiddenMeshes(['Ceiling', 'CustomizedCeiling'])
                 .renderType('depth')))
    Trescope().selectOutput(output_id).flush()


def visualize_front3d_normal(output_id, front3d_scene_file):
    (Trescope().selectOutput(output_id)
     .plotFRONT3D(front3d_scene_file)
     .withConfig(FRONT3DConfig()
                 .view('top')
                 .shapeLocalSource(os.path.join(front3d_base, '3D-FUTURE-model'))
                 .hiddenMeshes(['Ceiling', 'CustomizedCeiling'])
                 .renderType('normal')))
    Trescope().selectOutput(output_id).flush()


def main(output_type):
    front3d_scene = os.path.join(front3d_base, 'scenes')


    output_ids = [f'{file[:-5]}.{render_type}' for file in os.listdir(front3d_scene) for render_type in ['color', 'depth', 'normal', 'mesh_semantic']]

    if 'file' == output_type:
        Trescope().initialize(True, simpleFileOutputs('../data/gen/plot_front3d', output_ids, 720, 720))
    else:
        Trescope().initialize(True, simpleDisplayOutputs(3, 4, output_ids))

    for index, file in enumerate(os.listdir(front3d_scene)):
        name = file[:-5]
        file = os.path.join(front3d_scene, file)
        visualize_front3d_color(f'{name}.color', file)
        visualize_front3d_depth(f'{name}.depth', file)
        visualize_front3d_normal(f'{name}.normal', file)
        visualize_front3d_mesh_type(f'{name}.mesh_semantic', file)


if __name__ == '__main__':
    main('display')
