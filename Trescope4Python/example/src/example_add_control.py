import os
from typing import List

from trescope import Trescope
from trescope.config import ImageConfig
from trescope.controller import EnumControl
from trescope.toolbox import simpleDisplayOutputs
import pandas as pd


def clearTrescope():
    for i in range(4): Trescope().selectOutput(i).clear()


def add_control():
    path = '../data/res/model_images'
    model_images: List[str] = os.listdir(path)

    Trescope().initialize(True, simpleDisplayOutputs(1, 4))

    df = pd.DataFrame({'file': [], 'shape': [], 'thickness': []})
    batch_size = 2
    for batch_index in range(len(model_images) // batch_size):
        clearTrescope()
        for sample_index in range(batch_size):
            model_image_path = model_images[batch_index * batch_size + sample_index]
            Trescope().selectOutput(sample_index * 2).plotImage(os.path.join(path, model_image_path)).withConfig(ImageConfig())
            (Trescope().selectOutput(sample_index * 2 + 1).asInput()
             .addControl(EnumControl().id('file').label('File').enumeration(model_image_path).defaultValue(model_image_path))
             .addControl(EnumControl().id('shape').label('Circle or Square').enumeration('circle', 'square').defaultValue('circle'))
             .addControl(EnumControl().id('thickness').label('Size').enumeration('xs', 's', 'm', 'l', 'xl').defaultValue('m')))
        label_data = Trescope().breakPoint(f'batch_index:{batch_index}')
        for row in label_data.values(): df = df.append({'file': row['file'], 'shape': row['shape'], 'thickness': row['thickness']}, ignore_index=True)
    print(df)


if __name__ == '__main__':
    add_control()
