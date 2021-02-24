from trescope import Trescope
from trescope.config import ImageConfig
from trescope.controller import VisualDataPickControl, BoundingBox2D, EnumControl
from trescope.toolbox import simpleDisplayOutputs
import os


def main():
    Trescope().initialize(True, simpleDisplayOutputs(1, 2))
    image_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../data/res/texture_test_half.png'))
    Trescope().selectOutput(0).plotImage(image_path).withConfig(ImageConfig())
    Trescope().selectOutput(1).asInput().addControl(
        EnumControl().label('bboxType')
            .id('bboxType')
            .enumeration('A', 'B')
            .defaultValue('A')).addControl(
        VisualDataPickControl()
            .id('bbox')
            .label('bbox')
            .attachOutput(0)
            .defaultValue(BoundingBox2D(0, 0, 256, 128), BoundingBox2D(81, 69, 88, 116)))
    data = Trescope().breakPoint('')
    print('visual data picked:', data)


if __name__ == '__main__':
    main()
