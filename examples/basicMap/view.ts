import MapView from '../../src/MapView';
import { loadFile, loadJSON, loadTexture } from '../../src/util';
import { TextureAtlas, isMountain, isWater, TileData } from '../../src/interfaces';
import { generateRandomMap } from "../../src/map-generator"
import { varying } from './util';
import { TextureLoader } from 'three'
import { MapMeshOptions } from '../../src/MapMesh';

function asset(relativePath: string): string {
  return "../../assets/" + relativePath
}

async function loadTextureAtlas() {
  return loadJSON<TextureAtlas>(asset("land-atlas.json"))
}

async function generateMap(mapSize: number) {
  return generateRandomMap(mapSize, (q, r, height) => {
    const terrain = (height > 0.75 && "mountain") || varying("text1", "text2", "text3", "text4", "text5", "text6", "text7")
    const trees = !isMountain(height) && !isWater(height) && varying(true, false) ?
      Math.floor(Math.random() * 2) : undefined
    return { q, r, height, terrain, treeIndex: trees, fog: false, clouds: false }
  })
}

export async function initView(mapSize: number, initialZoom: number): Promise<MapView> {
  const textureLoader = new TextureLoader()
  const loadTexture = (name: string) => textureLoader.load(asset(name))
  const options: MapMeshOptions = {
    terrainAtlas: null,
    terrainAtlasTexture: loadTexture("terrain.png"),
    hillsNormalTexture: loadTexture("hills-normal.png"),
    undiscoveredTexture: loadTexture("paper.jpg"),
    transitionTexture: loadTexture("transitions.png"),
    treeSpritesheet: loadTexture("rock111.png"),
    treeSpritesheetSubdivisions: 4
  }
  const [map, atlas] = await Promise.all([generateMap(mapSize), loadTextureAtlas()])
  options.terrainAtlas = atlas

  if (window.map == null || window.map == undefined) {
    window.map = map
    localStorage.setItem('mapData', JSON.parse(JSON.stringify(map)))
    window.options = options
    //localStorage.setItem('options', JSON.stringify(options))
  } else {
    let mapData =
      map = window.map

  }
  const mapView = new MapView()
  mapView.zoom = initialZoom
  mapView.load(map, options)
  const controller = mapView.controller as DefaultMapViewController
  controller.debugOutput = document.getElementById("coordinates") as HTMLElement
  mapView.onTileSelected = (tile: TileData) => {
    // uncover tiles around initial selection
  }
  return mapView
}

/**
 * @param fog whether there should be fog on this tile making it appear darker
 * @param clouds whether there should be "clouds", i.e. an opaque texture, hiding the tile
 * @param range number of tiles around the given tile that should be updated
 * @param tile tile around which fog should be updated
 */
function setFogAround(mapView: MapView, tile: TileData, range: number, fog: boolean, clouds: boolean) {
  const tiles = mapView.getTileGrid().neighbors(tile.q, tile.r, range)

  const updated = tiles.map(t => {
    t.fog = fog
    t.clouds = clouds
    return t
  })

  mapView.updateTiles(updated)
}
