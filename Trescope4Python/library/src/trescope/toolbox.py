import math
from itertools import cycle, islice
from typing import List, Union, Tuple

import numpy as np

from trescope import DisplayOutputManager, DisplayOutputDesc, FileOutputManager, FileOutputDesc


def __displayOutput(rows: int, columns: int, scale: float, row: int, column: int, output_ids: Union[None, List[str]]) -> DisplayOutputDesc:
    id_ = int(row * columns + column)
    id_ = id_ if output_ids is None else output_ids[id_]
    startRow: int = round(row / rows / (scale / (rows / columns)))
    startColumn: int = round(column / columns / scale)
    span: int = math.ceil(1 / (columns * scale))
    return DisplayOutputDesc().id(id_).startAt(startRow, startColumn).withSpan(span, span)


def simpleDisplayOutputs(rows: int, columns: int, output_ids: Union[None, List[str]] = None) -> DisplayOutputManager:
    scale = 1 / columns
    manager = DisplayOutputManager(int(math.ceil(rows / columns / scale)), int(math.ceil(1 / scale)))
    for row in range(rows):
        for column in range(columns): manager.add(__displayOutput(rows, columns, scale, row, column, output_ids))
    return manager


def simpleFileOutputs(directory: str, fileNames: List[Union[str, int]], widthPixel: int = 640, heightPixel: int = 480) -> FileOutputManager:
    manager = FileOutputManager(directory, widthPixel, heightPixel)
    for fileName in fileNames: manager.add(FileOutputDesc().id(fileName))
    return manager


def random_color(alpha: int = 0xff) -> int:
    import numpy as np
    return alpha << 24 | np.random.randint(low=0, high=0xffffff)


__colors = [
               "#000000", "#FFFF00", "#1CE6FF", "#FF34FF", "#FF4A46", "#008941", "#006FA6", "#A30059",
               "#FFDBE5", "#7A4900", "#0000A6", "#63FFAC", "#B79762", "#004D43", "#8FB0FF", "#997D87",
               "#5A0007", "#809693", "#FEFFE6", "#1B4400", "#4FC601", "#3B5DFF", "#4A3B53", "#FF2F80",
               "#61615A", "#BA0900", "#6B7900", "#00C2A0", "#FFAA92", "#FF90C9", "#B903AA", "#D16100",
               "#DDEFFF", "#000035", "#7B4F4B", "#A1C299", "#300018", "#0AA6D8", "#013349", "#00846F",
               "#372101", "#FFB500", "#C2FFED", "#A079BF", "#CC0744", "#C0B9B2", "#C2FF99", "#001E09",
               "#00489C", "#6F0062", "#0CBD66", "#EEC3FF", "#456D75", "#B77B68", "#7A87A1", "#788D66",
               "#885578", "#FAD09F", "#FF8A9A", "#D157A0", "#BEC459", "#456648", "#0086ED", "#886F4C",
               "#34362D", "#B4A8BD", "#00A6AA", "#452C2C", "#636375", "#A3C8C9", "#FF913F", "#938A81",
               "#575329", "#00FECF", "#B05B6F", "#8CD0FF", "#3B9700", "#04F757", "#C8A1A1", "#1E6E00",
               "#7900D7", "#A77500", "#6367A9", "#A05837", "#6B002C", "#772600", "#D790FF", "#9B9700",
               "#549E79", "#FFF69F", "#201625", "#72418F", "#BC23FF", "#99ADC0", "#3A2465", "#922329",
               "#5B4534", "#FDE8DC", "#404E55", "#0089A3", "#CB7E98", "#A4E804", "#324E72", "#6A3A4C",
               "#83AB58", "#001C1E", "#D1F7CE", "#004B28", "#C8D0F6", "#A3A489", "#806C66", "#222800",
               "#BF5650", "#E83000", "#66796D", "#DA007C", "#FF1A59", "#8ADBB4", "#1E0200", "#5B4E51",
               "#C895C5", "#320033", "#FF6832", "#66E1D3", "#CFCDAC", "#D0AC94", "#7ED379", "#012C58"
           ][:32]
__colors = list(map(lambda color: int(f'0xFF{color[1:]}', 16), __colors))


def color_from_label(label: int, max_label: int = 100) -> int:
    return list(islice(cycle(__colors), int(max_label + 1)))[label]


def __extrude_along_y(contour_xz: np.ndarray, y1: float, y2: float) -> Tuple[np.ndarray, np.ndarray]:
    _, num = contour_xz.shape
    contour_xyz_bottom = np.array([
        contour_xz[0],
        [y1] * num,
        contour_xz[1],
    ])
    contour_xyz_top = np.array([
        contour_xz[0],
        [y2] * num,
        contour_xz[1],
    ])
    vertices = np.hstack([contour_xyz_bottom, contour_xyz_top])
    faces = np.array([0, 4, 5, 0, 5, 1, 1, 5, 6, 1, 6, 2, 2, 6, 7, 2, 7, 3, 3, 7, 4, 3, 4, 0,
                      0, 1, 2, 0, 2, 3,
                      4, 5, 6, 4, 6, 7], np.int).reshape((-1, 3)).T
    return vertices, faces


def mesh_from_aabb3d(min_xyz: Union[np.ndarray, List[float],], max_xyz: Union[np.ndarray, List[float]]) -> Tuple[
    np.ndarray, np.ndarray]:
    minx, miny, minz = min_xyz
    maxx, maxy, maxz = max_xyz
    return __extrude_along_y(np.array([
        [minx, minz],
        [maxx, minz],
        [maxx, maxz],
        [minx, maxz]
    ]).T, miny, maxz)
