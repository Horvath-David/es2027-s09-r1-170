export interface Project {
  id: string
  name: string
  mapData: string
  cells: Cell[]
}

export interface Cell {
  x: number
  y: number
  type: "Grass" | "Lake" | "Mountain"
  hasTurbine: boolean
}
