import logging

__logOpen = True

__logger = logging.getLogger('Trescope')


def info(message, **kwargs):
    if __logOpen: __logger.info(message.format(**kwargs))


def error(message, **kwargs):
    print(message)
    if __logOpen: __logger.error(message.format(**kwargs))
