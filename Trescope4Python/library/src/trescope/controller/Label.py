from trescope.controller import ControllerNode


class Label(ControllerNode):
    """
    Label for information display .
    """

    def __init__(self):
        super().__init__()
        self.__value = None
        self.__openIfLink = True

    def value(self, value: str):
        """
        Value of label .

        :param value: value
        :return: self , for chain call
        """
        self.__value = value
        return self

    def openIfLink(self, openIfLink: bool):
        """
        Forward to a new web page if label is a hyper link .

        :param openIfLink: open if link , default `True`
        :return: self , for chain call
        """
        self.__openIfLink = openIfLink
        return self

    def toDict(self):
        return {**super().toDict(), 'type': 'Label', 'value': self.__value, 'openIfLink': self.__openIfLink}
