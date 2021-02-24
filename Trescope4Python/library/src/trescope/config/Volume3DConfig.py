from trescope.config import Config


class Volume3DConfig(Config):
    """Config for :py:meth:`trescope.Output.plotVolume3D`"""

    def __init__(self):
        super().__init__()
        self.__opacity: float = .2
        self.__surfaceCount: int = 5
        self.__isoMin: float = -.5
        self.__isoMax: float = .5

    def opacity(self, opacity: float):
        """
        Specify opacity .

        :param opacity: opacity , default .2
        :return: self , for chain call
        """
        self.__opacity = opacity
        return self

    def surfaceCount(self, surfaceCount: int):
        """
        Specify surface count .

        :param surfaceCount: surface count , default 5
        :return: self , for chain call
        """
        self.__surfaceCount = surfaceCount
        return self

    def isoMin(self, isoMin: float):
        """
        Specify iso min .

        :param isoMin: ios min  , default -.5
        :return: self , for chain call
        """
        self.__isoMin = isoMin
        return self

    def isoMax(self, isoMax: float):
        """
        Specify iso max .

        :param isoMax: ios max , default .5
        :return: self , for chain call
        """
        self.__isoMax = isoMax
        return self

    def toDict(self):
        return {
            **super().toDict(),
            'opacity': self.__opacity,
            'surfaceCount': self.__surfaceCount,
            'isoMin': self.__isoMin,
            'isoMax': self.__isoMax
        }
