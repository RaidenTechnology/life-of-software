# gen_chars.py — Blender pixel-art CHARACTERS (transparent PNGs), v2: crisper
# silhouette + more anatomical detail than v1. Same keys/sizes as
# Battle.makeTextures() so alignment/gameplay never changes:
#   hero{t}   -> (60+t*3) x 52   sword variant, faces right
#   hero{t}x  -> 58 x 52         crossbow variant
#   en_{key}  -> 40 x 52         monster, faces left
#
# v2 additions: every structural part() gets a 1px dark pixel-outline (matches
# the game's original 2D art language, reads crisp at small sizes); arms/legs
# split into upper/lower segments with shading; rounded shoulders + hands via
# spheres; brow/jaw shading for facial read.
#
# Run: blender --background --factory-startup --python blender/gen_chars.py -- [what]

import bpy, sys, os, math, bmesh

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.normpath(os.path.join(HERE, "..", "assets"))
S = 0.1
PXH = 52
OUT = 0x0e1216   # pixel-outline color, matches the 2D placeholder art

def hx(v):
    r=((v>>16)&255)/255.0; g=((v>>8)&255)/255.0; b=(v&255)/255.0
    def lin(c): return c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4
    return (lin(r),lin(g),lin(b),1.0)

def shade(c, f):
    r=min(255,int(((c>>16)&255)*f)); g=min(255,int(((c>>8)&255)*f)); b=min(255,int((c&255)*f))
    return (r<<16)|(g<<8)|b

SS = 3
def reset(canvasW):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = 'BLENDER_EEVEE'
    sc.render.resolution_x = canvasW * SS; sc.render.resolution_y = PXH * SS
    sc.render.film_transparent = True
    sc.render.filter_size = 1.3
    try:
        sc.eevee.taa_render_samples = 48
        sc.eevee.use_gtao = True
    except Exception: pass
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_mode = 'RGBA'
    sc.view_settings.view_transform = 'Standard'
    cam = bpy.data.objects.new("Cam", bpy.data.cameras.new("Cam"))
    cam.data.type = 'ORTHO'; cam.data.ortho_scale = canvasW * S
    cam.location = (canvasW*S/2, -60, PXH*S/2); cam.rotation_euler = (math.radians(90),0,0)
    bpy.context.collection.objects.link(cam); sc.camera = cam
    d = bpy.data.lights.new("key",'SUN'); d.energy=3.4; d.angle=math.radians(12)
    o = bpy.data.objects.new("key",d); o.rotation_euler=(math.radians(52),0,math.radians(28))
    bpy.context.collection.objects.link(o)
    rim = bpy.data.lights.new("rim",'SUN'); rim.energy=2.6; rim.color=(0.65,0.78,1.0); rim.angle=math.radians(10)
    ro = bpy.data.objects.new("rim",rim); ro.rotation_euler=(math.radians(70),0,math.radians(200))
    bpy.context.collection.objects.link(ro)
    w = bpy.data.worlds.new("W"); w.use_nodes=True
    w.node_tree.nodes.get("Background").inputs[1].default_value = 0.5
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

def _cube(cx,y,cz,sx,sy,sz,color,rough=0.75,emit=0.0,bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(location=(cx,y,cz))
    o=bpy.context.active_object; o.scale=(sx,sy,sz)
    o.data.materials.append(mat(color,rough,emit))
    if bevel>0:
        m=o.modifiers.new("b",'BEVEL'); m.width=bevel; m.segments=2; m.limit_method='NONE'
    return o

def part(px, py, w, h, color, depth=3.2, y=0.0, bevel=0.05, rough=0.75, emit=0.0, outline=True, ow=1.0):
    """A body-part box in PIXEL space, with an optional 1px dark outline shell
    (pushed slightly back in Y) — the same crisp-silhouette trick the game's
    2D placeholder art used, so limbs/gear read clearly at tiny sizes."""
    cx=wx(px+w/2.0); cz=wz(py+h/2.0)
    if outline:
        _cube(cx, y+0.06, cz, (w+2*ow)*S/2.0, (depth+0.3)*S/2.0, (h+2*ow)*S/2.0, OUT, 1.0)
    return _cube(cx, y, cz, w*S/2.0, depth*S/2.0, h*S/2.0, color, rough, emit, bevel)

def sph(px, py, r, color, y=0.0, emit=0.0, flat=1.0, rough=0.6):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=r*S, location=(wx(px),y,wz(py)))
    o=bpy.context.active_object
    if flat!=1.0: o.scale=(1,flat,1)
    o.data.materials.append(mat(color,rough,emit))
    return o

