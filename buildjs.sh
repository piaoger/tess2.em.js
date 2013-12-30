

export PATH=$PATH:~/emscripten

#emcc -O2 libtess2.bc tess2.c -I./../libtess2/Include -o libtess2.js --closure 1 -s EXPORTED_FUNCTIONS="['_newTess', '_deleteTess', '_addContour', '_tesselate', '_getVertexCount', '_getVertices', '_getVertexIndices', '_getElementCount', '_getElements']"
emcc   libtess2.bc tess2.c -I./../libtess2/Include -o libtess2.js --closure 1 -s EXPORTED_FUNCTIONS="['_newTess', '_deleteTess', '_addContour', '_tesselate', '_getVertexCount', '_getVertices', '_getVertexIndices', '_getElementCount', '_getElements']"

cat header.js > tess2.em.js
cat libtess2.raw.js >> tess2.em.js
cat footer.js >> tess2.em.js