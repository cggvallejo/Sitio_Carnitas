import os
from PIL import Image

def fix_transparent_crop():
    logo_path = r"c:\Users\carl2\.gemini\antigravity\scratch\carnitas-el-patron\src\assets\images\logo.png"
    print("Opening logo...")
    img = Image.open(logo_path).convert("RGBA")
    datas = img.getdata()
    
    # We want to change all #050505 to transparent (0, 0, 0, 0)
    newData = []
    for item in datas:
        r, g, b, a = item[:4]
        # Allow a tiny bit of tolerance for the blending 
        if abs(r - 5) <= 2 and abs(g - 5) <= 2 and abs(b - 5) <= 2:
            newData.append((0, 0, 0, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    
    # Now get the bounding box of the non-transparent pixels
    bbox = img.getbbox()
    if bbox:
        print("Cropping to bbox:", bbox)
        img = img.crop(bbox)
        img.save(logo_path, "PNG")
        print("Done cropping and saving.")
    else:
        print("Empty image after making #050505 transparent.")

if __name__ == "__main__":
    fix_transparent_crop()
