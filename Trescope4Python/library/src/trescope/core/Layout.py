from typing import Union, List

import numpy as np
from trescope.config import Camera, PerspectiveCamera
from trescope.core.Utils import toListIfNumpyOrTensorArray


class Layout(object):
    """
    Specify output layout , such as title , axis , camera (if 3d data) and so on .
    """

    def __init__(self):
        self.__title: str = ''
        self.__camera: Camera = PerspectiveCamera()
        self.__showLegend: bool = True
        self.__axisUniformScale: bool = True
        self.__xTickValues, self.__xTickTexts = None, None
        self.__legendOrientation = 'h'
        self.__hoverLabelTextColor = None
        self.__hoverLabelBackgroundColor = None

    def title(self, title: str):
        """
        Specify output title .

        :param title: title
        :return: self , for chain call
        """
        self.__title = title
        return self

    def showLegend(self, show: bool):
        """
        Show legend or not .

        :param show: True or False , default True
        :return: self , for chain call
        """
        self.__showLegend = show
        return self

    def legendOrientation(self, orientation: str):
        """
        Specify legend orientation .

        :param orientation:  `vertical` or `horizontal` , default `vertical`
        :return: self , for chain call
        """
        self.__legendOrientation = 'v' if 'vertical' == orientation else 'h'
        return self

    def axisUniformScale(self, axisUniformScale: bool):
        """
        Specify axis uniform scale or not .

        :param axisUniformScale: True or False , default True
        :return: self , for chain call
        """
        self.__axisUniformScale = axisUniformScale
        return self

    def axisXTicks(self, tickValues: Union[List[float], np.ndarray], tickTexts: List[str]):
        """
        Specify x axis ticks .

        :param tickValues: values of ticks
        :param tickTexts: text of ticks
        :return: self , for chain call
        """
        self.__xTickValues = tickValues
        self.__xTickTexts = tickTexts
        return self

    def hoverLabelStyle(self, textColor: int, backgroundColor: int):
        """
        Specify hover label style .

        :param textColor: text color
        :param backgroundColor: background color
        :return: self , for chain call
        """
        self.__hoverLabelTextColor = textColor
        self.__hoverLabelBackgroundColor = backgroundColor
        return self

    def camera(self, camera: Camera):
        """
        Specify camera , only works for 3d data .

        :param camera: camera
        :return: self , for chain call
        """
        self.__camera = camera
        return self

    def toDict(self):
        return {
            'title': self.__title,
            'axisUniformScale': self.__axisUniformScale,
            'xTickValues': toListIfNumpyOrTensorArray(self.__xTickValues),
            'xTickTexts': toListIfNumpyOrTensorArray(self.__xTickTexts),
            'showLegend': self.__showLegend,
            'legendOrientation': self.__legendOrientation,
            'hoverLabelTextColor': self.__hoverLabelTextColor,
            'hoverLabelBackgroundColor': self.__hoverLabelBackgroundColor,
            **self.__camera.toDict()
        }
