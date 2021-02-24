import json
import os
import signal
import socket
from typing import Dict, Union, Tuple

import numpy as np

from trescope.core import ELog
from trescope.core.Output import Output
from trescope.core.OutputManager import FileOutputManager, DisplayOutputManager
from trescope.core.Utils import Singleton


class BadTokenException(Exception):
    pass


class Trescope(metaclass=Singleton):
    """
    Heterogeneous language client , used to connect backend for **debugging** , **visualization** ( display mode or file mode ) ,
    **fetching inputs from display** , etc .
    Before using it , :doc-emphasize:`please ensure that a backend has been started by typing trescope in terminal with enter` ,
    after starting backend , you should invoke :py:meth:`Trescope.initialize` first in your code before any other Trescope APIs called .
    It is a single instance , so you can use it globally in your code .

    **Usage**:

    1. Open terminal , enter :bash:`trescope` :

    .. code-block:: bash
        :linenos:

        $ trescope

    2. Open browser with the link info shown by terminal ( Available on ) .
    3. Run the code :

    .. code-block:: python
        :linenos:
        :emphasize-lines: 5

        from trescope import Trescope
        from trescope.config import Scatter3DConfig
        from trescope.toolbox import simpleDisplayOutputs

        Trescope().initialize(True, simpleDisplayOutputs(1, 4))
        Trescope().selectOutput(0).plotScatter3D(x= [0, 1, 1, 0], y = [0, 0, 1, 1], z = [0, 0, 0, 0]).withConfig(Scatter3DConfig().color(0xffff0000))

    4. Check your browser , see the result .

    """

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

    @staticmethod
    def __getType(something):
        def some_of(*types):
            for t in types:
                if isinstance(something, t): return True
            return False

        if something is None: return 'null'
        if some_of(str, np.str_): return 'string'
        if some_of(np.bool_, bool): return 'boolean'
        if some_of(int, float, np.byte, np.ubyte, np.short, np.ushort, np.intc, np.uintc, np.int_, np.uint, np.longlong, np.ulonglong, np.half,
                   np.float16, np.single, np.double, np.longdouble, np.csingle, np.cdouble, np.clongdouble, np.int8, np.int16, np.int32, np.int64,
                   np.uint8, np.uint16, np.uint32, np.uint64, np.intp, np.uintp, np.float32, np.float64, np.float_): return 'number'
        if isinstance(something, list): return 'array'

        if some_of(set, frozenset, dict, np.ndarray): raise Exception(f'type: {type(something).__name__s} not supported rpc')
        return 'unknown'

    def _internalCommit(self, **keyValuePairs) -> Dict:
        socketHandle = self.__connectIfNot()
        data = list(
            map(lambda keyValue:
                str(keyValue[0]) + self.splitChars() +
                Trescope.__getType(keyValue[1]) + self.splitChars() +
                str(keyValue[1]),
                keyValuePairs.items()))
        currentToken = self.__currentToken()
        data.append(f'token{self.splitChars()}number{self.splitChars()}{currentToken}')
        data.append('EOF\n')
        socketHandle.sendall('\n'.join(data).encode('utf-8'))
        # ELog.info('token[{token}]Send', token=currentToken)
        back = ''
        while True:
            try:
                received = socketHandle.recv(1024 * 256)
                back += received.decode()
                return json.loads(back)
            except:
                continue
        # ELog.info('token[{token}]Back', token=returnRemote['token'])
        # return returnRemote

    def __tryConnect(self, start=9000, end=9100) -> Tuple[Union[socket.socket, None], int]:
        for port in range(start, end + 1):
            try:
                socket_ = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                socket_.connect((self.__hostIP, port))

                data = [f'function{self.splitChars()}string{self.splitChars()}heteroHandshake',
                        f'identifier{self.splitChars()}string{self.splitChars()}{self.__identifier}',
                        f'pid{self.splitChars()}number{self.splitChars()}{os.getpid()}']
                currentToken = self.__currentToken()
                data.append(f'token{self.splitChars()}number{self.splitChars()}{currentToken}')
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

        def handle_signal(signum, stack):
            # ELog.info('Trescope will be closed ...')
            self.__socket.close()
            os._exit(0)

        signal.signal(signal.SIGTERM, handle_signal)  # for kill
        signal.signal(signal.SIGINT, handle_signal)  # for ctrl + c
        return self.__socket

    @staticmethod
    def __getOutputType(outputManager: Union[FileOutputManager, DisplayOutputManager]):
        if isinstance(outputManager, FileOutputManager): return 'file'
        if isinstance(outputManager, DisplayOutputManager): return 'display'
        raise Exception(f'Output must be file or display')

    def initialize(self, open: bool, outputManager: Union[FileOutputManager, DisplayOutputManager], identifier: str = 'main') -> None:
        """
        Initialize heterogeneous language client : specify **outputs** ( file output for image rendering and display output for interaction ,
        such as debugging algorithm process step by step ... ) and **identifier** for backend connection .

        :param open: now always True
        :param outputManager: The manager to arrange outputs , there are two types for OutputManager : :py:mod:`trescope.DisplayOutputManager` (plots data
            to display , ) and :py:mod:`trescope.FileOutputManager` .
        :param identifier: Default "main" . Any string for identifying backend , only same identifier leads to successful connection of
            heterogeneous language client and backend launched in terminal , you can specify backend identifier by passing args
            like this :bash:`trescope --identifier the-same-identifier` or alias for :bash:`trescope --id the-same-identifier` .

        """
        if self.__initialized: raise Exception("Shouldn't initialize twice!")
        self.__initialized = True
        from trescope import Layout
        outputType = self.__getOutputType(outputManager)

        self.__identifier: str = identifier
        result = self._internalCommit(function='connectOutput',
                                      outputType=outputType, **outputManager.toDict())
        while not result['success']:
            ELog.error('Trescope initialize with DisplayOutput, waiting for display(browser) connection ...')
            self._internalCommit(function='waitForDisplay')
            result = self._internalCommit(function='connectOutput',
                                          outputType=outputType, **outputManager.toDict())

        self._internalCommit(function='resetPlot')

        self.__open = open
        for outputDesc in outputManager:
            self.__outputs[outputDesc.getId()] = Output(outputDesc.getId(), self)
            self._internalCommit(
                function='initializeOutput',
                **outputDesc.toDict())
            self.__outputs[outputDesc.getId()].updateLayout(Layout())

    def close(self):
        self._internalCommit(function='close')

    def selectOutput(self, id: Union[str, int]) -> Output:
        """
        Select an :py:mod:`trescope.Output` to plot data , add control , etc .

        :param id: Output id that added when call :py:meth:`Trescope.initialize`
        :return: The output selected
        """
        return self.__outputs[id]

    def breakPoint(self, identifier: str) -> Dict:
        """
        Pause program execution and return input data from :py:mod:`trescope.Input` when resume .

        :param identifier: Any string identifies which breakpoint
        :return: Input data from **control** of display, see :py:mod:`trescope.control`
        """
        dumpData = self._internalCommit(function='breakPoint', identifier=identifier)
        return dumpData['inputDatas'] if 'inputDatas' in dumpData else {}

    def callBackendAPI(self, func: str, param: str):
        result = self._internalCommit(function=func, param=param)
        result.pop('token')
        return result

    def isOpen(self) -> bool:
        return self.__open

    @staticmethod
    def splitChars() -> str:
        return "¥爨¥"
