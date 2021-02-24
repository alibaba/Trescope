initialization
==============

Start backend
~~~~~~~~~~~~~~~~~~

before start trescope, remember to start backend in terminal


.. code-block:: bash

    trescope

and then appears

.. code-block:: bash

    Trescope start with 
        task identifier: main , 
        task directory: /home/*/.trescope
    Available on:
        http://*.*.*.*:9000
        http://*.*.*.*:9000

open second link in browser, then let's follow the next tutorials

.. hint::
    If one reinstall trescope, please restart the backend, or may waste tons of time.
    Attention!

Output select
~~~~~~~~~~~~~~~~~~

trescope split window into multiple grids, rowly and columnly, one need to select the grid to plot 3d, 2d, etc.

.. code-block:: python

    Trescope().initialize(True, simpleDisplayOutputs(1, 3))

and one may see the following grids with the column size is 3, and row size is 1

.. image:: ../../../readme/tutorial_doc/window_initialise.png

to plot your object in the second grid, just use 

.. code-block:: python

    Trescope().selectOutput(2).plot****

if one split your window into (4, 3) grids, and want to plot object in second grid, it will appears in grids[0][1] instead of grids[1][0].

Output clear
~~~~~~~~~~~~~~~~~~

if one have batch of data to visualise, the batch size exceeds your grid size, and next time you plot following data, pay attention to clear the window.

.. code-block:: bash

    Trescope().selectOutput(2).clear()
