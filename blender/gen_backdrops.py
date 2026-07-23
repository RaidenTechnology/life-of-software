# gen_backdrops.py — renders the 6 difficulty backdrops (bg_<type>.png, 920x104)
# for "Life of Software" as Blender pixel-art dioramas. Each scene reuses the
# hand-designed pixel layout from src/battle.js but rebuilt as lit 3D geometry,
# so it reads as the same theme with real depth + shading.
#
# Run:  blender --background --factory-startup --python blender/gen_backdrops.py -- [theme]
#   theme optional; omit to render all six.
#
# Coord bridge: the source art is 920x104 px, ground top at py=86. We map
#   1 px = 0.1 world units, worldX = px*0.1, worldZ = (104-py)*0.1.
# so battle.js pixel coords drop straight in.

import bpy, sys, os, math

OUT_W, OUT_H = 920, 104
PXH = 104
S = 0.1                      # world units per pixel
HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.normpath(os.path.join(HERE, "..", "assets"))

def hx(v):                   # 0xRRGGBB -> linear-ish rgba (sRGB values; EEVEE view transform handles it)
    r = ((v >> 16) & 255) / 255.0
    g = ((v >> 8) & 255) / 255.0
    b = (v & 255) / 255.0
    # convert sRGB->linear so the rendered color matches the source hex
    def lin(c):
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return (lin(r), lin(g), lin(b), 1.0)

def wx(px):  return px * S
def wz(py):  return (PXH - py) * S

# ---------------------------------------------------------------- scene setup
def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = 'BLENDER_EEVEE'
    sc.render.resolution_x = OUT_W
    sc.render.resolution_y = OUT_H
    sc.render.resolution_percentage = 100
    sc.render.film_transparent = False
    sc.render.filter_size = 1.2          # slight AA for smooth shading; res is low so it still reads pixel
    try:
        sc.eevee.taa_render_samples = 24
    except Exception:
        pass
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_mode = 'RGBA'
    sc.view_settings.view_transform = 'Standard'   # keep colors true to the hex palette
    # camera: orthographic side view down +Y, up = +Z
    cam_data = bpy.data.cameras.new("Cam")
    cam_data.type = 'ORTHO'
    cam_data.ortho_scale = OUT_W * S               # 92.0 -> maps to the wider (X) axis
    cam = bpy.data.objects.new("Cam", cam_data)
    cam.location = (OUT_W * S / 2.0, -60.0, OUT_H * S / 2.0)
    cam.rotation_euler = (math.radians(90), 0, 0)
    bpy.context.collection.objects.link(cam)
    sc.camera = cam
    return sc

_matcache = {}
def mat(color, emit=0.0, rough=0.85):
    key = (color, emit, rough)
    if key in _matcache:
        return _matcache[key]
    m = bpy.data.materials.new("m")
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    col = hx(color)
    if emit > 0:
        e = nt.nodes.new("ShaderNodeEmission")
        e.inputs[0].default_value = col
        e.inputs[1].default_value = emit
        nt.links.new(e.outputs[0], out.inputs[0])
    else:
        b = nt.nodes.new("ShaderNodeBsdfPrincipled")
        b.inputs["Base Color"].default_value = col
        b.inputs["Roughness"].default_value = rough
        if "Specular IOR Level" in b.inputs:
            b.inputs["Specular IOR Level"].default_value = 0.15
        nt.links.new(b.outputs[0], out.inputs[0])
    _matcache[key] = m
    return m

def box(px, py, w, h, color, y=0.0, depth=1.4, emit=0.0, rough=0.85):
    """rect in source pixel space (px,py = top-left, w,h px) -> lit 3D slab."""
    cx = wx(px + w / 2.0)
    cz = wz(py + h / 2.0)
    bpy.ops.mesh.primitive_cube_add(location=(cx, y, cz))
    o = bpy.context.active_object
    o.scale = (wx(w) / 2.0, depth / 2.0, wz(0) - wz(h) if False else (h * S) / 2.0)
    o.data.materials.append(mat(color, emit, rough))
    _bevel(o, 0.03)
    return o

