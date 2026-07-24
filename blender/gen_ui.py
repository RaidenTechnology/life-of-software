# gen_ui.py — Blender pixel-art UI pieces:
#  - pause_panel.png: ESC/pause "IDE window" slab, glowing frame + corner bolts.
#  - title_panel.png: a wide backing plate behind the menu title text, so it
#    stays readable over the busy key-art splash instead of just an alpha scrim.
# Phaser draws the actual text on top of both.
#
# Run: blender --background --factory-startup --python blender/gen_ui.py

import bpy, sys, os, math

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.normpath(os.path.join(HERE, "..", "assets"))

def hx(v):
    r=((v>>16)&255)/255.0; g=((v>>8)&255)/255.0; b=(v&255)/255.0
    def lin(c): return c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4
    return (lin(r),lin(g),lin(b),1.0)

def reset(W,H,S):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc=bpy.context.scene
    sc.render.engine='BLENDER_EEVEE'
    sc.render.resolution_x=W; sc.render.resolution_y=H
    sc.render.film_transparent=True
    sc.render.filter_size=1.0
    try: sc.eevee.taa_render_samples=32
    except Exception: pass
    sc.render.image_settings.file_format='PNG'
    sc.render.image_settings.color_mode='RGBA'
    sc.view_settings.view_transform='Standard'
    cam=bpy.data.objects.new("Cam",bpy.data.cameras.new("Cam"))
    cam.data.type='ORTHO'; cam.data.ortho_scale=W*S
    cam.location=(W*S/2,-50,H*S/2); cam.rotation_euler=(math.radians(90),0,0)
    bpy.context.collection.objects.link(cam); sc.camera=cam
    w=bpy.data.worlds.new("W"); w.use_nodes=True
    w.node_tree.nodes.get("Background").inputs[1].default_value=0.0
    sc.world=w
    d=bpy.data.lights.new("s",'SUN'); d.energy=2.0; d.use_shadow=False
    o=bpy.data.objects.new("s",d); o.rotation_euler=(math.radians(55),0,math.radians(20))
    bpy.context.collection.objects.link(o)
    return sc

def mat(color,emit=0.0,rough=0.7):
    m=bpy.data.materials.new("m"); m.use_nodes=True
    nt=m.node_tree; nt.nodes.clear()
    out=nt.nodes.new("ShaderNodeOutputMaterial")
    if emit>0:
        e=nt.nodes.new("ShaderNodeEmission"); e.inputs[0].default_value=hx(color); e.inputs[1].default_value=emit
        nt.links.new(e.outputs[0],out.inputs[0])
    else:
        b=nt.nodes.new("ShaderNodeBsdfPrincipled")
        b.inputs["Base Color"].default_value=hx(color); b.inputs["Roughness"].default_value=rough
        nt.links.new(b.outputs[0],out.inputs[0])
    return m

def slab(cx,cy,cz,w,h,d,color,emit=0.0,bevel=0.06):
    bpy.ops.mesh.primitive_cube_add(location=(cx,cy,cz))
    o=bpy.context.active_object
    o.scale=(w/2,d/2,h/2)
    o.data.materials.append(mat(color,emit))
    m=o.modifiers.new("b",'BEVEL'); m.width=bevel; m.segments=2
    return o

def pause_panel():
    W,H,S=560,320,0.02
    reset(W,H,S)
    U=lambda px:px*S
    cx=U(W/2); cz=U(H/2)
    # glowing accent frame (sits slightly behind, shows as a rim)
    slab(cx,1.0,cz, U(W-24),U(H-24),0.3, 0x569cd6, emit=3.2, bevel=0.12)
    # dark glass body
    slab(cx,0.4,cz, U(W-40),U(H-40),0.9, 0x1e1e28, emit=0.0, bevel=0.18)
    # top titlebar strip
    slab(cx,0.0,U(H-46), U(W-40),U(34),0.95, 0x2d2d3a, emit=0.0, bevel=0.1)
    # three window dots (red/yellow/green) — the IDE chrome motif
    for i,c in enumerate((0xff5f56,0xffbd2e,0x27c93f)):
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2,radius=U(7),
            location=(U(40+i*24),-0.4,U(H-46)))
        bpy.context.active_object.data.materials.append(mat(c,emit=2.4))
    # corner bolts (gold)
    for bx,bz in [(30,30),(W-30,30),(30,H-30),(W-30,H-30)]:
        bpy.ops.mesh.primitive_cylinder_add(vertices=8,radius=U(6),depth=0.4,
            location=(U(bx),-0.5,U(bz)),rotation=(math.radians(90),0,0))
        bpy.context.active_object.data.materials.append(mat(0xc9a227,emit=1.2))
    bpy.context.scene.render.filepath=os.path.join(ASSETS,"pause_panel.png")
    bpy.ops.render.render(write_still=True)
    print("WROTE pause_panel.png")

def title_panel():
    # wide, short banner sized to sit behind "LIFE OF SOFTWARE" + the subtitle
    # line on the menu — opaque dark body so the title reads regardless of
    # what's happening in the key-art splash behind it, glow rim ties it to
    # the same IDE-window language as pause_panel.
    W,H,S=760,190,0.02
    reset(W,H,S)
    U=lambda px:px*S
    cx=U(W/2); cz=U(H/2)
    slab(cx,1.0,cz, U(W-16),U(H-16),0.3, 0x569cd6, emit=2.2, bevel=0.15)   # glow rim
    slab(cx,0.4,cz, U(W-32),U(H-32),0.9, 0x14141c, emit=0.0, bevel=0.2)   # dark glass body
    bpy.context.scene.render.filepath=os.path.join(ASSETS,"title_panel.png")
    bpy.ops.render.render(write_still=True)
    print("WROTE title_panel.png")

os.makedirs(ASSETS,exist_ok=True)
pause_panel()
title_panel()
print("ALL_DONE")
