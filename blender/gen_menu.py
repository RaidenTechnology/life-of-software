# gen_menu.py — the menu KEY-ART splash (menu_splash.png, 960x540): a dramatic
# Blender pixel-art battle diorama shown on the title screen to catch the eye.
# Composed so the upper-center stays dark/skyey for the title + text, with the
# hero and a monster horde staged along the lower band.
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

def cyl(px,py_bottom,r,hgt,color,y=0.0,verts=12,emit=0.0):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts,radius=r*S,depth=hgt*S,
        location=(wx(px),y,wz(py_bottom)+hgt*S/2))
    o=bpy.context.active_object; o.data.materials.append(mat(color,0.6,emit)); return o

def sph(px,py,r,color,y=0.0,emit=0.0,flat=1.0):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=3,radius=r*S,location=(wx(px),y,wz(py)))
    o=bpy.context.active_object; o.scale=(1,flat,1); o.data.materials.append(mat(color,0.55,emit)); return o

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

# ---- a detailed hero, ~150px tall, heroic stance, facing right ----
def hero(cx, scale=1.0, y=0.0):
    def P(dx,dy,w,h,c,yy=0.0,d=7,em=0.0,rg=0.6):
        box(cx+dx*scale, GROUND-(dy+h)*scale, w*scale, h*scale, c, y=y+yy, depth=d*scale, emit=em, rough=rg)
    armor=0x6a4fb3; trim=0xc9a227; skin=0xf0c29a
    # legs
    P(-16,0,11,34,0x37474f); P(5,0,11,34,0x37474f)
    P(-17,-2,13,6,0x14181c); P(4,-2,13,6,0x14181c)        # boots
    # torso (deep) + plate detail
    P(-18,30,36,40,armor, d=12)
    P(-18,52,36,4,0x4a3580, d=12.2)                        # chest line
    P(-16,64,32,6,trim, d=12.4, em=0.25)                   # collar trim
    # belt + buckle
    P(-18,26,36,7,0x5d4037, d=12.4); P(-4,26,8,7,trim, d=12.6, em=0.3)
    # shoulders (rounded) + arms + hands
    sph(cx-18*scale, GROUND-(62)*scale, 9*scale, armor, y=y-3*scale)
    sph(cx+18*scale, GROUND-(62)*scale, 9*scale, armor, y=y-3*scale)
    P(-24,34,8,22,armor, d=8); P(16,30,8,20,armor, d=8)
    sph(cx-20*scale, GROUND-(32)*scale, 5*scale, skin, y=y-4*scale)   # left hand
    sph(cx+20*scale, GROUND-(28)*scale, 5*scale, skin, y=y-4*scale)   # right hand
    # head + helmet + plume + face
    sph(cx, GROUND-(80)*scale, 12*scale, skin, y=y, flat=0.92)
    P(-13,80,26,10,armor, d=11)                            # helmet band
    P(-5,90,10,10,0xd32f2f, d=6)                           # plume
    # eyes: white + dark pupil + highlight
    P(-8,72,5,4,0xffffff, d=12.2, yy=-3, rg=0.4); P(3,72,5,4,0xffffff, d=12.2, yy=-3, rg=0.4)
    P(-7,72,2,3,0x20140a, d=12.4, yy=-3.5); P(4,72,2,3,0x20140a, d=12.4, yy=-3.5)
    P(-7,74,1,1,0xffffff, d=12.6, yy=-4, em=0.6); P(4,74,1,1,0xffffff, d=12.6, yy=-4, em=0.6)
    # shield on left arm (forward)
    box(cx-26*scale, GROUND-46*scale, 12*scale, 30*scale, 0x4e342e, y=y-6*scale, depth=4*scale)
    sph(cx-26*scale, GROUND-46*scale, 5*scale, 0xb0bec5, y=y-8*scale, emit=0.3)
    # raised sword (right), glowing blade
    box(cx+22*scale, GROUND-40*scale, 5*scale, 10*scale, 0x5d4037, y=y-6*scale, depth=4*scale)  # grip
    box(cx+18*scale, GROUND-50*scale, 14*scale, 4*scale, trim, y=y-6*scale, depth=4.5*scale, emit=0.3)  # guard
    box(cx+23*scale, GROUND-96*scale, 5*scale, 48*scale, 0xdfe7ec, y=y-6*scale, depth=4*scale, rough=0.2, emit=0.15)  # blade
    cone(cx+25.5*scale, GROUND-96*scale, 4*scale, 10*scale, 0xffffff, y=y-6*scale, verts=3, emit=0.5)  # tip

