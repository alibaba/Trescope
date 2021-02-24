from typing import List

from trescope.controller import ControllerNode


class EnumControl(ControllerNode):
    """
    Control for inputting enumerations .
    """

    def __init__(self):
        super().__init__()
        self.__value = ''
        self.__enumeration = None
        self.__style = 'horizontal'  # or vertical

    def enumeration(self, *enumeration: List[str]):
        """
        Specify enumerations .

        :param enumeration: enumeration
        :return: self , for chain call
        """
        self.__enumeration = [*enumeration]
        return self

    def defaultValue(self, value: str):
        """
        Specify default value .

        :param value: value
        :return: self , for chain call
        """
        self.__value = value
        return self

    def style(self, style: str):
        """
        Specify control to display vertically or horizontally .

        :param style: style , `horizontal` or `vertical` , default `horizontal`
        :return: self , for chain call
        """
        self.__style = style
        return self

    def toDict(self):
        return {**super().toDict(), 'type': 'EnumControl', 'value': self.__value, 'enumeration': self.__enumeration, 'style': self.__style}
