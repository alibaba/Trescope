from trescope import Trescope, DisplayOutputManager, DisplayOutputDesc
from trescope.config import Scatter2DConfig


def main():
    outputManager = DisplayOutputManager(4, 10)
    outputManager.add(DisplayOutputDesc().id('startAt(0, 0).withSpan(1, 10)').startAt(0, 0).withSpan(1, 10))
    outputManager.add(DisplayOutputDesc().id('startAt(1, 0).withSpan(5, 2)').startAt(1, 0).withSpan(3, 2))
    outputManager.add(DisplayOutputDesc().id('startAt(1, 3).withSpan(3, 2)').startAt(1, 2).withSpan(3, 8))
    Trescope().initialize(True, outputManager)

    Trescope().selectOutput('startAt(0, 0).withSpan(1, 10)').plotScatter2D([0, 1, 2], [0, 1, 2]).withConfig(Scatter2DConfig())
    Trescope().selectOutput('startAt(1, 0).withSpan(5, 2)').plotScatter2D([0, 1, 2], [0, 1, 2]).withConfig(Scatter2DConfig())
    Trescope().selectOutput('startAt(1, 3).withSpan(3, 2)').plotScatter2D([0, 1, 2], [0, 1, 2]).withConfig(Scatter2DConfig())


if __name__ == '__main__':
    main()
