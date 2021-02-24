from pathlib import Path
from typing import List, Union

from trescope.core.Utils import get_abs_path


class DisplayOutputDesc(object):
    """
    Display output description , specify **id** , **start** and **span** of output .
    """

    def __init__(self):
        self.__id: str = '0'
        self.__rowStart: int = 0
        self.__columnStart: int = 0
        self.__rowSpan: int = 0
        self.__columnSpan: int = 1

    def id(self, id: Union[str, int]):
        """
        Specify id of display output .

        :param id: ID of display output
        :return: self , for chain call
        """
        self.__id = id
        return self

    def getId(self) -> str: return self.__id

    def startAt(self, rowStart: int, columnStart: int):
        """
        Specify start of display output .

        :param rowStart: Start row
        :param columnStart: Start column
        :return: self , for chain call
        """
        self.__rowStart, self.__columnStart = rowStart, columnStart
        return self

    def withSpan(self, rowSpan: int, columnSpan: int):
        """
         Specify span of display output .

         :param rowSpan: Rows to span
         :param columnSpan: Columns to span
         :return: self , for chain call
         """
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
    """
    Specify output as display , check data in display ( browser ) with interaction , divide whole display to `resolutionRow` * `resolutionColumn` grids ,
    then layout outputs by specifying which grid to start at and how many grids to span .

    :param resolutionRow: How many rows to divide
    :param resolutionColumn: How many columns  to divide

    Example says all :

     .. code-block:: python
        :linenos:
        :emphasize-lines: 4 , 6

        from trescope import Trescope, DisplayOutputManager, DisplayOutputDesc
        from trescope.config import Scatter2DConfig

        # Divide display to 4 * 10 grids
        outputManager = DisplayOutputManager(4, 10)
        # Output `startAt(0, 0).withSpan(1, 10)` occupies 1 * 10 grids and starts at grid(0 , 0)
        outputManager.add(DisplayOutputDesc().id('startAt(0, 0).withSpan(1, 10)').startAt(0, 0).withSpan(1, 10))
        outputManager.add(DisplayOutputDesc().id('startAt(1, 0).withSpan(5, 2)').startAt(1, 0).withSpan(3, 2))
        outputManager.add(DisplayOutputDesc().id('startAt(1, 3).withSpan(3, 2)').startAt(1, 2).withSpan(3, 8))
        Trescope().initialize(True, outputManager)
        Trescope().selectOutput('startAt(0, 0).withSpan(1, 10)').plotScatter2D([0, 1, 2], [0, 1, 2]).withConfig(Scatter2DConfig())
        Trescope().selectOutput('startAt(1, 0).withSpan(5, 2)').plotScatter2D([0, 1, 2], [0, 1, 2]).withConfig(Scatter2DConfig())
        Trescope().selectOutput('startAt(1, 3).withSpan(3, 2)').plotScatter2D([0, 1, 2], [0, 1, 2]).withConfig(Scatter2DConfig())

    You will see something below in browser :

    .. image:: ../_static/display-output-manager.png

    """

    def __init__(self, resolutionRow: int, resolutionColumn: int):
        self.__outputDescs: List[DisplayOutputDesc] = []
        self.__resolutionRow: int = resolutionRow
        self.__resolutionColumn: int = resolutionColumn

    def add(self, outputDesc: DisplayOutputDesc):
        """
        Add output description .

        :param outputDesc: Display output description to specify **output id** , **where starts** , **how many spans**
        :return: self , for chain call
        """
        self.__outputDescs.append(outputDesc)
        return self

    def __iter__(self):
        return iter(self.__outputDescs)

    def __next__(self):
        return next(self.__outputDescs)

    def toDict(self):
        return {'resolutionRow': self.__resolutionRow, 'resolutionColumn': self.__resolutionColumn}


class FileOutputDesc():
    """
    Display output description , specify **id** (name of image file) of output .
    """

    def __init__(self):
        self.__id: str = '0'

    def id(self, id: Union[str, int]):
        """
        Specify id of file output .

        :param id: ID of file output
        :return: self , for chain call
        """
        self.__id = id
        return self

    def getId(self) -> str: return self.__id

    def toDict(self):
        return {'outputId': self.__id}


class FileOutputManager(object):
    """
    Specify output as file , plot data to image file .

    :param directory: Directory where image file generated
    :param widthPixel: image width
    :param heightPixel: image height
    """

    def __init__(self, directory: Union[str, Path], widthPixel: int = 640, heightPixel: int = 480):
        self.__outputDescs: List[FileOutputDesc] = []
        self.__directory: str = get_abs_path(directory)
        self.__widthPixel: int = widthPixel
        self.__heightPixel: int = heightPixel

    def add(self, outputDesc: FileOutputDesc):
        """
        Add output description .

        :param outputDesc: File output description to specify **output id** (file names)
        :return: self , for chain call
        """
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
