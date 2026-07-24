# gen_menu.py — the menu KEY-ART splash (menu_splash.png, 960x540): a Blender-
# rendered environment (sky, ground, distant trees, glow) with the REAL in-game
# hero/monster sprites (hero5.png, en_ork.png, en_demon_boss.png) composited on
# top at native pixel size. Earlier versions modeled a separate, more detailed
# hero/monster in 3D for this splash — but that geometry was far more complex
# than the actual game sprites, and squeezing it into the same low native
# resolution turned it into a blurry smear on downscale. Compositing the exact
# sprites the game already uses guarantees this reads identically crisp.
#
# Run: blender --background --factory-startup --python blender/gen_menu.py

import bpy, os, math

W, H = 960, 540
S = 0.02
HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.normpath(os.path.join(HERE, "..", "assets"))
GROUND = 452   # ground top in px (lower band for the action)

# pixel-art match: render natively LOW-RES (like the character sprites) instead
# of full 960x540, then Phaser upscales with NEAREST — same chunky-pixel
# language as hero/monster sprites, instead of a smooth high-res render.
PIXEL_SCALE = 5             # 960/5=192, 540/5=108 native render size
SS = 3                       # supersample factor for crisp edges pre-downscale

def hx(v):
    r=((v>>16)&255)/255.0; g=((v>>8)&255)/255.0; b=(v&255)/255.0
    def lin(c): return c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4
    return (lin(r),lin(g),lin(b),1.0)

def wx(px): return px*S
def wz(py): return (H-py)*S

