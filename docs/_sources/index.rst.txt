======================================
Overview
======================================

**Trescope** is a comprehensive 3D machine learning development tool devoted to improve developing experience and speed in 3D field, which helps researchers and developers to label, debug, visualize various 3D data .

Labeling
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Support labeling multiple attributes of 3D data, such as enumeration attributes, pose(coming soon), point cloud segmentation(coming soon) and so on .

.. image:: ../readme/trescope-label-case.png

Debug
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Support breakpoint and 3D data visualization when one debug program .

.. image:: ../readme/trescope-step-debug.gif

Visualization
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Support visualization of various 3D data types, such as mesh, voxel, point cloud and so on, it is worth mentioning that we also support `3D-FRONT dataset <https://tianchi.aliyun.com/specials/promotion/alibaba-3d-scene-dataset>`_  visualization(which is a fantastic scene dataset from Alibaba) .

.. image:: ../readme/trescope-plot-front3d.gif

Heterogeneous language support architecture
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Support multiple development languages, and it is easy to support a new language under trescope architecture .

Online/Offline visualization
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Support two ways to visualize 3D data:

 - Online mode(display output): visualize 3D data in browser with interaction(zoom, rotate...)
 - Offline mode(file output): visualize 3D data to file, in this way, one can check plenty of 3D data quickly .

======================================
Tutorial
======================================
.. toctree::
    :maxdepth: 1
    :caption: Tutorial

    tutorial/installation/index
    tutorial/visualization/index
    tutorial/labeling/index
    tutorial/interactive_control/index
    
======================================
API Reference(Python)
======================================
.. toctree::
    :maxdepth: 1
    :caption: API Reference(Python)

    module/trescope
    module/trescope.config
    module/trescope.controller
    module/trescope.toolbox

Index
~~~~~~~~~~~~~~~
:ref:`genindex`