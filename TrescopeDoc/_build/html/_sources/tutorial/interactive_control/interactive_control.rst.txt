interactive makers
===================================

masker visualization
~~~~~~~~~~~~~~~~~~~~~~~~~~

trescope plot what you put into the grid, meanwhile, there is a masker corresponding to the  object, one can use this command:

.. code-block:: python

    Trescope().selectOutput(0).plotAxisHelper3D().withConfig(AxisHelper3DConfig().width(5).axisLength(.5))
    Trescope().selectOutput(0).plotScatter3D(
        [0, 1, 1, 0],
        [0, 0, 1, 1],
        [0, 0, 0, 0]
    ).withConfig(Scatter3DConfig().color(0xffff0000).mode([ScatterMode.MARKERS]))

.. image:: ../../../readme/tutorial_doc/plot_inter1.png

above command plot one axis as well as 3d point, if one click **trace 0** button, the color turns to gray, and those axis disappears
also, one may click **trace 1** button, those points disappears.

attributes visualization 
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: python

    Trescope().selectOutput(1).plotScatter3D(
            [0, 1, 1, 0],
            [0, 0, 1, 1],
            [0, 0, 0, 0]
        ).withConfig(Scatter3DConfig().color(0xff00ff00).name(f'attribute visualization'))

.. image:: ../../../readme/tutorial_doc/plot_inter2.png

one may notice that if the mouse is put on the point, its coordinate appears, meanwhile, **attribute visualization** appears in the downside.

 
