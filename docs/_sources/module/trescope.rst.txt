trescope
========================================================================

.. role:: py(code)
   :language: py

.. role:: bash(code)
   :language: bash

.. raw:: html

    <style> .doc-emphasize {color: #AA0000} </style>

.. role:: doc-emphasize


.. contents:: Contents
    :local:

Trescope
--------------------

.. autoclass:: trescope.Trescope
    :members:

OutputManager
--------------------

In trescope , you can specify two outputs for visualization data : **display** (:py:mod:`trescope.DisplayOutputManager`) or **file** (:py:mod:`trescope.FileOutputManager`) , **display** for plotting data in display (browser) , **file** for plotting data to image file .

DisplayOutput
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. autoclass:: trescope.DisplayOutputManager
    :members:

.. autoclass:: trescope.DisplayOutputDesc
    :members:

FileOutput
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. autoclass:: trescope.FileOutputManager
    :members:

.. autoclass:: trescope.FileOutputDesc
    :members:

Output and Input
--------------------

In trescope , we use :py:mod:`trescope.Output` for data plotting and :py:mod:`trescope.Input` for user input .

Output
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. autoclass:: trescope.Output
    :members:

Input
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. autoclass:: trescope.Input
    :members:

Content
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. autoclass:: trescope.Content
    :members:

Layout
--------------------
.. autoclass:: trescope.Layout
    :members:
