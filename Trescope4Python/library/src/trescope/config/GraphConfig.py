from trescope.config import Config
from trescope.core.Utils import toListIfNumpyOrTensorArray


class GraphConfig(Config):
    """Config for :py:meth:`trescope.Output.plotGraph`"""

    def __init__(self):
        super().__init__()
        self.__vertexDescription = None
        self.__edgeDescription = None
        self.__vertexSize = 3.
        self.__edgeWidth = 1.
        self.__vertexColor = 0xffff0000
        self.__edgeColor = 0xff0000ff
        self.__vertexOpacity = 1.
        self.__edgeOpacity = 1.

    def vertexDescription(self, vertexDescription):
        """
        Specify vertex description .

        :param vertexDescription: vertex description
        :return: self , for chain call
        """
        self.__vertexDescription = vertexDescription
        return self

    def edgeDescription(self, edgeDescription):
        """
        Specify edge description .

        :param edgeDescription: edge description
        :return: self , for chain call
        """
        self.__edgeDescription = edgeDescription
        return self

    def vertexSize(self, vertexSize):
        """
        Specify vertex size .

        :param vertexSize: vertex size
        :return: self , for chain call
        """
        self.__vertexSize = vertexSize
        return self

    def edgeWidth(self, edgeWidth):
        """
        Specify edge width .

        :param edgeWidth: edge width
        :return: self , for chain call
        """
        self.__edgeWidth = edgeWidth
        return self

    def vertexColor(self, vertexColor):
        """
        Specify vertex color .

        :param vertexColor: vertex color
        :return: self , for chain call
        """
        self.__vertexColor = vertexColor
        return self

    def edgeColor(self, edgeColor):
        """
        Specify edge color .

        :param edgeColor: edge color
        :return: self , for chain call
        """
        self.__edgeColor = edgeColor
        return self

    def vertexOpacity(self, vertexOpacity):
        """
        Specify vertex opacity .

        :param vertexOpacity: vertex opacity
        :return: self , for chain call
        """
        self.__vertexOpacity = vertexOpacity
        return self

    def edgeOpacity(self, edgeOpacity):
        """
        Specify edgeOpacity opacity .

        :param edgeOpacity: edge opacity
        :return: self , for chain call
        """
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
