from trescope.controller import ControllerNode


class TextControl(ControllerNode):
    def __init__(self):
        super().__init__()
        self.__value = ''

    def defaultValue(self, value: str):
        self.__value = value
        return self

    def toDict(self):
        return {**super().toDict(), 'type': 'TextControl', 'value': self.__value}
