# gen_chars.py — Blender pixel-art CHARACTERS (transparent PNGs), v3: Minecraft-
# style voxel look. v2's soft AO + specular + split-limb double-outline seams
# were downscaling into smudgy "stain" patches; v3 fixes that by going FLAT:
# no ambient occlusion, no bevel, no specular, no gradient overlay bands — every
# limb/weapon/wing is a stack of solid-color axis-aligned boxes with ONE crisp
# outline per group (no internal seams). Same keys/sizes, alignment unchanged:
#   hero{t}   -> (60+t*3) x 52   sword variant, faces right
#   hero{t}x  -> 58 x 52         crossbow variant
#   en_{key}  -> 40 x 52         monster, faces left
#
# Run: blender --background --factory-startup --python blender/gen_chars.py -- [what]

import bpy, sys, os, math

HERE = os.path.dirname(os.path.abspath(__file__))
# blender --python runs the script with its own folder OFF sys.path
if HERE not in sys.path:
    sys.path.insert(0, HERE)
import pixelart

ASSETS = os.path.normpath(os.path.join(HERE, "..", "assets"))
S = 0.1
PXH = 52
OUT = 0x0e1216

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
    sc.render.filter_size = 1.0        # minimal blur — flat cube faces need no softening
    try:
        sc.eevee.taa_render_samples = 32
        sc.eevee.use_gtao = False      # NO ambient occlusion — it was the main "stain" source
    except Exception: pass
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_mode = 'RGBA'
    sc.view_settings.view_transform = 'Standard'
    cam = bpy.data.objects.new("Cam", bpy.data.cameras.new("Cam"))
    cam.data.type = 'ORTHO'; cam.data.ortho_scale = canvasW * S
    cam.location = (canvasW*S/2, -60, PXH*S/2); cam.rotation_euler = (math.radians(90),0,0)
    bpy.context.collection.objects.link(cam); sc.camera = cam
    # use_shadow=False on both: forward-pulled held items (club/dagger/bow/staff,
    # y<0) were casting angled shadows onto the body behind them, which downscaled
    # into exactly the blurry dark "soot" blobs reported on the characters.
    d = bpy.data.lights.new("key",'SUN'); d.energy=3.2; d.angle=math.radians(4); d.use_shadow=False
    o = bpy.data.objects.new("key",d); o.rotation_euler=(math.radians(52),0,math.radians(28))
    bpy.context.collection.objects.link(o)
    rim = bpy.data.lights.new("rim",'SUN'); rim.energy=2.0; rim.color=(0.7,0.8,1.0); rim.angle=math.radians(4); rim.use_shadow=False
    ro = bpy.data.objects.new("rim",rim); ro.rotation_euler=(math.radians(70),0,math.radians(200))
    bpy.context.collection.objects.link(ro)
    w = bpy.data.worlds.new("W"); w.use_nodes=True
    w.node_tree.nodes.get("Background").inputs[1].default_value = 0.55
    sc.world = w

def wx(px): return px*S
def wz(py): return (PXH-py)*S

_mats = {}
def mat(color):
    if color in _mats: return _mats[color]
    m=bpy.data.materials.new("m"); m.use_nodes=True
    nt=m.node_tree; nt.nodes.clear()
    out=nt.nodes.new("ShaderNodeOutputMaterial")
    b=nt.nodes.new("ShaderNodeBsdfPrincipled")
    b.inputs["Base Color"].default_value=hx(color)
    b.inputs["Roughness"].default_value=1.0        # fully matte — no specular hotspots
    if "Specular IOR Level" in b.inputs: b.inputs["Specular IOR Level"].default_value=0.0
    nt.links.new(b.outputs[0],out.inputs[0])
    _mats[color]=m; return m

def _cube(cx,y,cz,sx,sy,sz,color):
    bpy.ops.mesh.primitive_cube_add(location=(cx,y,cz))
    o=bpy.context.active_object; o.scale=(sx,sy,sz)
    o.data.materials.append(mat(color))
    return o

def part(px, py, w, h, color, depth=3.2, y=0.0, outline=True, ow=1.0):
    """One flat-colored voxel box in PIXEL space, sharp edges (no bevel). With
    outline=True it gets its own 1px dark shell — use outline=False for pieces
    inside a stack() group (which draws ONE shell around the whole group) or
    for tiny flat details (eyes) that shouldn't get a halo."""
    cx=wx(px+w/2.0); cz=wz(py+h/2.0)
    if outline:
        _cube(cx, y+0.05, cz, (w+2*ow)*S/2.0, (depth+0.2)*S/2.0, (h+2*ow)*S/2.0, OUT)
    return _cube(cx, y, cz, w*S/2.0, depth*S/2.0, h*S/2.0, color)

