import Badge from '@/components/Badge'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

describe("Badge", () => {
    it("renders an in-text badge", () => {
        render(<Badge>Test</Badge>)
        expect(screen.getByText("Test")).toBeInTheDocument()
    })
    it("renders an in-text badge with a color", () => {
        const { container } = render(<Badge color="red">Test</Badge>)
        expect(container).toMatchSnapshot()
    })
})