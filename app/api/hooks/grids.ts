import { create } from "zustand"

type GridView = "grid" | "list"

type GridViewStore = {
    gridView: GridView
    setGridView: (gridView: GridView) => void
}

export const useGridView = create<GridViewStore>(set => ({
    gridView: "list",
    setGridView: (gridView: GridView) => {
        set({gridView})
    }
}))