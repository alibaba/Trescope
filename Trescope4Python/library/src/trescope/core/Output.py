from typing import List, Union

import numpy as np

from trescope.core.Layout import Layout
from trescope.core.Input import Input
from trescope.core.Content import Content


class Output(object):
    def __init__(self, id: str, trescope):
        from trescope.core.Trescope import Trescope
        self.__id: str = id
        self.__host: Trescope = trescope

    def getHost(self): return self.__host

    def toDict(self): return {'outputId': self.__id}

    def updateLayout(self, layout: Layout):
        self.__host.internalCommit(function='updateLayout', outputId=self.__id, **layout.toDict())

    def clear(self):
        self.__host.internalCommit(function='clearOutput', outputId=self.__id)

    def flush(self):  # TODO
        self.__host.internalCommit(function='flushOutput', outputId=self.__id)

    def plotHistogram(self, x: Union[List[float], np.ndarray]) -> Content:
        return Content(self, function='plotHistogram', x=x)

    def plotViolin(self, x: Union[List[float], np.ndarray]) -> Content:
        return Content(self, function='plotViolin', x=x)

    def plotVolume3D(self, x: Union[List[float], np.ndarray], y: Union[List[float], np.ndarray], z: Union[List[float], np.ndarray],
                     value: Union[List[float], np.ndarray]) -> Content:
        return Content(self, function='plotVolume3D', x=x, y=y, z=z, value=value)

    def plotScatter2D(self, x: Union[List[float], np.ndarray], y: Union[List[float], np.ndarray]) -> Content:
        return Content(self, function='plotScatter2D', x=x, y=y)

    def plotScatter3D(self, x: Union[List[float], np.ndarray], y: Union[List[float], np.ndarray],
                      z: Union[List[float], np.ndarray]) -> Content:
        return Content(self, function='plotScatter3D', x=x, y=y, z=z)

    def plotMesh3D(self, x: Union[List[float], np.ndarray], y: Union[List[float], np.ndarray],
                   z: Union[List[float], np.ndarray]) -> Content:
        return Content(self, function='plotMesh3D', x=x, y=y, z=z)

    def plotVectorField3D(self, u: Union[List[float], np.ndarray], v: Union[List[float], np.ndarray],
                          w: Union[List[float], np.ndarray]) -> Content:
        return Content(self, function='plotVectorField3D', x=u, y=v, z=w)

    def plotLollipop3D(self, u: Union[List[float], np.ndarray], v: Union[List[float], np.ndarray],
                       w: Union[List[float], np.ndarray]) -> Content:
        return Content(self, function='plotLollipop3D', x=u, y=v, z=w)

    def plotHeatMap(self, intensity2DArray: Union[List[float], np.ndarray]):
        return Content(self, function='plotHeatMap', intensity=intensity2DArray)

    def plotSurface3D(self, intensity2DArray: Union[List[float], np.ndarray]) -> Content:
        return Content(self, function='plotSurface3D', intensity=intensity2DArray)

    def plotFRONT3D(self, houseLayoutFile: str) -> Content:
        return Content(self, function='plotFRONT3D', filePath=houseLayoutFile)

    def plotJuranJson(self, filePath: str) -> Content:
        return Content(self, function='plotJuranJson', filePath=filePath)

    def plotJuranJsonString(self, content: str) -> Content:
        return Content(self, function='plotJuranJsonString', fileContent=content)

    def plotImage(self, remoteOrLocalPath: str) -> Content:
        return Content(self, function='plotImage', filePath=remoteOrLocalPath)

    def plotGraph(self, vertex: List, link: List, edge: List) -> Content:
        return Content(self, function='plotGraph', vertex=vertex, link=link, edge=edge)

    def asInput(self) -> Input:
        return Input(self)
