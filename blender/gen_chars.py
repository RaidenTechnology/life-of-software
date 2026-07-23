# gen_chars.py — Blender pixel-art CHARACTERS (transparent PNGs) that replace the
# code-drawn hero tiers and monsters with lit 3D "figurines": the exact same
# silhouettes/keys as battle.js (so in-game alignment + gameplay are unchanged),
# rebuilt as shaded 3D volume for a more realistic, dimensional look.
#
# Keys/sizes match Battle.makeTextures():
#   hero{t}   -> (60+t*3) x 52   sword variant, faces right
#   hero{t}x  -> 58 x 52         crossbow variant
#   en_{key}  -> 40 x 52         monster, faces left
#
# Run: blender --background --factory-startup --python blender/gen_chars.py -- [what]
#   what: 'hero0'.. 'hero5', 'hero0x'.., 'ork','skeleton',... or omit for ALL.

import bpy, sys, os, math

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.normpath(os.path.join(HERE, "..", "assets"))
S = 0.1          # world units per pixel
PXH = 52

def hx(v):
    r=((v>>16)&255)/255.0; g=((v>>8)&255)/255.0; b=(v&255)/255.0
    def lin(c): return c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4
    return (lin(r),lin(g),lin(b),1.0)

def shade(c, f):
    r=min(255,int(((c>>16)&255)*f)); g=min(255,int(((c>>8)&255)*f)); b=min(255,int((c&255)*f))
    return (r<<16)|(g<<8)|b

_canvasW = 40
def reset(canvasW):
    global _canvasW; _canvasW = canvasW
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = 'BLENDER_EEVEE'
    sc.render.resolution_x = canvasW; sc.render.resolution_y = PXH
    sc.render.film_transparent = True
    sc.render.filter_size = 1.3
    try:
        sc.eevee.taa_render_samples = 48
        sc.eevee.use_gtao = True            # ambient occlusion -> contact depth
    except Exception:
        pass
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_mode = 'RGBA'
    sc.view_settings.view_transform = 'Standard'
    cam = bpy.data.objects.new("Cam", bpy.data.cameras.new("Cam"))
    cam.data.type = 'ORTHO'; cam.data.ortho_scale = canvasW * S
    cam.location = (canvasW*S/2, -60, PXH*S/2); cam.rotation_euler = (math.radians(90),0,0)
    bpy.context.collection.objects.link(cam); sc.camera = cam
    # lighting: key from upper-left-front + soft ambient fill
    d = bpy.data.lights.new("key",'SUN'); d.energy=3.6; d.angle=math.radians(12)
    o = bpy.data.objects.new("key",d); o.rotation_euler=(math.radians(52),0,math.radians(28))
    bpy.context.collection.objects.link(o)
    w = bpy.data.worlds.new("W"); w.use_nodes=True
    w.node_tree.nodes.get("Background").inputs[1].default_value = 0.55
    sc.world = w

def wx(px): return px*S
def wz(py): return (PXH-py)*S

_mats = {}
def mat(color, rough=0.75, emit=0.0):
    key=(color,rough,emit)
    if key in _mats: return _mats[key]
    m=bpy.data.materials.new("m"); m.use_nodes=True
    nt=m.node_tree; nt.nodes.clear()
    out=nt.nodes.new("ShaderNodeOutputMaterial")
    if emit>0:
        e=nt.nodes.new("ShaderNodeEmission"); e.inputs[0].default_value=hx(color); e.inputs[1].default_value=emit
        nt.links.new(e.outputs[0],out.inputs[0])
    else:
        b=nt.nodes.new("ShaderNodeBsdfPrincipled")
        b.inputs["Base Color"].default_value=hx(color); b.inputs["Roughness"].default_value=rough
        if "Specular IOR Level" in b.inputs: b.inputs["Specular IOR Level"].default_value=0.2
        nt.links.new(b.outputs[0],out.inputs[0])
    _mats[key]=m; return m

def part(px, py, w, h, color, depth=3.2, y=0.0, bevel=0.05, rough=0.75, emit=0.0):
    cx=wx(px+w/2.0); cz=wz(py+h/2.0)
    bpy.ops.mesh.primitive_cube_add(location=(cx,y,cz))
    o=bpy.context.active_object
    o.scale=(w*S/2.0, depth*S/2.0, h*S/2.0)
    o.data.materials.append(mat(color,rough,emit))
    m=o.modifiers.new("b",'BEVEL'); m.width=bevel; m.segments=2; m.limit_method='NONE'
    return o

