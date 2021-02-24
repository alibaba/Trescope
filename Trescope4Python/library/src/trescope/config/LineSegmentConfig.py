from typing import List

from trescope.config import Config
from trescope.core.Utils import toListIfNumpyOrTensorArray


class LineSegmentConfig(Config):
    """Config for :py:meth:`trescope.Output.plotLineSegment`"""

    def __init__(self):
        super().__init__()
        self.__color: int = 0xff000000
        self.__width: int = 1
        self.__i: List[int] = None
        self.__j: List[int] = None

    def color(self, color: int):
        """
        Specify line color .

        :param color: color , default 0xff000000 (means black with no transparency)
        :return: self , for chain call
        """
        self.__color = color
        return self

    def width(self, width: int):
        """
        Specify line width .

        :param width: width , default 1
        :return: self , for chain call
        """
        self.__width = width
        return self

    def indices(self, i: List[int], j: List[int]):
        """
        Specify indices of  vertices to form line segments .

        :param i: i
        :param j: j
        :return: self , for chain call
        """

        self.__i, self.__j = i, j
        return self

    def toDict(self):
        return {
            **super().toDict(),
            'color': self.__color,
            'width': self.__width,
            'i': toListIfNumpyOrTensorArray(self.__i),
            'j': toListIfNumpyOrTensorArray(self.__j),
        }
