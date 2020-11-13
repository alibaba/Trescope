from typing import List

from trescope.config import Config, AnchorType, AnchorCM
from trescope.core.Utils import toListIfNumpyOrTensorArray


class VectorField3DConfig(Config):
    def __init__(self):
        super().__init__()
        self.__sizeFactor: float = .5
        self.__autoScaleByLocation = False
        self.__colorScale = [[0, 0x88000000], [1, 0x88000000]]
        self.__x: List[float] = []
        self.__y: List[float] = []
        self.__z: List[float] = []
        self.__anchor: str = str(AnchorCM)

    def sizeFactor(self, sizeFactor: float):
        self.__sizeFactor = sizeFactor
        return self

    def anchor(self, anchor: AnchorType):
        self.__anchor = str(anchor)
        return self

    def autoScaleByLocation(self, autoScale: bool):
        self.__autoScaleByLocation = autoScale
        return self

    def locations(self, x: List[float], y: List[float], z: List[float]):
        self.__x, self.__y, self.__z = x, y, z
        return self

    def color(self, color: int):
        self.__colorScale = [[0, color], [1, color]]
        return self

    def toDict(self):
        return {
            **super().toDict(),
            'sizeFactor': self.__sizeFactor,
            'autoScaleByLocation': self.__autoScaleByLocation,
            'colorScale': self.__colorScale,
            'locationX': toListIfNumpyOrTensorArray(self.__x),
            'locationY': toListIfNumpyOrTensorArray(self.__y),
            'locationZ': toListIfNumpyOrTensorArray(self.__z),
            'anchor': self.__anchor
        }
