from trescope.config import Config


class ViolinConfig(Config):
    """Config for :py:meth:`trescope.Output.plotViolin`"""

    def __init__(self):
        super().__init__()
        self.__color: int = 0xff000000
        self.__useUniformScale = False
        self.__useUniformAxis = False

    def color(self, color: int):
        """
        Specify color .

        :param color: color , default 0xff000000 (means black with transparency of 0x88)
        :return: self , for chain call
        """
        self.__color = color
        return self

    def useUniformScale(self, useUniformScale: bool):
        """
        Use uniform scale or not .

        :param useUniformScale: use uniform scale , default `False`
        :return: self , for chain call
        """
        self.__useUniformScale = useUniformScale
        return self

    def useUniformAxis(self, useUniformAxis: bool):
        """
        Use uniform axis or not .

        :param useUniformAxis: use uniform axis , default `False`
        :return: self , for chain call
        """
        self.__useUniformAxis = useUniformAxis
        return self

    def toDict(self):
        return {
            **super().toDict(),
            'color': self.__color,
            'useUniformScale': self.__useUniformScale,
            'useUniformAxis': self.__useUniformAxis
        }
