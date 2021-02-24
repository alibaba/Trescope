from typing import List

from trescope.config import Config
from trescope.core.Utils import toListIfNumpyOrTensorArray


class Lollipop3DConfig(Config):
    """Config for :py:meth:`trescope.Output.plotLollipop3D`"""

    def __init__(self):
        super().__init__()
        self.__headSize: float = 10
        self.__tailSize: float = 20
        self.__lineWidth: float = 1
        self.__color: int = 0xff000000
        self.__x: List[float] = []
        self.__y: List[float] = []
        self.__z: List[float] = []

    def headSize(self, size: float):
        """
        Specify head size .

        :param size: size , default 10
        :return: self , for chain call
        """
        self.__headSize = size
        return self

    def tailSize(self, size: float):
        """
        Specify tail size .

        :param size: size , default 20
        :return: self , for chain call
        """
        self.__tailSize = size
        return self

    def lineWidth(self, width: float):
        """
        Specify line width .

        :param width: width , default 1
        :return: self , for chain call
        """
        self.__lineWidth = width
        return self

    def locations(self, x: List[float], y: List[float], z: List[float]):
        """
        Specify locations .

        :param x: x
        :param y: y
        :param z: z
        :return: self , for chain call
        """
        self.__x, self.__y, self.__z = x, y, z
        return self

    def color(self, color: int):
        """
        Specify color .

        :param color: color , default 0xff000000 (means black with no transparency)
        :return: self , for chain call
        """
        self.__color = color
        return self

    def toDict(self):
        return {
            **super().toDict(),
            'tailSize': self.__tailSize,
            'headSize': self.__headSize,
            'lineWidth': self.__lineWidth,
            'color': self.__color,
            'locationX': toListIfNumpyOrTensorArray(self.__x),
            'locationY': toListIfNumpyOrTensorArray(self.__y),
            'locationZ': toListIfNumpyOrTensorArray(self.__z),
        }
