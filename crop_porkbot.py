import os
from PIL import Image

def clean_mascot():
    input_path = r"c:\Users\carl2\Downloads\Logo la Patrona VF.png"
    out_mascot_path = r"c:\Users\carl2\.gemini\antigravity\scratch\carnitas-el-patron\src\assets\images\porkbot.png"
    
    print("Opening original image...")
    # Open the raw image with rembg to extract a clean shape
    img = Image.open(input_path).convert("RGBA")
    
    from rembg import remove, new_session
    print("Removing background with rembg...")
    session = new_session("u2net")
    output = remove(img, session=session)
    
    # We want to crop ONLY the pig. 
    # Based on the original proportions, the pig is exclusively in the top left quadrant
    width, height = output.size
    
    # Crop tightly to the pig (X from 0 to about ~18% of width, Y from 0 to ~bottom of pig shoes)
    # The image is 1810x592. The pig is roughly up to x=320, y=550.
    crop_box = (0, 0, 320, height)
    pig_crop = output.crop(crop_box)
    
    # Find natural bounding box to remove transparent edges
    bbox = pig_crop.getbbox()
    if bbox:
        pig_crop = pig_crop.crop(bbox)
        
    # Extra safety: Make sure there's no text bleeding in the bottom right corner of the cropped box
    # Crop significantly tighter on the right side to ensure no "D" remains
    p_w, p_h = pig_crop.size
    # Adjust this crop to exactly 60% of the height which removes the rightmost portion holding the D
    tight_crop_box = (0, 0, int(p_h * 0.60), p_h)
    pig_crop = pig_crop.crop(tight_crop_box)
    
    # Final trim to remove any remaining transparent space
    final_bbox = pig_crop.getbbox()
    if final_bbox:
        pig_crop = pig_crop.crop(final_bbox)
       
    pig_crop.save(out_mascot_path, format="PNG")
    print("Clean mascot saved to:", out_mascot_path)

if __name__ == "__main__":
    clean_mascot()
