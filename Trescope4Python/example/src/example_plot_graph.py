import numpy as np
from trescope import Trescope
from trescope.config import GraphConfig
from trescope.toolbox import simpleDisplayOutputs


def plot_graph():
    Trescope().initialize(True, simpleDisplayOutputs(1, 3))
    (Trescope()
        .selectOutput(0)
        .plotGraph(
        vertex=np.array([[255, 0, 0, 0xff0000], [0, 255, 0, 0x00ff00], [0, 0, 255, 0x0000ff], [255, 255, 0, 0xffff00]]).T,
        link=[
            [0, 0, 2, 3, 2],
            [1, 1, 1, 3, 3]
        ],
        edge=np.array([[100, 90], [900, 802], [987, 234], [777, 990], [123, 345]]).T
    ).withConfig(
        GraphConfig()
            .vertexDescription(['红', '绿', '蓝', '黄'])
            .vertexSize(3)
            .vertexColor([0xff0000, 0x00ff00, 0x0000ff, 0xffff00])
            .vertexOpacity(.5)
            .edgeDescription('edge')
            .edgeColor('black')
            .edgeWidth([1.5, 1, 1, 1, 2])
            .edgeOpacity(.3)
    ))


if __name__ == '__main__':
    plot_graph()