def cyl(px_center, py_bottom, radius_px, height_px, color, y=0.0, verts=10, emit=0.0):
    cx = wx(px_center)
    cz = wz(py_bottom) + (height_px * S) / 2.0
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=radius_px * S,
        depth=height_px * S, location=(cx, y, cz), rotation=(0, 0, 0))
    o = bpy.context.active_object
    o.data.materials.append(mat(color, emit))
    return o

def sphere(px, py, radius_px, color, y=0.0, emit=0.0, flat=0.9):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=radius_px * S,
        location=(wx(px), y, wz(py)))
    o = bpy.context.active_object
    o.scale = (1, flat, 1)
    o.data.materials.append(mat(color, emit))
    return o

def cone(px_center, py_bottom, radius_px, height_px, color, y=0.0, emit=0.0, verts=8):
    cx = wx(px_center)
    cz = wz(py_bottom) + (height_px * S) / 2.0
    bpy.ops.mesh.primitive_cone_add(vertices=verts, radius1=radius_px * S, radius2=0,
        depth=height_px * S, location=(cx, y, cz))
    o = bpy.context.active_object
    o.data.materials.append(mat(color, emit))
    return o

def _bevel(o, w):
    m = o.modifiers.new("bev", 'BEVEL')
    m.width = w
    m.segments = 1

def skyplane(top_color, bot_color=None):
    """full-frame background plane behind everything, optional vertical gradient."""
    bpy.ops.mesh.primitive_plane_add(location=(OUT_W * S / 2.0, 12.0, OUT_H * S / 2.0))
    o = bpy.context.active_object
    o.rotation_euler = (math.radians(90), 0, 0)
    o.scale = (OUT_W * S, OUT_H * S, 1)
    m = bpy.data.materials.new("sky"); m.use_nodes = True
    nt = m.node_tree; nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    e = nt.nodes.new("ShaderNodeEmission")
    if bot_color is None:
        e.inputs[0].default_value = hx(top_color)
        nt.links.new(e.outputs[0], out.inputs[0])
    else:
        grad = nt.nodes.new("ShaderNodeTexGradient")
        ramp = nt.nodes.new("ShaderNodeValToRGB")
        texco = nt.nodes.new("ShaderNodeTexCoord")
        ramp.color_ramp.elements[0].color = hx(bot_color)
        ramp.color_ramp.elements[1].color = hx(top_color)
        nt.links.new(texco.outputs["Generated"], grad.inputs[0])
        nt.links.new(grad.outputs["Color"], ramp.inputs[0])
        nt.links.new(ramp.outputs["Color"], e.inputs[0])
        nt.links.new(e.outputs[0], out.inputs[0])
    o.data.materials.append(m)
    e.inputs[1].default_value = 1.0
    return o

def sun(rot=(55, 0, 25), energy=3.2, color=(1,1,1)):
    d = bpy.data.lights.new("sun", 'SUN'); d.energy = energy; d.color = color
    d.angle = math.radians(8)
    d.use_shadow = False          # cel/retro look: shape from shading, no cast blobs
    o = bpy.data.objects.new("sun", d)
    o.rotation_euler = tuple(math.radians(a) for a in rot)
    bpy.context.collection.objects.link(o)
    return o

def ambient(color, strength):
    w = bpy.data.worlds.new("W"); w.use_nodes = True
    bg = w.node_tree.nodes.get("Background")
    bg.inputs[0].default_value = hx(color)
    bg.inputs[1].default_value = strength
    bpy.context.scene.world = w

GY = 86  # source ground top (px)

def ground_slab(base, top=None, front_depth=2.2):
    # ground fills py 86..104 -> a slab; slight front face gives thickness
    box(0, GY, OUT_W, PXH - GY, base, y=0.0, depth=front_depth, rough=1.0)
    if top is not None:
        box(0, GY - 2, OUT_W, 3, top, y=-1.0, depth=0.4, rough=1.0)

