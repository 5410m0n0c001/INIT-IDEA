# Renderiza sprites PNG (fondo transparente) de la rosa 3D para las decoraciones de la invitación.
# Uso: blender -b --factory-startup --python tools/render_rosas.py -- models/rosa.glb img/deco
import bpy, sys, os, math
glb, salida = sys.argv[-2], sys.argv[-1]
os.makedirs(salida, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb)
rosa, tallo = bpy.data.objects['Rosa'], bpy.data.objects['Tallo']

def material(nombre, color, sheen, gamma=0.6):
    m = bpy.data.materials.new(nombre); m.use_nodes = True
    n = m.node_tree.nodes; p = n['Principled BSDF']
    vc = n.new('ShaderNodeVertexColor'); vc.layer_name = rosa.data.color_attributes[0].name
    mix = n.new('ShaderNodeMix'); mix.data_type = 'RGBA'; mix.blend_type = 'MULTIPLY'; mix.inputs['Factor'].default_value = 1
    mix.inputs[6].default_value = color
    bw = n.new('ShaderNodeRGBToBW'); m.node_tree.links.new(vc.outputs['Color'], bw.inputs[0])
    gam = n.new('ShaderNodeMath'); gam.operation = 'POWER'; gam.inputs[1].default_value = gamma
    m.node_tree.links.new(bw.outputs[0], gam.inputs[0]); m.node_tree.links.new(gam.outputs[0], mix.inputs[7])
    m.node_tree.links.new(mix.outputs[2], p.inputs['Base Color'])
    p.inputs['Roughness'].default_value = 0.45
    p.inputs['Coat Weight'].default_value = 0.4
    p.inputs['Sheen Weight'].default_value = 0.6
    p.inputs['Sheen Tint'].default_value = sheen
    return m
azul = material('Azul', (0.03, 0.12, 0.55, 1), (0.55, 0.7, 1, 1))
blanca = material('Blanca', (1, 0.97, 0.93, 1), (1, 1, 1, 1), 0.12)
hoja = bpy.data.materials.new('Tallo'); hoja.use_nodes = True
hp = hoja.node_tree.nodes['Principled BSDF']; hp.inputs['Base Color'].default_value = (0.05, 0.16, 0.07, 1); hp.inputs['Roughness'].default_value = 0.5
tallo.data.materials.clear(); tallo.data.materials.append(hoja)

esc = bpy.context.scene
esc.render.engine = 'BLENDER_EEVEE'
esc.render.film_transparent = True
esc.render.resolution_x = esc.render.resolution_y = 700
esc.render.image_settings.file_format = 'PNG'; esc.render.image_settings.color_mode = 'RGBA'
esc.view_settings.view_transform = 'AgX'
mundo = bpy.data.worlds.new('M'); esc.world = mundo; mundo.use_nodes = True
mundo.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.6
for nombre, rot, energia in (('Key', (50, 0, 35), 4), ('Rim', (60, 0, 210), 3), ('Fill', (80, 0, 120), 1.2)):
    l = bpy.data.objects.new(nombre, bpy.data.lights.new(nombre, 'SUN')); l.data.energy = energia
    l.rotation_euler = [math.radians(a) for a in rot]; esc.collection.objects.link(l)
cam = bpy.data.objects.new('Cam', bpy.data.cameras.new('Cam')); esc.collection.objects.link(cam); esc.camera = cam
cam.data.type = 'ORTHO'

def render(nombre, mat, apertura, con_tallo, elev, giro, escala, exposicion=0, fijo=None):
    esc.view_settings.exposure = exposicion
    rosa.data.materials.clear(); rosa.data.materials.append(mat)
    rosa.data.shape_keys.key_blocks['Abierta'].value = apertura
    tallo.hide_render = not con_tallo
    bpy.context.view_layer.update()
    from mathutils import Vector
    obj = tallo if con_tallo else rosa
    pts = [obj.matrix_world @ Vector(c) for c in obj.bound_box]
    if con_tallo: pts += [rosa.matrix_world @ Vector(c) for c in rosa.bound_box]
    cx, cy, cz = (sum(p[i] for p in pts) / len(pts) for i in range(3))
    tam = max(max(p[i] for p in pts) - min(p[i] for p in pts) for i in range(3))
    if fijo: cx, cy, cz, tam = fijo  # encuadre fijo (secuencias de floración)
    d = 6; e, g = math.radians(elev), math.radians(giro)
    cam.location = (cx + d * math.cos(e) * math.sin(g), cy - d * math.cos(e) * math.cos(g), cz + d * math.sin(e))
    direccion = (cx - cam.location.x, cy - cam.location.y, cz - cam.location.z)
    from mathutils import Vector
    cam.rotation_euler = Vector(direccion).to_track_quat('-Z', 'Y').to_euler()
    cam.data.ortho_scale = tam * escala
    esc.render.filepath = os.path.join(salida, nombre + '.png')
    bpy.ops.render.render(write_still=True)

render('rosa-azul-1', azul, 1.0, False, 55, 20, 1.15)
render('rosa-azul-2', azul, 0.8, False, 30, 140, 1.15)
render('rosa-azul-tallo', azul, 0.9, True, 25, 60, 1.05)
render('boton-azul', azul, 0.15, False, 30, 120, 1.3)
render('rosa-blanca', blanca, 0.95, False, 50, 250, 1.15, 1.3)
render('boton-blanco-1', blanca, 0.12, False, 25, 80, 1.3, 1.3)
render('boton-blanco-2', blanca, 0.3, False, 45, 200, 1.3, 1.3)

# ---------- secuencias de floración (divisores): misma cámara, de botón a abierta ----------
APERTURAS = (0.0, 0.2, 0.4, 0.6, 0.8, 1.0)
for nombre, m, elev, giro, expo in (('flor-azul', azul, 42, 30, 0), ('flor-blanca', blanca, 42, 200, 1.3)):
    # encuadre fijo al tamaño de la flor abierta para que las etapas no "salten"
    from mathutils import Vector
    rosa.data.shape_keys.key_blocks['Abierta'].value = 1.0
    bpy.context.view_layer.update()
    ev = rosa.evaluated_get(bpy.context.evaluated_depsgraph_get()).to_mesh()
    pts = [rosa.matrix_world @ v.co for v in ev.vertices]
    centro = [(max(p[i] for p in pts) + min(p[i] for p in pts)) / 2 for i in range(3)]
    tam = max(max(p[i] for p in pts) - min(p[i] for p in pts) for i in range(3))
    for i, a in enumerate(APERTURAS):
        render(f'{nombre}-{i}', m, a, False, elev, giro, 1.1, expo, (*centro, tam))

# rama con hojas (sin flor) para enlazar las flores del divisor
rosa.hide_render = True
render('rama', azul, 0, True, 10, 90, 1.0)
rosa.hide_render = False
