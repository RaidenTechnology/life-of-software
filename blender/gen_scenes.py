# gen_scenes.py — full-screen atmospheric backdrops (scene_<type>.png, 960x540)
# that sit BEHIND the whole IDE scene and change with the stage/difficulty.
# Kept dark and mostly-empty in the center so the editor panel + HUD stay
# readable; mood lives in the gradient, an overhead glow, and drifting motes.
#
# Run: blender --background --factory-startup --python blender/gen_scenes.py -- [theme]

import bpy, sys, os, math

W, H = 960, 540
HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.normpath(os.path.join(HERE, "..", "assets"))
S = 0.02                      # world units per pixel

def hx(v):
    r = ((v >> 16) & 255) / 255.0; g = ((v >> 8) & 255) / 255.0; b = (v & 255) / 255.0
    def lin(c): return c/12.92 if c <= 0.04045 else ((c+0.055)/1.055)**2.4
    return (lin(r), lin(g), lin(b), 1.0)

def wx(px): return px * S
def wy(py): return (H - py) * S

def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = 'BLENDER_EEVEE'
    sc.render.resolution_x = W; sc.render.resolution_y = H
    sc.render.film_transparent = False
    sc.render.filter_size = 1.5
    try:
        sc.eevee.taa_render_samples = 32
        sc.eevee.use_bloom = True
    except Exception:
        pass
    sc.render.image_settings.file_format = 'PNG'
    sc.view_settings.view_transform = 'Standard'
    cam = bpy.data.objects.new("Cam", bpy.data.cameras.new("Cam"))
    cam.data.type = 'ORTHO'; cam.data.ortho_scale = W * S
    cam.location = (W*S/2, -50, H*S/2); cam.rotation_euler = (math.radians(90), 0, 0)
    bpy.context.collection.objects.link(cam); sc.camera = cam
    w = bpy.data.worlds.new("W"); w.use_nodes = True
    w.node_tree.nodes.get("Background").inputs[1].default_value = 0.0
    sc.world = w
    return sc

def emit_mat(color, strength=1.0):
    m = bpy.data.materials.new("e"); m.use_nodes = True
    nt = m.node_tree; nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    e = nt.nodes.new("ShaderNodeEmission")
    e.inputs[0].default_value = hx(color); e.inputs[1].default_value = strength
    nt.links.new(e.outputs[0], out.inputs[0])
    return m

def gradient_bg(top, mid, bot):
    bpy.ops.mesh.primitive_plane_add(location=(W*S/2, 12, H*S/2))
    o = bpy.context.active_object
    o.rotation_euler = (math.radians(90), 0, 0)
    o.scale = (W*S, H*S, 1)
    m = bpy.data.materials.new("bg"); m.use_nodes = True
    nt = m.node_tree; nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    e = nt.nodes.new("ShaderNodeEmission")
    grad = nt.nodes.new("ShaderNodeTexGradient")
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    tex = nt.nodes.new("ShaderNodeTexCoord")
    ce = ramp.color_ramp.elements
    ce[0].position = 0.0; ce[0].color = hx(bot)
    ce[1].position = 1.0; ce[1].color = hx(top)
    m1 = ramp.color_ramp.elements.new(0.5); m1.color = hx(mid)
    nt.links.new(tex.outputs["Generated"], grad.inputs[0])
    nt.links.new(grad.outputs["Color"], ramp.inputs[0])
    nt.links.new(ramp.outputs["Color"], e.inputs[0])
    nt.links.new(e.outputs[0], out.inputs[0])
    o.data.materials.append(m)

def glow(px, py, radius_px, color, strength):
    # soft radial glow: a plane whose alpha falls off from center (spherical
    # gradient) to transparent, additively lighting the themed gradient behind.
    bpy.ops.mesh.primitive_plane_add(location=(wx(px), 6, wy(py)))
    o = bpy.context.active_object
    o.rotation_euler = (math.radians(90), 0, 0)
    o.scale = (radius_px*S*2, radius_px*S*2, 1)   # inner half is the visible blob
    m = bpy.data.materials.new("g"); m.use_nodes = True
    nt = m.node_tree; nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    e = nt.nodes.new("ShaderNodeEmission"); e.inputs[0].default_value = hx(color)
    e.inputs[1].default_value = strength
    tr = nt.nodes.new("ShaderNodeBsdfTransparent")
    mix = nt.nodes.new("ShaderNodeMixShader")
    grad = nt.nodes.new("ShaderNodeTexGradient"); grad.gradient_type = 'SPHERICAL'
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    tex = nt.nodes.new("ShaderNodeTexCoord")
    # spherical gradient: 1 at center -> 0 at edge. Shape a soft falloff.
    ce = ramp.color_ramp.elements
    ce[0].position = 0.0; ce[0].color = (0,0,0,1)          # edge -> transparent
    ce[1].position = 1.0; ce[1].color = (1,1,1,1)          # center -> lit
    # keep the outer half fully transparent so the square plane edge never shows
    mid = ramp.color_ramp.elements.new(0.5); mid.color = (0,0,0,1)
    nt.links.new(tex.outputs["Generated"], grad.inputs[0])
    nt.links.new(grad.outputs["Fac"], ramp.inputs[0])
    nt.links.new(ramp.outputs["Color"], mix.inputs[0])
    nt.links.new(tr.outputs[0], mix.inputs[1])
    nt.links.new(e.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs[0])
    m.blend_method = 'BLEND'
    m.use_backface_culling = False
    o.data.materials.append(m)

