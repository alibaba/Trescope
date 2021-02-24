from trescope.config import Config


class PieConfig(Config):
    """Config for :py:meth:`trescope.Output.plotPie`"""

    def __init__(self):
        super().__init__()

    def toDict(self) -> dict:
        return {**super().toDict()}
