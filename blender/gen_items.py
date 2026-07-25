# gen_items.py — Blender pixel-art LOOT ICONS (it_sword/armor/potion/scroll/
# treasure, 22x22 transparent PNGs), same flat-voxel language as gen_chars.py
# (no AO, no bevel, no specular, one outline shell per shape) so drops/bag/shop
# match the rest of the Blender art. Self-contained script (small, standalone).
#
# Run: blender --background --factory-startup --python blender/gen_items.py -- [name]

import bpy, sys, os, math

HERE = os.path.dirname(os.path.abspath(__file__))
if HERE not in sys.path:
    sys.path.insert(0, HERE)   # blender --python doesn't add the script's folder
import pixelart
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
    # EEVEE's engine identifier changed across releases ('BLENDER_EEVEE' ->
    # 'BLENDER_EEVEE_NEXT' in 4.2, back again in 5.x). Assigning an unknown one
    # raises, which would kill the batch on a machine with a different Blender
    # than the artist's. Try each, keep whatever sticks.
    for _eng in ('BLENDER_EEVEE', 'BLENDER_EEVEE_NEXT'):
        try:
            sc.render.engine = _eng
            break
        except Exception:
            pass
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
def wz(py): return (PX-py)*S

_mats = {}
def mat(color, emit=0.0):
    # Keyed on (color, emit): the cache used to be colour-only, which was fine
    # while every material was flat. The gems reuse the SAME hex at two glow
    # levels (a lit table facet over an unlit body), so a colour-only key would
    # silently hand the second one the first one's material and kill the glow.
    key=(color, round(emit,3))
    if key in _mats: return _mats[key]
    m=bpy.data.materials.new("m"); m.use_nodes=True
    nt=m.node_tree; nt.nodes.clear()
    out=nt.nodes.new("ShaderNodeOutputMaterial")
    b=nt.nodes.new("ShaderNodeBsdfPrincipled")
    b.inputs["Base Color"].default_value=hx(color)
    b.inputs["Roughness"].default_value=1.0
    if "Specular IOR Level" in b.inputs: b.inputs["Specular IOR Level"].default_value=0.0
    # Emission, guarded: the socket names moved between Blender releases and a
    # KeyError here would take out the whole batch render for a cosmetic lift.
    # Emissive rather than just a brighter base colour because the lighting rig
    # is two suns with no fill — a lit facet has to make its OWN light or it
    # posterises down into the body colour at 22px and the gem reads as a rock.
    if emit > 0.0:
        if "Emission Color" in b.inputs: b.inputs["Emission Color"].default_value=hx(color)
        elif "Emission" in b.inputs: b.inputs["Emission"].default_value=hx(color)
        if "Emission Strength" in b.inputs: b.inputs["Emission Strength"].default_value=emit
    nt.links.new(b.outputs[0],out.inputs[0])
    _mats[key]=m; return m

def _cube(cx,y,cz,sx,sy,sz,color,emit=0.0):
    bpy.ops.mesh.primitive_cube_add(location=(cx,y,cz))
    o=bpy.context.active_object; o.scale=(sx,sy,sz)
    o.data.materials.append(mat(color,emit))
    return o

def part(px, py, w, h, color, depth=3.0, y=0.0, outline=True, ow=0.9, emit=0.0):
    cx=wx(px+w/2.0); cz=wz(py+h/2.0)
    if outline:
        _cube(cx, y+0.05, cz, (w+2*ow)*S/2.0, (depth+0.2)*S/2.0, (h+2*ow)*S/2.0, OUT)
    return _cube(cx, y, cz, w*S/2.0, depth*S/2.0, h*S/2.0, color, emit)

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

# --- gems ------------------------------------------------------------------
# The five new functional items (prism/sigil/core/shard/vault) are gemstones, so
# they need to read as CUT STONE and not as another wooden prop. Three rules do
# all the work at 22px:
#
#  1. FACETS ARE BANDS. A real brilliant cut is a stack of narrowing horizontal
#     girdles. Modelling actual angled facets is pointless here — after the 3x
#     downscale and the hard alpha snap, a smooth cone and a stack of six cubes
#     resolve to the same silhouette, and the cube stack keeps the flat-voxel
#     language the rest of the art is written in.
#  2. ONE HUE, MANY STEPS. Each gem walks a single hue from a near-white crown
#     to a near-black pavilion. That vertical ramp is what the eye reads as
#     "transparent stone catching light" — a flat fill reads as plastic.
#  3. THE INNER FACET IS EMISSIVE. The rig is two suns and no fill, so the
#     brightest facet has to emit or it posterises into the body colour. This is
#     the "emissive-ish" look, kept to one or two small parts per gem so the
#     icon still has a hard outline instead of blooming out of its own shell.
#
# The band coordinates below are the SAME ones Items.makeTextures() draws for
# its code fallback, so a gem whose PNG is missing keeps its silhouette.

