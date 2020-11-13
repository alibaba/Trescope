from typing import List, Union

from trescope.config import Config, ScatterMode, ScatterSymbol
from trescope.core.Utils import toListIfNumpyOrTensorArray


class Scatter3DConfig(Config):
    def __init__(self):
        super().__init__()
        self.__color: Union(int, List[int]) = 0xff000000
        self.__size: float = 5
        self.__mode: List[str] = [ScatterMode.MARKER]
        self.__symbol = ScatterSymbol.Circle

    def color(self, color: Union[int, List[int]]):
        self.__color = color
        return self

    def size(self, size: float):
        self.__size = size
        return self

    def mode(self, mode: List[str]):
        self.__mode = mode
        return self

    def symbol(self, symbolOrSymbols):
        self.__symbol = symbolOrSymbols
        return self

    def toDict(self):
        return {
            **super().toDict(),
            'color': toListIfNumpyOrTensorArray(self.__color),
            'size': self.__size,
            'symbol': self.__symbol,
            'mode': self.__mode
        }
