# gen_items.py — Blender pixel-art LOOT ICONS (it_sword/armor/potion/scroll/
# treasure, 22x22 transparent PNGs), same flat-voxel language as gen_chars.py
# (no AO, no bevel, no specular, one outline shell per shape) so drops/bag/shop
# match the rest of the Blender art. Self-contained script (small, standalone).
#
# Run: blender --background --factory-startup --python blender/gen_items.py -- [name]

import bpy, sys, os, math

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.normpath(os.path.join(HERE, "..", "assets"))
S = 0.1
PX = 22
OUT = 0x0e1216
SS = 3

def hx(v):
    r=((v>>16)&255)/255.0; g=((v>>8)&255)/255.0; b=(v&255)/255.0
    def lin(c): return c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4
    return (lin(r),lin(g),lin(b),1.0)

def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = 'BLENDER_EEVEE'
    sc.render.resolution_x = PX*SS; sc.render.resolution_y = PX*SS
    sc.render.film_transparent = True
    sc.render.filter_size = 1.0
    try:
        sc.eevee.taa_render_samples = 32
        sc.eevee.use_gtao = False
    except Exception: pass
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_mode = 'RGBA'
    sc.view_settings.view_transform = 'Standard'
    cam = bpy.data.objects.new("Cam", bpy.data.cameras.new("Cam"))
    cam.data.type = 'ORTHO'; cam.data.ortho_scale = PX * S
    cam.location = (PX*S/2, -60, PX*S/2); cam.rotation_euler = (math.radians(90),0,0)
    bpy.context.collection.objects.link(cam); sc.camera = cam
    d = bpy.data.lights.new("key",'SUN'); d.energy=3.2; d.angle=math.radians(4)
    o = bpy.data.objects.new("key",d); o.rotation_euler=(math.radians(52),0,math.radians(28))
    bpy.context.collection.objects.link(o)
    rim = bpy.data.lights.new("rim",'SUN'); rim.energy=2.0; rim.color=(0.7,0.8,1.0); rim.angle=math.radians(4)
    ro = bpy.data.objects.new("rim",rim); ro.rotation_euler=(math.radians(70),0,math.radians(200))
    bpy.context.collection.objects.link(ro)
    w = bpy.data.worlds.new("W"); w.use_nodes=True
    w.node_tree.nodes.get("Background").inputs[1].default_value = 0.55
    sc.world = w

def wx(px): return px*S
def wz(py): return (PX-py)*S

_mats = {}
def mat(color):
    if color in _mats: return _mats[color]
    m=bpy.data.materials.new("m"); m.use_nodes=True
    nt=m.node_tree; nt.nodes.clear()
    out=nt.nodes.new("ShaderNodeOutputMaterial")
    b=nt.nodes.new("ShaderNodeBsdfPrincipled")
    b.inputs["Base Color"].default_value=hx(color)
    b.inputs["Roughness"].default_value=1.0
    if "Specular IOR Level" in b.inputs: b.inputs["Specular IOR Level"].default_value=0.0
    nt.links.new(b.outputs[0],out.inputs[0])
    _mats[color]=m; return m

def _cube(cx,y,cz,sx,sy,sz,color):
    bpy.ops.mesh.primitive_cube_add(location=(cx,y,cz))
    o=bpy.context.active_object; o.scale=(sx,sy,sz)
    o.data.materials.append(mat(color))
    return o

def part(px, py, w, h, color, depth=3.0, y=0.0, outline=True, ow=0.9):
    cx=wx(px+w/2.0); cz=wz(py+h/2.0)
    if outline:
        _cube(cx, y+0.05, cz, (w+2*ow)*S/2.0, (depth+0.2)*S/2.0, (h+2*ow)*S/2.0, OUT)
    return _cube(cx, y, cz, w*S/2.0, depth*S/2.0, h*S/2.0, color)

def i_sword():
    part(9,1,4,11,0xdfe7ec, depth=2.4)             # blade
    part(5,12,12,2,0xc9a227, depth=2.6)            # crossguard
    part(9,14,4,5,0x5d4037, depth=2.2)             # grip
    part(8,19,6,2,0xc9a227, depth=2.4)             # pommel

def i_armor():
    part(6,4,10,12,0x90a4ae, depth=2.6)            # chestplate
    part(3,4,4,6,0x78909c, depth=2.2)              # left pauldron
    part(15,4,4,6,0x78909c, depth=2.2)             # right pauldron
    part(6,4,10,2,0xcfd8dc, depth=2.7, outline=False)  # collar trim

def i_potion():
    part(9,2,4,3,0x8d6e63, depth=2.4)              # cork
    part(6,5,10,13,0xd32f2f, depth=2.6)            # bottle
    part(7,6,3,4,0xef5350, depth=2.7, outline=False)  # highlight

def i_scroll():
    part(3,3,16,3,0x8d6e63, depth=2.4)             # top rod
    part(4,5,14,12,0xd7ccc8, depth=2.2)            # parchment
    part(3,16,16,3,0x8d6e63, depth=2.4)            # bottom rod
    part(10,8,2,6,0xb71c1c, depth=2.5, outline=False)  # ribbon

def i_treasure():
    part(4,6,14,5,0x6d4c41, depth=2.6)             # lid
    part(4,11,14,8,0x5d4037, depth=2.6)            # base
    part(4,13,14,2,0xc9a227, depth=2.8)            # gold band
    part(9,12,4,4,0xffd54f, depth=3.0, outline=False)  # lock/gem

ITEMS = {'sword':i_sword,'armor':i_armor,'potion':i_potion,'scroll':i_scroll,'treasure':i_treasure}

def downscale(src, dst, w, h):
    import numpy as np
    img = bpy.data.images.load(src)
    W2, H2 = img.size
    px = np.array(img.pixels[:]).reshape(H2, W2, 4)
    fy, fx = H2 // h, W2 // w
    px = px.reshape(h, fy, w, fx, 4).mean(axis=(1, 3))
    out = bpy.data.images.new("o", width=w, height=h, alpha=True)
    out.pixels = px.reshape(-1).tolist()
    out.filepath_raw = dst; out.file_format = 'PNG'; out.save()
    bpy.data.images.remove(img); bpy.data.images.remove(out)

def render(name):
    _mats.clear()
    reset(); ITEMS[name]()
    fname = "it_%s.png" % name
    dst = os.path.join(ASSETS, fname)
    tmp = dst + ".ss.png"
    bpy.context.scene.render.filepath = tmp
    bpy.ops.render.render(write_still=True)
    downscale(tmp, dst, PX, PX)
    try: os.remove(tmp)
    except Exception: pass
    print("WROTE", fname)

def main():
    argv=sys.argv; args=argv[argv.index("--")+1:] if "--" in argv else []
    todo = args if args else list(ITEMS.keys())
    os.makedirs(ASSETS, exist_ok=True)
    for n in todo: render(n)
    print("ALL_DONE")

main()
