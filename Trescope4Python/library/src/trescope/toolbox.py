import math
from itertools import cycle, islice
from typing import List, Union, Tuple, Dict, Callable

import numpy as np

from trescope import DisplayOutputManager, DisplayOutputDesc, FileOutputManager, FileOutputDesc, Trescope
from trescope.config import (Mesh3DConfig, Wireframe3DConfig)


def __displayOutput(rows: int, columns: int, scale: float, row: int, column: int, output_ids: Union[None, List[str]]) -> DisplayOutputDesc:
    id_ = int(row * columns + column)
    id_ = id_ if output_ids is None else output_ids[id_]
    startRow: int = round(row / rows / (scale / (rows / columns)))
    startColumn: int = round(column / columns / scale)
    span: int = math.ceil(1 / (columns * scale))
    return DisplayOutputDesc().id(id_).startAt(startRow, startColumn).withSpan(span, span)


def simpleDisplayOutputs(rows: int, columns: int, output_ids: Union[None, List[str]] = None) -> DisplayOutputManager:
    """
    Convenient method to specify uniform , square display output .

    :param rows: row number
    :param columns: column number
    :param output_ids: ID of output , default `None`
    :return: :py:mod:`trescope.DisplayOutputManager`
    """
    scale = 1 / columns
    manager = DisplayOutputManager(int(math.ceil(rows / columns / scale)), int(math.ceil(1 / scale)))
    for row in range(rows):
        for column in range(columns): manager.add(__displayOutput(rows, columns, scale, row, column, output_ids))
    return manager


def simpleFileOutputs(directory: str, fileNames: List[Union[str, int]], widthPixel: int = 640, heightPixel: int = 480) -> FileOutputManager:
    """
    Convenient method to specify file output.

    :param directory: directory to generate files
    :param fileNames: names of file
    :param widthPixel: width of image file in pixel
    :param heightPixel: height of image file in pixel
    :return: :py:mod:`trescope.FileOutputManager`
    """
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
    """
    Generate color by integer .

    :param label: int label
    :param max_label: max label number
    :return: color
    """
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


