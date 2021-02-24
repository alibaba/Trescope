from typing import Tuple

from trescope.core.Utils import singleton


class ColorScale:
    RdBu = 'RdBu'
    Greys = 'Greys'
    YlOrRd = 'YlOrRd'
    YlGnBu = 'YlGnBu'
    Portland = 'Portland'
    Picnic = 'Picnic'
    Jet = 'Jet'
    Hot = 'Hot'
    Greens = 'Greens'
    Electric = 'Electric'
    Earth = 'Earth'
    Bluered = 'Bluered'
    Blackbody = 'Blackbody'


class Camera:
    def __init__(self):
        self.__eye: Tuple[float] = [1.25, 1.25, 1.25]
        self.__center: Tuple[float] = [0, 0, 0]
        self.__up: Tuple[float] = [0, 1, 0]

    def eye(self, x: float, y: float, z: float):
        self.__eye = [x, y, z]
        return self

    def center(self, x: float, y: float, z: float):
        self.__center = [x, y, z]
        return self

    def up(self, x: float, y: float, z: float):
        self.__up = [x, y, z]
        return self

    def toDict(self) -> dict: return {
        'eye': self.__eye,
        'center': self.__center,
        'up': self.__up
    }


class OrthographicCamera(Camera):
    def toDict(self) -> dict: return {'projectionType': 'orthographic', **super().toDict()}


class PerspectiveCamera(Camera):
    def __init__(self):
        super().__init__()
        self.__fovy: float = 65
        self.__near: float = .1
        self.__far: float = 100
        self.__aspect: float = None

    def fovy(self, fovyDegree: float):
        self.__fovy = fovyDegree
        return self

    def near(self, near: float):
        self.__near = near
        return self

    def far(self, far: float):
        self.__far = far
        return self

    def aspect(self, aspect: float):
        self.__aspect = aspect
        return self

    def toDict(self) -> dict: return {
        'projectionType': 'perspective',
        'fovy': self.__fovy,
        'near': self.__near,
        'far': self.__far,
        'aspect': self.__aspect,
        **super().toDict()
    }


class AnchorType: pass


@singleton
class AnchorTip(AnchorType):
    def __str__(self): return 'tip'


@singleton
class AnchorTail(AnchorType):
    def __str__(self): return 'tail'


@singleton
class AnchorCM(AnchorType):
    def __str__(self): return 'cm'


@singleton
class AnchorCenter(AnchorType):
    def __str__(self): return 'center'


class ScatterMode:
    MARKERS: str = 'markers'
    LINES: str = 'lines'
    TEXT: str = 'text'


from .ScatterSymbol import ScatterSymbol

from .Config import Config
from .ImageConfig import ImageConfig
from .Mesh3DConfig import Mesh3DConfig
from .Scatter2DConfig import Scatter2DConfig
from .Scatter3DConfig import Scatter3DConfig
from .HeatMapConfig import HeatMapConfig
from .VectorField3DConfig import VectorField3DConfig
from .Lollipop3DConfig import Lollipop3DConfig
from .GraphConfig import GraphConfig
from .Surface3DConfig import Surface3DConfig
from .HistogramConfig import HistogramConfig
from .ViolinConfig import ViolinConfig
from .Volume3DConfig import Volume3DConfig
from .FRONT3DConfig import FRONT3DConfig
from .Wireframe3DConfig import Wireframe3DConfig
from .AxisHelper3DConfig import AxisHelper3DConfig
from .LineSegmentConfig import LineSegmentConfig
from .PieConfig import PieConfig

__all__ = [
    'Camera',
    'OrthographicCamera',
    'PerspectiveCamera',
    'AnchorType',
    'AnchorTip',
    'AnchorTail',
    'AnchorCM',
    'AnchorCenter',
    'ScatterMode',
    'ScatterSymbol',
    'ColorScale',

    'Config',
    'ImageConfig',
    'Mesh3DConfig',
    'Scatter2DConfig',
    'Scatter3DConfig',
    'HeatMapConfig',
    'VectorField3DConfig',
    'Lollipop3DConfig',
    'GraphConfig',
    'Surface3DConfig',
    'HistogramConfig',
    'ViolinConfig',
    'Volume3DConfig',
    'FRONT3DConfig',
    'Wireframe3DConfig',
    'AxisHelper3DConfig',
    'LineSegmentConfig',
    'PieConfig',
]
