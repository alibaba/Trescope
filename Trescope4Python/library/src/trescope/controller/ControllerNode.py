class ControllerNode(object):
    def __init__(self):
        self.__id = ''
        self.__label = ''
        self._children = []

    def id(self, id: str):
        """
        Specify control id .

        :param id: ID of control
        :return: self , for chain call
        """
        self.__id = id
        return self

    def getId(self) -> str: return self.__id

    def label(self, label: str):
        """
        Specify label of control .

        :param label: label of control
        :return: self , for chain call
        """

        self.__label = label
        return self

    def toDict(self):
        return {'id': self.__id, 'label': self.__label}
