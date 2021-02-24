from typing import List, Union

from trescope.controller import ControllerNode


class BoundingBox2D():
    """
    Image bounding box .
    """

    def __init__(self, x, y, width, height):
        self.__x = x
        self.__y = y
        self.__width = width
        self.__height = height

    def __str__(self):
        return f'(bbox2d,{self.__x},{self.__y},{self.__width},{self.__height})'


class VisualDataPickControl(ControllerNode):
    """
    Control for picking visual data , now support **Mesh3D** , **Scatter3D** and **Image bounding box** .
    """

    def __init__(self):
        super().__init__()
        self.__attachOutput = None
        self.__colorWhenPicked: int = 0xff888888
        self.__defaultValue: List = []

    def attachOutput(self, id: Union[str, int]):
        """
        Specify which output to pick data .

        :param id: output id
        :return: self , for chain call
        """
        self.__attachOutput = id
        return self

    def colorWhenPicked(self, color: int):
        """
        Specify color when data picked .

        :param color: color , default 0xff888888 (means light white with no transparency)
        :return: self , for chain call
        """
        self.__colorWhenPicked = color
        return self

    def defaultValue(self, *value):
        """
        Specify default data picked .

        :param value: value
        :return: self , for chain call
        """
        self.__defaultValue = value
        return self

    def toDict(self):
        return {**super().toDict(),
                'type': 'VisualDataPickControl',
                'attachOutput': self.__attachOutput,
                'colorWhenPicked': self.__colorWhenPicked,
                'value': list(map(str, self.__defaultValue))
                }