def visualize_front3d_mesh(output_id: Union[str, int], scene: Dict,
                           focus_meshes_fetcher: Union[Callable, None] = None, ignore_meshes_fetcher: Union[Callable, None] = None,
                           material_when_unavailable: Union[Callable, int] = 0xff000000):
    """
     visualize_front3d_mesh(0, scene_dict,
                                   focus_meshes_fetcher=lambda mesh_table: mesh_table[mesh_table['type'].isin(['Floor'])],
                                   ignore_meshes_fetcher=lambda mesh_table: mesh_table[mesh_table['type'].isin(['WallOuter', 'WallInner'])])

    :param output_id: output id
    :param scene: scene
    :param focus_meshes_fetcher: focus_meshes_fetcher
    :param ignore_meshes_fetcher: ignore_meshes_fetcher
    :param material_when_unavailable: material_when_unavailable
    """

    import pandas as pd

    def __create_mesh_table():
        _ = {'uid': [], 'type': [], 'material': [], 'xyz': [], 'uv': [], 'normal': [], 'face': []}
        for _mesh in scene['mesh']:
            _['uid'].append(_mesh['uid'])
            _['type'].append(_mesh['type'])
            _['material'].append(_mesh['material'])
            _['xyz'].append(np.array(_mesh['xyz']).reshape((-1, 3)).T)
            _['uv'].append(np.array(_mesh['uv']).reshape((-1, 2)).T)
            _['normal'].append(np.array(_mesh['normal']).reshape((-1, 3)).T)
            _['face'].append(np.array(_mesh['faces'], np.int).reshape((-1, 3)).T)
        return pd.DataFrame(_)

    def __create_material_table():
        def compatible_texture(_texture):
            # return {'type': 'url', 'value': _texture} if isinstance(_texture, str) else _texture
            return _texture['value'] if isinstance(_texture, dict) else _texture

        def compatible_color(rgba_or_rgb_array):
            r, g, b, a = rgba_or_rgb_array if 4 == len(rgba_or_rgb_array) else [*rgba_or_rgb_array, 255]
            return a << 24 | r << 16 | g << 8 | b

        def compatible_color_mode(_material):
            return _material['colorMode'] if 'colorMode' in _material else ('color' if _material['useColor'] else 'texture')

        def compatible_uv_transform(_material):
            return np.array(_material['UVTransform']).reshape(3, 3) if 'UVTransform' in _material else np.eye(3)

        _ = {'uid': [], 'texture': [], 'color': [], 'colorMode': [], 'UVTransform': [], }
        for _material in scene['material']:
            _['uid'].append(_material['uid'])
            try:
                _['texture'].append(compatible_texture(_material['texture']))
                _['color'].append(compatible_color(_material['color']))
                _['colorMode'].append(compatible_color_mode(_material))
                _['UVTransform'].append(compatible_uv_transform(_material))
            except:
                if isinstance(material_when_unavailable, int):
                    _['texture'].append('')
                    _['UVTransform'].append(np.eye(3))
                    _['color'].append(material_when_unavailable)
                    _['colorMode'].append('color')
                else:
                    _m = material_when_unavailable(_material)
                    _['texture'].append(compatible_texture(_m['texture']))
                    _['UVTransform'].append(compatible_uv_transform(_m))
                    _['color'].append(compatible_color(_m['color']))
                    _['colorMode'].append(compatible_color_mode(_m))
        return pd.DataFrame(_)

    def __reduce_meshes(_meshes: pd.DataFrame):
        t = _meshes.loc[:, ('uid', 'type', 'material', 'xyz', 'uv', 'normal', 'face', 'texture', 'color', 'colorMode', 'UVTransform')].values
        _uid_all, _type_all, _, _xyz_all, _uv_all, _normal_all, _face_all, _, _, _, _UVTransform = t[0]
        _uid_all, _type_all = [_uid_all], [_type_all]
        _uv_all = __transform_uv(_uv_all, _UVTransform)
        for _uid, _type, _, _xyz, _uv, _normal, _face, _, _, _, _UVTransform in t[1:]:
            _face_all = np.hstack([_face_all, _face + _xyz_all.shape[1]])
            _xyz_all = np.hstack([_xyz_all, _xyz])
            _uv_all = np.hstack([_uv_all, __transform_uv(_uv, _UVTransform)])
            _normal_all = np.hstack([_normal_all, _normal])
            _uid_all += [_uid]
            _type_all += [_type]
        return _xyz_all, _uv_all, _normal_all, _face_all, set(_uid_all), set(_type_all)

    def __transform_uv(_uv, matrix):
        new_uv = np.matmul(matrix.T, np.vstack([_uv, [1] * _uv.shape[1]]))
        return new_uv[(0, 1), :] / new_uv[2, :]

    def __aggregate_mesh_by_material_texture(_meshes: pd.DataFrame):
        enum_material_texture = set(_meshes[_meshes['colorMode'] == 'texture'].loc[:, 'texture'].values)
        return [(_texture, __reduce_meshes(_meshes[_meshes['texture'] == _texture])) for _texture in enum_material_texture]

    def __aggregate_mesh_by_material_color(_meshes: pd.DataFrame):
        enum_material_color = set(_meshes[_meshes['colorMode'] == 'color'].loc[:, 'color'].values.tolist())
        return [(_color, __reduce_meshes(_meshes[_meshes['color'] == _color])) for _color in enum_material_color]

    def plot_mesh(_xyz, _uv, _texture, _color, _face, _color_mode, _name):
        config = Mesh3DConfig().indices(*_face).name(_name).flatShading(True)
        config = config.color(_color) if _color_mode == 'color' else config.texture(_texture, wrap=('REPEAT', 'REPEAT')).textureCoordinate(*_uv)
        Trescope().selectOutput(output_id).plotMesh3D(*_xyz).withConfig(config)

    mesh_table = __create_mesh_table()
    material_table = __create_material_table()
    mesh_material = mesh_table.join(material_table.set_index('uid'), on='material')

    focus_meshes: pd.DataFrame = mesh_material[mesh_table['uid'].isin([])] if focus_meshes_fetcher is None else focus_meshes_fetcher(mesh_material)
    ignore_meshes: pd.DataFrame = mesh_material[mesh_table['uid'].isin([])] if ignore_meshes_fetcher is None else ignore_meshes_fetcher(mesh_material)
    vanilla_meshes = mesh_material[
        ~(mesh_material['uid'].isin(focus_meshes.loc[:, 'uid'].values) | mesh_material['uid'].isin(ignore_meshes.loc[:, 'uid'].values))]

    xyz_all, uv_all, normal_all, face_all, _, _ = __reduce_meshes(mesh_material)
    Trescope().selectOutput(output_id).plotWireframe3D(*xyz_all).withConfig(Wireframe3DConfig().indices(*face_all).color(0xffff0000).name('wireframe'))

    # focus_meshes
    for uid, _type, material, xyz, uv, normal, face, texture, color, colorMode, UVTransform in \
            focus_meshes.loc[:, ('uid', 'type', 'material', 'xyz', 'uv', 'normal', 'face', 'texture', 'color', 'colorMode', 'UVTransform')].values:
        plot_mesh(xyz, __transform_uv(uv, UVTransform), texture, color, face, colorMode, f'focus: {uid} | {_type} | {material}')

    # vanilla_meshes: same color
    for color, (xyz, uv, normal, face, uid_list, type_list) in __aggregate_mesh_by_material_color(vanilla_meshes):
        plot_mesh(xyz, uv, None, color, face, 'color', f'vanilla: same_color({hex(color)})<br>uids: {uid_list}<br>types: {type_list}')

    # vanilla_meshes: same texture
    for texture, (xyz, uv, normal, face, uid_list, type_list) in __aggregate_mesh_by_material_texture(vanilla_meshes):
        plot_mesh(xyz, uv, texture, None, face, 'texture', f'vanilla same_texture({texture})<br>uids: {uid_list}<br>types: {type_list}')
