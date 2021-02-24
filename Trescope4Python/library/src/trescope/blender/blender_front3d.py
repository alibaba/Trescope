import json
import math
import os
import sys
from typing import Dict, Union, Callable, Tuple, Optional

import bpy
import mathutils
import numpy as np

sys.path.append(os.path.dirname(__file__))


def setSceneOutput(output_file_path, width, height):
    scene = bpy.context.scene
    scene.render.resolution_percentage = 100
    scene.render.resolution_x = width
    scene.render.resolution_y = height
    scene.render.filepath = output_file_path


def setCycles(num_samples=128):
    scene = bpy.context.scene
    scene.render.image_settings.file_format = 'PNG'
    scene.render.engine = 'CYCLES'
    scene.cycles.samples = num_samples
    scene.view_layers[0].cycles.use_denoising = True


def normalizeScene():
    for obj in bpy.data.objects:
        if obj.name not in ['Camera']: obj.select_set(state=True)
    bpy.ops.object.delete()


def __create_instance_table(sceneDict: Dict):
    _ = {'id': [], 'position': [], 'rotation': [], 'scale': [], 'ref': []}
    for room in sceneDict['scene']['room']:
        for child in room['children']:
            _['id'].append(child['instanceid'])
            _['position'].append(child['pos'])
            _['rotation'].append(child['rot'])
            _['scale'].append(child['scale'])
            _['ref'].append(child['ref'])
    return {key: np.array(value) for key, value in _.items()}


def __create_mesh_table(sceneDict: Dict):
    _ = {'id': [], 'material_id': [], 'type': [], 'xyz': [], 'normal': [], 'uv': [], 'face': []}
    for index, mesh in enumerate(sceneDict['mesh']):
        _['id'].append(mesh['uid'])
        _['material_id'].append(mesh['material'])
        _['type'].append(mesh['type'])
        _['xyz'].append(np.array(mesh['xyz']).reshape(-1, 3).T.tolist())
        _['normal'].append(np.array(mesh['normal']).reshape(-1, 3).T.tolist())
        _['uv'].append(np.array(mesh['uv']).reshape(-1, 2).T.tolist())
        _['face'].append(np.array(mesh['faces']).reshape(-1, 3).T.tolist())
    return {key: np.array(value) for (key, value) in _.items()}


def __create_material_table(sceneDict: Dict, material_when_unavailable: Union[int, Callable] = 0xffffffff):
    def compatible_texture(_material):
        if 'texture' not in _material: return ''
        _texture = _material['texture']
        return _texture['value'] if isinstance(_texture, dict) else _texture

    def compatible_color(rgba_or_rgb_array):
        r, g, b, a = rgba_or_rgb_array if 4 == len(rgba_or_rgb_array) else [*rgba_or_rgb_array, 255]
        return a << 24 | r << 16 | g << 8 | b

    def compatible_color_mode(_material):
        if not bool(_material.get('texture')): return 'color'
        if 'colorMode' in _material: return _material['colorMode']
        if bool(_material.get('useColor')): return 'color'
        return 'texture'

    def compatible_uv_transform(_material):
        return np.array(_material['UVTransform']).reshape(3, 3) if 'UVTransform' in _material else np.eye(3)

    _ = {'id': [], 'texture': [], 'color': [], 'colorMode': [], 'UVTransform': [], }
    for _material in sceneDict['material']:
        _['id'].append(_material['uid'])
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
    return {key: np.array(value) for key, value in _.items()}


def __create_furniture_table(sceneDict: Dict):
    _ = {'id': [], 'jid': []}
    for furniture in sceneDict['furniture']:
        _['id'].append(furniture['uid'])
        _['jid'].append(furniture['jid'])
    return {key: np.array(value) for key, value in _.items()}


