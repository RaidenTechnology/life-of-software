# pixelart.py — the shared post-render pass that turns a Blender render into
# something that reads as PIXEL ART rather than as a small 3D render.
#
# Every gen_*.py used to do its own `px.reshape(...).mean(...)` box downscale and
# save the result straight out. That leaves three tells the eye picks up instantly:
#
#   1. DARK HALO. Blender's float buffer is premultiplied, but averaging RGB and
#      alpha independently mixes fully-transparent (rgb=0) pixels into the edge
#      colour. Every sprite silhouette picked up a thin dark rim — the "smudge"
#      that v3 of gen_chars went flat-shaded to chase, without ever fixing the
#      actual cause, which was here in the downscale.
#   2. SOFT EDGES. A 3x box mean produces alpha 0.33 / 0.67 border pixels. That is
#      anti-aliasing: correct for a render, wrong for pixel art, where the whole
#      look comes from the silhouette being one pixel hard.
#   3. UNBOUNDED PALETTE. Averaging generates hundreds of unique colours, so the
#      shading reads as a photograph of a model. Hand-drawn pixel art uses a small
#      ramp per material; that restraint IS the style.
#
# So: premultiply-correct downscale, snap the alpha, posterize the colour (with
# an optional ordered dither so gradients band into a deliberate pattern instead
# of mud). Posterize rather than a hand-authored palette on purpose — it keeps
# every hue the scripts already chose and only limits how many steps each can
# take, so no art direction is silently overridden.
#
# Used by gen_chars / gen_items (sprites, alpha) and gen_backdrops / gen_scenes /
# gen_ui / gen_menu (opaque plates, dither on).

import numpy as np

# Bayer 4x4, normalised to (-0.5, +0.5) — the classic ordered-dither kernel.
_BAYER4 = np.array([
    [0,  8,  2, 10],
    [12, 4, 14,  6],
    [3, 11,  1,  9],
    [15, 7, 13,  5],
], dtype=np.float64) / 16.0 - 0.5


def box_downscale(px, w, h):
    """Premultiplied box downscale of an HxWx4 float array to h x w.

    Transparent pixels carry rgb=0, so straight averaging drags edge colours
    toward black. Premultiply first, average, then un-premultiply where there is
    something left to divide by.
    """
    H2, W2 = px.shape[:2]
    fy, fx = H2 // h, W2 // w
    rgb, a = px[..., :3], px[..., 3:4]
    pre = np.concatenate([rgb * a, a], axis=-1)
    pre = pre.reshape(h, fy, w, fx, 4).mean(axis=(1, 3))
    out_a = pre[..., 3:4]
    safe = np.where(out_a > 1e-6, out_a, 1.0)
    return np.concatenate([pre[..., :3] / safe, out_a], axis=-1)


def snap_alpha(px, threshold=0.5):
    """Hard silhouette: every pixel is fully in or fully out.

    This is the single biggest difference between "downscaled render" and "pixel
    art". Semi-transparent border pixels also fight Phaser's NEAREST filtering —
    they stay soft no matter how crisply the game samples them.
    """
    px = px.copy()
    px[..., 3] = (px[..., 3] >= threshold).astype(np.float64)
    return px


def _to_srgb(c):
    c = np.clip(c, 0.0, 1.0)
    return np.where(c <= 0.0031308, c * 12.92, 1.055 * np.power(c, 1 / 2.4) - 0.055)


def _to_linear(c):
    c = np.clip(c, 0.0, 1.0)
    return np.where(c <= 0.04045, c / 12.92, np.power((c + 0.055) / 1.055, 2.4))


