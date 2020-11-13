import random
import string

import numpy as np

from trescope.core import ELog


def singleton(cls, *args, **kw):
    instances = {}

    def _singleton():
        if cls not in instances:
            instances[cls] = cls(*args, **kw)
        return instances[cls]

    return _singleton


def generateRandomString(length: int):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))


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
