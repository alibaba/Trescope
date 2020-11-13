class ControllerNode(object):
    def __init__(self):
        self.__id = ''
        self.__label = ''
        self._children = []

    def id(self, _id: str):
        self.__id = _id
        return self

    def getId(self) -> str: return self.__id

    def label(self, label: str):
        self.__label = label
        return self

    def toDict(self):
        return {'id': self.__id, 'label': self.__label}
