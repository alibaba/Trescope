from trescope.config import Config


class CompleteInfo(object):
    def __init__(self, content, configOrList: Config) -> None:
        from trescope.core.Content import Content
        self.__host: Content = content
        self.__config: Config = configOrList

    def toDict(self):
        return self.__config.toDict()

    def getHost(self): return self.__host

    def commit(self):
        from trescope.core.Trescope import Trescope
        trescope: Trescope = self.getHost().getHost().getHost()
        trescope._internalCommit(
            **self.toDict(),  # config
            **self.getHost().toDict(),  # content
            **self.getHost().getHost().toDict(),  # output
        )
