from trescope import Trescope, Layout
from trescope.config import (Scatter3DConfig, FRONT3DConfig, Scatter2DConfig, Mesh3DConfig, Lollipop3DConfig, ImageConfig, HistogramConfig,
                             ViolinConfig, VectorField3DConfig, HeatMapConfig, Surface3DConfig)
from trescope.toolbox import simpleDisplayOutputs, simpleFileOutputs
import numpy as np
import os


def main(output_type):
    if 'display' == output_type:
        Trescope().initialize(True, simpleDisplayOutputs(3, 4))
    else:
        Trescope().initialize(True, simpleFileOutputs('../data/gen/common_plot', list(range(12)), 480, 480))
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

    Trescope().selectOutput(2).updateLayout(Layout().showLegend(False))
    Trescope().selectOutput(2).plotMesh3D(
        [0, 0, 0],
        [0, 1, 0],
        [1, 0, 0]
    ).withConfig(Mesh3DConfig().indices([0], [1], [2]).name('plotMesh3D').color(0xffff0000))
    Trescope().selectOutput(2).flush()

    Trescope().selectOutput(3).plotLollipop3D(
        [0, 1, 0],
        [1, 1, -1],
        [0, 1, 0]
    ).withConfig(Lollipop3DConfig().locations([0, 1, 2], [0, 0, 0], [0, 0, 0]).name('plotLollipop3D').color(0xffff0000))
    Trescope().selectOutput(3).flush()

    x = np.random.randn(20)
    Trescope().selectOutput(4).plotHistogram(x).withConfig(HistogramConfig().color(0xaaff0000).name('plotHistogram').xBinRange(0, .4, .04))
    Trescope().selectOutput(4).flush()
    Trescope().selectOutput(5).plotViolin(x).withConfig(ViolinConfig().name('plotViolin').color(0xaa00ff00))
    Trescope().selectOutput(5).flush()

    Trescope().selectOutput(6).plotVectorField3D([1, 0], [1, 0], [1, 1]).withConfig(
        VectorField3DConfig()
            .name('plotVectorField3D')
            .color(0xffff0000)
            .autoScaleByLocation(False)
            .sizeFactor(1).locations([0, 3], [0, 3], [0, 0]))
    Trescope().selectOutput(6).flush()

    Trescope().selectOutput(7).plotHeatMap(np.array(range(10)).reshape((2, 5))).withConfig(HeatMapConfig().useGL(False))
    Trescope().selectOutput(7).flush()

    Trescope().selectOutput(8).plotSurface3D(np.random.rand(100).reshape((10, 10))).withConfig(Surface3DConfig())
    Trescope().selectOutput(8).flush()

    front3d_base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../data/res/3D-FRONT-samples/scenes'))
    Trescope().selectOutput(9).plotFRONT3D(os.path.join(front3d_base_dir,'310e0715-f95b-40ca-8edc-744560f57379.json')).withConfig(
        FRONT3DConfig()
            .view('top')
            .renderType('color')
            .shapeLocalSource('../data/res/3D-FRONT-samples/3D-FUTURE-model')
            .hiddenMeshes(['Ceiling', 'SlabTop', 'ExtrusionCustomizedCeilingModel']))
    Trescope().selectOutput(9).flush()

    Trescope().selectOutput(10).plotFRONT3D(os.path.join(front3d_base_dir,'07700701-1835-4532-8af0-bd8c7f624b1b.json')).withConfig(
        FRONT3DConfig()
            .shapeLocalSource('../data/res/3D-FRONT-samples/3D-FUTURE-model')
            .view('top')
            .renderType('depth')
            .hiddenMeshes(['Ceiling', 'SlabTop', 'ExtrusionCustomizedCeilingModel']))
    Trescope().selectOutput(10).flush()

    Trescope().selectOutput(11).plotFRONT3D(os.path.join(front3d_base_dir , 'dc74ad5c-34cf-4237-a3f3-a94297a907c8.json')).withConfig(
        FRONT3DConfig()
            .shapeLocalSource('../data/res/3D-FRONT-samples/3D-FUTURE-model')
            .view('top')
            .renderType('normal')
            .hiddenMeshes(['Ceiling', 'SlabTop', 'ExtrusionCustomizedCeilingModel']))
    Trescope().selectOutput(11).flush()


if __name__ == '__main__':
    main('display')
