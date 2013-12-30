
// https://github.com/kripken/emscripten/wiki/Interacting-with-code#accessing-memory
//https://github.com/kripken/emscripten/wiki/embind

//#include <tesselator.h>
// TODO
// Another CI:  https://drone.io/
// Example:
TESStesselator* newTess(int size);

void deleteTess(TESStesselator* tess);

void addContour(TESStesselator* tess, int size, const void* pointer, int stride, int count);

int tesselate(TESStesselator* tess, int windingRule, int elementType, int polySize, int vertexSize, const TESSreal* normal);

int getVertexCount(TESStesselator* tess);

const TESSreal* getVertices(TESStesselator* tess);

const TESSindex* getVertexIndices(TESStesselator* tess);

int getElementCount(TESStesselator* tess);

const TESSindex* getElements(TESStesselator* tess);
