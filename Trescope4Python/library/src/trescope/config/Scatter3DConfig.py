from typing import List, Union

from trescope.config import Config, ScatterMode, ScatterSymbol
from trescope.core.Utils import toListIfNumpyOrTensorArray


class Scatter3DConfig(Config):
    """Config for :py:meth:`trescope.Output.plotScatter3D`"""

    def __init__(self):
        super().__init__()
        self.__color: Union(int, List[int]) = 0xff000000
        self.__size: float = 5
        self.__width: float = 1
        self.__mode: List[str] = [ScatterMode.MARKERS]
        self.__symbol = ScatterSymbol.Circle

    def color(self, color: Union[int, List[int]]):
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

    def width(self, width: float):
        """
        Specify line width .

        :param width: width , default 1
        :return: self , for chain call
        """
        self.__width = width
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

    def toDict(self):
        return {
            **super().toDict(),
            'color': toListIfNumpyOrTensorArray(self.__color),
            'size': self.__size,
            'width': self.__width,
            'symbol': self.__symbol,
            'mode': self.__mode
        }
