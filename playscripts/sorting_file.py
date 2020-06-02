import os
import shutil

fullpath = os.path.join
python_directory = "./py"
start_directory = "./mixed"
text_files = "./txt"

default_path = "./default"

#This is the dictionary to look up file extensions
dir_lookup = {
    'docx': './docx/',
    'txt': './txt/'
}

def get_extension(filename):
    return filename[filename.rfind('.')+1:]

def main():
    for dirname, dirnames, filenames in os.walk(start_directory):
        for filename in filenames:
            source = fullpath(dirname, filename)
            extension = get_extension(filename)
            if (extension in dir_lookup):
                shutil.move(source, fullpath(dir_lookup[extension], filename))
            else:
                shutil.move(source, fullpath(default_path, filename))

if __name__ == "__main__":
    main()
