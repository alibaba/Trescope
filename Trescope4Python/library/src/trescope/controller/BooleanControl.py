from trescope.controller import ControllerNode


class BooleanControl(ControllerNode):
    def __init__(self):
        super().__init__()
        self.__value = False

    def defaultValue(self, value: bool):
        self.__value = value
        return self

    def toDict(self):
        return {**super().toDict(), 'type': 'BooleanControl', 'value': self.__value}
