import { useLocalStorage } from "usehooks-ts"

type GridView = "grid" | "list"

export function useGridView() {
    const [gridView, setGridView] = useLocalStorage("gridView", "grid")

    return {
        gridView, setGridView
    }
}
