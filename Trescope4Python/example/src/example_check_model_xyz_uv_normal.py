import os

from base import load_obj
from trescope import Trescope
from trescope.config import Mesh3DConfig, Lollipop3DConfig, Scatter3DConfig, Wireframe3DConfig
from trescope.toolbox import simpleDisplayOutputs


def example_check_model_xyz_uv_normal():
    Trescope().initialize(True, simpleDisplayOutputs(1, 2))

    obj_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../data/res/model_test/model1.obj'))
    texture_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../data/res/model_test/texture1.png'))
    obj = load_obj(obj_path)

    if obj['uv'] is not None:
        Trescope().selectOutput(0).plotMesh3D(*obj['position']).withConfig(
            Mesh3DConfig().indices(*obj['index']).textureCoordinate(*obj['uv']).texture(texture_path).name('model'))
    else:
        Trescope().selectOutput(0).plotMesh3D(*obj['position']).withConfig(Mesh3DConfig().indices(*obj['index']).color(0xffff0000).name('model'))
    if obj['normal'] is not None:
        Trescope().selectOutput(0).plotLollipop3D(*(obj['normal'] * 10)).withConfig(
            Lollipop3DConfig().locations(*obj['position']).color(0xaaff0000).tailSize(0).headSize(1).name('normal'))
    Trescope().selectOutput(0).plotScatter3D(*obj['position']).withConfig(
        Scatter3DConfig().color(0xff0000ff).name('xyz'))
    Trescope().selectOutput(0).plotWireframe3D(*obj['position']).withConfig(
        Wireframe3DConfig().indices(*obj['index']).name('wireframe').color(0xffffff00).width(2))


if __name__ == '__main__':
    example_check_model_xyz_uv_normal()
