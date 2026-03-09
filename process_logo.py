import os
from PIL import Image
from rembg import remove, new_session

def process_image():
    input_path = r"c:\Users\carl2\Downloads\Logo la Patrona VF.png"
    out_logo_path = r"c:\Users\carl2\.gemini\antigravity\scratch\carnitas-el-patron\src\assets\images\logo.png"
    out_mascot_path = r"c:\Users\carl2\.gemini\antigravity\scratch\carnitas-el-patron\src\assets\images\porkbot.png"
    out_favicon_path = r"c:\Users\carl2\.gemini\antigravity\scratch\carnitas-el-patron\public\favicon.ico"

    print("Opening image...")
    img = Image.open(input_path).convert("RGBA")
    
    print("Removing background with rembg...")
    session = new_session("u2net")
    output = remove(img, session=session)
    
    # 1. Save MASCOT
    print("Cropping mascot...")
    width, height = output.size
    crop_box = (0, 0, int(width * 0.28), height)
    pig_crop = output.crop(crop_box)
    pig_bbox = pig_crop.getbbox()
    if pig_bbox:
        pig_crop = pig_crop.crop(pig_bbox)
        
    pig_crop.save(out_mascot_path, format="PNG")
    print("Saved mascot to:", out_mascot_path)
    
    # 2. Save FAVICON
    print("Creating favicon...")
    p_w, p_h = pig_crop.size
    sq_size = max(p_w, p_h)
    new_im = Image.new('RGBA', (sq_size, sq_size), (0, 0, 0, 0))
    new_im.paste(pig_crop, ((sq_size - p_w) // 2, (sq_size - p_h) // 2))
    new_im.thumbnail((64, 64), Image.Resampling.LANCZOS)
    new_im.save(out_favicon_path, format="ICO")
    print("Saved favicon to:", out_favicon_path)
    
    # 3. Save LOGO
    # User requested #050505 background to blend perfectly with the site
    print("Compositing main logo...")
    bg = Image.new("RGBA", output.size, (5, 5, 5, 255))
    clean_logo = Image.alpha_composite(bg, output)
    clean_logo.save(out_logo_path, format="PNG")
    print("Saved logo to:", out_logo_path)
    
    print("Done!")

if __name__ == "__main__":
    process_image()
