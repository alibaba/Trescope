from typing import List

from trescope.config import Config
from trescope.core.Utils import get_abs_path


class FRONT3DConfig(Config):
    """Config for :py:meth:`trescope.Output.plotFRONT3D`"""

    def __init__(self):
        super().__init__()
        self.__shapeLocalSource: str = None
        self.__shapeRemoteSourceObj: str = None
        self.__shapeRemoteSourceTexture: str = None
        self.__view: str = None
        self.__unit: str = 'm'
        self.__hiddenMeshes: List[str] = []
        self.__renderType: str = 'color'  # depth , normal
        self.__renderer: str = 'default'  # blender
        self.__sampleCount: int = 128
        self.__baseLightStrength: float = 10

    def shapeLocalSource(self, shapeLocalSource: str):
        """
        Specify directory where model files (`*.obj` and `*.png` , referenced by front3d json file) put .

        :param shapeLocalSource: directory where model files (`*.obj` and `*.png` , referenced by front3d json file) put
        :return: self , for chain call
        """
        self.__shapeLocalSource = get_abs_path(shapeLocalSource)
        return self

    def shapeRemoteSource(self, obj: List[str], texture: List[str]):
        self.__shapeRemoteSourceObj = obj
        self.__shapeRemoteSourceTexture = texture
        return self

    def view(self, view: str):
        """
        Specify view , enumeration of `top` , `bottom` , `left` , `right` , `back` and `front`  or `None` .
        :doc-emphasize:`If view is specified ,` :py:meth:`trescope.Layout.camera` :doc-emphasize:`won't work .`

        :param view: enumeration of `top` , `bottom` , `left` , `right` , `back` and `front` or `None`
        :return: self , for chain call
        """
        self.__view = view
        return self

    def unit(self, unit: str):
        """
        Specify unit , `m` or `cm` .

        :param unit: unit , default `m`
        :return: self , for chain call
        """
        self.__unit = unit
        return self

    def renderType(self, renderType: str):
        """
        Specify render type , enumeration of `color` , `depth` and `normal` .

        :param renderType: render type , default `color`
        :return: self , for chain call
        """
        self.__renderType = renderType
        return self

    def hiddenMeshes(self, hiddenMeshes: List[str]):
        """
        Specify hidden meshes .

        :param hiddenMeshes: types of mesh to hide
        :return: self , for chain call
        """
        self.__hiddenMeshes = hiddenMeshes
        return self

    def renderer(self, renderer: str, sampleCount: int = 128):
        """
        Specify renderer , enumeration of `default` and `blender` .
        `blender` renderer only works , if blender has been installed .

        :param renderer: renderer , default `default`
        :param sampleCount: sample count , matters when `blender` renderer used
        :return: self , for chain call
        """
        self.__renderer = renderer
        self.__sampleCount = sampleCount
        return self

    def baseLightStrength(self, strength: float):
        """
        Specify base light strength .

        :param strength: light strength , default 10
        :return: self , for chain call
        """
        self.__baseLightStrength = strength
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
            'renderType': self.__renderType,
            'renderer': self.__renderer,
            'sampleCount': self.__sampleCount,
            'baseLightStrength': self.__baseLightStrength
        }
