from trescope.controller import ControllerNode


class TextControl(ControllerNode):
    """
    Control for inputting text .
    """

    def __init__(self):
        super().__init__()
        self.__value = ''

    def defaultValue(self, value: str):
        """
        Specify default text .

        :param value: value
        :return: self , for chain call
        """

        self.__value = value
        return self

    def toDict(self):
        return {**super().toDict(), 'type': 'TextControl', 'value': self.__value}
