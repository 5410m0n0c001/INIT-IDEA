# Croquis 3D PROVISIONAL del Jardín Mina Real a partir del checklist (sin medidas reales todavía).
# Uso: blender -b --factory-startup --python tools/croquis.py -- models/croquis.glb
# Al tener el levantamiento del jardín, ajustar TERRENO y las posiciones de cada zona.
import bpy, sys, math

salida = sys.argv[-1]
bpy.ops.wm.read_factory_settings(use_empty=True)
esc = bpy.context.scene

def mat(nombre, color, rugosidad=0.6, metal=0.0, emision=0.0):
    m = bpy.data.materials.new(nombre)
    m.use_nodes = True
    p = m.node_tree.nodes['Principled BSDF']
    p.inputs['Base Color'].default_value = (*color, 1)
    p.inputs['Roughness'].default_value = rugosidad
    p.inputs['Metallic'].default_value = metal
    if emision:
        p.inputs['Emission Color'].default_value = (*color, 1)
        p.inputs['Emission Strength'].default_value = emision
    return m

PASTO = mat('Pasto', (0.24, 0.42, 0.18), 0.95)
CERRO = mat('Cerro', (0.2, 0.32, 0.17), 1)
CAMINO = mat('Camino', (0.78, 0.72, 0.6), 0.9)
MADERA = mat('Madera', (0.42, 0.26, 0.14), 0.55)
ARENA = mat('Mantel arena', (0.86, 0.79, 0.66), 0.8)
MARINO = mat('Azul marino', (0.03, 0.07, 0.2), 0.6)
BLANCO = mat('Blanco', (0.95, 0.95, 0.93), 0.5)
IVORY = mat('Ivory', (0.98, 0.94, 0.85), 0.6)
ROSA = mat('Rosa pastel', (0.95, 0.68, 0.72), 0.6)
AZUL = mat('Azul', (0.2, 0.36, 0.72), 0.4)
ORO = mat('Dorado', (0.85, 0.66, 0.32), 0.3, 1)
PISTA = mat('Pista', (0.92, 0.92, 0.95), 0.2)
LUZ = mat('Letras', (1.0, 0.92, 0.75), 0.4, 0, 3)
NEGRO = mat('Negro', (0.05, 0.05, 0.07), 0.5)

def caja(nombre, x, y, z, sx, sy, sz, m, rot=0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, y, z + sz / 2))
    o = bpy.context.object
    o.name = nombre
    o.scale = (sx, sy, sz)
    o.rotation_euler[2] = math.radians(rot)
    o.data.materials.append(m)
    return o

def cilindro(nombre, x, y, z, r, h, m, verts=24):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=h, location=(x, y, z + h / 2))
    o = bpy.context.object
    o.name = nombre
    o.data.materials.append(m)
    return o

def esfera(nombre, x, y, z, r, m):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8, radius=r, location=(x, y, z))
    o = bpy.context.object
    o.name = nombre
    o.data.materials.append(m)
    return o

def texto(contenido, x, y, z, tam, m, rot_x=90, rot_z=0, grosor=0.05):
    bpy.ops.object.text_add(location=(x, y, z))
    o = bpy.context.object
    o.data.body = contenido
    o.data.size = tam
    o.data.extrude = grosor
    o.data.align_x = 'CENTER'
    o.rotation_euler = (math.radians(rot_x), 0, math.radians(rot_z))
    o.data.materials.append(m)
    bpy.ops.object.convert(target='MESH')
    o.name = 'Texto ' + contenido
    return o

def silla(x, y, rot, m=MADERA):
    caja('Silla', x, y, 0, 0.42, 0.42, 0.45, m, rot)
    a = math.radians(rot)
    # el respaldo va del lado contrario a donde mira la silla
    caja('Respaldo', x + 0.19 * math.sin(a), y + 0.19 * math.cos(a), 0.45, 0.42, 0.05, 0.45, m, rot)

def centro(x, y, z):
    cilindro('Base centro', x, y, z, 0.12, 0.08, IVORY)
    esfera('Flor', x - 0.06, y, z + 0.16, 0.09, ROSA)
    esfera('Flor', x + 0.06, y + 0.03, z + 0.15, 0.08, IVORY)
    esfera('Flor', x, y - 0.06, z + 0.14, 0.06, AZUL)

# ---------- terreno (provisional: 40 x 28 m) ----------
TERRENO = (40, 28)
caja('Jardín', 0, 0, -0.1, TERRENO[0], TERRENO[1], 0.1, PASTO)
bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, radius=14, location=(0, 26, -7))
cerro = bpy.context.object; cerro.name = 'Cerro'; cerro.scale = (2.2, 0.6, 1); cerro.data.materials.append(CERRO)
caja('Camino', -15, 0, 0, 2, 26, 0.02, CAMINO)

# ---------- ceremonia: vista al cerro (al norte) ----------
cx, cy = -6, 9
caja('Altar', cx, cy + 3.5, 0, 3, 1.2, 0.15, MADERA)
for lado in (-1, 1):
    cilindro('Arco', cx + lado * 1.3, cy + 3.5, 0.15, 0.06, 2.6, BLANCO)