def _gem(bands, glow=None, spark=None):
    """bands = [(px,py,w,h,color), ...] top to bottom, widest in the middle.

    glow/spark are optional (px,py,w,h,color,strength) front parts drawn with no
    outline and a little extra depth, so they sit proud of the body rather than
    z-fighting with the band they're painted on."""
    for (px, py, w, h, color) in bands:
        part(px, py, w, h, color, depth=2.6)
    for extra in (glow, spark):
        if extra:
            px, py, w, h, color, strength = extra
            part(px, py, w, h, color, depth=3.2, outline=False, emit=strength)

# Glow strengths are all under ~1.2 on purpose. The first pass ran them at
# 1.4-1.6 and every inner facet clipped to pure white, which threw away the one
# thing that tells a ruby from a topaz at this size — its HUE. Just bright
# enough to be the lightest step on the ramp, never bright enough to leave it.

def i_prism():                                   # DIAMOND — brilliant cut, ice
    _gem([(8,3,6,2,0xe0f7fa), (6,5,10,3,0xb2ebf2), (4,8,14,2,0x80deea),
          (5,10,12,2,0x4dd0e1), (7,12,8,3,0x26c6da), (9,15,4,2,0x00acc1),
          (10,17,2,2,0x00838f)],
         glow=(9,10,4,2,0xe0f7fa,0.7), spark=(9,4,2,2,0xffffff,1.1))

def i_sigil():                                   # EMERALD — step cut
    # Six narrow bands, not three fat ones: the first pass used a single 6-row
    # slab for the body and the whole stone downscaled into a green pill with no
    # cut at all. An emerald cut IS its steps — they have to be one band each.
    _gem([(8,3,6,2,0xa5d6a7), (6,5,10,2,0x81c784), (5,7,12,4,0x43a047),
          (5,11,12,4,0x2e7d32), (6,15,10,2,0x1b5e20), (8,17,6,2,0x0d3d10)],
         glow=(9,9,4,2,0xb9f6ca,0.7), spark=(7,13,8,1,0x66bb6a,0.3))

def i_core():                                    # AMETHYST — octahedron, violet
    _gem([(10,2,2,2,0xe1bee7), (8,4,6,3,0xba68c8), (5,7,12,4,0x8e24aa),
          (5,11,12,3,0x6a1b9a), (8,14,6,3,0x4a148c), (10,17,2,2,0x311b92)],
         glow=(10,9,3,3,0xe1bee7,0.9), spark=(7,8,3,4,0xce93d8,0.4))

def i_shard():                                   # RUBY — broken splinter, off-axis
    _gem([(12,2,4,3,0xffcdd2), (10,5,6,3,0xe57373), (8,8,7,4,0xc62828),
          (6,12,7,4,0x9b1b1b), (5,16,5,3,0x7f0000)],
         glow=(9,9,2,3,0xff8a80,0.9), spark=(11,6,2,5,0xef5350,0.4))

def i_vault():                                   # TOPAZ — cushion cut, gold core
    # Same fix as the emerald: the pavilion needs three narrowing bands to read
    # as a cut stone rather than a gold bead.
    _gem([(6,3,10,2,0xffe082), (4,5,14,3,0xffca28), (4,8,14,4,0xf9a825),
          (5,12,12,3,0xc17900), (7,15,8,2,0x8f5c00), (9,17,4,2,0x5d3a00)],
         glow=(8,7,4,3,0xfff8e1,0.8), spark=(12,10,3,2,0xffe082,0.35))

ITEMS = {'sword':i_sword,'armor':i_armor,'potion':i_potion,'scroll':i_scroll,'treasure':i_treasure,
         'prism':i_prism,'sigil':i_sigil,'core':i_core,'shard':i_shard,'vault':i_vault}

def downscale(src, dst, w, h):
    # Premultiplied downscale + hard alpha (see blender/pixelart.py). No colour
    # quantising and no post outline: both were tried and measured against these
    # very icons, and both made them worse — the ramp re-hued the flat fills, and
    # a second outline ring ate interior pixels at 22px.
    pixelart.process_file(bpy, src, dst, w, h, alpha_threshold=0.5)

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
