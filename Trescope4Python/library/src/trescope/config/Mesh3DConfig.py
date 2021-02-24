from typing import List, Union, Tuple
import numpy as np

from trescope.config import Config
from trescope.core.Utils import toListIfNumpyOrTensorArray


class Mesh3DConfig(Config):
    """Config for :py:meth:`trescope.Output.plotMesh3D`"""

    def __init__(self):
        super().__init__()
        self.__color: int = 0xff000000
        self.__i: List[int] = None
        self.__j: List[int] = None
        self.__k: List[int] = None
        self.__u: List[float] = None
        self.__v: List[float] = None
        self.__texture: str = None
        self.__textureFlip: bool = True
        self.__textureWrap: List[str] = ['CLAMP_TO_EDGE', 'CLAMP_TO_EDGE']
        self.__faceColor: List[int] = None
        self.__flatShading = False

    def color(self, color: int):
        """
        Specify color of whole mesh .  :doc-emphasize:`If` :py:meth:`trescope.config.Mesh3DConfig.faceColor`  :doc-emphasize:`has specified , it won't work.`

        :param color: color , default 0xff000000 (means black with no transparency)
        :return: self , for chain call
        """
        self.__color = color
        return self

    def faceColor(self, color: Union[List[int], None]):
        """
        Specify colors of faces separately .

        :param color: color array , default `None`
        :return: self , for chain call
        """
        self.__faceColor = color
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

    def textureCoordinate(self, u: Union[List[float], np.ndarray], v: Union[List[float]]):
        """
        Specify texture coordinates .

        :param u: u
        :param v: v
        :return: self , for chain call
        """
        self.__u, self.__v = u, v
        return self

    def texture(self, uri: str, autoFlip: bool = True, wrap: Tuple[str, str] = ('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE')):
        """
        Specify texture .

        :param uri: texture uri , local file path or url .
        :param autoFlip: flip texture or not , default `True`
        :param wrap: wrap , enumeration of `CLAMP_TO_EDGE` and `REPEAT` , default `CLAMP_TO_EDGE`
        :return: self , for chain call
        """
        self.__texture = uri
        self.__textureFlip = autoFlip
        self.__textureWrap = list(wrap)
        return self

    def flatShading(self, flatShading: bool):
        """
        Specify flat shading .

        :param flatShading: flat shading , default `False`
        :return:
        """
        self.__flatShading = flatShading
        return self

    def toDict(self):
        return {
            **super().toDict(),
            'flatShading': self.__flatShading,
            'color': self.__color,
            'faceColor': toListIfNumpyOrTensorArray(self.__faceColor),
            'u': toListIfNumpyOrTensorArray(self.__u),
            'v': toListIfNumpyOrTensorArray(self.__v),
            'texture': self.__texture,
            'textureFlip': self.__textureFlip,
            'textureWrap': self.__textureWrap,
            'i': toListIfNumpyOrTensorArray(self.__i),
            'j': toListIfNumpyOrTensorArray(self.__j),
            'k': toListIfNumpyOrTensorArray(self.__k),
        }
