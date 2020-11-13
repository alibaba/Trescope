from trescope.config import Config


class ViolinConfig(Config):
    def __init__(self):
        super().__init__()
        self.__color: int = 0xff000000
        self.__useUniformScale = False
        self.__useUniformAxis = False

    def color(self, color: int):
        self.__color = color
        return self

    def useUniformScale(self, useUniformScale: bool):
        self.__useUniformScale = useUniformScale
        return self

    def useUniformAxis(self, useUniformAxis: bool):
        self.__useUniformAxis = useUniformAxis
        return self

    def toDict(self):
        return {
            **super().toDict(),
            'color': self.__color,
            'useUniformScale': self.__useUniformScale,
            'useUniformAxis': self.__useUniformAxis
        }
