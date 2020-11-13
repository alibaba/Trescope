class Config:
    def __init__(self):
        self.__name: str = '_'

    def name(self, name: str):
        self.__name = name
        return self

    def toDict(self) -> dict: return {
        'name': self.__name,
    }
