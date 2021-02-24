from trescope import Trescope
from trescope.config import (PieConfig)
from trescope.toolbox import simpleDisplayOutputs, simpleFileOutputs


def plot_pie():
    Trescope().initialize(True, simpleDisplayOutputs(1, 2))
    Trescope().selectOutput(0).plotPie(['dog', 'cat'], [45, 89]).withConfig(PieConfig())
    Trescope().selectOutput(0).flush()
    print('finish')


if __name__ == '__main__':
    plot_pie()
