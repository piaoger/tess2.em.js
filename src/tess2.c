#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <tesselator.h>
#include "tess2.h"


TESStesselator* newTess(int size)
{
    return tessNewTess(NULL);;
}

void deleteTess(TESStesselator* tess)
{
    tessDeleteTess(tess);
}

void addContour(TESStesselator* tess, int size, const void* pointer, int stride, int count)
{
    tessAddContour(tess, size, pointer, stride, count);
}

int tesselate(TESStesselator* tess, int windingRule, int elementType, int polySize, int vertexSize, const TESSreal* normal)
{
    return tessTesselate(tess, windingRule, elementType, polySize, vertexSize, normal);
}

int getVertexCount(TESStesselator* tess)
{
    return tessGetVertexCount(tess);
}

const TESSreal* getVertices(TESStesselator* tess)
{
    return tessGetVertices(tess);
}

const TESSindex* getVertexIndices(TESStesselator* tess)
{
    return tessGetVertexIndices(tess);
}

int getElementCount(TESStesselator* tess)
{
    return tessGetElementCount(tess);
}

const TESSindex* getElements(TESStesselator* tess)
{
    return tessGetElements(tess);
}
