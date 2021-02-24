import os

from trescope import Trescope, Layout
from trescope.config import Scatter3DConfig, Scatter2DConfig, FRONT3DConfig, Mesh3DConfig
from trescope.toolbox import simpleFileOutputs


def main():
    Trescope().initialize(True, simpleFileOutputs(os.path.abspath(os.path.join(os.path.dirname(__file__),'../data/gen/file_output')), list(range(4)), 640, 480))
    Trescope().selectOutput(0).plotScatter3D(
        [1, 2, 3],
        [1, 1, 1],
        [2, 2, 2],
    ).withConfig(Scatter3DConfig().name('plotScatter3D').color(0xffff0000))
    Trescope().selectOutput(0).plotScatter3D([0], [0], [0]).withConfig(Scatter3DConfig().color(0xff00ff00))
    Trescope().selectOutput(0).updateLayout(Layout().showLegend(False))
    Trescope().selectOutput(0).flush()

    Trescope().selectOutput(1).plotScatter2D(
        [1, 2, 3],
        [1, 1, 1],
    ).withConfig(Scatter2DConfig().name('plotScatter2D').color(0xffff0000))
    Trescope().selectOutput(1).flush()

    Trescope().selectOutput(2).plotMesh3D(
        [0, 1, 1, 0],
        [0, 0, 1, 1],
        [0, 0, 0, 0]
    ).withConfig(Mesh3DConfig().indices(
        [0, 3],
        [1, 1],
        [3, 2]).color(0xffff00ff).name('plotMesh3D'))
    Trescope().selectOutput(2).flush()

    front3d_base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../data/res/3D-FRONT-samples'))
    front3d_scene_file = os.path.join(front3d_base_dir, 'scenes','310e0715-f95b-40ca-8edc-744560f57379.json')
    (Trescope().selectOutput(3)
     .plotFRONT3D(front3d_scene_file)
     .withConfig(FRONT3DConfig()
                 .view('top')
                 .shapeLocalSource(os.path.join(front3d_base_dir,'3D-FUTURE-model/'))
                 .hiddenMeshes(['Ceiling', 'CustomizedCeiling'])
                 .renderType('color')))
    Trescope().selectOutput(3).flush()


if __name__ == '__main__':
    main()
