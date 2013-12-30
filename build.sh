export PATH=$PATH:~/emscripten
export PATH=$PATH:~/t/bin/Linux/node/bin

emcc -O3 ../libtess2/Source/bucketalloc.c ../libtess2/Source/dict.c ../libtess2/Source/geom.c ../libtess2/Source/mesh.c ../libtess2/Source/priorityq.c ../libtess2/Source/sweep.c ../libtess2/Source/tess.c -o ./build/libtess2.bc -I./../libtess2/Include

emcc -O3 ./build/libtess2.bc ./src/tess2.c -I./../libtess2/Include -o ./build/libtess2.js --closure 1 -s EXPORTED_FUNCTIONS="['_newTess', '_deleteTess', '_addContour', '_tesselate', '_getVertexCount', '_getVertices', '_getVertexIndices', '_getElementCount', '_getElements']"

cat ./src/header.js ./build/libtess2.js ./src/footer.js > ./build/libtess2-em.js
cp ./build/libtess2-em.js ./lib/libtess2.js