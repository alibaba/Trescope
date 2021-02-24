import os
import random
import string
from pathlib import Path
from typing import Union
from functools import wraps

import numpy as np

from trescope.core import ELog


class Singleton(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


def singleton(cls, *args, **kw):
    instances = {}

    @wraps(cls)
    def _singleton():
        if cls not in instances: instances[cls] = cls(*args, **kw)
        return instances[cls]

    return _singleton


def generateRandomString(length: int):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))


def get_abs_path(path_link_maybe: Union[str, Path]) -> str:
    if isinstance(path_link_maybe, str): return path_link_maybe if 'http' == path_link_maybe[:4] else os.path.abspath(path_link_maybe)
    if isinstance(path_link_maybe, Path): return os.fspath(path_link_maybe)
    return str(path_link_maybe)


def toListIfNumpyOrTensorArray(array):
    try:
        import torch
        if isinstance(array, torch.Tensor): array = array.numpy()
    except:
        ELog.error('import torch failed')

    if isinstance(array, np.ndarray):
        return array.tolist()

    if isinstance(array, list) and len(array) > 0 and isinstance(array[0], np.ndarray):
        return [toListIfNumpyOrTensorArray(elementArray) for elementArray in array]
    return array
