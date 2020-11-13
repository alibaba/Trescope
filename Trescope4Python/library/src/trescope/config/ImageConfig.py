from trescope.config import Config


class ImageConfig(Config):
    def __init__(self):
        super().__init__()

    def toDict(self) -> dict:
        return {**super().toDict()}
