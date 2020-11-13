from trescope import Trescope, Layout
from trescope.config import (Mesh3DConfig, HeatMapConfig, ColorScale)
from trescope.toolbox import simpleDisplayOutputs
import numpy as np


def plot_heat_map():
    Trescope().initialize(True, simpleDisplayOutputs(1, 4))

    Trescope().selectOutput(0).plotHeatMap(np.array(range(10)).reshape((2, 5))).withConfig(
        HeatMapConfig().colorScale(ColorScale.Greys))
    Trescope().selectOutput(1).plotHeatMap(np.array(range(10)).reshape((2, 5))).withConfig(
        HeatMapConfig().colorScale(ColorScale.RdBu))

    Trescope().selectOutput(2).plotHeatMap(np.array(range(10)).reshape((2, 5))).withConfig(
        HeatMapConfig().colorScale(ColorScale.Greys).useGL(True))
    Trescope().selectOutput(3).plotHeatMap(np.array(range(10)).reshape((2, 5))).withConfig(
        HeatMapConfig().colorScale(ColorScale.RdBu).useGL(True))


if __name__ == '__main__':
    plot_heat_map()
