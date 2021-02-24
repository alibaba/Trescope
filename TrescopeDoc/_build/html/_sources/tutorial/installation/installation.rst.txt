Installation
==============

Installing from http link directly
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Now only support Mac and Linux, one can run the following command:

.. code-block:: bash

    $ pip install https://ossgw.alicdn.com/homeai-inner/homeai_alg/trescope/trescope-0.0.1-py3-none-macosx_10_10_x86_64.whl  # For mac
    $ pip install https://ossgw.alicdn.com/homeai-inner/homeai_alg/trescope/trescope-0.0.1-py3-none-linux_x86_64.whl # For linux


Build from source
~~~~~~~~~~~~~~~~~~

When first build, one need to use `npm install` to install dependencies:

.. code-block:: bash

    cd TrescopeServer/third/gl-mesh3d
    npm install

    cd TrescopeServer/third/plotly.js
    npm install

    cd TrescopeServer/universal/scene-json-renderer
    npm install

    cd TrescopeServer/frontend
    npm install

    cd TrescopeServer/backend
    npm install

Once the step above finishes, just package

.. code-block:: bash

    ./package


after build, the python archive will under directory Trescope4Python/library/dist, and one can using

.. code-block:: bash

    pip install trescope-x.x.x.whl

Try it!
~~~~~~~~~~~~~~~~~~

To verify installation, fire up terminal and try to execute the following command:

.. code-block:: bash

    $ trescope --version

one should then be able to see the version of the library installed.
