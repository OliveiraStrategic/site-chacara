import os
import re
import unicodedata

def slugify(text):
    text = unicodedata.normalize('NFKD', text).encode('ASCII', 'ignore').decode('utf-8')
    text = text.lower()
    text = re.sub(r'[^a-z0-9\.]', '-', text)
    text = re.sub(r'-+', '-', text)
    text = text.strip('-')
    return text

def rename_and_update():
    base_dir = os.path.join(os.path.dirname(__file__), 'assets', 'img')
    old_to_new = {}
    
    # 1. Rename directories
    dirs_to_rename = []
    for root, dirs, files in os.walk(base_dir, topdown=False):
        for d in dirs:
            old_dir_path = os.path.join(root, d)
            new_dir_name = slugify(d)
            new_dir_path = os.path.join(root, new_dir_name)
            if old_dir_path != new_dir_path:
                dirs_to_rename.append((old_dir_path, new_dir_path, d, new_dir_name))

    for old_path, new_path, old_name, new_name in dirs_to_rename:
        os.rename(old_path, new_path)
        old_to_new[old_name] = new_name
        print(f"Renamed dir: {old_name} -> {new_name}")

    # 2. Rename files
    files_to_rename = []
    for root, dirs, files in os.walk(base_dir):
        for f in files:
            old_file_path = os.path.join(root, f)
            new_file_name = slugify(f)
            new_file_path = os.path.join(root, new_file_name)
            if old_file_path != new_file_path:
                files_to_rename.append((old_file_path, new_file_path, f, new_file_name))
                
    for old_path, new_path, old_name, new_name in files_to_rename:
        os.rename(old_path, new_path)
        old_to_new[old_name] = new_name
        print(f"Renamed file: {old_name} -> {new_name}")

    # 3. Update HTML and CSS
    files_to_update = [
        os.path.join(os.path.dirname(__file__), 'index.html'),
        os.path.join(os.path.dirname(__file__), 'assets', 'css', 'style.css')
    ]

    for file_path in files_to_update:
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Replace directory names
            content = content.replace('Fotos externas', 'fotos-externas')
            content = content.replace('Fotos internas', 'fotos-internas')
            
            # Replace file names
            for old_name, new_name in old_to_new.items():
                if old_name.endswith('.webp') or old_name.endswith('.jpg') or old_name.endswith('.png'):
                    # To be safe, only replace the exact filename if it occurs
                    content = content.replace(old_name, new_name)
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated: {file_path}")

if __name__ == "__main__":
    rename_and_update()
