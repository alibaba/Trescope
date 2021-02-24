from trescope.config import Config


class HeatMapConfig(Config):
    """Config for :py:meth:`trescope.Output.plotHeatMap`"""

    def __init__(self):
        super().__init__()
        self.__useGL: bool = False
        self.__colorScale: str = 'RdBu'

    def useGL(self, useGL: bool):
        """
        Specify use gl or not .

        :param useGL: use gl , default `False`
        :return: self , for chain call
        """
        self.__useGL = useGL
        return self

    def colorScale(self, colorScale: str):
        """
        Specify color scale .

        :param colorScale: color scale , default `RdBu`
        :return: self , for chain call
        """
        self.__colorScale = colorScale
        return self

    def toDict(self):
        return {
            **super().toDict(),
            'colorScale': self.__colorScale,
            'useGL': self.__useGL
        }
