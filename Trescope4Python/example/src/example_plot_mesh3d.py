from trescope import Trescope, Layout
from trescope.config import (Mesh3DConfig)
from trescope.toolbox import simpleDisplayOutputs


def plot_mesh_3d():
    Trescope().initialize(True, simpleDisplayOutputs(1, 4))

    Trescope().selectOutput(0).updateLayout(Layout().title('color'))
    Trescope().selectOutput(1).updateLayout(Layout().title('faceColor'))

    Trescope().selectOutput(0).plotMesh3D(
        [0, 1, 1, 0],
        [0, 0, 1, 1],
        [0, 0, 0, 0]
    ).withConfig(Mesh3DConfig().indices(
        [0, 3],
        [1, 1],
        [3, 2]).color(0xffff00ff))

    Trescope().selectOutput(1).plotMesh3D(
        [0, 1, 1, 0],
        [0, 0, 1, 1],
        [0, 0, 0, 0]
    ).withConfig(Mesh3DConfig().indices(
        [0, 3],
        [1, 1],
        [3, 2]).faceColor([0xffff0000, 0xff0000ff]))


if __name__ == '__main__':
    plot_mesh_3d()