def tri(pts, color, depth=2.0, y=0.0, emit=0.0):
    # a flat triangular prism from 3 pixel points [(px,py)*3]
    import bmesh
    me=bpy.data.meshes.new("t"); o=bpy.data.objects.new("t",me)
    bpy.context.collection.objects.link(o)
    bm=bmesh.new()
    vs=[bm.verts.new((wx(px), -depth*S/2, wz(py))) for px,py in pts]
    vs2=[bm.verts.new((wx(px), depth*S/2, wz(py))) for px,py in pts]
    bm.faces.new(vs); bm.faces.new(list(reversed(vs2)))
    for i in range(3):
        j=(i+1)%3
        bm.faces.new([vs[i],vs[j],vs2[j],vs2[i]])
    bm.normal_update(); bm.to_mesh(me); bm.free()
    o.data.materials.append(mat(color,0.7,emit))
    return o

# ------------------------------------------------------------------- HERO
ARMORS = [0x8d6e63, 0x9e9e9e, 0xd4af37, 0x2e9c87, 0xc62828, 0x6a4fb3]

def hero_base(armor, t):
    part(12,40,7,10,0x37474f, depth=3.0)                 # legs
    part(23,40,7,10,0x37474f, depth=3.0)
    part(11,48,9,3,0x14181c, depth=3.4); part(22,48,9,3,0x14181c, depth=3.4)  # boots
    part(9,22,24,18,armor, depth=4.6)                    # torso (deeper)
    part(9,36,24,4,0x5d4037, depth=4.7)                  # belt
    part(19,36,4,4,0xc9a227, depth=4.9, emit=0.3)        # buckle
    part(4,24,6,12,armor, depth=3.4); part(32,24,6,12,armor, depth=3.4)  # arms
    part(13,8,16,13,0xf0c29a, depth=4.2)                 # head
    part(19,13,2,2,0x2b1d12, depth=4.5, y=-2.0)          # eyes
    part(24,13,2,2,0x2b1d12, depth=4.5, y=-2.0)
    if t>=1: part(12,4,18,6,armor, depth=4.4)            # helmet
    if t>=3: part(18,0,6,4,0xd32f2f, depth=3.0)          # plume
    if t>=2:                                             # shield (on left arm, forward)
        part(0,26,7,16,0x4e342e, depth=2.2, y=-2.6)
        part(2,32,3,4,0xb0bec5, depth=2.4, y=-3.0, emit=0.2)

def build_hero(t):
    armor=ARMORS[t]
    hero_base(armor,t)
    part(34,27,4,6,0x5d4037, depth=2.4, y=-1.5)          # grip
    part(33,26,6,2,0xc9a227, depth=2.6, y=-1.5, emit=0.2)  # crossguard
    part(34,33,3,3,0xc9a227, depth=2.6, y=-1.5, emit=0.2)  # pommel
    L=10+t*3
    part(38,27,L,4,0xdfe7ec, depth=2.6, y=-1.5, rough=0.25)  # blade (shiny)
    part(38+L,27,6,4,0xdfe7ec, depth=2.6, y=-1.5, rough=0.25)  # tip block (≈triangle)

def build_herox(t):
    armor=ARMORS[t]
    hero_base(armor,t)
    part(33,27,12,4,0x5d4037, depth=2.6, y=-1.5)         # stock
    part(42,20,3,18,0x6d4c41, depth=2.6, y=-1.8)         # bow arms
    part(45,21,1,16,0xeeeeee, depth=2.8, y=-2.2)         # string
    part(38,28,12,2,0xb0bec5, depth=2.8, y=-2.0, rough=0.3)  # loaded bolt

# ------------------------------------------------------------------- MONSTERS
def m_ork():
    part(10,40,7,10,0x2e4d1e); part(23,40,7,10,0x2e4d1e)
    part(6,20,28,20,0x5d8a3c, depth=4.6)
    part(4,17,8,6,0x4a7030, depth=3.4); part(28,17,8,6,0x4a7030, depth=3.4)  # shoulders
    part(11,6,18,15,0x7cb342, depth=4.4)                 # head
    part(15,10,3,3,0xffee58, depth=4.7, y=-2.0, emit=0.6); part(23,10,3,3,0xffee58, depth=4.7, y=-2.0, emit=0.6)
    part(13,15,3,5,0xffffff, depth=4.6, y=-2.2); part(24,15,3,5,0xffffff, depth=4.6, y=-2.2)  # tusks
    part(0,18,5,22,0x4e342e, depth=2.6, y=-2.0)          # club (left)