def join(ndarray1Dict, ndarray2Dict, c1, c2, rsuffix):
    leftColumnNames = list(ndarray1Dict.keys())
    rightColumnNames = list(ndarray2Dict.keys())

    def rightName(_name):
        return _name if _name not in leftColumnNames else f'{rsuffix}{_name}'

    columnNames = leftColumnNames + [rightName(name) for name in rightColumnNames]
    dict1KeyIndex = list(ndarray1Dict.keys()).index(c1)
    result = []
    for row1 in zip(*ndarray1Dict.values()):
        indices = (ndarray2Dict[c2] == row1[dict1KeyIndex])
        row_join = [v[indices] for v in ndarray2Dict.values()]
        for row2 in zip(*row_join): result.append([*row1, *row2])
    columns = np.array(result).T.tolist()
    return {name: column for name, column in zip(columnNames, columns)}


def setCamera(eye, center, up, fovyDegree, near, far):
    camera = bpy.data.objects['Camera']

    camera.data.angle = math.radians(fovyDegree)

    eye = np.array(list(eye.values()))
    center = np.array(list(center.values()))
    north = np.array(list(up.values()))
    direction = center - eye
    forward = -direction / np.linalg.norm(direction)
    right = np.cross(north, forward)
    up = np.cross(forward, right)
    rotation = np.vstack([right, up, forward]).T
    matrix = np.eye(4)
    matrix[:3, :3] = rotation
    matrix[:3, -1] = eye
    mm = mathutils.Matrix.Identity(4)
    for index, row in enumerate(matrix): mm[index] = row
    camera.matrix_world = mm

    return camera, (eye, center)


def clean_nodes(nodes) -> None:
    for node in nodes: nodes.remove(node)


def create_sun_light(location: Tuple[float, float, float] = (0.0, 0.0, 5.0),
                     rotation: Tuple[float, float, float] = (0.0, 0.0, 0.0),
                     name: Optional[str] = None) -> bpy.types.Object:
    bpy.ops.object.light_add(type='SUN', location=location, rotation=rotation)

    if name is not None:
        bpy.context.object.name = name

    return bpy.context.object


def createLightPoint(location: Tuple[float, float, float] = (0.0, 0.0, 5.0), strength: float = 100, name: Optional[str] = None) -> bpy.types.Object:
    bpy.ops.object.light_add(type='POINT', location=location)
    light = bpy.context.object.data
    light.energy = strength
    if name is not None: bpy.context.object.name = name
    return bpy.context.object


def create_area_light(location: Tuple[float, float, float] = (0.0, 0.0, 5.0),
                      rotation: Tuple[float, float, float] = (0.0, 0.0, 0.0),
                      size: float = 5.0,
                      color: Tuple[float, float, float, float] = (1.00, 0.90, 0.80, 1.00),
                      strength: float = 1000.0,
                      name: Optional[str] = None):
    if bpy.app.version >= (2, 80, 0):
        bpy.ops.object.light_add(type='AREA', location=location, rotation=rotation)
    else:
        bpy.ops.object.lamp_add(type='AREA', location=location, rotation=rotation)

    if name is not None:
        bpy.context.object.name = name

    light = bpy.context.object.data
    light.size = size
    light.use_nodes = True
    light.node_tree.nodes["Emission"].inputs["Color"].default_value = color
    light.energy = strength

    return bpy.context.object


