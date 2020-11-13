import os
from typing import List, Union


class DisplayOutputDesc(object):
    def __init__(self):
        self.__id: str = '0'
        self.__rowStart: int = 0
        self.__columnStart: int = 0
        self.__rowSpan: int = 0
        self.__columnSpan: int = 1

    def id(self, id: Union[str, int]):
        self.__id = str(id)
        return self

    def getId(self) -> str: return self.__id

    def startAt(self, rowStart, columnStart):
        self.__rowStart, self.__columnStart = rowStart, columnStart
        return self

    def withSpan(self, rowSpan, columnSpan):
        self.__rowSpan, self.__columnSpan = rowSpan, columnSpan
        return self

    def toDict(self):
        return {
            'outputId': self.__id,
            'rowStart': self.__rowStart,
            'columnStart': self.__columnStart,
            'rowSpan': self.__rowSpan,
            'columnSpan': self.__columnSpan,
        }


class DisplayOutputManager(object):
    def __init__(self, resolutionRow: int, resolutionColumn: int):
        self.__outputDescs: List[DisplayOutputDesc] = []
        self.__resolutionRow: int = resolutionRow
        self.__resolutionColumn: int = resolutionColumn

    def add(self, outputDesc: DisplayOutputDesc):
        self.__outputDescs.append(outputDesc)
        return self

    def __iter__(self):
        return iter(self.__outputDescs)

    def __next__(self):
        return next(self.__outputDescs)

    def toDict(self):
        return {'resolutionRow': self.__resolutionRow, 'resolutionColumn': self.__resolutionColumn}


class FileOutputDesc():
    def __init__(self):
        self.__id: str = '0'

    def id(self, id: Union[str, int]):
        self.__id = str(id)
        return self

    def getId(self) -> str: return self.__id

    def toDict(self):
        return {'outputId': self.__id}


class FileOutputManager(object):
    def __init__(self, directory: str, widthPixel: int = 640, heightPixel: int = 480):
        self.__outputDescs: List[FileOutputDesc] = []
        self.__directory: str = os.path.abspath(directory)
        self.__widthPixel: int = widthPixel
        self.__heightPixel: int = heightPixel

    def add(self, outputDesc: FileOutputDesc):
        self.__outputDescs.append(outputDesc)
        return self

    def __iter__(self):
        return iter(self.__outputDescs)

    def __next__(self):
        return next(self.__outputDescs)

    def toDict(self):
        return {
            'directory': self.__directory,
            'widthPixel': self.__widthPixel,
            'heightPixel': self.__heightPixel}