def m_skeleton():
    part(13,40,4,10,0xd7d7d7); part(23,40,4,10,0xd7d7d7)
    part(12,36,16,4,0xcfcfcf, depth=3.0)                 # pelvis
    part(18,22,4,14,0xcfcfcf, depth=3.0)                 # spine
    for yy in (23,28,33): part(11,yy,18,2,0xe5e5e5, depth=3.2)  # ribs
    part(12,5,16,14,0xefefef, depth=4.0)                 # skull
    part(15,10,4,4,0x111111, depth=4.3, y=-2.0); part(22,10,4,4,0x111111, depth=4.3, y=-2.0)  # sockets
    part(2,22,4,20,0xe0e0e0, depth=2.4, y=-2.0)          # staff (left)

def m_elf():
    part(12,40,6,10,0x14532d); part(22,40,6,10,0x14532d)
    part(10,22,20,18,0x1f7a45, depth=4.4)                # tunic
    part(10,36,20,3,0x8d6e63, depth=4.6)                 # belt
    part(13,7,15,12,0xffe0b2, depth=4.0)                 # head
    part(12,3,17,5,0xd9c04a, depth=4.2)                  # circlet
    part(16,11,2,2,0x1b5e20, depth=4.3, y=-2.0, emit=0.4); part(22,11,2,2,0x1b5e20, depth=4.3, y=-2.0, emit=0.4)
    part(2,12,3,28,0x6d4c41, depth=2.4, y=-2.0)          # bow (left)

def m_goblin():
    part(14,44,5,6,0x33691e); part(21,44,5,6,0x33691e)
    part(11,30,18,14,0x4f7a28, depth=4.0)                # body
    part(10,14,20,16,0x76a840, depth=4.4)                # big head
    part(4,18,6,4,0x76a840, depth=3.0, y=-1.0); part(30,18,6,4,0x76a840, depth=3.0, y=-1.0)  # ears
    part(14,20,3,3,0xffc107, depth=4.7, y=-2.0, emit=0.5); part(23,20,3,3,0xffc107, depth=4.7, y=-2.0, emit=0.5)
    part(2,34,8,3,0xb0bec5, depth=2.4, y=-2.0, rough=0.3)  # dagger (left)

def m_vampire():
    tri([(4,16),(36,16),(20,49)], 0x1a1a1a, depth=1.4, y=3.2)   # cape (back)
    tri([(8,18),(32,18),(20,44)], 0x38124a, depth=1.6, y=2.4)
    part(14,42,5,8,0x212121); part(22,42,5,8,0x212121)
    part(12,22,16,20,0x3c1361, depth=3.6)                # suit
    part(13,6,14,13,0xf3e5d8, depth=4.0)                 # face
    part(16,11,3,2,0xff1744, depth=4.3, y=-2.0, emit=1.2); part(21,11,3,2,0xff1744, depth=4.3, y=-2.0, emit=1.2)  # eyes

def m_demon():
    tri([(1,18),(11,8),(9,34)], 0x3a0d0d, depth=1.6, y=2.6)     # wings
    tri([(39,18),(29,8),(31,34)], 0x3a0d0d, depth=1.6, y=2.6)
    part(11,40,7,10,0x6d1b1b); part(22,40,7,10,0x6d1b1b)
    part(8,20,24,20,0xb42222, depth=4.6)                 # torso
    part(12,6,16,13,0xcf3030, depth=4.2)                 # head
    tri([(12,6),(16,6),(13,0)], 0x2d1b12, depth=2.6)     # horns
    tri([(24,6),(28,6),(27,0)], 0x2d1b12, depth=2.6)
    part(15,10,3,3,0xffee58, depth=4.5, y=-2.0, emit=0.9); part(22,10,3,3,0xffee58, depth=4.5, y=-2.0, emit=0.9)

MONSTERS = {'ork':m_ork,'skeleton':m_skeleton,'elf':m_elf,'goblin':m_goblin,'vampire':m_vampire,'demon':m_demon}

def render(name):
    _mats.clear()
    if name.startswith('hero'):
        base=name[4:]
        if base.endswith('x'):
            t=int(base[:-1]); reset(58); build_herox(t)
        else:
            t=int(base); reset(60+t*3); build_hero(t)
        fname = name + ".png"
    else:
        reset(40); MONSTERS[name](); fname = "en_" + name + ".png"
    bpy.context.scene.render.filepath=os.path.join(ASSETS, fname)
    bpy.ops.render.render(write_still=True)
    print("WROTE", fname)

def all_names():
    names=[]
    for t in range(6): names.append('hero%d'%t); names.append('hero%dx'%t)
    names += list(MONSTERS.keys())
    return names

def main():
    argv=sys.argv; args=argv[argv.index("--")+1:] if "--" in argv else []
    todo = args if args else all_names()
    os.makedirs(ASSETS, exist_ok=True)
    for n in todo: render(n)
    print("ALL_DONE")

main()
