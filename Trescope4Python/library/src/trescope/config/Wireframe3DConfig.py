from typing import List

from trescope.config import Config
from trescope.core.Utils import toListIfNumpyOrTensorArray


class Wireframe3DConfig(Config):
    """Config for :py:meth:`trescope.Output.plotWireframe3D`"""

    def __init__(self):
        super().__init__()
        self.__color: int = 0xff000000
        self.__width: int = 1
        self.__i: List[int] = None
        self.__j: List[int] = None
        self.__k: List[int] = None

    def color(self, color: int):
        """
        Specify line color of  wireframe.

        :param color: color ,  default 0xff000000 (means black with no transparency)
        :return: self , for chain call
        """
        self.__color = color
        return self

    def width(self, width: int):
        """
        Specify line width of wireframe .

        :param width: width , default 1
        :return: self , for chain call
        """
        self.__width = width
        return self

    def indices(self, i: List[int], j: List[int], k: List[int]):
        """
        Specify indices of vertices to form faces .

        :param i: i
        :param j: j
        :param k: k
        :return: self , for chain call
        """
        self.__i, self.__j, self.__k = i, j, k
        return self

    def toDict(self):
        return {
            **super().toDict(),
            'color': self.__color,
            'width': self.__width,
            'i': toListIfNumpyOrTensorArray(self.__i),
            'j': toListIfNumpyOrTensorArray(self.__j),
            'k': toListIfNumpyOrTensorArray(self.__k),
        }
