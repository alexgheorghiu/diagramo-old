rem it will create a similar name file but with jpg extension
rem see http://xmlgraphics.apache.org/batik/tools/rasterizer.html
java -jar batik-rasterizer.jar -m image/jpeg -q .99 %1
