from PIL import Image
import os, shutil

mapping = [
    ("photo_2026-09-12_12-32-25.jpg", "issue-01-karti"),
    ("ChatGPT Image Sep 12, 2026, 12_25_00 PM.png", "issue-02-okasha"),
    ("photo_2026-09-12_12-31-49.jpg", "issue-03-yasser"),
    ("ChatGPT Image Sep 12, 2026, 12_24_51 PM.png", "issue-04-hito"),
    ("ChatGPT Image Sep 12, 2026, 12_24_40 PM.png", "issue-05-osama"),
    ("ChatGPT Image Sep 12, 2026, 12_24_21 PM.png", "issue-06-garden-girl"),
    ("ChatGPT Image Sep 12, 2026, 12_24_02 PM.png", "issue-07-garden-girl-response"),
]

os.makedirs("public/covers", exist_ok=True)
os.makedirs("public/covers/original", exist_ok=True)
os.makedirs("public/covers/webp", exist_ok=True)

for src, dest_base in mapping:
    src_path = src
    if src.lower().endswith(".png"):
        ext_orig = ".png"
    else:
        ext_orig = ".jpg"
    dest_orig = f"public/covers/original/{dest_base}{ext_orig}"
    shutil.copy2(src_path, dest_orig)
    print(f"copied original {src_path} -> {dest_orig} ({os.path.getsize(dest_orig)/1024:.0f}KB)")
    im = Image.open(src_path).convert("RGB")
    w, h = im.size
    print(f"  original size {w}x{h}")
    for max_w, suffix, quality in [(900, "", 75), (1200, "-large", 78), (480, "-thumb", 70)]:
        if w > max_w:
            ratio = max_w / w
            new_h = int(h * ratio)
            im_resized = im.resize((max_w, new_h), Image.LANCZOS)
        else:
            im_resized = im
        if suffix == "":
            webp_path = f"public/covers/webp/{dest_base}.webp"
        else:
            webp_path = f"public/covers/webp/{dest_base}{suffix}.webp"
        im_resized.save(webp_path, "WEBP", quality=quality, method=6)
        print(f"  saved {webp_path} {os.path.getsize(webp_path)/1024:.0f}KB {im_resized.size}")
    jpg_fallback = f"public/covers/{dest_base}.jpg"
    if w > 900:
        im900 = im.resize((900, int(h*900/w)), Image.LANCZOS)
    else:
        im900 = im
    im900.save(jpg_fallback, "JPEG", quality=78, optimize=True, progressive=True)
    print(f"  fallback jpg {jpg_fallback} {os.path.getsize(jpg_fallback)/1024:.0f}KB")
print("DONE")
