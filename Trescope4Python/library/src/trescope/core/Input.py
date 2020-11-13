from trescope.controller import ControllerNode


class Input(object):
    def __init__(self, host):
        from trescope.core import Output
        self.__host: Output = host

    def addControl(self, controlNode: ControllerNode):
        self.__host.getHost().internalCommit(function='addControl', **self.__host.toDict(), **controlNode.toDict())
        return self

    def waitForControllerWithId(self, controlId, identifier: str = ''):
        rawResult = self.__host.internalCommit(function='waitForControllerWithId',
                                               controlId=controlId, identifier=identifier)

        controlResult = rawResult['result']
        if 'TriggerControl' == controlResult['type']: return controlId
        return Input.__toValueByType(controlResult['type'], controlResult['newValue'])

    @staticmethod
    def __toValueByType(type_, valueString):
        swithcer = {
            'BooleanControl': bool,
            'ColorControl': lambda string: int(f'0xff{string[1:]}', 16),  # TODO bug alpha
            'EnumControl': str,
            'RangeControl': float,
            'TextControl': str
        }
        return swithcer[type_](valueString)