def _tri_mesh(pts, color, depth, y, emit, rough=0.7):
    me=bpy.data.meshes.new("t"); o=bpy.data.objects.new("t",me)
    bpy.context.collection.objects.link(o)
    bm=bmesh.new()
    vs=[bm.verts.new((wx(px), y-depth*S/2, wz(py))) for px,py in pts]
    vs2=[bm.verts.new((wx(px), y+depth*S/2, wz(py))) for px,py in pts]
    bm.faces.new(vs); bm.faces.new(list(reversed(vs2)))
    for i in range(3):
        j=(i+1)%3
        bm.faces.new([vs[i],vs[j],vs2[j],vs2[i]])
    bm.normal_update(); bm.to_mesh(me); bm.free()
    o.data.materials.append(mat(color,rough,emit))
    return o

def tri(pts, color, depth=2.0, y=0.0, emit=0.0, outline=True):
    if outline:
        cx=sum(p[0] for p in pts)/3.0; cy=sum(p[1] for p in pts)/3.0
        big=[(cx+(px-cx)*1.16, cy+(py-cy)*1.16) for px,py in pts]
        _tri_mesh(big, OUT, depth+0.3, y+0.06, 1.0)
    return _tri_mesh(pts, color, depth, y, emit)

# ------------------------------------------------------------------- HERO
ARMORS = [0x8d6e63, 0x9e9e9e, 0xd4af37, 0x2e9c87, 0xc62828, 0x6a4fb3]
SKIN = 0xf0c29a

def limb(px, py, w, hi, lo, color, depth, y=0.0, split=0.5):
    """A two-tone limb segment (upper lighter, lower shaded) — one call instead
    of two, reads as a joint (shoulder/elbow, hip/knee) without extra geometry."""
    sh = round(hi*split)
    part(px, py, w, sh, color, depth=depth, y=y)
    part(px, py+sh, w, hi-sh+lo, shade(color,0.78), depth=depth, y=y)

def hero_base(armor, t):
    # legs: thigh (armor-shaded greave) -> shin -> boot
    limb(12,38,7,7,5,shade(armor,0.55), 3.2)
    limb(23,38,7,7,5,shade(armor,0.55), 3.2)
    part(11,48,9,3,0x14181c, depth=3.6); part(22,48,9,3,0x14181c, depth=3.6)  # boots
    part(9,22,24,18,armor, depth=4.6)                    # torso
    part(9,25,24,3,shade(armor,1.3), depth=4.65, outline=False)  # chest highlight band
    part(9,36,24,4,0x5d4037, depth=4.7)                  # belt
    part(19,36,4,4,0xc9a227, depth=4.9, emit=0.3)        # buckle
    # arms: shoulder pauldron (sphere) -> upper -> forearm -> hand
    sph(4,25,4.5,armor, y=-1.0); sph(35,25,4.5,armor, y=-1.0)
    limb(3,27,6,6,6,armor, 3.4)
    limb(32,27,6,6,6,armor, 3.4)
    sph(6,39,3.4,SKIN, y=-1.6); sph(35,39,3.4,SKIN, y=-1.6)   # hands
    # head + face
    part(13,8,16,13,SKIN, depth=4.2)                     # head
    part(14,10,14,2,shade(SKIN,0.82), depth=4.4, y=-1.6, outline=False)  # brow shadow
    part(19,13,2,2,0x2b1d12, depth=4.5, y=-2.0, outline=False)  # eyes
    part(24,13,2,2,0x2b1d12, depth=4.5, y=-2.0, outline=False)
    part(19,13,1,1,0xffffff, depth=4.7, y=-2.4, emit=0.4, outline=False)  # eye glints
    part(24,13,1,1,0xffffff, depth=4.7, y=-2.4, emit=0.4, outline=False)
    part(19,17,6,1,shade(SKIN,0.75), depth=4.4, y=-1.6, outline=False)   # jaw shadow
    part(11,10,2,4,shade(SKIN,0.9), depth=4.0, outline=False)  # ear
    if t>=1: part(12,4,18,6,armor, depth=4.4)            # helmet
    if t>=3: part(18,0,6,4,0xd32f2f, depth=3.0)          # plume
    if t>=2:                                             # shield (left arm, forward)
        part(0,26,7,16,0x4e342e, depth=2.2, y=-2.6)
        part(2,32,3,4,0xb0bec5, depth=2.4, y=-3.0, emit=0.2, outline=False)

