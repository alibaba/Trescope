from typing import List

from trescope.config import Config, ScatterMode, ScatterSymbol


class Scatter2DConfig(Config):
    """Config for :py:meth:`trescope.Output.plotScatter2D`"""

    def __init__(self):
        super().__init__()
        self.__color: int = 0xff000000
        self.__size: float = 5
        self.__useGL: bool = False
        self.__mode: List[str] = [ScatterMode.MARKERS]
        self.__symbol: str = ScatterSymbol.Circle
        self.__fill: bool = False
        self.__fillColor: int = 0x88000000

    def color(self, color: int):
        """
        Specify color .

        :param color: color , default 0xff000000 (means black with no transparency)
        :return: self , for chain call
        """
        self.__color = color
        return self

    def size(self, size: float):
        """
        Specify size .

        :param size: size , default 5
        :return: self , for chain call
        """
        self.__size = size
        return self

    def mode(self, modeCombination: List[str]):
        """
        Specify mode , enumeration of :py:attr:`trescope.config.ScatterMode.MARKERS` ,
        :py:attr:`trescope.config.ScatterMode.LINES` or combination of them .

        :param modeCombination: combination of mode , default `[trescope.config.ScatterMode.MARKERS]`
        :return: self , for chain call
        """
        self.__mode = modeCombination
        return self

    def symbol(self, symbolOrSymbols):
        """
        Specify symbol .

        :param symbolOrSymbols: symbol , see :py:mod:`trescope.config.ScatterSymbol` , default :py:attr:`trescope.config.ScatterSymbol.Circle`
        :return: self , for chain call
        """
        self.__symbol = symbolOrSymbols
        return self

    def useGL(self, useGL: bool):
        """
        Specify use gl or not .

        :param useGL: use gl , default `False`
        :return: self , for chain call
        """
        self.__useGL = useGL
        return self

    def fill(self, fill: bool):
        """
        Specify fill or not .

        :param fill: fill , default `False`
        :return: self , for chain call
        """
        self.__fill = fill
        return self

    def fillColor(self, color: int):
        """
        Specify fill color .

        :param color: color , default 0x88000000 (means black with transparency of 0x88)
        :return: self , for chain call
        """
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
