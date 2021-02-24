from trescope.config import Config


class AxisHelper3DConfig(Config):
    """Config for :py:meth:`trescope.Output.plotAxisHelper3D`"""

    def __init__(self):
        super().__init__()
        self.__width = 1
        self.__axisLength = 1

    def width(self, width: float):
        """
        Axis line width .

        :param width: width , default 1
        :return: self , for chain call
        """
        self.__width = width
        return self

    def axisLength(self, axisLength: float):
        """
        Axis length .

        :param axisLength: axisLength , default 1
        :return: self , for chain call
        """
        self.__axisLength = axisLength
        return self

    def toDict(self):
        return {
            **super().toDict(),
            'width': self.__width,
            'axisLength': self.__axisLength
        }