def build_hero(t):
    armor=ARMORS[t]
    hero_base(armor,t)
    part(34,27,4,6,0x5d4037, depth=2.4, y=-1.5)
    part(33,26,6,2,0xc9a227, depth=2.6, y=-1.5, emit=0.2)
    part(34,33,3,3,0xc9a227, depth=2.6, y=-1.5, emit=0.2)
    L=10+t*3
    part(38,27,L,4,0xdfe7ec, depth=2.6, y=-1.5, rough=0.2)
    part(38,27,L,1,0xffffff, depth=2.7, y=-1.5, rough=0.15, outline=False)  # edge shine
    part(38+L,27,6,4,0xdfe7ec, depth=2.6, y=-1.5, rough=0.2)

def build_herox(t):
    armor=ARMORS[t]
    hero_base(armor,t)
    part(33,27,12,4,0x5d4037, depth=2.6, y=-1.5)
    part(42,20,3,18,0x6d4c41, depth=2.6, y=-1.8)
    part(45,21,1,16,0xeeeeee, depth=2.8, y=-2.2, outline=False)
    part(38,28,12,2,0xb0bec5, depth=2.8, y=-2.0, rough=0.3)

# ------------------------------------------------------------------- MONSTERS
def m_ork():
    limb(10,38,7,6,4,shade(0x2e4d1e,1.1), 3.4); limb(23,38,7,6,4,shade(0x2e4d1e,1.1), 3.4)
    part(6,20,28,20,0x5d8a3c, depth=4.6)
    part(6,22,28,3,shade(0x5d8a3c,1.25), depth=4.65, outline=False)  # belly highlight
    sph(4,20,4.5,0x4a7030, y=-1.0); sph(32,20,4.5,0x4a7030, y=-1.0)  # shoulders
    part(11,6,18,15,0x7cb342, depth=4.4)                 # head
    part(15,10,3,3,0xffee58, depth=4.7, y=-2.0, emit=0.6, outline=False)
    part(23,10,3,3,0xffee58, depth=4.7, y=-2.0, emit=0.6, outline=False)
    part(13,15,3,5,0xffffff, depth=4.6, y=-2.2, outline=False)
    part(24,15,3,5,0xffffff, depth=4.6, y=-2.2, outline=False)
    part(15,18,10,1,shade(0x7cb342,0.7), depth=4.5, y=-1.6, outline=False)  # jaw shadow
    part(0,18,5,22,0x4e342e, depth=2.6, y=-2.0)          # club

def m_skeleton():
    part(13,40,4,10,0xd7d7d7); part(23,40,4,10,0xd7d7d7)
    part(12,36,16,4,0xcfcfcf, depth=3.0)
    part(18,22,4,14,0xcfcfcf, depth=3.0)
    for yy in (23,28,33): part(11,yy,18,2,0xe5e5e5, depth=3.2)
    sph(11,24,3,0xcfcfcf, y=-1.0); sph(29,24,3,0xcfcfcf, y=-1.0)  # shoulder joints
    part(12,5,16,14,0xefefef, depth=4.0)
    part(15,10,4,4,0x111111, depth=4.3, y=-2.0, outline=False)
    part(22,10,4,4,0x111111, depth=4.3, y=-2.0, outline=False)
    part(15,10,2,2,0x8fd6ff, depth=4.6, y=-2.6, emit=0.8, outline=False)  # eye glow
    part(22,10,2,2,0x8fd6ff, depth=4.6, y=-2.6, emit=0.8, outline=False)
    part(17,17,6,1,0x9e9e9e, depth=4.2, y=-1.6, outline=False)  # jaw
    part(2,22,4,20,0xe0e0e0, depth=2.4, y=-2.0)          # staff

def m_elf():
    limb(12,38,6,7,3,shade(0x14532d,1.15), 3.6); limb(22,38,6,7,3,shade(0x14532d,1.15), 3.6)
    part(10,22,20,18,0x1f7a45, depth=4.4)
    part(10,36,20,3,0x8d6e63, depth=4.6)
    sph(10,23,3.5,0x1f7a45, y=-0.8); sph(30,23,3.5,0x1f7a45, y=-0.8)
    part(13,7,15,12,0xffe0b2, depth=4.0)
    part(14,9,13,2,shade(0xffe0b2,0.85), depth=4.2, y=-1.4, outline=False)  # brow
    part(12,3,17,5,0xd9c04a, depth=4.2)
    part(16,11,2,2,0x1b5e20, depth=4.3, y=-2.0, emit=0.4, outline=False)
    part(22,11,2,2,0x1b5e20, depth=4.3, y=-2.0, emit=0.4, outline=False)
    part(9,11,3,2,0xffe0b2, depth=3.8, outline=False)     # pointed ear hint
    part(2,12,3,28,0x6d4c41, depth=2.4, y=-2.0)           # bow