# ------------------------------------------------------------------- themes
def t_ork():
    ambient(0x16241a, 0.35)
    sun((58, 0, 20), 3.4, (0.9, 1.0, 0.85))
    skyplane(0x16241a, 0x22381f)
    box(0, GY - 30, OUT_W, 30, 0x1d3122, y=8, depth=0.3)      # far mist band
    for x, h in [(60,40),(150,56),(300,36),(420,50),(600,42),(740,58),(860,44)]:
        cyl(x + 4, GY, 4, h, 0x241a10, y=2.5)                  # trunk
        sphere(x + 4, GY - h - 6, 20, 0x0f2016, y=3.5, flat=0.8)
        sphere(x + 12, GY - h + 2, 14, 0x1f4a2c, y=2.5, flat=0.8)
    for x, y in [(110,30),(370,44),(530,26),(810,38)]:
        sphere(x, y, 3, 0xbfff89, y=-3, emit=6)               # fireflies
    ground_slab(0x3a2c1c, 0x2f5d2a)

def t_skeleton():
    ambient(0x1d2130, 0.4)
    sun((62, 0, -18), 2.6, (0.8, 0.85, 1.0))
    skyplane(0x1d2130, 0x2a2f45)
    sphere(838, 22, 12, 0xe8e3c8, y=9, emit=2.2)              # moon
    for x in (120, 380, 700):                                  # dead trees
        cyl(x + 2, GY, 2.5, 44, 0x14151c, y=2)
        box(x - 12, GY - 40, 14, 3, 0x14151c, y=2, depth=0.6)
        box(x + 4, GY - 52, 3, 14, 0x14151c, y=2, depth=0.6)
    for x, h in [(220,16),(300,12),(520,18),(610,12),(800,16)]:
        box(x, GY - h, 14, h, 0x3a3f52, y=1.5, depth=1.4)     # tombstones
    box(0, GY - 8, OUT_W, 5, 0x39445e, y=-2, depth=0.2, emit=0.4)  # fog
    ground_slab(0x2c2a26, 0x39413b)

def t_elf():
    ambient(0x102830, 0.5)
    sun((60, 0, 15), 2.4, (0.7, 1.0, 0.9))
    skyplane(0x102830, 0x16414a)
    box(0, GY - 26, OUT_W, 26, 0x16414a, y=8, depth=0.3)
    for x, h in [(90,46),(260,60),(500,40),(680,56),(850,48)]:
        cyl(x + 3, GY, 3.5, h, 0x1e2a20, y=2.5)
        sphere(x + 3, GY - h - 4, 16, 0x2e7d6b, y=3.5, emit=1.1, flat=0.8)
        sphere(x + 3, GY - h - 8, 7, 0x4dd0a1, y=2.5, emit=3.0)
    for x, r in [(180,10),(430,8),(760,10)]:                  # mushrooms
        box(x, GY - 8, 4, 8, 0xefe6d0, y=0, depth=1.0)
        sphere(x + 2, GY - 9, r, 0xd9534f, y=0, flat=0.7)
    for x, y in [(70,24),(330,38),(560,20),(790,34)]:
        sphere(x, y, 3, 0x9fe8c8, y=-3, emit=5)               # motes
    ground_slab(0x2b2418, 0x1e4632)

def t_goblin():
    ambient(0x181410, 0.3)
    sun((70, 0, 0), 1.6, (1.0, 0.7, 0.4))
    skyplane(0x181410, 0x241e18)
    for x in range(0, OUT_W, 60):                             # stalactites
        cone(x + 22, 0, 22, 22 + (x % 3) * 8, 0x241e18, y=6)
    for x in (160, 470, 780):                                  # torches
        box(x, GY - 26, 4, 26, 0x4e342e, y=2, depth=1.0)
        cone(x + 2, GY - 40, 7, 16, 0xff9800, y=1.5, emit=6)
        cone(x + 2, GY - 36, 4, 9, 0xffee58, y=1.0, emit=9)
    for x, h in [(260,12),(640,10)]:                          # rocks
        cone(x + 15, GY, 16, h + 8, 0x2c2620, y=2, verts=6)
    cone(353, GY, 4, 12, 0x4dd0e1, y=0.5, emit=5)             # crystals
    cone(704, GY, 5, 15, 0x4dd0e1, y=0.5, emit=5)
    ground_slab(0x2c2620, None)