# ---- a monster silhouette (ork-ish), facing left ----
def ork(cx, scale=1.0, y=0.0):
    def P(dx,dy,w,h,c,yy=0.0,d=6,em=0.0):
        box(cx+dx*scale, GROUND-(dy+h)*scale, w*scale, h*scale, c, y=y+yy, depth=d*scale, emit=em)
    body=0x4a7030
    P(-13,0,9,26,0x2b471c); P(6,0,9,26,0x2b471c)
    P(-16,22,32,26,body, d=10)
    sph(cx-16*scale, GROUND-40*scale, 8*scale, body, y=y-2*scale)
    sph(cx+16*scale, GROUND-40*scale, 8*scale, body, y=y-2*scale)
    sph(cx, GROUND-52*scale, 11*scale, 0x5d8a3c, y=y, flat=0.9)      # head
    P(-7,50,4,3,0xffee58, d=10.4, yy=-3, em=0.9); P(3,50,4,3,0xffee58, d=10.4, yy=-3, em=0.9)  # eyes
    P(-6,42,3,6,0xffffff, d=10.2, yy=-3); P(3,42,3,6,0xffffff, d=10.2, yy=-3)  # tusks

def demon(cx, scale=1.0, y=0.0):
    def P(dx,dy,w,h,c,yy=0.0,d=6,em=0.0):
        box(cx+dx*scale, GROUND-(dy+h)*scale, w*scale, h*scale, c, y=y+yy, depth=d*scale, emit=em)
    body=0xb42222
    cone(cx-16*scale, GROUND-58*scale, 12*scale, 30*scale, 0x3a0d0d, y=y+3*scale, verts=3)  # wing
    cone(cx+16*scale, GROUND-58*scale, 12*scale, 30*scale, 0x3a0d0d, y=y+3*scale, verts=3)
    P(-12,0,8,24,0x6d1b1b); P(5,0,8,24,0x6d1b1b)
    P(-15,20,30,28,body, d=10)
    sph(cx, GROUND-50*scale, 10*scale, 0xcf3030, y=y, flat=0.9)
    cone(cx-7*scale, GROUND-56*scale, 3*scale, 12*scale, 0x2d1b12, y=y, verts=3)  # horns
    cone(cx+7*scale, GROUND-56*scale, 3*scale, 12*scale, 0x2d1b12, y=y, verts=3)
    P(-7,48,4,3,0xffee58, d=10.4, yy=-3, em=1.0); P(3,48,4,3,0xffee58, d=10.4, yy=-3, em=1.0)

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
    # hero (hero, big) centre-left; monster horde to the right (smaller = further)
    demon(792, scale=0.62, y=2.5)
    ork(690, scale=0.72, y=1.5)
    ork(610, scale=0.6, y=3.0)
    hero(300, scale=1.5, y=-2.0)
    vignette()
    dst=os.path.join(ASSETS,"menu_splash.png")
    tmp=dst+".ss.png"
    bpy.context.scene.render.filepath=tmp
    bpy.ops.render.render(write_still=True)
    downscale(tmp, dst, W//PIXEL_SCALE, H//PIXEL_SCALE)
    try: os.remove(tmp)
    except Exception: pass
    print("WROTE menu_splash.png")

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

os.makedirs(ASSETS, exist_ok=True)
build()
print("ALL_DONE")
