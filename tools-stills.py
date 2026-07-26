import os
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
FRAMES = os.path.join(HERE, 'frames')
OUT = r'C:\Users\imrai\Documents\RaidenTechnology\gmtk2026-jam\media'

# Five stills straight out of the recorded take - the same beats the GIF shows,
# so the itch page and the GIF tell one story instead of two.
PICKS = {
    'ss1-deprecation': 3030,   # the notice up, versioned like a real changelog
    'ss2-rescue': 3043,        # SAVED FROM DEPRECATION x2, both pops readable
    'ss3-boss-chain': 70,      # the exploit chain mid-sequence
    'ss4-road-epitaph': 275,   # the language road with the epitaph at full read
    'ss5-code-review': 338,    # the card nothing else in the jam has
    'ss6-festival-road': 8101, # the festival as its own stop between two languages
}

for name, n in PICKS.items():
    src = os.path.join(FRAMES, 'f%05d.png' % n)
    dst = os.path.join(OUT, name + '.png')
    Image.open(src).convert('RGB').save(dst, optimize=True)
    print('%-20s <- f%05d  %d KB' % (name, n, os.path.getsize(dst) // 1024))
