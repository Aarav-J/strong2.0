from PIL import Image
import os 
import glob

def save_left_half(input_path:str) : 
    img = Image.open(input_path)
    width, height = img.size
    left = img.crop((0, 0, width //2, height))
    left_rgba = left.convert("RGBA")
    base, ext = os.path.splitext(input_path)
    out_path = base + "_thumbnail.png" 
    left_rgba.save(out_path, format="PNG")
    # left.save(input_path.replace('.jpg', '_thumbnail.jpg'))

if __name__ == "__main__": 
    os.makedirs('./thumbnails', exist_ok=True)
    for img_path in glob.glob("./downloaded_images/*.jpg"): 
        filename = os.path.basename(img_path)
        save_left_half(img_path)
                                 