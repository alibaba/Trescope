from trescope.config import Config


class ImageConfig(Config):
    """Config for :py:meth:`trescope.Output.plotImage`"""

    def __init__(self):
        super().__init__()

    def toDict(self) -> dict:
        return {**super().toDict()}