def posterize(px, levels=6, dither=False):
    """Quantise each colour channel to `levels` steps, optionally Bayer-dithered.

    levels=6 gives at most 216 combinations and in practice ~30-50 colours per
    sprite — a hand-drawable ramp. Dither is for the large gradient plates
    (backdrops, scene atmospheres): without it low-res gradients band into ugly
    stripes; with it they band into an ordered pattern that reads as intentional
    shading. Alpha is never dithered or posterized — snap_alpha owns it.
    """
    px = px.copy()
    q = levels - 1
    # Quantise in sRGB, not in Blender's linear float. Even steps in linear space
    # are wildly uneven perceptually — they bunch up in the highlights and tear
    # the darks apart, which re-hues the art instead of tidying it (measured: the
    # armour icon's grey-blue #90a4ae came out teal, its pauldrons purple). sRGB
    # steps are also exactly the steps the 8-bit PNG can store, so what we round
    # to is what actually ships.
    rgb = _to_srgb(px[..., :3])
    if dither:
        h, w = rgb.shape[:2]
        tile = np.tile(_BAYER4, (h // 4 + 1, w // 4 + 1))[:h, :w, None]
        rgb = rgb + tile / q
    rgb = np.clip(np.round(np.clip(rgb, 0.0, 1.0) * q) / q, 0.0, 1.0)
    px[..., :3] = _to_linear(rgb)
    return px


def outline(px, color=(0.055, 0.071, 0.086), alpha_threshold=0.5):
    """Add a 1px hard outline around the silhouette (4-neighbour dilation).

    Off by default everywhere: gen_chars builds its outlines as geometry, one per
    limb group, and stacking a second one thickens the read. Here for the item /
    prop generators, where a uniform post-pass outline is cheaper than modelling
    one, and for anything that ends up sitting on a busy backdrop.
    """
    a = px[..., 3] >= alpha_threshold
    grown = a.copy()
    grown[1:, :] |= a[:-1, :]
    grown[:-1, :] |= a[1:, :]
    grown[:, 1:] |= a[:, :-1]
    grown[:, :-1] |= a[:, 1:]
    ring = grown & ~a
    px = px.copy()
    px[ring, 0], px[ring, 1], px[ring, 2] = color
    px[ring, 3] = 1.0
    return px


def pixelize(px, w, h, levels=None, alpha=True, alpha_threshold=0.5,
             dither=False, add_outline=False):
    """The whole pass, in the order that matters.

    Downscale (premultiplied) -> posterize colour -> snap alpha -> outline.
    Alpha is snapped AFTER posterizing so quantisation never sees a colour that
    a soon-to-be-cut edge pixel contributed.

    levels defaults to None = NO posterizing, on purpose. It was tried on the
    loot icons at 5 and at 10 steps, in linear and in sRGB, and compared against
    the originals every time: an even quantisation ladder has no idea which of
    the artist's colours matter, so it re-hues flat fills (grey-blue armour to
    teal, brown chest to olive) and speckles gently shaded ones. Real pixel art
    limits its palette by CHOOSING colours, which is an art decision, not a
    filter. The knob stays here for anyone who wants to hand it a coarse ramp on
    a specific asset — it just isn't the default, because the honest measured
    result was "the silhouette fixes help, the colour quantiser hurts".
    """
    if px.shape[0] != h or px.shape[1] != w:
        px = box_downscale(px, w, h)
    if levels:
        px = posterize(px, levels=levels, dither=dither)
    if not alpha:
        px[..., 3] = 1.0
    elif alpha_threshold is not None:
        px = snap_alpha(px, alpha_threshold)
        if add_outline:
            px = outline(px, alpha_threshold=alpha_threshold)
    # alpha_threshold=None keeps the soft alpha: right for the big UI plates,
    # whose drop shadows are supposed to fade rather than cut.
    return px


# --- bpy glue -------------------------------------------------------------
# Kept in this module so the generators stay art-code and never repeat the
# load/reshape/save dance. Imported lazily: the pure-numpy half above can then be
# exercised outside Blender.

def load_pixels(bpy, path):
    img = bpy.data.images.load(path)
    W, H = img.size
    px = np.array(img.pixels[:]).reshape(H, W, 4)
    bpy.data.images.remove(img)
    return px


def save_pixels(bpy, px, path):
    h, w = px.shape[:2]
    out = bpy.data.images.new("_pixelize_out", width=w, height=h, alpha=True)
    out.pixels = px.reshape(-1).tolist()
    out.filepath_raw = path
    out.file_format = 'PNG'
    out.save()
    bpy.data.images.remove(out)


def process_file(bpy, src, dst, w=None, h=None, **kw):
    """Read a rendered PNG, run pixelize, write it back out."""
    px = load_pixels(bpy, src)
    save_pixels(bpy, pixelize(px, w or px.shape[1], h or px.shape[0], **kw), dst)
