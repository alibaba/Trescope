from trescope.config import Config
from trescope.core.Utils import toListIfNumpyOrTensorArray


class GraphConfig(Config):
    def __init__(self):
        super().__init__()
        self.__vertexDescription = None
        self.__edgeDescription = None
        self.__vertexSize = None
        self.__edgeWidth = None
        self.__vertexColor = None
        self.__edgeColor = None
        self.__vertexOpacity = None
        self.__edgeOpacity = None

    def vertexDescription(self, vertexDescription):
        self.__vertexDescription = vertexDescription
        return self

    def edgeDescription(self, edgeDescription):
        self.__edgeDescription = edgeDescription
        return self

    def vertexSize(self, vertexSize):
        self.__vertexSize = vertexSize
        return self

    def edgeWidth(self, edgeWidth):
        self.__edgeWidth = edgeWidth
        return self

    def vertexColor(self, vertexColor):
        self.__vertexColor = vertexColor
        return self

    def edgeColor(self, edgeColor):
        self.__edgeColor = edgeColor
        return self

    def vertexOpacity(self, vertexOpacity):
        self.__vertexOpacity = vertexOpacity
        return self

    def edgeOpacity(self, edgeOpacity):
        self.__edgeOpacity = edgeOpacity
        return self

    def toDict(self):
        return {
            **super().toDict(),
            'vertexDescription': toListIfNumpyOrTensorArray(self.__vertexDescription),
            'edgeDescription': toListIfNumpyOrTensorArray(self.__edgeDescription),
            'vertexSize': self.__vertexSize,
            'edgeWidth': toListIfNumpyOrTensorArray(self.__edgeWidth),
            'vertexColor': toListIfNumpyOrTensorArray(self.__vertexColor),
            'edgeColor': toListIfNumpyOrTensorArray(self.__edgeColor),
            'vertexOpacity': self.__vertexOpacity,
            'edgeOpacity': self.__edgeOpacity
        }
