import numpy as np


def search_data(data_values, coordinates, skip, data_type):
    for d in data_values:
        if d == skip:
            continue
        if data_type == 'float':
            coordinates.append(float(d))
        elif data_type == 'int':
            coordinates.append(int(d) - 1)


def create_unsorted_vertex_buffer(indices_data, vertices, textures, normals):
    buffer = []
    num_verts = len(vertices) // 3

    for i1 in range(num_verts):
        start = i1 * 3
        end = start + 3
        buffer.extend(vertices[start:end])

        for i2, data in enumerate(indices_data):
            if i2 % 3 == 0 and data == i1:
                start = indices_data[i2 + 1] * 2
                end = start + 2
                buffer.extend(textures[start:end])

                start = indices_data[i2 + 2] * 3
                end = start + 3
                buffer.extend(normals[start:end])
                break
    return buffer


def load_obj(file):
    vert_coords = []  # will contain all the vertex coordinates
    tex_coords = []  # will contain all the texture coordinates
    norm_coords = []  # will contain all the vertex normals

    all_indices = []  # will contain all the vertex, texture and normal indices
    indices = []  # will contain the indices for indexed drawing

    with open(file, 'r') as f:
        line = f.readline()
        while line:
            values = line.split()
            if 0 == len(values): break
            if values[0] == 'v':
                search_data(values, vert_coords, 'v', 'float')
            elif values[0] == 'vt':
                search_data(values, tex_coords, 'vt', 'float')
            elif values[0] == 'vn':
                search_data(values, norm_coords, 'vn', 'float')
            elif values[0] == 'f':
                for value in values[1:]:
                    val = value.split('/')
                    search_data(val, all_indices, 'f', 'int')
                    indices.append(int(val[0]) - 1)

            line = f.readline()

    buffer = create_unsorted_vertex_buffer(all_indices, vert_coords, tex_coords, norm_coords)
    buffer = np.array(buffer).reshape(-1, 3 + 2 * int(bool(len(tex_coords))) + 3 * int(bool(len(norm_coords))))
    return {
        'position': buffer[:, (0, 1, 2)].T,
        'uv': buffer[:, (3, 4)].T if bool(len(tex_coords)) else None,
        'normal': buffer[:, (5, 6, 7)].T if bool(len(tex_coords)) else None,
        'index': np.array(indices).reshape(-1, 3).T
    }
