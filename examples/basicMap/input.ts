import { KeyActions, KEY_CODES } from './util';
import MapView from '../../src/MapView';

export function initInput(mapView: MapView) {
  const keyActions: KeyActions = {
    [KEY_CODES.LEFT_ARROW]: {
      down: () => mapView.scrollDir.x = -1,
      up: () => mapView.scrollDir.x = 0
    },
    [KEY_CODES.RIGHT_ARROW]: {
      down: () => mapView.scrollDir.x = 1,
      up: () => mapView.scrollDir.x = 0
    },
    [KEY_CODES.UP_ARROW]: {
      down: () => mapView.scrollDir.y = 1,
      up: () => mapView.scrollDir.y = 0
    },
    [KEY_CODES.DOWN_ARROW]: {
      down: () => mapView.scrollDir.y = -1,
      up: () => mapView.scrollDir.y = 0
    },
    [KEY_CODES.E]: {
      down: () => mapView.setZoom(mapView.getZoom() * 0.9)
    },
    [KEY_CODES.A]: {
      down: () => mapView.rotateVector(((new THREE.Vector3(0, 1, 0)).normalize()), (1 * Math.PI / 180))
    },
    [KEY_CODES.W]: {
      down: () => mapView.rotateVector(((new THREE.Vector3(1, 0, 0)).normalize()), (1 * Math.PI / 180))
    },
    [KEY_CODES.S]: {
      down: () => mapView.rotateVector(((new THREE.Vector3(1, 0, 0)).normalize()), (-1 * Math.PI / 180))
    },
    [KEY_CODES.D]: {
      down: () => mapView.rotateVector(((new THREE.Vector3(0, 1, 0)).normalize()), (-1 * Math.PI / 180))
    },
    [KEY_CODES.Q]: {
      down: () => mapView.setZoom(mapView.getZoom() * 1.1)
    },
    [KEY_CODES.O]: {
      down: () => mapView.addObject()
    },
    [KEY_CODES.G]: {
      down: () => mapView.mapMesh.showGrid = !mapView.mapMesh.showGrid
    }
  }

  window.addEventListener("keydown", (event: KeyboardEvent) => {
    const actions = keyActions[event.keyCode]

    if (actions && "down" in actions) {
      actions["down"]()
    }
  }, false)

  window.addEventListener("keyup", (event: KeyboardEvent) => {
    const actions = keyActions[event.keyCode]

    if (actions && "up" in actions) {
      actions["up"]()
    }
  }, false)

  window.addEventListener("mousewheel", onMouseWheelHandler(mapView), false)
  window.addEventListener("DOMMouseScroll", onMouseWheelHandler(mapView), false)
  window.addEventListener("DOMContentLoaded", loadData(mapView), false)
}
function loadData(mapView: MapView) {
  return () => {
    window.mapView = mapView
    var modify = document.getElementById("modifyData");
    var load = document.getElementById("loadFile");
    var save = document.getElementById("saveFile");
    modify.addEventListener("click", modifyData, false);
    load.addEventListener("click", loadFile, false);
    save.addEventListener("click", saveFile, false);
  }
}
function loadFile() {

}
function saveFile() {
  let map = window.map
  window.mapData = window.map.toArray()
  window.map.data = window.mapData
  var mapCreated = {
    'map': window.map,
    // 'options': window.options,
    // 'mapview': window.mapView
  }
  saveDataToFile(mapCreated)
}
function saveDataToFile(mapData) {
  var objetctToSave = JSON.stringify(mapData);
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:attachment/text,' + encodeURI(objetctToSave);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'mapData.json';
  hiddenElement.click();
}
function modifyData() {
  // console.log(window.map)
  // console.log(window.options)
  // console.log(window.mapView)
  let mapView = window.mapView
  window.map._height = 8
  window.map._width = 8
  window.map.halfHeight = 4
  window.map.halfWidth = 4
  window.options.treeSpritesheetSubdivisions = 1
  mapView.load(window.map, window.options)
}
function onMouseWheelHandler(mapView: MapView) {
  return (e: MouseWheelEvent) => {
    var delta = Math.max(-1, Math.min(1, (e.wheelDeltaY || e.detail)))
    if (delta == 0) return;

    const zoom = Math.max(8.0, Math.min(500.0, mapView.getZoom() * (1.0 - delta * 0.025)))

    mapView.setZoom(zoom)
  }
}
