from trescope import Trescope, Layout
from trescope.config import (Mesh3DConfig, Scatter2DConfig, ScatterMode)
from trescope.toolbox import simpleDisplayOutputs


def update_layout():
    Trescope().initialize(True, simpleDisplayOutputs(2, 4))

    Trescope().selectOutput(0).updateLayout(Layout().title('color'))
    Trescope().selectOutput(1).updateLayout(
        Layout().title('hoverLabel redText blueBKG').hoverLabelStyle(textColor=0xffff0000, backgroundColor=0xff0000ff))
    Trescope().selectOutput(2).updateLayout(Layout().title('uniformAxis:True').axisUniformScale(True))
    Trescope().selectOutput(3).updateLayout(Layout().title('uniformAxis:False').axisUniformScale(False))
    Trescope().selectOutput(4).updateLayout(Layout().title('customize x tick(1->a,3->b)').axisXTicks([1, 3], ['a', 'b']))
    Trescope().selectOutput(5).updateLayout(Layout().title('legend orientation: v').legendOrientation('vertical'))

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
        [3, 2]).color(0xffff00ff))

    Trescope().selectOutput(2).plotScatter2D(
        [1, 2, 3],
        [1, 4, 6],
    ).withConfig(Scatter2DConfig().mode([ScatterMode.LINES, ScatterMode.MARKERS]).color(0xffff0000))

    Trescope().selectOutput(3).plotScatter2D(
        [1, 2, 3],
        [1, 4, 6],
    ).withConfig(Scatter2DConfig().mode([ScatterMode.LINES, ScatterMode.MARKERS]).color(0xffff0000))

    Trescope().selectOutput(4).plotScatter2D(
        [1, 2, 3],
        [1, 4, 6],
    ).withConfig(Scatter2DConfig().mode([ScatterMode.LINES, ScatterMode.MARKERS]).color(0xffff0000))

    Trescope().selectOutput(5).plotScatter2D(
        [1, 2, 3],
        [1, 4, 6],
    ).withConfig(Scatter2DConfig().mode([ScatterMode.LINES, ScatterMode.MARKERS]).color(0xffff0000))
    Trescope().selectOutput(5).plotScatter2D(
        [1, 2, 3],
        [1, 2, 3],
    ).withConfig(Scatter2DConfig().mode([ScatterMode.LINES, ScatterMode.MARKERS]).color(0xff00ff00))


if __name__ == '__main__':
    update_layout()
