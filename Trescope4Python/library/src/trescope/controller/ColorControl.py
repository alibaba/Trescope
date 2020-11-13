from trescope.controller import ControllerNode


class ColorControl(ControllerNode):
    def __init__(self):
        super().__init__()
        self.__value = 0

    def defaultValue(self, value: int):
        self.__value = value
        return self

    def toDict(self):
        return {**super().toDict(), 'type': 'ColorControl', 'value': self.__value}
