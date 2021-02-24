import logging
import os
import os.path as path
import sys
from distutils import dir_util
from subprocess import check_call

from setuptools import setup, Command
from setuptools.command.install import install
from wheel.bdist_wheel import bdist_wheel as bdist_wheel_orig

_module_path = path.dirname(__file__)

sys.path.insert(0, path.join(_module_path, 'src'))
logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)

server_dst_pkg = 'src/trescope/serverPackage'

version = [index for index, arg in enumerate(sys.argv) if len(arg.split('=')) > 1][0]
version = sys.argv.pop(version).split("=")
version = version[1] if version[0] == 'version' else None
if version is None: raise Exception('No version specified!')


def get_platform():
    import distutils.util
    name = distutils.util.get_platform().replace('.', '_').replace('-', '_')
    if 'macosx' in name: return 'macosx_10_10_x86_64'  # https://www.electronjs.org/docs/tutorial/support
    if name == 'linux_x86_64' and sys.maxsize == 2147483647: return 'linux_i686'
    return name


class bdist_wheel(bdist_wheel_orig):

    def finalize_options(self):
        self.plat_name = get_platform()
        super().finalize_options()

    def run(self):
        if 'linux' == sys.platform.lower():
            server_src_pkg = '../../TrescopeServer/backend/trescope-linux-x64'
        elif 'darwin' == sys.platform.lower():
            server_src_pkg = '../../TrescopeServer/backend/trescope-darwin-x64'
        else:
            raise Exception(f'Unsupported platform {sys.platform.lower()}')

        if os.path.exists(server_dst_pkg): dir_util.remove_tree(server_dst_pkg, dry_run=self.dry_run)
        dir_util.copy_tree(server_src_pkg, server_dst_pkg, dry_run=self.dry_run)
        super().run()
        dir_util.remove_tree(server_dst_pkg, dry_run=self.dry_run)


class BuildDocCommand(Command):
    description = 'Build FF3D-Trescope Documentation'
    user_options = []

    def __init__(self, dist, **kw):
        super().__init__(dist, **kw)

    def initialize_options(self): pass

    def finalize_options(self): pass

    def run(self):
        print('BuildDoc start ...')

        documentation_path = path.join(_module_path, 'doc')
        os.system(f'make -C {documentation_path} clean html')

        print('\t cp documentation ...')
        doc_from_path = path.join(_module_path, f'doc/_build/html')
        doc_to_path = path.join('../../', 'doc/py')
        if not os.path.exists(doc_to_path): os.makedirs(doc_to_path)

        os.system(f'cp -r {doc_from_path} {doc_to_path}')

        print(
            f'FF3D-Trescope[{version}] documentation build end. Now git commit and sync pages[ https://pages.alibaba-inc.com/p/1334678 ] manually')


def is_tool(name):
    from shutil import which
    return which(name) is not None


class TrescopeInstallCommand(install):
    def run(self):
        if 'linux' == sys.platform.lower() and not is_tool('xvfb-run'):
            print('trescope install xvfb')
            check_call('sudo apt-get install xvfb'.split())
        install.run(self)


setup(
    name='trescope',
    version=version,
    description='Developing tool for algorithm about 3D',
    author='yunhun',
    author_email='yunhun.fyy@alibaba-inc.com',
    zip_safe=False,
    install_requires=['numpy'],

    packages=['trescope', 'trescope.core', 'trescope.blender', 'trescope.controller', 'trescope.config'],
    package_dir={
        'trescope': 'src/trescope',
        'trescope.core': 'src/trescope/core',
        'trescope.blender': 'src/trescope/blender',
        'trescope.controller': 'src/trescope/controller',
        'trescope.config': 'src/trescope/config'
    },
    scripts=['scripts/trescope'],
    include_package_data=True,
    package_data={'trescope': [f'{server_dst_pkg}/*']},
    cmdclass={
        'bdist_wheel': bdist_wheel,
        'install': TrescopeInstallCommand,
        'buildDoc': BuildDocCommand,
    },
)
