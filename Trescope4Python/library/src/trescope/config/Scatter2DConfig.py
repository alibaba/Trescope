from typing import List

from trescope.config import Config, ScatterMode, ScatterSymbol


class Scatter2DConfig(Config):
    def __init__(self):
        super().__init__()
        self.__color: int = 0xff000000
        self.__size: float = 5
        self.__useGL: bool = False
        self.__mode: List[str] = [ScatterMode.MARKER]
        self.__symbol: str = ScatterSymbol.Circle
        self.__fill: bool = False
        self.__fillColor: int = 0x88000000

    def color(self, color: int):
        self.__color = color
        return self

    def size(self, size: float):
        self.__size = size
        return self

    def mode(self, modeCombination: List[str]):
        self.__mode = modeCombination
        return self

    def symbol(self, symbolOrSymbols):
        self.__symbol = symbolOrSymbols
        return self

    def useGL(self, useGL: bool):
        self.__useGL = useGL
        return self

    def fill(self, fill: bool):
        self.__fill = fill
        return self

    def fillColor(self, color: int):
        self.__fillColor = color
        return self

    def toDict(self):
        return {
            **super().toDict(),
            'color': self.__color,
            'size': self.__size,
            'mode': self.__mode,
            'symbol': self.__symbol,
            'useGL': self.__useGL,
            'fill': self.__fill,
            'fillColor': self.__fillColor
        }
