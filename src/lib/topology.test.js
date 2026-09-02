import test from "node:test";
import assert from "node:assert/strict";
import { topologyFeatureCollection } from "./topology.js";

test("decodes transformed polygon arcs and joins", () => {
  const topology = {
    type: "Topology",
    transform: { scale: [2, 3], translate: [10, -5] },
    arcs: [
      [[0, 0], [2, 0], [0, 2]],
      [[0, 2], [-2, 0], [0, -2]],
    ],
    objects: {
      countries: {
        type: "GeometryCollection",
        geometries: [{
          type: "Polygon",
          id: "AAA",
          properties: { name: "Example" },
          arcs: [[0, 1]],
        }],
      },
    },
  };

  assert.deepEqual(topologyFeatureCollection(topology, "countries"), {
    type: "FeatureCollection",
    features: [{
      type: "Feature",
      id: "AAA",
      properties: { name: "Example" },
      geometry: {
        type: "Polygon",
        coordinates: [[[10, -5], [14, -5], [14, 1], [6, 1], [6, -5]]],
      },
    }],
  });
});

test("rejects a missing collection", () => {
  assert.throws(() => topologyFeatureCollection({ objects: {} }, "countries"));
});
