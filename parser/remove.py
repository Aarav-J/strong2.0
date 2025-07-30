from rembg import remove
from PIL import Image
import numpy as np
import cv2
import os, glob

def replace_bg_strict(input_path: str, output_path: str):
    # 1) Remove background → RGBA with soft alpha
    img = Image.open(input_path).convert("RGBA")
    fg = remove(img)
    
    # 2) Convert to OpenCV for mask post-processing
    fg_np = np.array(fg)              # H×W×4
    b, g, r, a = cv2.split(fg_np)     # split channels

    # 3) Hard-threshold the alpha: everything >240 → 255, else 0
    _, alpha = cv2.threshold(a, 240, 255, cv2.THRESH_BINARY)

    # 4) Close small holes and smooth edges
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15,15))
    alpha = cv2.morphologyEx(alpha, cv2.MORPH_CLOSE, kernel)
    alpha = cv2.GaussianBlur(alpha, (7,7), 0)

    # 5) Reassemble a “clean” RGBA foreground
    fg_np[:,:,3] = alpha
    clean_rgba = cv2.cvtColor(fg_np, cv2.COLOR_BGRA2RGBA)

    # 6) Composite over white
    h, w = alpha.shape
    white = np.ones((h, w, 3), dtype=np.uint8) * 255
    alpha_f = (alpha.astype(np.float32) / 255.0)[...,None]
    comp = (white * (1-alpha_f) + clean_rgba[:,:,:3].astype(np.float32)*alpha_f).astype(np.uint8)

    # 7) Save
    Image.fromarray(comp).save(output_path, quality=95)
    print(f"Saved cleaned image to {output_path}")

if __name__ == "__main__":
    os.makedirs("cleaned_strict", exist_ok=True)
    for infile in glob.glob("images/*.png"):    # or point to your folder
        base = os.path.splitext(os.path.basename(infile))[0]
        replace_bg_strict(infile, f"cleaned_strict/{base}_clean.jpg")