def motes(coords, color, strength=8, r=2):
    for px, py in coords:
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=r*S,
            location=(wx(px), 0, wy(py)))
        bpy.context.active_object.data.materials.append(emit_mat(color, strength))

def vignette():
    # dark frame so screen edges fall off and center stays legible
    bpy.ops.mesh.primitive_plane_add(location=(W*S/2, -8, H*S/2))
    o = bpy.context.active_object
    o.rotation_euler = (math.radians(90), 0, 0); o.scale = (W*S, H*S, 1)
    m = bpy.data.materials.new("v"); m.use_nodes = True
    nt = m.node_tree; nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    tr = nt.nodes.new("ShaderNodeBsdfTransparent")
    em = nt.nodes.new("ShaderNodeEmission"); em.inputs[0].default_value = (0,0,0,1)
    mix = nt.nodes.new("ShaderNodeMixShader")
    tex = nt.nodes.new("ShaderNodeTexCoord")
    dist = nt.nodes.new("ShaderNodeVectorMath"); dist.operation = 'DISTANCE'
    dist.inputs[1].default_value = (0.5,0.5,0.5)
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.35; ramp.color_ramp.elements[0].color = (0,0,0,1)
    ramp.color_ramp.elements[1].position = 0.75; ramp.color_ramp.elements[1].color = (1,1,1,1)
    nt.links.new(tex.outputs["Generated"], dist.inputs[0])
    nt.links.new(dist.outputs["Value"], ramp.inputs[0])
    nt.links.new(ramp.outputs["Color"], mix.inputs[0])
    nt.links.new(tr.outputs[0], mix.inputs[1])
    nt.links.new(em.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs[0])
    m.blend_method = 'BLEND'
    o.data.materials.append(m)

# ------------------------------------------------------------- themes (mood only)
def s_ork():
    gradient_bg(0x0c1710, 0x14241a, 0x0a1109)
    glow(300, 120, 260, 0x2f5d2a, 2.2)
    motes([(160,90),(520,140),(760,110),(880,200),(120,260),(650,80)], 0x87c96b, 7)

def s_skeleton():
    gradient_bg(0x141826, 0x1d2130, 0x0b0d16)
    glow(770, 90, 200, 0xbfc6e0, 2.6)
    motes([(200,120),(430,90),(600,160),(840,220),(120,200)], 0x9fb0d8, 6)

def s_elf():
    gradient_bg(0x0a1c20, 0x102830, 0x061014)
    glow(480, 110, 300, 0x2e7d6b, 2.6)
    motes([(150,120),(360,90),(560,150),(770,100),(880,180),(240,240)], 0x4dd0a1, 9)

def s_goblin():
    gradient_bg(0x140f0a, 0x1a1410, 0x080503)
    glow(300, 130, 220, 0xff9800, 2.0)
    glow(700, 150, 180, 0xff7043, 1.6)
    motes([(180,160),(470,120),(780,140),(880,240)], 0xffb74d, 8)

def s_vampire():
    gradient_bg(0x1a0710, 0x2c0b10, 0x100307)
    glow(480, 100, 300, 0x8c1c2b, 2.4)
    motes([(160,120),(400,90),(620,140),(820,110),(300,220)], 0xc9a227, 6)

def s_demon():
    gradient_bg(0x1c0805, 0x2d0f08, 0x0c0302)
    glow(690, 150, 260, 0xff5722, 2.6)
    glow(250, 120, 180, 0xbf360c, 1.8)
    motes([(120,120),(360,90),(520,160),(720,110),(860,200),(430,240)], 0xff7043, 9)

THEMES = {'ork':s_ork,'skeleton':s_skeleton,'elf':s_elf,'goblin':s_goblin,'vampire':s_vampire,'demon':s_demon}

def render(name):
    reset(); THEMES[name](); vignette()
    bpy.context.scene.render.filepath = os.path.join(ASSETS, "scene_%s.png" % name)
    bpy.ops.render.render(write_still=True)
    print("WROTE", bpy.context.scene.render.filepath)

def main():
    argv = sys.argv; args = argv[argv.index("--")+1:] if "--" in argv else []
    todo = [args[0]] if args and args[0] in THEMES else list(THEMES.keys())
    os.makedirs(ASSETS, exist_ok=True)
    for t in todo: render(t)
    print("ALL_DONE")

main()
