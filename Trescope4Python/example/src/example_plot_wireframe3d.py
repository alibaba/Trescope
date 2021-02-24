from trescope import Trescope
from trescope.config import (Wireframe3DConfig)
from trescope.toolbox import simpleDisplayOutputs


def plot_wireframe_3d():
    Trescope().initialize(True, simpleDisplayOutputs(1, 4))

    Trescope().selectOutput(0).plotWireframe3D(
        [0, 1, 1, 0],
        [0, 0, 1, 1],
        [0, 0, 0, 0]
    ).withConfig(Wireframe3DConfig().indices(
        [0, 3],
        [1, 1],
        [3, 2]).color(0xffff0000).width(1))

    Trescope().selectOutput(1).plotWireframe3D(
        [0, 1, 1, 0],
        [0, 0, 1, 1],
        [0, 0, 0, 0]
    ).withConfig(Wireframe3DConfig().indices(
        [0, 3],
        [1, 1],
        [3, 2]).color(0xff00ff00).width(5))


if __name__ == '__main__':
    plot_wireframe_3d()
