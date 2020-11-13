from trescope.config import Config


class JuranJsonConfig(Config):
    def __init__(self):
        super().__init__()
        self.__cameraDistanceRatio:float = .5

    def cameraDistanceRatio(self, cameraDistanceRatio: float):
        self.__cameraDistanceRatio = cameraDistanceRatio
        return self

    def toDict(self):
        return {**super().toDict(), 'cameraDistanceRatio': self.__cameraDistanceRatio}
