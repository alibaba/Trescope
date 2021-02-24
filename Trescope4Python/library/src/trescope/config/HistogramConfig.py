from typing import List

from trescope.config import Config


class HistogramConfig(Config):
    """Config for :py:meth:`trescope.Output.plotHistogram`"""

    def __init__(self):
        super().__init__()
        self.__color: int = 0xff000000
        self.__xBinRange: List[float] = None

    def color(self, color: int):
        """
        Specify color .

        :param color: color , default 0xff000000 (means black with no transparency)
        :return: self , for chain call
        """
        self.__color = color
        return self

    def xBinRange(self, start: float, end: float, step: float):
        """
        Specify x bin range .

        :param start: bin start
        :param end: bin end
        :param step: bin step
        :return: self , for chain call
        """
        self.__xBinRange = [start, end, step]
        return self

    def toDict(self):
        return {
            **super().toDict(),
            'color': self.__color,
            'xBinRange': self.__xBinRange
        }
