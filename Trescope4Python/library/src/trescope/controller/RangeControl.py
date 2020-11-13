from trescope.controller import ControllerNode


class RangeControl(ControllerNode):
    def __init__(self):
        super().__init__()
        self.__value = 0
        self.__min = 0
        self.__max = 0
        self.__step = 0

    def defaultValue(self, value: float):
        self.__value = value
        return self

    def min(self, min_: float):
        self.__min = min_
        return self

    def max(self, max_: float):
        self.__max = max_
        return self

    def step(self, step: float):
        self.__step = step
        return self

    def toDict(self):
        return {**super().toDict(), 'type': 'RangeControl', 'value': self.__value, 'min': self.__min, 'max': self.__max,
                'step': self.__step}
