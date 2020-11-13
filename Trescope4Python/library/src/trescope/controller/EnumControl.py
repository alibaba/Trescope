from typing import List

from trescope.controller import ControllerNode


class EnumControl(ControllerNode):
    def __init__(self):
        super().__init__()
        self.__value = ''
        self.__enumeration = None

    def enumeration(self, *enumeration: List[str]):
        self.__enumeration = [*enumeration]
        return self

    def defaultValue(self, value: str):
        self.__value = value
        return self

    def toDict(self):
        return {**super().toDict(), 'type': 'EnumControl', 'value': self.__value, 'enumeration': self.__enumeration}
