import json
import socket
from typing import Dict, Union, Tuple

from trescope.core import ELog
from trescope.core.Output import Output
from trescope.core.OutputManager import FileOutputManager, DisplayOutputManager
from trescope.core.Utils import singleton


class BadTokenException(Exception):
    pass


@singleton
class Trescope(object):
    def __init__(self) -> None:
        super().__init__()
        self.__open = False
        self.__outputs: Dict[str, Output] = {}
        self.__inputs = None

        self.__initialized: bool = False

        self.__hostIP, self.__port = '127.0.0.1', 9001
        self.__socket = None

        self.__identifier = 'main'

        register = {'token': -1}

        def stepToken():
            register['token'] = register['token'] + 1
            return register['token']

        self.__currentToken = stepToken

    def internalCommit(self, **keyValuePairs) -> Dict:
        socketHandle = self.__connectIfNot()
        data = list(
            map(lambda keyValue: str(keyValue[0]) + self.splitChars() + str(keyValue[1]), keyValuePairs.items()))
        currentToken = self.__currentToken()
        data.append(f'token{self.splitChars()}{currentToken}')
        data.append('EOF\n')
        socketHandle.sendall('\n'.join(data).encode('utf-8'))
        # ELog.info('token[{token}]Send', token=currentToken)
        back = socketHandle.recv(1024 * 256).decode()
        returnRemote = json.loads(back)
        # ELog.info('token[{token}]Back', token=returnRemote['token'])
        return returnRemote

    def __tryConnect(self, start=9000, end=9050) -> Tuple[Union[socket.socket, None], int]:
        for port in range(start, end + 1):
            try:
                socket_ = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                socket_.connect((self.__hostIP, port))

                data = [f'function{self.splitChars()}heteroHandshake', f'identifier{self.splitChars()}{self.__identifier}']
                currentToken = self.__currentToken()
                data.append(f'token{self.splitChars()}{currentToken}')
                data.append('EOF\n')
                socket_.sendall('\n'.join(data).encode('utf-8'))

                back = socket_.recv(1024).decode()
                returnRemote = json.loads(back)
                backToken, backSuccess = returnRemote['token'], returnRemote['success']
                if not backSuccess or backToken != currentToken: raise Exception('Token unmatched')
                return socket_, port
            except Exception as e:
                continue
        raise Exception(f'No available backend for task {self.__identifier}')

    def __connectIfNot(self) -> socket:
        if self.__socket is not None: return self.__socket
        self.__socket, self.__port = self.__tryConnect()
        return self.__socket

    @staticmethod
    def __getOutputType(outputManager: Union[FileOutputManager, DisplayOutputManager]):
        if isinstance(outputManager, FileOutputManager): return 'file'
        if isinstance(outputManager, DisplayOutputManager): return 'display'
        raise Exception(f'Output must be file or display')

    def initialize(self, open_, outputManager: Union[FileOutputManager, DisplayOutputManager], identifier: str = 'main') -> None:
        if self.__initialized: raise Exception("Shouldn't initialize twice!")
        self.__initialized = True
        from trescope import Layout
        outputType = self.__getOutputType(outputManager)

        self.__identifier: str = identifier
        result = self.internalCommit(function='connectOutput',
                                     outputType=outputType, **outputManager.toDict())
        while not result['success']:
            ELog.error('Trescope initialize with DisplayOutput, waiting for display(browser) connection...')
            self.internalCommit(function='waitForDisplay')
            result = self.internalCommit(function='connectOutput',
                                         outputType=outputType, **outputManager.toDict())

        self.internalCommit(function='resetPlot')

        self.__open = open_
        for outputDesc in outputManager:
            self.__outputs[outputDesc.getId()] = Output(outputDesc.getId(), self)
            self.internalCommit(
                function='initializeOutput',
                **outputDesc.toDict())
            self.__outputs[outputDesc.getId()].updateLayout(Layout())

    def close(self):
        self.internalCommit(function='close')

    def selectOutput(self, index: Union[str, int]) -> Output:
        return self.__outputs[str(index)]

    def breakPoint(self, identifier: str) -> Dict:
        dumpData = self.internalCommit(function='breakPoint', identifier=identifier)
        return dumpData['inputDatas'] if 'inputDatas' in dumpData else {}

    def isOpen(self) -> bool:
        return self.__open

    @staticmethod
    def splitChars() -> str:
        return "¥爨¥"
