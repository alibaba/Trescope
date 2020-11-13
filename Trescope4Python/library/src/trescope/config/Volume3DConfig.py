from trescope.config import Config


class Volume3DConfig(Config):
    def __init__(self):
        super().__init__()
        self.__opacity: float = .2
        self.__surfaceCount: int = 5
        self.__isoMin: float = -.5
        self.__isoMax: float = .5

    def opacity(self, opacity: float):
        self.__opacity = opacity
        return self

    def surfaceCount(self, surfaceCount: int):
        self.__surfaceCount = surfaceCount
        return self

    def isoMin(self, isoMin: float):
        self.__isoMin = isoMin
        return self

    def isoMax(self, isoMax: float):
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
