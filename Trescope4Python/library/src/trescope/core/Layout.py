from trescope.config import Camera, PerspectiveCamera


class Layout(object):
    def __init__(self):
        self.__title: str = ''
        self.__camera: Camera = PerspectiveCamera()
        self.__showLegend: bool = True
        self.__axisUniformScale: bool = True

    def title(self, title: str):
        self.__title = title
        return self

    def showLegend(self, show: bool):
        self.__showLegend = show
        return self

    def axisUniformScale(self, axisUniformScale: bool):
        self.__axisUniformScale = axisUniformScale
        return self

    def camera(self, camera: Camera):
        self.__camera = camera
        return self

    def toDict(self):
        return {
            'title': self.__title,
            'axisUniformScale': self.__axisUniformScale,
            'showLegend': self.__showLegend,
            **self.__camera.toDict()
        }
