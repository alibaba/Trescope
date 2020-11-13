from typing import List

from trescope.config import Config
from trescope.core.Utils import toListIfNumpyOrTensorArray


class Mesh3DConfig(Config):
    def __init__(self):
        super().__init__()
        self.__color: int = 0xff000000
        self.__i: List[int] = None
        self.__j: List[int] = None
        self.__k: List[int] = None
        self.__faceColor: List[int] = None

    def color(self, color: int):
        self.__color = color
        return self

    def faceColor(self, color: List[int]):
        self.__faceColor = color
        return self

    def indices(self, i: List[int], j: List[int], k: List[int]):
        self.__i, self.__j, self.__k = i, j, k
        return self

    def toDict(self):
        return {
            **super().toDict(),
            'color': self.__color,
            'faceColor': toListIfNumpyOrTensorArray(self.__faceColor),
            'i': toListIfNumpyOrTensorArray(self.__i),
            'j': toListIfNumpyOrTensorArray(self.__j),
            'k': toListIfNumpyOrTensorArray(self.__k),
        }
