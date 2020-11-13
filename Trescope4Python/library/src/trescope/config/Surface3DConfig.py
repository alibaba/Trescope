from trescope.config import Config


class Surface3DConfig(Config):
    def __init__(self):
        super().__init__()

    def toDict(self):
        return {
            **super().toDict(),
        }
