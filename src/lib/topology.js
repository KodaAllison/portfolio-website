function decodeArc(topology, arcIndex) {
  const reverse = arcIndex < 0;
  const encoded = topology.arcs[reverse ? ~arcIndex : arcIndex];
  const scale = topology.transform?.scale ?? [1, 1];
  const translate = topology.transform?.translate ?? [0, 0];
  let x = 0;
  let y = 0;
  const points = encoded.map(([dx, dy]) => {
    x += dx;
    y += dy;
    return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
  });
  return reverse ? points.reverse() : points;
}

function decodeRing(topology, arcIndexes) {
  return arcIndexes.flatMap((arcIndex, index) => {
    const points = decodeArc(topology, arcIndex);
    return index === 0 ? points : points.slice(1);
  });
}

function decodeGeometry(topology, geometry) {
  if (geometry.type === "Polygon") {
    return {
      type: "Polygon",
      coordinates: geometry.arcs.map((ring) => decodeRing(topology, ring)),
    };
  }
  if (geometry.type === "MultiPolygon") {
    return {
      type: "MultiPolygon",
      coordinates: geometry.arcs.map((polygon) => (
        polygon.map((ring) => decodeRing(topology, ring))
      )),
    };
  }
  throw new Error(`Unsupported atlas geometry: ${geometry.type}`);
}

export function topologyFeatureCollection(topology, objectName) {
  const object = topology.objects?.[objectName];
  if (!object || object.type !== "GeometryCollection") {
    throw new Error(`Missing TopoJSON geometry collection: ${objectName}`);
  }

  return {
    type: "FeatureCollection",
    features: object.geometries.map((geometry) => ({
      type: "Feature",
      id: geometry.id,
      properties: geometry.properties ?? {},
      geometry: decodeGeometry(topology, geometry),
    })),
  };
}
