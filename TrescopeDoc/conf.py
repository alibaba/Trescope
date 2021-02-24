# Configuration file for the Sphinx documentation builder.
#
# This file only contains a selection of the most common options. For a full
# list see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Path setup --------------------------------------------------------------
import sphinx_material

# If extensions (or modules to document with autodoc) are in another directory,
# add these directories to sys.path here. If the directory is relative to the
# documentation root, use os.path.abspath to make it absolute, like shown here.
#
# import os
# import sys
# sys.path.insert(0, os.path.abspath('.'))
import os
import sys
sys.path.insert(0, os.path.abspath('../Trescope4Python/library/src'))


# -- Project information -----------------------------------------------------

project = 'Trescope'
html_title = "Trescope"
copyright = '2021, YunzhongTianjing, jeannotes'
author = 'YunzhongTianjing, jeannotes'

# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.napoleon',
    "sphinx.ext.doctest",
    "sphinx.ext.extlinks",
    "sphinx.ext.intersphinx",
    "sphinx.ext.todo",
    "sphinx.ext.mathjax",
    "sphinx.ext.viewcode",
    "sphinx_copybutton",

    "numpydoc",
    "nbsphinx",
    "recommonmark",
    "sphinx_markdown_tables",
]

autosummary_generate = True
autoclass_content = "class"

numpydoc_show_class_members = False

html_show_sourcelink = False
html_sidebars = {
    "**": ["logo-text.html", "globaltoc.html", "localtoc.html", "searchbox.html"]
}


# Add any paths that contain templates here, relative to this directory.
templates_path = ['_templates']

exclude_patterns = ["_build", "Thumbs.db", ".DS_Store"]

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']

autodoc_mock_imports = ['numpy', 'torch']

# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
#
# html_theme = 'alabaster'
extensions.append("sphinx_material")
html_theme_path = sphinx_material.html_theme_path()
html_context = sphinx_material.get_html_context()
html_theme = "sphinx_material"

html_theme_options = {
    # "repo_url": "https://github.com/alibaba/Trescope",
    "repo_name": "Trescope",
    "html_minify": False,
    "html_prettify": True,
    "css_minify": True,
    "repo_type": "github",
    "globaltoc_depth": 2,
    "color_primary": "#4253af",
    "color_accent": "cyan",
    "logo_icon": ' ',
    "touch_icon": "_static/favicon.png",
    "theme_color": "#2196f3",
    "master_doc": False,
    "heroes": {
        "index": "Make 3D algorithm developing easier !",
    },
    "version_dropdown": False,
    "table_classes": ["plain"],
}

html_favicon = "_static/favicon.ico"
html_use_index = True
html_domain_indices = True

nbsphinx_execute = "always"
nbsphinx_kernel_name = "python3"

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path = ['_static']