def set_principled_node(
        principled_node,
        base_color: Tuple[float, float, float, float] = (0.6, 0.6, 0.6, 1.0),
        subsurface: float = 0.0,
        subsurface_color: Tuple[float, float, float, float] = (0.8, 0.8, 0.8, 1.0),
        subsurface_radius: Tuple[float, float, float] = (1.0, 0.2, 0.1),
        metallic: float = 0.0,
        specular: float = 0.5,
        specular_tint: float = 0.0,
        roughness: float = 0.5,
        anisotropic: float = 0.0,
        anisotropic_rotation: float = 0.0,
        sheen: float = 0.0,
        sheen_tint: float = 0.5,
        clearcoat: float = 0.0,
        clearcoat_roughness: float = 0.03,
        ior: float = 1.45,
        transmission: float = 0.0,
        transmission_roughness: float = 0.0) -> None:
    principled_node.inputs['Base Color'].default_value = base_color
    principled_node.inputs['Subsurface'].default_value = subsurface
    principled_node.inputs['Subsurface Color'].default_value = subsurface_color
    principled_node.inputs['Subsurface Radius'].default_value = subsurface_radius
    principled_node.inputs['Metallic'].default_value = metallic
    principled_node.inputs['Specular'].default_value = specular
    principled_node.inputs['Specular Tint'].default_value = specular_tint
    principled_node.inputs['Roughness'].default_value = roughness
    principled_node.inputs['Anisotropic'].default_value = anisotropic
    principled_node.inputs['Anisotropic Rotation'].default_value = anisotropic_rotation
    principled_node.inputs['Sheen'].default_value = sheen
    principled_node.inputs['Sheen Tint'].default_value = sheen_tint
    principled_node.inputs['Clearcoat'].default_value = clearcoat
    principled_node.inputs['Clearcoat Roughness'].default_value = clearcoat_roughness
    principled_node.inputs['IOR'].default_value = ior
    principled_node.inputs['Transmission'].default_value = transmission
    principled_node.inputs['Transmission Roughness'].default_value = transmission_roughness


def add_material(name: str = "Material", use_nodes: bool = False, make_node_tree_empty: bool = False):
    material = bpy.data.materials.new(name)
    material.use_nodes = use_nodes
    if use_nodes and make_node_tree_empty: clean_nodes(material.node_tree.nodes)
    return material


def import_and_initialize_furniture(furniture, obj_and_texture_fetcher):
    jid, position, rotation, scale = furniture
    x, y, z, w = rotation
    rotation = (w, x, y, z)
    obj_path, texture_path = obj_and_texture_fetcher(jid)

    if obj_path is None or texture_path is None: return

    for obj in bpy.data.objects: obj.select_set(False)

    obj_material = add_material(f'obj_material[{jid}]', use_nodes=True, make_node_tree_empty=False)
    tree, links, nodes = obj_material.node_tree, obj_material.node_tree.links, obj_material.node_tree.nodes
    bsdf = nodes["Principled BSDF"]
    set_principled_node(principled_node=bsdf)
    texImage = nodes.new('ShaderNodeTexImage')
    texImage.image = bpy.data.images.load(texture_path)
    links.new(bsdf.inputs['Base Color'], texImage.outputs['Color'])

    bpy.ops.import_scene.obj(filepath=obj_path, axis_forward='Y', axis_up='Z')
    for model in bpy.context.selected_objects:
        model.select_set(False)
        model.name = f'{jid}.{model.name}'

        scaleMatrix = mathutils.Matrix.Identity(4)
        scaleMatrix[0][0], scaleMatrix[1][1], scaleMatrix[2][2] = scale
        model.matrix_world = (
                mathutils.Matrix.Translation(mathutils.Vector(position)) @
                mathutils.Quaternion(rotation).to_matrix().to_4x4() @
                scaleMatrix)

        if model.data.materials:
            model.data.materials[0] = obj_material
        else:
            model.data.materials.append(obj_material)


def create_mesh(id_, xyz, normal, uv, face, color):
    def int_to_color_rgba_array(_color) -> Tuple[float, float, float, float]:
        _color_array = [(_color & 0x00ff0000) >> 16, (_color & 0x0000ff00) >> 8, (_color & 0x000000ff) >> 0, (_color & 0xff000000) >> 24, ]
        return tuple(map(lambda e: e / 255, _color_array))

    mesh_name = f'mesh_{id_}'
    new_mesh: bpy.types.Mesh = bpy.data.meshes.new(mesh_name)
    scene = bpy.context.scene
    vertices = xyz.T.tolist()
    faces = face.T.tolist()
    new_mesh.from_pydata(vertices, [], faces)
    new_mesh.update()

    new_object: bpy.types.Object = bpy.data.objects.new(f'{mesh_name}_obj', new_mesh)
    scene.collection.objects.link(new_object)

    new_object.location = (0, 0, 0)
    new_object.scale = (1, 1, 1)
    new_object.rotation_euler = (0, 0, 0)

    material = add_material(f'{mesh_name}_material', use_nodes=True, make_node_tree_empty=False)
    tree, links, nodes = material.node_tree, material.node_tree.links, material.node_tree.nodes

    bsdf = nodes["Principled BSDF"]
    base_color = int_to_color_rgba_array(color)
    set_principled_node(
        principled_node=bsdf,
        base_color=base_color
    )
    if new_object.data.materials:
        new_object.data.materials[0] = material
    else:
        new_object.data.materials.append(material)

    return new_object


