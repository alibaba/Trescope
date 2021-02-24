class Config:
    def __init__(self):
        self.__name: str = None

    def name(self, name: str):
        """
        Name of data .

        :param name: name
        :return: self , for chain call
        """
        self.__name = name
        return self

    def toDict(self) -> dict: return {
        'name': self.__name,
    }
