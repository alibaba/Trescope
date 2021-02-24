from trescope import Trescope
from trescope.config import Mesh3DConfig, Scatter3DConfig, ScatterMode
from trescope.controller import VisualDataPickControl
from trescope.toolbox import simpleDisplayOutputs


def add_visual_data_pick_control():
    Trescope().initialize(True, simpleDisplayOutputs(1, 2))

    for z, color, name in [(0, 0xffff0000, 'red_mesh'), (1, 0xff00ff00, 'green_mesh'), (2, 0xff0000ff, 'blue_mesh')]:
        Trescope().selectOutput(0).plotMesh3D(
            [0, 1, 1, 0],
            [0, 0, 1, 1],
            [z, z, z, z]
        ).withConfig(Mesh3DConfig().indices(
            [0, 3],
            [1, 1],
            [3, 2]).color(color).name(name))

    for z, color, name in [(0, 0xffff0000, 'red_points'), (1, 0xff00ff00, 'green_points'), (2, 0xff0000ff, 'blue_points')]:
        Trescope().selectOutput(0).plotScatter3D(
            [0, 2, 2, 0],
            [0, 0, 2, 2],
            [z, z, z, z]
        ).withConfig(Scatter3DConfig().color(color).mode([ScatterMode.MARKERS]).name(name))

    for z, color, name in [(0, 0xffff0000, 'red_lines'), (1, 0xff00ff00, 'green_lines'), (2, 0xff0000ff, 'blue_lines')]:
        Trescope().selectOutput(0).plotScatter3D(
            [0, 3, 3, 0],
            [0, 0, 3, 3],
            [z, z, z, z]
        ).withConfig(Scatter3DConfig().color(color).mode([ScatterMode.LINES]).name(name).width(5))

    (Trescope().selectOutput(1).asInput()
     .addControl(VisualDataPickControl().id('selected_visual_data').label('SelectedVisualData').attachOutput(0).colorWhenPicked(0xaaffffff)))
    label_data = Trescope().breakPoint(f'Choose data in output 0')
    print('visual data picked', label_data)


if __name__ == '__main__':
    add_visual_data_pick_control()
