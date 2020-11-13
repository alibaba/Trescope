from trescope.config import Config


class HeatMapConfig(Config):
    def __init__(self):
        super().__init__()
        self.__useGL: bool = False
        self.__colorScale: str = 'RdBu'

    def useGL(self, useGL: bool):
        self.__useGL = useGL
        return self

    def colorScale(self, colorScale: str):
        self.__colorScale = colorScale
        return self

    def toDict(self):
        return {
            **super().toDict(),
            'colorScale': self.__colorScale,
            'useGL': self.__useGL
        }
