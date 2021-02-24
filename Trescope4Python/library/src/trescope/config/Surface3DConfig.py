from trescope.config import Config


class Surface3DConfig(Config):
    """Config for :py:meth:`trescope.Output.plotSurface3D`"""

    def __init__(self):
        super().__init__()

    def toDict(self):
        return {
            **super().toDict(),
        }
