from pathlib import Path
from typing import List, Union

import numpy as np

from trescope.core.Content import Content
from trescope.core.Input import Input
from trescope.core.Layout import Layout


class Output(object):
    """
    Output for plotting data .
    """

    def __init__(self, id: str, trescope):
        from trescope.core.Trescope import Trescope
        self.__id: str = id
        self.__host: Trescope = trescope

    def getHost(self): return self.__host

    def toDict(self): return {'outputId': self.__id}

    def updateLayout(self, layout: Layout):
        """
        Update layout .

        :param layout: layout
        """
        self.__host._internalCommit(function='updateLayout', outputId=self.__id, **layout.toDict())

    def clear(self):
        """
        Clear output .
        """
        self.__host._internalCommit(function='clearOutput', outputId=self.__id)

    def flush(self):
        """
        Flush data to file , no influence for display output .
        """
        self.__host._internalCommit(function='flushOutput', outputId=self.__id)

    def plotHistogram(self, x: Union[List[float], np.ndarray]) -> Content:
        """
        Plot histogram .

        :param x: x
        :return: Content
        """
        return Content(self, function='plotHistogram', x=x)

    def plotViolin(self, x: Union[List[float], np.ndarray]) -> Content:
        """
        Plot violin , probability density .

        :param x: x
        :return: Content
        """
        return Content(self, function='plotViolin', x=x)

    def plotVolume3D(self, x: Union[List[float], np.ndarray], y: Union[List[float], np.ndarray], z: Union[List[float], np.ndarray],
                     value: Union[List[float], np.ndarray]) -> Content:
        """
        Plot volume .

        :param x: x
        :param y: y
        :param z: z
        :param value: value
        :return: Content
        """
        return Content(self, function='plotVolume3D', x=x, y=y, z=z, value=value)

    def plotScatter2D(self, x: Union[List[float], np.ndarray], y: Union[List[float], np.ndarray]) -> Content:
        """
        Plot 2D scatter .

        :param x: x
        :param y: y
        :return: Content
        """
        return Content(self, function='plotScatter2D', x=x, y=y)

    def plotScatter3D(self, x: Union[List[float], np.ndarray], y: Union[List[float], np.ndarray],
                      z: Union[List[float], np.ndarray]) -> Content:
        """
        Plot 3D scatter .

        :param x: x
        :param y: y
        :param z: z
        :return: Content
        """
        return Content(self, function='plotScatter3D', x=x, y=y, z=z)

    def plotMesh3D(self, x: Union[List[float], np.ndarray], y: Union[List[float], np.ndarray],
                   z: Union[List[float], np.ndarray]) -> Content:
        """
        Plot mesh .

        :param x: x
        :param y: y
        :param z: z
        :return: Content
        """
        return Content(self, function='plotMesh3D', x=x, y=y, z=z)

    def plotWireframe3D(self, x: Union[List[float], np.ndarray], y: Union[List[float], np.ndarray],
                        z: Union[List[float], np.ndarray]) -> Content:
        """
        Plot wireframe .

        :param x: x
        :param y: y
        :param z: z
        :return: Content
        """
        return Content(self, function='plotWireframe3D', x=x, y=y, z=z)

    def plotLineSegment(self, x: Union[List[float], np.ndarray], y: Union[List[float], np.ndarray]) -> Content:
        """
        Plot line segment .

        :param x: x
        :param y: y
        :return: Content
        """
        return Content(self, function='plotLineSegment', x=x, y=y)

    def plotVectorField3D(self, u: Union[List[float], np.ndarray], v: Union[List[float], np.ndarray],
                          w: Union[List[float], np.ndarray]) -> Content:
        """
        Plot 3D vector field .

        :param u: u
        :param v: v
        :param w: w
        :return: Content
        """
        return Content(self, function='plotVectorField3D', x=u, y=v, z=w)

    def plotAxisHelper3D(self):
        """
        Plot 3d axis helper .

        :return: Content
        """
        return Content(self, function='plotAxisHelper3D')

    def plotLollipop3D(self, u: Union[List[float], np.ndarray], v: Union[List[float], np.ndarray],
                       w: Union[List[float], np.ndarray]) -> Content:
        """
        Plot lollipop .

        :param u: u
        :param v: v
        :param w: w
        :return: Content
        """
        return Content(self, function='plotLollipop3D', x=u, y=v, z=w)

    def plotHeatMap(self, intensity2DArray: Union[List[float], np.ndarray]):
        """
        Plot heatmap .

        :param intensity2DArray: intensity
        :return: Content
        """
        return Content(self, function='plotHeatMap', intensity=intensity2DArray)

    def plotSurface3D(self, intensity2DArray: Union[List[float], np.ndarray]) -> Content:
        """
        Plot surface .

        :param intensity2DArray: intensity
        :return: Content
        """
        return Content(self, function='plotSurface3D', intensity=intensity2DArray)

    def plotFRONT3D(self, houseLayoutFile: Union[str, Path]) -> Content:
        """
        Plot FRONT3D scene .

        :param houseLayoutFile: Scene file
        :return: Content
        """
        return Content(self, function='plotFRONT3D', filePath=houseLayoutFile)

    def plotImage(self, remoteOrLocalPath: Union[str, Path]) -> Content:
        """
        Plot image .

        :param remoteOrLocalPath: Image local path or url
        :return: Content
        """
        return Content(self, function='plotImage', filePath=remoteOrLocalPath)

    def plotGraph(self, vertex: Union[List, np.ndarray], link: Union[List, np.ndarray], edge: Union[List, np.ndarray]) -> Content:
        """
        Plot graph .

        :param vertex: vertex
        :param link: link
        :param edge: edge
        :return: Content
        """
        return Content(self, function='plotGraph', vertex=vertex, link=link, edge=edge)

    def plotPie(self, label: Union[List, np.ndarray], value: Union[List, np.ndarray]) -> Content:
        """
        Plot pie .

        :param label: label
        :param value: value
        :return: Content
        """
        return Content(self, function='plotPie', label=label, value=value)

    def asInput(self) -> Input:
        """
        Change to input for add control .

        :return: Input
        """
        return Input(self)
