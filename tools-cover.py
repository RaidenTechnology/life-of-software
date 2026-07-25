# itch.io cover, 630x500, built out of the game's own pixels.
#
# Nothing here is drawn by hand or by a model: the title is lifted from the menu
# the game renders (so the cover's type IS the game's type), the cast is the
# shipped menu_splash art nearest-upscaled, and the hook is the actual
# deprecation notice as it appears in play, cropped clear of the HUD. Only the
# layout and the two tagline rows are composed. That keeps the "all art is
# hand-made" claim honest and makes the cover look like the thing it sells.
import os
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
FRAMES = os.path.join(HERE, 'frames')
REPO = r'C:\Users\imrai\Documents\RaidenTechnology\gmtk2026-jam'
FONT = r'C:\Windows\Fonts\consola.ttf'
FONTB = r'C:\Windows\Fonts\consolab.ttf'

W, H = 630, 500
BG = (18, 18, 20)
EDGE = (58, 58, 64)
DIM = (128, 128, 132)
AMBER = (220, 220, 170)
GREEN = (106, 153, 85)

menu = Image.open(os.path.join(FRAMES, 'f09998.png')).convert('RGB')
play = Image.open(os.path.join(FRAMES, 'f03030.png')).convert('RGB')
splash = Image.open(os.path.join(REPO, 'assets', 'menu_splash.png')).convert('RGB')

cover = Image.new('RGB', (W, H), BG)
d = ImageDraw.Draw(cover)


def fit(img, width):
    return img.resize((width, max(1, int(img.height * width / img.width))), Image.LANCZOS)


# --- 1. title, cropped tight to the glyphs so no panel edge comes with it ----
title = fit(menu.crop((196, 100, 764, 150)), W - 44)
cover.paste(title, (22, 24))

# --- 2. the whole cast, nearest-upscaled so it stays pixel art --------------
cast = splash.resize((splash.width * 4, splash.height * 4), Image.NEAREST)
cast = fit(cast.crop((44, 44, 764, 300)), W - 44)
cover.paste(cast, (22, 96))

# --- 3. the hook: the real notice, cropped clear of the HUD readout ---------
# Measured in play: the alarm spans x 275..685 and the credits block starts at
# 690, so 262..700 takes both notice rows and nothing else.
notice = fit(play.crop((273, 262, 686, 308)), W - 44)
cover.paste(notice, (22, 300))

# --- 4. what the game actually is, in two rows -----------------------------
f14 = ImageFont.truetype(FONTB, 15)
f12 = ImageFont.truetype(FONT, 13)
f11 = ImageFont.truetype(FONT, 12)


def centre(text, font, y, fill):
    w = d.textbbox((0, 0), text, font=font)[2]
    d.text(((W - w) // 2, y), text, font=font, fill=fill)


centre('25 LANGUAGES.  ONE CLOCK.', f14, 366, AMBER)
centre('and a second countdown eating the answers', f12, 390, GREEN)
centre('a typing roguelite that teaches you what you typed', f11, 424, DIM)
centre('GMTK 2026  ---  Count Down', f11, 452, (90, 90, 96))

# --- 5. a thin frame so it reads as a card in the jam grid ------------------
px = cover.load()
for x in range(W):
    for y in (0, 1, H - 2, H - 1):
        px[x, y] = EDGE
for y in range(H):
    for x in (0, 1, W - 2, W - 1):
        px[x, y] = EDGE

out = os.path.join(REPO, 'media', 'cover-630x500.png')
cover.save(out, optimize=True)
print('%s  %dx%d  %d KB' % (out, cover.width, cover.height, os.path.getsize(out) // 1024))

# the jam grid shows it at 315x250 - check it survives that
cover.resize((315, 250), Image.LANCZOS).save(os.path.join(HERE, 'cover-thumb.png'))
print('thumb written')
