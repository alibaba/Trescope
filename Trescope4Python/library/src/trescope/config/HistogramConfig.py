from typing import List

from trescope.config import Config


class HistogramConfig(Config):
    def __init__(self):
        super().__init__()
        self.__color: int = 0xff000000
        self.__xBinRange: List[float] = None

    def color(self, color: int):
        self.__color = color
        return self

    def xBinRange(self, start: float, end: float, step: float):
        self.__xBinRange = [start, end, step]
        return self

    def toDict(self):
        return {
            **super().toDict(),
            'color': self.__color,
            'xBinRange': self.__xBinRange
        }
