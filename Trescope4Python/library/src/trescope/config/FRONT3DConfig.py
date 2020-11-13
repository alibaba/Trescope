import os
from typing import List

from trescope.config import Config


class FRONT3DConfig(Config):
    def __init__(self):
        super().__init__()
        self.__shapeLocalSource: str = None
        self.__shapeRemoteSourceObj: str = None
        self.__shapeRemoteSourceTexture: str = None
        self.__view: str = None
        self.__unit: str = 'm'
        self.__hiddenMeshes: List[str] = []
        self.__renderType: str = 'color'  # depth , normal

    def shapeLocalSource(self, shapeLocalSource: str):
        self.__shapeLocalSource = os.path.abspath(shapeLocalSource)
        return self

    def shapeRemoteSource(self, obj: List[str], texture: List[str]):
        self.__shapeRemoteSourceObj = obj
        self.__shapeRemoteSourceTexture = texture
        return self

    def view(self, view: str):
        self.__view = view
        return self

    def unit(self, unit: str):
        self.__unit = unit
        return self

    def renderType(self, renderType: str):
        self.__renderType = renderType
        return self

    def hiddenMeshes(self, hiddenMeshes: List[str]):
        self.__hiddenMeshes = hiddenMeshes
        return self

    def toDict(self):
        return {
            **super().toDict(),
            'shapeLocalSource': self.__shapeLocalSource,
            'shapeRemoteSourceObj': self.__shapeRemoteSourceObj,
            'shapeRemoteSourceTexture': self.__shapeRemoteSourceTexture,
            'view': self.__view,
            'unit': self.__unit,
            'hiddenMeshes': self.__hiddenMeshes,
            'renderType': self.__renderType
        }
