import os
from PIL import Image, ImageChops

def crop_edges():
    logo_path = r"c:\Users\carl2\.gemini\antigravity\scratch\carnitas-el-patron\src\assets\images\logo.png"
    
    print("Opening logo...")
    img = Image.open(logo_path).convert("RGBA")
    
    # We want to crop out the exact #050505 background to leave only the transparent shape.
    # First, let's create a solid #050505 image of the same size
    bg = Image.new("RGBA", img.size, (5, 5, 5, 255))
    
    # Then we find the difference
    diff = ImageChops.difference(img, bg)
    
    # And convert the difference to a bounding box. 
    # Any pixel that is NOT #050505 will be inside this bounding box
    bbox = diff.getbbox()
    
    if bbox:
        # Crop the image tightly to its contents and save
        print("Cropping image to bbox:", bbox)
        cropped_img = img.crop(bbox)
        
        # Let's also enforce that any remaining #050505 pixel on the edge 
        # is just turned into transparent alpha so we don't have hard edges
        datas = cropped_img.getdata()
        newData = []
        for item in datas:
            r, g, b, a = item[:4]
            if r == 5 and g == 5 and b == 5:
                newData.append((0, 0, 0, 0)) # Turn pure #050505 background into transparent
            else:
                newData.append(item)
                
        cropped_img.putdata(newData)
        cropped_img.save(logo_path, "PNG")
        print("Done cropping and saving.")
    else:
        print("Could not find a bounding box.")

if __name__ == "__main__":
    crop_edges()
