import React from "react"
import renderer from "react-test-renderer"
import Index from "../pages/index"

describe("Index", () => {
  test("renders correctly", () => {
    const location = {
      pathname: "/",
    }

    const tree = renderer.create(<Index location={location} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