def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc=bpy.context.scene
    sc.render.engine='BLENDER_EEVEE'
    # native LOW res (W/PIXEL_SCALE x H/PIXEL_SCALE), supersampled for crisp
    # edges pre-downscale — Phaser then upscales with NEAREST to fill 960x540.
    sc.render.resolution_x=(W//PIXEL_SCALE)*SS; sc.render.resolution_y=(H//PIXEL_SCALE)*SS
    sc.render.film_transparent=False
    sc.render.filter_size=1.0
    try:
        sc.eevee.taa_render_samples=48
        sc.eevee.use_gtao=False   # flat/no-AO — matches the character-sprite fix
    except Exception: pass
    sc.render.image_settings.file_format='PNG'
    sc.view_settings.view_transform='Standard'
    cam=bpy.data.objects.new("Cam",bpy.data.cameras.new("Cam"))
    cam.data.type='ORTHO'; cam.data.ortho_scale=W*S
    cam.location=(W*S/2,-80,H*S/2); cam.rotation_euler=(math.radians(90),0,0)
    bpy.context.collection.objects.link(cam); sc.camera=cam
    # key light (warm, upper-right) + cool rim from left/behind
    k=bpy.data.lights.new("k",'SUN'); k.energy=3.2; k.color=(1.0,0.86,0.6); k.use_shadow=False
    ko=bpy.data.objects.new("k",k); ko.rotation_euler=(math.radians(55),0,math.radians(-35))
    bpy.context.collection.objects.link(ko)
    r=bpy.data.lights.new("r",'SUN'); r.energy=2.2; r.color=(0.5,0.7,1.0); r.use_shadow=False
    ro=bpy.data.objects.new("r",r); ro.rotation_euler=(math.radians(60),0,math.radians(120))
    bpy.context.collection.objects.link(ro)
    w=bpy.data.worlds.new("W"); w.use_nodes=True
    w.node_tree.nodes.get("Background").inputs[1].default_value=0.35
    w.node_tree.nodes.get("Background").inputs[0].default_value=hx(0x0e0a1a)
    sc.world=w
    return sc

def mat(color,rough=0.7,emit=0.0):
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
    return m

def box(px,py,w,h,color,y=0.0,depth=6,bevel=0.06,rough=0.7,emit=0.0):
    bpy.ops.mesh.primitive_cube_add(location=(wx(px+w/2),y,wz(py+h/2)))
    o=bpy.context.active_object
    o.scale=(w*S/2, depth*S/2, h*S/2)
    o.data.materials.append(mat(color,rough,emit))
    m=o.modifiers.new("b",'BEVEL'); m.width=bevel; m.segments=2; m.limit_method='NONE'
    return o

def cone(px,py_bottom,r,hgt,color,y=0.0,verts=4,emit=0.0):
    bpy.ops.mesh.primitive_cone_add(vertices=verts,radius1=r*S,radius2=0,depth=hgt*S,
        location=(wx(px),y,wz(py_bottom)+hgt*S/2))
    o=bpy.context.active_object; o.data.materials.append(mat(color,0.6,emit)); return o

def sky():
    bpy.ops.mesh.primitive_plane_add(location=(W*S/2,16,H*S/2))
    o=bpy.context.active_object; o.rotation_euler=(math.radians(90),0,0); o.scale=(W*S,H*S,1)
    m=bpy.data.materials.new("sky"); m.use_nodes=True
    nt=m.node_tree; nt.nodes.clear()
    out=nt.nodes.new("ShaderNodeOutputMaterial"); e=nt.nodes.new("ShaderNodeEmission")
    grad=nt.nodes.new("ShaderNodeTexGradient"); ramp=nt.nodes.new("ShaderNodeValToRGB")
    tex=nt.nodes.new("ShaderNodeTexCoord")
    ce=ramp.color_ramp.elements
    ce[0].position=0.0; ce[0].color=hx(0x1a1030)          # horizon-ish bottom
    ce[1].position=1.0; ce[1].color=hx(0x090614)          # top (dark for title)
    a=ramp.color_ramp.elements.new(0.32); a.color=hx(0x6a2b52)  # warm dusk band low
    nt.links.new(tex.outputs["Generated"],grad.inputs[0])
    nt.links.new(grad.outputs["Color"],ramp.inputs[0])
    nt.links.new(ramp.outputs["Color"],e.inputs[0]); nt.links.new(e.outputs[0],out.inputs[0])
    o.data.materials.append(m)

def glow(px,py,r,color,strength):
    bpy.ops.mesh.primitive_plane_add(location=(wx(px),12,wz(py)))
    o=bpy.context.active_object; o.rotation_euler=(math.radians(90),0,0); o.scale=(r*S*2,r*S*2,1)
    m=bpy.data.materials.new("g"); m.use_nodes=True
    nt=m.node_tree; nt.nodes.clear()
    out=nt.nodes.new("ShaderNodeOutputMaterial"); e=nt.nodes.new("ShaderNodeEmission")
    e.inputs[0].default_value=hx(color); e.inputs[1].default_value=strength
    tr=nt.nodes.new("ShaderNodeBsdfTransparent"); mix=nt.nodes.new("ShaderNodeMixShader")
    grad=nt.nodes.new("ShaderNodeTexGradient"); grad.gradient_type='SPHERICAL'
    ramp=nt.nodes.new("ShaderNodeValToRGB"); tex=nt.nodes.new("ShaderNodeTexCoord")
    ce=ramp.color_ramp.elements
    ce[0].position=0.0; ce[0].color=(0,0,0,1); ce[1].position=1.0; ce[1].color=(1,1,1,1)
    mid=ramp.color_ramp.elements.new(0.5); mid.color=(0,0,0,1)
    nt.links.new(tex.outputs["Generated"],grad.inputs[0]); nt.links.new(grad.outputs["Fac"],ramp.inputs[0])
    nt.links.new(ramp.outputs["Color"],mix.inputs[0]); nt.links.new(tr.outputs[0],mix.inputs[1])
    nt.links.new(e.outputs[0],mix.inputs[2]); nt.links.new(mix.outputs[0],out.inputs[0])
    m.blend_method='BLEND'; o.data.materials.append(m)

def vignette():
    bpy.ops.mesh.primitive_plane_add(location=(W*S/2,-12,H*S/2))
    o=bpy.context.active_object; o.rotation_euler=(math.radians(90),0,0); o.scale=(W*S,H*S,1)
    m=bpy.data.materials.new("v"); m.use_nodes=True
    nt=m.node_tree; nt.nodes.clear()
    out=nt.nodes.new("ShaderNodeOutputMaterial")
    tr=nt.nodes.new("ShaderNodeBsdfTransparent"); em=nt.nodes.new("ShaderNodeEmission"); em.inputs[0].default_value=(0,0,0,1)
    mix=nt.nodes.new("ShaderNodeMixShader"); tex=nt.nodes.new("ShaderNodeTexCoord")
    # darken the TOP (for title) using the Y of generated coords
    sep=nt.nodes.new("ShaderNodeSeparateXYZ"); ramp=nt.nodes.new("ShaderNodeValToRGB")
    ce=ramp.color_ramp.elements
    ce[0].position=0.45; ce[0].color=(0,0,0,1)     # lower -> clear
    ce[1].position=1.0; ce[1].color=(0.72,0.72,0.72,1)  # top -> darkened
    nt.links.new(tex.outputs["Generated"],sep.inputs[0]); nt.links.new(sep.outputs["Y"],ramp.inputs[0])
    nt.links.new(ramp.outputs["Color"],mix.inputs[0]); nt.links.new(tr.outputs[0],mix.inputs[1])
    nt.links.new(em.outputs[0],mix.inputs[2]); nt.links.new(mix.outputs[0],out.inputs[0])
    m.blend_method='BLEND'; o.data.materials.append(m)

# ---- composite the REAL game sprites onto the rendered background, at native
# pixel size (no scaling at all) so they stay exactly as crisp as in-game ----
def load_rgba(path):
    img = bpy.data.images.load(path)
    import numpy as np
    w, h = img.size
    arr = np.array(img.pixels[:]).reshape(h, w, 4)
    bpy.data.images.remove(img)
    return arr

def paste(bg, fg, x, y):
    """Alpha-composite fg onto bg with fg's top-left at (x,y); native size only,
    no resampling — clips silently if it runs past bg's edges."""
    import numpy as np
    fh, fw = fg.shape[:2]
    bh, bw = bg.shape[:2]
    x0, y0 = max(0, x), max(0, y)
    x1, y1 = min(bw, x + fw), min(bh, y + fh)
    if x1 <= x0 or y1 <= y0: return
    fg_s = fg[y0 - y:y1 - y, x0 - x:x1 - x]
    a = fg_s[..., 3:4]
    bg[y0:y1, x0:x1] = fg_s[..., :4] * a + bg[y0:y1, x0:x1] * (1 - a)

def build():
    reset()
    sky()
    glow(300,150,300,0xff8a3d,2.0)          # warm sun glow behind
    glow(720,120,220,0x7a5cff,1.4)          # cool accent
    # distant tree/mountain silhouette line
    for x in range(-20,W+40,70):
        h=40+((x*7)%50)
        cone(x, GROUND, 30, h, 0x120a1e, y=9, verts=3)
    # ground slab + edge
    box(0,GROUND,W,H-GROUND,0x1a1226, y=0, depth=2, bevel=0.0)
    box(0,GROUND-2,W,3,0x2a1c3a, y=-1.5, depth=0.6)
    # midground fog
    box(0,GROUND-22,W,22,0x241634, y=6, depth=0.3, emit=0.15)
    vignette()
    dst=os.path.join(ASSETS,"menu_splash.png")
    tmp=dst+".ss.png"
    bpy.context.scene.render.filepath=tmp
    bpy.ops.render.render(write_still=True)
    nw, nh = W//PIXEL_SCALE, H//PIXEL_SCALE
    bg = downscale_arr(tmp, nw, nh)
    try: os.remove(tmp)
    except Exception: pass

    # composite the REAL in-game sprites at native pixel size — hero big on the
    # left, a small monster pair on the right (matches the old 3D composition's
    # layout, but guaranteed pixel-identical to what you fight in-game).
    # feet on the ground line (+2px so they sit into the grass, not float above)
    ground_n = GROUND // PIXEL_SCALE
    def feet(a, x): paste(bg, a, x, ground_n - a.shape[0] + 2)
    hero_a = load_rgba(os.path.join(ASSETS, "hero5.png"))
    ork_a = load_rgba(os.path.join(ASSETS, "en_ork.png"))
    demon_a = load_rgba(os.path.join(ASSETS, "en_demon_boss.png"))
    feet(hero_a, 14)     # hero, left
    feet(ork_a, 100)     # front monster (40px wide -> 100..140)
    feet(demon_a, 148)   # boss, right (40px wide -> 148..188), clear gap

    save_png(bg, dst)
    print("WROTE menu_splash.png")

def downscale_arr(src, w, h):
    import numpy as np
    img = bpy.data.images.load(src)
    W2, H2 = img.size
    px = np.array(img.pixels[:]).reshape(H2, W2, 4)
    fy, fx = H2 // h, W2 // w
    px = px.reshape(h, fy, w, fx, 4).mean(axis=(1, 3))
    bpy.data.images.remove(img)
    return px

def save_png(arr, dst):
    h, w = arr.shape[:2]
    out = bpy.data.images.new("o", width=w, height=h, alpha=True)
    out.pixels = arr.reshape(-1).tolist()
    out.filepath_raw = dst; out.file_format = 'PNG'; out.save()
    bpy.data.images.remove(out)

os.makedirs(ASSETS, exist_ok=True)
build()
print("ALL_DONE")
