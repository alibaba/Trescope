import os
from typing import List

from trescope.config import Config
from trescope.core.CompleteInfo import CompleteInfo
from trescope.core.Utils import generateRandomString, toListIfNumpyOrTensorArray


def _wrapFilePath(filePath: str):
    return filePath if 'http' == filePath[:4] else os.path.abspath(filePath)


class Content(object):
    def __init__(self, output, **kwargs):
        from trescope.core.Output import Output
        self.__host: Output = output
        self.__function: str = kwargs['function']
        self.__x: List[float] = kwargs['x'] if 'x' in kwargs else None
        self.__y: List[float] = kwargs['y'] if 'y' in kwargs else None
        self.__z: List[float] = kwargs['z'] if 'z' in kwargs else None
        self.__value: List[float] = kwargs['value'] if 'value' in kwargs else None
        self.__intensity = kwargs['intensity'] if 'intensity' in kwargs else None
        self.__filePath: str = _wrapFilePath(kwargs['filePath']) if 'filePath' in kwargs else \
            (self.__generateFile(kwargs['fileContent']) if 'fileContent' in kwargs else None)
        self.__vertex: List = kwargs['vertex'] if 'vertex' in kwargs else None
        self.__link: List = kwargs['link'] if 'link' in kwargs else None
        self.__edge: List = kwargs['edge'] if 'edge' in kwargs else None

    def __generateFile(self, fileContentString: str) -> str:
        filePath = os.path.join(self.getHost().getHost()._hostDirectory(), f'{generateRandomString(5)}.json')
        with open(filePath, 'w') as temp:
            temp.write(fileContentString)
        return filePath

    def getHost(self): return self.__host

    def toDict(self):
        return {
            'function': self.__function,
            'x': toListIfNumpyOrTensorArray(self.__x),
            'y': toListIfNumpyOrTensorArray(self.__y),
            'z': toListIfNumpyOrTensorArray(self.__z),
            'value': toListIfNumpyOrTensorArray(self.__value),
            'intensity': toListIfNumpyOrTensorArray(self.__intensity),
            'filePath': self.__filePath,
            'vertex': toListIfNumpyOrTensorArray(self.__vertex),
            'link': toListIfNumpyOrTensorArray(self.__link),
            'edge': toListIfNumpyOrTensorArray(self.__edge),
        }

    def withConfig(self, config: Config) -> None: CompleteInfo(self, config).commit()