def m_goblin():
    limb(14,44,5,4,2,shade(0x33691e,1.15), 3.2); limb(21,44,5,4,2,shade(0x33691e,1.15), 3.2)
    part(11,30,18,14,0x4f7a28, depth=4.0)
    part(10,14,20,16,0x76a840, depth=4.4)
    part(4,18,6,4,0x76a840, depth=3.0, y=-1.0); part(30,18,6,4,0x76a840, depth=3.0, y=-1.0)  # ears
    part(14,20,3,3,0xffc107, depth=4.7, y=-2.0, emit=0.5, outline=False)
    part(23,20,3,3,0xffc107, depth=4.7, y=-2.0, emit=0.5, outline=False)
    part(16,26,8,1,shade(0x76a840,0.65), depth=4.5, y=-1.6, outline=False)  # grin shadow
    part(2,34,8,3,0xb0bec5, depth=2.4, y=-2.0, rough=0.3)  # dagger

def m_vampire():
    tri([(4,16),(36,16),(20,49)], 0x1a1a1a, depth=1.4, y=3.2)
    tri([(8,18),(32,18),(20,44)], 0x38124a, depth=1.6, y=2.4)
    limb(14,40,5,5,3,shade(0x212121,1.3), 2.8); limb(22,40,5,5,3,shade(0x212121,1.3), 2.8)
    part(12,22,16,20,0x3c1361, depth=3.6)
    part(12,24,16,3,shade(0x3c1361,1.35), depth=3.7, outline=False)  # satin sheen
    part(13,6,14,13,0xf3e5d8, depth=4.0)
    part(14,8,12,2,shade(0xf3e5d8,0.85), depth=4.2, y=-1.4, outline=False)  # brow
    part(16,11,3,2,0xff1744, depth=4.3, y=-2.0, emit=1.2, outline=False)
    part(21,11,3,2,0xff1744, depth=4.3, y=-2.0, emit=1.2, outline=False)
    part(18,15,1,2,0xffffff, depth=4.2, y=-1.8, outline=False)  # fang
    part(21,15,1,2,0xffffff, depth=4.2, y=-1.8, outline=False)

def m_demon():
    tri([(1,18),(11,8),(9,34)], 0x3a0d0d, depth=1.6, y=2.6)
    tri([(39,18),(29,8),(31,34)], 0x3a0d0d, depth=1.6, y=2.6)
    limb(11,40,7,6,4,shade(0x6d1b1b,1.2), 3.4); limb(22,40,7,6,4,shade(0x6d1b1b,1.2), 3.4)
    part(8,20,24,20,0xb42222, depth=4.6)
    part(8,22,24,3,shade(0xb42222,1.25), depth=4.65, outline=False)  # chest highlight
    sph(6,20,4.5,0xb42222, y=-1.0); sph(34,20,4.5,0xb42222, y=-1.0)  # shoulders
    part(12,6,16,13,0xcf3030, depth=4.2)
    tri([(12,6),(16,6),(13,0)], 0x2d1b12, depth=2.6)
    tri([(24,6),(28,6),(27,0)], 0x2d1b12, depth=2.6)
    part(15,10,3,3,0xffee58, depth=4.5, y=-2.0, emit=0.9, outline=False)
    part(22,10,3,3,0xffee58, depth=4.5, y=-2.0, emit=0.9, outline=False)
    part(17,17,6,1,shade(0xcf3030,0.7), depth=4.4, y=-1.6, outline=False)  # jaw shadow

MONSTERS = {'ork':m_ork,'skeleton':m_skeleton,'elf':m_elf,'goblin':m_goblin,'vampire':m_vampire,'demon':m_demon}

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
    if name.startswith('hero'):
        base=name[4:]
        if base.endswith('x'):
            t=int(base[:-1]); reset(58); build_herox(t); w=58
        else:
            t=int(base); reset(60+t*3); build_hero(t); w=60+t*3
        fname = name + ".png"
    else:
        reset(40); MONSTERS[name](); fname = "en_" + name + ".png"; w=40
    dst = os.path.join(ASSETS, fname)
    tmp = dst + ".ss.png"
    bpy.context.scene.render.filepath = tmp
    bpy.ops.render.render(write_still=True)
    downscale(tmp, dst, w, PXH)
    try: os.remove(tmp)
    except Exception: pass
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