def stack(px, py, w, segs, depth, y=0.0, ow=1.0):
    """A limb as layered solid blocks (e.g. pauldron/sleeve/glove) with exactly
    ONE outline shell around the full stack — avoids the seam-blur that
    per-segment outlines caused when downscaled."""
    total = sum(h for h,_ in segs)
    cx=wx(px+w/2.0); cz=wz(py+total/2.0)
    _cube(cx, y+0.05, cz, (w+2*ow)*S/2.0, (depth+0.2)*S/2.0, (total+2*ow)*S/2.0, OUT)
    yy = py
    for h, color in segs:
        part(px, yy, w, h, color, depth=depth, y=y, outline=False)
        yy += h

def stair(px, py, w, h, color, y=0.0, depth=3.0, mirror=False, steps=4, flip=False):
    """A blocky pixel-wedge from stacked shrinking rows — voxel wings/horns
    instead of a smooth mesh. flip=True widens toward the bottom (horns);
    default widens toward the top (wings hanging from the shoulder)."""
    rows = max(1, h // steps)
    for i in range(steps):
        remaining = h - i*rows
        if remaining <= 0: break
        rh = rows if i < steps-1 else remaining
        frac = (i/steps) if flip else (1 - i/steps)
        rw = max(1, round(w*frac))
        ox = (w-rw) if mirror else 0
        part(px+ox, py+i*rows, rw, rh, color, depth=depth, y=y)

# ------------------------------------------------------------------- HERO
ARMORS = [0x8d6e63, 0x9e9e9e, 0xd4af37, 0x2e9c87, 0xc62828, 0x6a4fb3]
SKIN = 0xf0c29a

def hero_base(armor, t):
    stack(12,38,7,[(5,shade(armor,0.65)),(5,0x37474f),(3,0x14181c)], 3.2)  # thigh/shin/boot
    stack(23,38,7,[(5,shade(armor,0.65)),(5,0x37474f),(3,0x14181c)], 3.2)
    part(9,22,24,18,armor, depth=4.6)                    # torso
    part(17,24,8,6,shade(armor,1.4), depth=4.65, y=-2.4, outline=False)  # chest emblem accent
    part(9,36,24,4,0x5d4037, depth=4.75)                 # belt (forward, avoids z-fight)
    part(19,36,4,4,0xc9a227, depth=4.9)                  # buckle
    stack(3,23,6,[(3,shade(armor,1.15)),(5,armor),(5,shade(armor,0.8)),(2,SKIN)], 3.4)  # pauldron/arm/forearm/hand
    stack(32,23,6,[(3,shade(armor,1.15)),(5,armor),(5,shade(armor,0.8)),(2,SKIN)], 3.4)
    part(13,8,16,13,SKIN, depth=4.2)                     # head
    part(19,13,2,2,0x2b1d12, depth=4.5, y=-2.0, outline=False)  # eyes
    part(24,13,2,2,0x2b1d12, depth=4.5, y=-2.0, outline=False)
    if t>=1: part(12,4,18,6,armor, depth=4.4)            # helmet
    if t>=3: part(18,0,6,4,0xd32f2f, depth=3.0)          # plume
    if t>=2:
        part(0,26,7,16,0x4e342e, depth=2.2, y=-2.6)          # shield
        part(2,32,3,4,0xb0bec5, depth=2.4, y=-3.0, outline=False)

def build_hero(t):
    hero_base(ARMORS[t],t)
    part(34,27,4,6,0x5d4037, depth=2.4, y=-1.5)          # grip
    part(33,26,6,2,0xc9a227, depth=2.6, y=-1.5)          # crossguard
    part(34,33,3,3,0xc9a227, depth=2.6, y=-1.5)          # pommel
    L=10+t*3
    part(38,27,L,4,0xdfe7ec, depth=2.6, y=-1.5)          # blade
    part(38+L,27,6,4,0xdfe7ec, depth=2.6, y=-1.5)        # tip block

def build_herox(t):
    hero_base(ARMORS[t],t)
    part(33,27,12,4,0x5d4037, depth=2.6, y=-1.5)         # stock
    part(42,20,3,18,0x6d4c41, depth=2.6, y=-1.8)         # bow arms
    part(45,21,1,16,0xeeeeee, depth=2.8, y=-2.2, outline=False)  # string
    part(38,28,12,2,0xb0bec5, depth=2.8, y=-2.0)         # loaded bolt

# ------------------------------------------------------------------- MONSTERS
def m_ork():
    stack(10,38,7,[(4,shade(0x2e4d1e,1.1)),(4,0x14181c)], 3.4)
    stack(23,38,7,[(4,shade(0x2e4d1e,1.1)),(4,0x14181c)], 3.4)
    part(6,20,28,20,0x5d8a3c, depth=4.6)                 # body
    stack(0,20,6,[(4,shade(0x4a7030,1.15)),(10,0x4a7030)], 3.0)   # left arm — flush with body, 0px overlap
    stack(34,20,6,[(4,shade(0x4a7030,1.15)),(10,0x4a7030)], 3.0)  # right arm — flush with body, 0px overlap
    part(11,6,18,14,0x7cb342, depth=4.4)                 # head — 1px shorter, flush with body (0px overlap)
    part(15,10,3,3,0xffee58, depth=4.7, y=-2.0, outline=False)
    part(23,10,3,3,0xffee58, depth=4.7, y=-2.0, outline=False)
    part(13,15,3,5,0xffffff, depth=4.6, y=-2.2, outline=False)  # tusks
    part(24,15,3,5,0xffffff, depth=4.6, y=-2.2, outline=False)
    part(10,26,20,3,shade(0x5d8a3c,1.5), depth=4.65, y=-2.4, outline=False)  # chest strap accent (pulled forward, no overlap risk)
    part(0,30,5,20,0x4e342e, depth=2.6, y=-2.0)          # club

def m_skeleton():
    part(13,40,4,10,0xd7d7d7); part(23,40,4,10,0xd7d7d7)  # leg bones
    part(12,36,16,4,0xcfcfcf, depth=3.0)                  # pelvis
    part(18,22,4,14,0xcfcfcf, depth=3.0)                  # spine
    for yy in (23,28,33): part(11,yy,18,2,0xe5e5e5, depth=3.2)  # ribs
    part(7,24,3,16,0xd7d7d7, depth=2.6)                   # left arm bone — flush, 0px overlap with ribs
    part(30,24,3,16,0xd7d7d7, depth=2.6)                  # right arm bone — flush, 0px overlap with ribs
    part(12,5,16,14,0xefefef, depth=4.0)                  # skull
    part(15,10,4,4,0x111111, depth=4.3, y=-2.0, outline=False)
    part(22,10,4,4,0x111111, depth=4.3, y=-2.0, outline=False)
    part(2,22,4,20,0xe0e0e0, depth=2.4, y=-2.0)           # staff

def m_elf():
    stack(12,38,6,[(6,shade(0x14532d,1.1)),(4,0x8d6e63)], 3.6)
    stack(22,38,6,[(6,shade(0x14532d,1.1)),(4,0x8d6e63)], 3.6)
    part(10,22,20,18,0x1f7a45, depth=4.4)                 # tunic
    part(10,36,20,3,0x8d6e63, depth=4.55)                 # belt
    stack(5,23,5,[(3,shade(0x1f7a45,1.15)),(12,0x1f7a45)], 3.0)   # left arm — flush, 0px overlap
    stack(30,23,5,[(3,shade(0x1f7a45,1.15)),(12,0x1f7a45)], 3.0)  # right arm — flush, 0px overlap
    part(13,7,15,12,0xffe0b2, depth=4.0)                  # head
    part(12,3,17,4,0xd9c04a, depth=4.2)                   # circlet — 1px shorter, flush with head (0px overlap)
    part(12,26,16,2,shade(0x1f7a45,1.5), depth=4.45, y=-2.4, outline=False)  # sash accent (pulled forward)
    part(16,11,2,2,0x1b5e20, depth=4.3, y=-2.0, outline=False)
    part(22,11,2,2,0x1b5e20, depth=4.3, y=-2.0, outline=False)
    part(2,12,3,28,0x6d4c41, depth=2.4, y=-2.0)           # bow

def m_goblin():
    stack(14,44,5,[(4,shade(0x33691e,1.1)),(2,0x14181c)], 3.2)
    stack(21,44,5,[(4,shade(0x33691e,1.1)),(2,0x14181c)], 3.2)
    part(11,30,18,14,0x4f7a28, depth=4.0)                 # body
    part(10,14,20,16,0x76a840, depth=4.4)                 # head
    part(4,18,6,4,0x76a840, depth=3.0, y=-1.0); part(30,18,6,4,0x76a840, depth=3.0, y=-1.0)  # ears
    part(6,30,5,12,0x4f7a28, depth=3.0)                   # left arm
    part(29,30,5,12,0x4f7a28, depth=3.0)                  # right arm
    part(14,20,3,3,0xffc107, depth=4.7, y=-2.0, outline=False)
    part(23,20,3,3,0xffc107, depth=4.7, y=-2.0, outline=False)
    part(2,34,8,3,0xb0bec5, depth=2.4, y=-2.0)            # dagger

def m_vampire():
    stair(2,16,36,32,0x1a1a1a, depth=1.4, y=3.3, steps=6)     # cape backing
    stair(6,19,28,24,0x38124a, depth=1.6, y=2.5, steps=5)     # cape inner
    part(14,42,5,8,0x212121); part(22,42,5,8,0x212121)        # boots
    part(12,22,16,20,0x3c1361, depth=3.6)                     # suit
    part(8,23,4,16,shade(0x212121,1.2), depth=2.8)            # left arm
    part(24,23,4,16,shade(0x212121,1.2), depth=2.8)           # right arm
    part(13,6,14,13,0xf3e5d8, depth=4.0)                      # face
    part(16,11,3,2,0xff1744, depth=4.3, y=-2.0, outline=False)
    part(21,11,3,2,0xff1744, depth=4.3, y=-2.0, outline=False)

def m_demon():
    stair(0,10,12,26,0x3a0d0d, mirror=True, steps=5, depth=1.6, y=2.6)   # left wing
    stair(28,10,12,26,0x3a0d0d, steps=5, depth=1.6, y=2.6)               # right wing
    part(11,40,7,10,0x6d1b1b); part(22,40,7,10,0x6d1b1b)      # legs
    part(8,20,24,20,0xb42222, depth=4.6)                       # torso
    part(4,22,4,16,shade(0xb42222,0.9), depth=3.0)             # left arm — flush, 0px overlap
    part(32,22,4,16,shade(0xb42222,0.9), depth=3.0)            # right arm — flush, 0px overlap
    part(12,6,16,13,0xcf3030, depth=4.2)                       # head
    stair(11,2,6,6,0x2d1b12, steps=3, depth=2.6, flip=True)    # left horn
    stair(23,2,6,6,0x2d1b12, mirror=True, steps=3, depth=2.6, flip=True)  # right horn
    part(15,10,3,3,0xffee58, depth=4.5, y=-2.0, outline=False)
    part(22,10,3,3,0xffee58, depth=4.5, y=-2.0, outline=False)

MONSTERS = {'ork':m_ork,'skeleton':m_skeleton,'elf':m_elf,'goblin':m_goblin,'vampire':m_vampire,'demon':m_demon}

# --------------------------------------------------------------------- BOSS
# One "boss" variant per monster type: the same body plus a gold crown/accent,
# rendered at the same 40x52 canvas as the regular monster (the game already
# scales bosses 2.6x with NEAREST filtering, so bigger chunky voxels read as
# a mega-sized boss — no need for a separate larger canvas).
GOLD = 0xc9a227

def crown(px, top, w):
    top = max(1, top)
    part(px, top, w, 3, GOLD, depth=4.9)                  # band
    step = max(1, w // 4)
    for i in range(1, 4):
        part(px + i*step - 1, max(1, top-3), 2, 3, GOLD, depth=4.7)  # spikes

def boss_ork():
    m_ork(); crown(10, 1, 20)

def boss_skeleton():
    m_skeleton(); crown(11, 1, 18)

def boss_elf():
    m_elf(); part(12, 1, 17, 3, 0xffd700, depth=4.3)      # brighter/bigger circlet

def boss_goblin():
    m_goblin(); crown(9, 9, 22)

def boss_vampire():
    m_vampire(); crown(12, 1, 16)

def boss_demon():
    m_demon()
    part(12, 1, 4, 3, GOLD, depth=2.8)                    # gold-tipped horns
    part(24, 1, 4, 3, GOLD, depth=2.8)

BOSSES = {'ork':boss_ork,'skeleton':boss_skeleton,'elf':boss_elf,'goblin':boss_goblin,'vampire':boss_vampire,'demon':boss_demon}

def downscale(src, dst, w, h):
    # The plain box mean this used to be left a dark rim on every silhouette
    # (premultiplied buffer, straight average), soft half-transparent edges, and
    # a few hundred colours per sprite. pixelart.pixelize fixes all three — see
    # the header of blender/pixelart.py. No outline: the models carry their own.
    pixelart.process_file(bpy, src, dst, w, h, alpha_threshold=0.5)

def render(name):
    _mats.clear()
    if name.startswith('hero'):
        base=name[4:]
        if base.endswith('x'):
            t=int(base[:-1]); reset(58); build_herox(t); w=58
        else:
            t=int(base); reset(60+t*3); build_hero(t); w=60+t*3
        fname = name + ".png"
    elif name.endswith('_boss'):
        mtype = name[:-5]
        reset(40); BOSSES[mtype](); fname = "en_" + name + ".png"; w=40
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
    names += [k+'_boss' for k in BOSSES.keys()]
    return names

def main():
    argv=sys.argv; args=argv[argv.index("--")+1:] if "--" in argv else []
    todo = args if args else all_names()
    os.makedirs(ASSETS, exist_ok=True)
    for n in todo: render(n)
    print("ALL_DONE")

main()