caja('Arco travesaño', cx, cy + 3.5, 2.7, 2.8, 0.12, 0.12, BLANCO)
esfera('Flores arco', cx - 1.1, cy + 3.5, 2.75, 0.35, IVORY); esfera('Flores arco', cx + 1.1, cy + 3.5, 2.75, 0.3, ROSA)
caja('Mesa de velas', cx + 1.8, cy + 3.3, 0, 0.6, 0.6, 0.75, BLANCO)
for i in range(3): cilindro('Vela', cx + 1.65 + i * 0.15, cy + 3.3, 0.75, 0.03, 0.18 + i * 0.05, IVORY, 12)
for fila in range(6):
    for col in range(8):
        lado = -1 if col < 4 else 1
        x = cx + lado * (0.9 + (col % 4) * 0.55)
        silla(x, cy + 1.6 - fila * 0.8, 180, BLANCO)  # miran al altar
texto('Ceremonia', cx, cy - 3.6, 0.05, 0.6, MARINO, rot_x=0)

# ---------- cóctel: sala lounge, 4 periqueras, barra mix y letras gigantes ----------
lx, ly = 9, 9
caja('Sala lounge', lx - 2, ly, 0, 2.4, 0.9, 0.45, BLANCO); caja('Respaldo lounge', lx - 2, ly + 0.4, 0.45, 2.4, 0.15, 0.4, BLANCO)
caja('Mesa centro lounge', lx - 2, ly - 1, 0, 1, 0.6, 0.4, MADERA)
for i in range(4):
    cilindro('Periquera', lx + 1 + (i % 2) * 1.6, ly - 0.5 + (i // 2) * 1.6, 0, 0.05, 1.05, NEGRO)
    cilindro('Cubierta periquera', lx + 1 + (i % 2) * 1.6, ly - 0.5 + (i // 2) * 1.6, 1.05, 0.35, 0.04, ARENA)
caja('Barra mix', lx + 4.5, ly, 0, 0.7, 3, 1.05, MARINO)
texto('Barra mix', lx + 4.5, ly - 2.1, 0.05, 0.35, MARINO, rot_x=0)
texto('A & J', lx, ly + 3, 0, 1.4, LUZ, grosor=0.15)
texto('Cóctel', lx, ly - 3, 0.05, 0.6, MARINO, rot_x=0)

# ---------- banquete ----------
# mesa principal sobre templete, sillones Rey & Reina, arreglo floral
mx, my = 0, -2
caja('Templete', mx, my + 5, 0, 5, 1.8, 0.3, MADERA)
caja('Mesa principal', mx, my + 5, 0.3, 2.4, 0.9, 0.75, MADERA)
for lado in (-1, 1):
    caja('Sillón', mx + lado * 0.6, my + 5.7, 0.3, 0.7, 0.6, 0.5, IVORY)
    caja('Respaldo sillón', mx + lado * 0.6, my + 6.0, 0.8, 0.75, 0.12, 0.9, IVORY)
centro(mx, my + 5, 1.05)
texto('Mesa principal', mx, my + 3.6, 0.05, 0.4, MARINO, rot_x=0)

numero = 1
# montaje 1: 4 mesas cuadradas (mantel arena + cubremantel azul marino)
for i, (x, y) in enumerate([(-8, -3), (-5.5, -3), (-8, -6), (-5.5, -6)]):
    caja(f'Mesa {numero}', x, y, 0, 1.5, 1.5, 0.74, ARENA)
    caja('Cubremantel', x, y, 0.74, 1.2, 1.2, 0.01, MARINO, 45)
    centro(x, y, 0.75)
    for k in range(8):
        a = k * math.pi / 4
        silla(x + math.cos(a) * 1.15, y + math.sin(a) * 1.15, -math.degrees(a) + 90, BLANCO)
    texto(str(numero), x, y, 1.3, 0.5, AZUL, rot_x=90)
    numero += 1
# montaje 2: 6 mesas de madera rectangulares, silla crossback
for i in range(6):
    x = 3 + (i % 2) * 3.4
    y = -2.5 - (i // 2) * 2.6
    caja(f'Mesa {numero}', x, y, 0, 2.4, 1, 0.75, MADERA)
    centro(x, y, 0.75)
    for k in range(4):
        for lado in (-1, 1):
            silla(x - 0.9 + k * 0.6, y + lado * 0.8, 180 if lado < 0 else 0, MADERA)
    texto(str(numero), x, y, 1.3, 0.5, AZUL, rot_x=90)
    numero += 1

# pista, cabina de fotos, barra de esquites, violinista
caja('Pista', 0, -6.5, 0, 5, 5, 0.04, PISTA)
texto('Pista', 0, -6.5, 0.06, 0.6, MARINO, rot_x=0)
caja('Cabina de fotos', -13, -8, 0, 1.6, 1.6, 2.2, MARINO)
texto('Cabina de fotos', -13, -9.4, 0.05, 0.35, MARINO, rot_x=0)
caja('Barra de esquites', 13, -6, 0, 0.7, 2.6, 1, ARENA)
texto('Esquites', 13, -7.8, 0.05, 0.35, MARINO, rot_x=0)
cilindro('Violinista', -3.5, 2.5, 0, 0.5, 0.05, ORO)
texto('Violinista', -3.5, 1.7, 0.05, 0.3, MARINO, rot_x=0)

# ---------- exportar ----------
for o in esc.objects:
    o.select_set(True)
bpy.ops.export_scene.gltf(filepath=salida, export_format='GLB', use_selection=False, export_apply=True)
print('Croquis exportado:', salida)
