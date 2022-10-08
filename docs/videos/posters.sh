for file in $(find . -name "*.mp4"); 
do
    magick convert "$file[0]" "${file%.mp4}.png";
done