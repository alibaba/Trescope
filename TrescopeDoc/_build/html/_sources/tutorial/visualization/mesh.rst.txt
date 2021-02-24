mesh plot
==============

visualise mesh
~~~~~~~~~~~~~~~~~~~~~~

to plot the next example mesh:

.. code-block:: python

    vertices:
        [0, 1, 1, 0],
        [0, 0, 1, 1],
        [0, 0, 0, 0]
    face indices:
        [0, 3],
        [1, 1],
        [3, 2]

use the following command to plot them

.. code-block:: python

    Trescope().selectOutput(0).plotMesh3D(
        [0, 1, 1, 0],
        [0, 0, 1, 1],
        [0, 0, 0, 0]
    ).withConfig(Mesh3DConfig().indices([0, 3],
                                        [1, 1],
                                        [3, 2]).color(0xffff00ff))


.. image:: ../../../readme/tutorial_doc/plot_mesh1.png

like **plotScatter3D**, **plotMesh3D** read points using same format, remember to split x,y,z into different lists like this.
in **Mesh3DConfig**, one can set indices, color , above example show two faces, [0,1,3] is first triangle, and [3,1,2] is the second triangle

different mesh face colors
~~~~~~~~~~~~~~~~~~~~~~~~~~~

to plot mesh with different colors, one can use the following command

.. code-block:: python

    Trescope().selectOutput(1).plotMesh3D(
        [0, 1, 1, 0],
        [0, 0, 1, 1],
        [0, 0, 0, 0]
    ).withConfig(Mesh3DConfig().indices(
        [0, 3],
        [1, 1],
        [3, 2]).faceColor([0xffff0000, 0xff0000ff]))

.. image:: ../../../readme/tutorial_doc/plot_mesh2.png

visualise mesh with texture
~~~~~~~~~~~~~~~~~~~~~~~~~~~

to plot mesh with texture, one can use the following command:

.. code-block:: python

    Trescope().selectOutput(2).plotMesh3D(
        [0, 1, 1, 0],
        [0, 0, 1, 1],
        [0, 0, 0, 0]
    ).withConfig(Mesh3DConfig().indices(
        [0, 3],
        [1, 1],
        [3, 2])
        .texture('http://personal.psu.edu/xqz5228/jpg.jpg')
        .textureCoordinate(
        [0, 1, 1, 0],
        [0, 0, 1, 1], ))

.. image:: ../../../readme/tutorial_doc/plot_mesh3.png

visualise mesh with wireframe
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

to plot mesh with a skeletal three-dimensional model in which only lines and vertices are 
represented, one can use the following command:

.. code-block:: python

    Trescope().selectOutput(1).plotWireframe3D(
        [0, 1, 1, 0],
        [0, 0, 1, 1],
        [0, 0, 0, 0]
    ).withConfig(Wireframe3DConfig().indices(
        [0, 3],
        [1, 1],
        [3, 2]).color(0xff00ff00).width(5))

.. image:: ../../../readme/tutorial_doc/plot_mesh4.png


 
 