def t_vampire():
    ambient(0x2c0b10, 0.5)
    sun((64, 0, 30), 2.2, (1.0, 0.85, 0.7))
    skyplane(0x2c0b10, 0x3a1015)
    box(0, 20, OUT_W, 2, 0xc9a227, y=7, depth=0.2, emit=1.2)  # gold trim
    for x in range(40, OUT_W, 160):                           # columns
        cyl(x + 9, GY, 9, GY - 22, 0x57181f, y=3, verts=12)
        box(x - 3, 22, 24, 4, 0xc9a227, y=2.6, depth=1.6, emit=0.5)
        box(x - 3, GY - 6, 24, 6, 0xc9a227, y=2.6, depth=1.6, emit=0.5)
    for x in range(110, OUT_W, 160):                          # arched windows (glow)
        box(x, 34, 22, 34, 0x8c1c2b, y=6, depth=0.2, emit=1.6)
        sphere(x + 11, 34, 11, 0x8c1c2b, y=6, emit=1.6, flat=1.0)
    for x in range(150, OUT_W, 320):                          # banners
        box(x, 24, 16, 30, 0x6d1220, y=1.5, depth=0.6)
        sphere(x + 8, 32, 3, 0xc9a227, y=1.0, emit=1.5)
    ground_slab(0x6d1220, 0x8c1c2b)
    box(0, GY + 4, OUT_W, 1, 0xc9a227, y=-1.2, depth=0.2, emit=0.8)

def t_demon():
    ambient(0x1a0b08, 0.35)
    sun((66, 0, -10), 1.8, (1.0, 0.55, 0.35))
    skyplane(0x1a0b08, 0x3a1108)
    box(0, GY - 30, OUT_W, 30, 0x2d0f08, y=8, depth=0.3)
    cone(690, GY, 90, 58, 0x241210, y=4, verts=3)             # volcano
    box(682, GY - 58, 16, 4, 0xff5722, y=3, depth=1.0, emit=6)
    cone(690, GY - 74, 6, 16, 0xff9800, y=3, emit=9)          # eruption
    for x, y in [(100,30),(280,18),(460,40),(840,26)]:
        sphere(x, y, 3, 0xff7043, y=-3, emit=6)               # embers
    for x in (60, 230, 420, 560, 820):                        # flames
        cone(x + 9, GY, 9, 20, 0xbf360c, y=1.5, emit=4)
        cone(x + 9, GY, 6, 14, 0xff9800, y=1.0, emit=7)
        cone(x + 9, GY, 3, 8, 0xffee58, y=0.5, emit=10)
    ground_slab(0x241210, None)
    for x in range(30, OUT_W, 90):                            # lava cracks
        box(x, GY + 6 + (x % 2) * 4, 24, 2, 0xff5722, y=-1.2, depth=0.2, emit=5)

THEMES = {
    'ork': t_ork, 'skeleton': t_skeleton, 'elf': t_elf,
    'goblin': t_goblin, 'vampire': t_vampire, 'demon': t_demon,
}

def render(name):
    reset()
    _matcache.clear()
    THEMES[name]()
    bpy.context.scene.render.filepath = os.path.join(ASSETS, "bg_%s.png" % name)
    bpy.ops.render.render(write_still=True)
    print("WROTE", bpy.context.scene.render.filepath)

def main():
    argv = sys.argv
    args = argv[argv.index("--") + 1:] if "--" in argv else []
    todo = [args[0]] if args and args[0] in THEMES else list(THEMES.keys())
    os.makedirs(ASSETS, exist_ok=True)
    for t in todo:
        render(t)
    print("ALL_DONE")

main()
