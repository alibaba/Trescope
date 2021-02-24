import os
from typing import List

from trescope import Trescope
from trescope.config import ImageConfig
from trescope.controller import EnumControl, TextControl, Label
from trescope.toolbox import simpleDisplayOutputs
import pandas as pd


def clear_trescope():
    for i in range(4): Trescope().selectOutput(i).clear()


def add_control():
    path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../data/res/model_images'))
    model_images: List[str] = os.listdir(path)

    Trescope().initialize(True, simpleDisplayOutputs(1, 4))

    df = pd.DataFrame({'file': [], 'shape': [], 'thickness': [], 'otherInfo': [], })
    batch_size = 2
    for batch_index in range(len(model_images) // batch_size):
        clear_trescope()
        for sample_index in range(batch_size):
            model_image_path = model_images[batch_index * batch_size + sample_index]
            full_image_path = os.path.join(path, model_image_path)
            Trescope().selectOutput(sample_index * 2).plotImage(full_image_path).withConfig(ImageConfig())
            (Trescope().selectOutput(sample_index * 2 + 1).asInput()
             .addControl(Label().id('file').label(model_image_path).value(full_image_path))
             .addControl(EnumControl().id('0').label('0').enumeration(0, 1).defaultValue(0))
             .addControl(EnumControl().id('shape').label('Circle or Square').enumeration('circle', 'square').style('vertical'))
             .addControl(EnumControl().id('thickness').label('Size').enumeration('xs', 's', 'm', 'l', 'xl').defaultValue('m'))
             .addControl(TextControl().id('otherInfo').label('OtherInfo').defaultValue('something'))
             )
        label_data = Trescope().breakPoint(f'batch_index:{batch_index}')
        for row in label_data.values(): df = df.append({
            'file': row['file'],
            'shape': row['shape'],
            'thickness': row['thickness'],
            'otherInfo': row['otherInfo'],
        }, ignore_index=True)
    print(df)


if __name__ == '__main__':
    add_control()