def startRender():
    bpy.ops.render.render(use_viewport=True, write_still=True)


def render(renderType: str, sceneDict: Dict, shapeLocalSource: str,
           eye: Dict, center: Dict, up: Dict, fovyDegree: float, near: float, far: float, baseLightStrength: float,
           width: int, height: int, sampleCount: int, outputFile: str):
    instance_table = __create_instance_table(sceneDict)
    mesh_table = __create_mesh_table(sceneDict)
    material_table = __create_material_table(sceneDict)
    furniture_table = __create_furniture_table(sceneDict)

    mesh_material = join(mesh_table, material_table, 'material_id', 'id', 'material_')
    mesh_all = join(mesh_material, instance_table, 'id', 'ref', 'instance_')
    furniture_all = join(furniture_table, instance_table, 'id', 'ref', 'instance_')

    setSceneOutput(outputFile, width, height)
    setCycles(sampleCount)
    normalizeScene()
    _, (npEye, npCenter) = setCamera(eye, center, up, fovyDegree, near, far)

    for furniture in zip(furniture_all['jid'], furniture_all['position'], furniture_all['rotation'], furniture_all['scale']):
        import_and_initialize_furniture(furniture, lambda jid: (
            os.path.join(shapeLocalSource, jid, 'raw_model.obj') if os.path.exists(
                os.path.join(shapeLocalSource, jid, 'raw_model.obj')) else None,
            os.path.join(shapeLocalSource, jid, 'texture.png') if os.path.exists(
                os.path.join(shapeLocalSource, jid, 'texture.png')) else None,
        ))

    for index, mesh in enumerate(
            zip(mesh_all['id'], mesh_all['type'], mesh_all['xyz'], mesh_all['normal'], mesh_all['uv'], mesh_all['face'], mesh_all['color'])):
        id_, type_, xyz, normal, uv, face, color = mesh
        xyz = np.array(xyz.tolist()).astype(np.float)
        normal = np.array(normal.tolist()).astype(np.float)
        uv = np.array(uv.tolist()).astype(np.float)
        face = np.array(face.tolist()).astype(np.int)
        create_mesh(id_, xyz, normal, uv, face, color)

    npDirection = npCenter - npEye
    npDirection = npDirection / np.linalg.norm(npDirection)
    for i in range(1, 4): createLightPoint(location=(npEye + npDirection * .5 * i).tolist(), strength=baseLightStrength)
    startRender()


def main():
    args = json.loads(sys.argv[-1])
    houseLayoutFile = args['data'][0]['houseLayoutFile']
    shapeLocalSource = args['data'][0]['shapeLocalSource']
    renderType = args['data'][0]['renderType']
    sampleCount = args['data'][0]['sampleCount']
    baseLightStrength = args['data'][0]['baseLightStrength']
    eye = args['layout']['scene']['camera']['eye']
    center = args['layout']['scene']['camera']['center']
    up = args['layout']['scene']['camera']['up']
    fovy = args['layout']['scene']['camera']['fovy']
    near, far = args['layout']['scene']['camera']['near'], args['layout']['scene']['camera']['far']
    width, height = args['width'], args['height']
    outputFile = args['outputFile']

    with open(houseLayoutFile) as f: sceneDict = json.load(f)
    render(renderType, sceneDict, shapeLocalSource,
           eye, center, up, fovy, near, far, baseLightStrength,
           width, height, sampleCount, outputFile)


if __name__ == '__main__':
    main()
