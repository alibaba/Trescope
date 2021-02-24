from trescope import Trescope, Layout
from trescope.config import (Scatter3DConfig, ScatterMode, AxisHelper3DConfig)
from trescope.toolbox import simpleDisplayOutputs


def plot_scatter_3d():
    Trescope().initialize(True, simpleDisplayOutputs(1, 3))

    Trescope().selectOutput(0).updateLayout(Layout().title('marker'))
    Trescope().selectOutput(1).updateLayout(Layout().title('line'))
    Trescope().selectOutput(1).updateLayout(Layout().title('marker+line'))

    Trescope().selectOutput(0).plotAxisHelper3D().withConfig(AxisHelper3DConfig().width(5).axisLength(.5))
    Trescope().selectOutput(0).plotScatter3D(
        [0, 1, 1, 0],
        [0, 0, 1, 1],
        [0, 0, 0, 0]
    ).withConfig(Scatter3DConfig().color(0xffff0000).mode([ScatterMode.MARKERS]))

    Trescope().selectOutput(1).plotScatter3D(
        [0, 1, 1, 0],
        [0, 0, 1, 1],
        [0, 0, 0, 0]
    ).withConfig(Scatter3DConfig().color(0xff00ff00).mode([ScatterMode.LINES]))

    Trescope().selectOutput(2).plotScatter3D(
        [0, 1, 1, 0],
        [0, 0, 1, 1],
        [0, 0, 0, 0]
    ).withConfig(Scatter3DConfig().color(0xff0000ff).mode([ScatterMode.MARKERS, ScatterMode.LINES]).width(4).size(8))


if __name__ == '__main__':
    plot_scatter_3d()
