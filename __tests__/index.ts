import { tagFormat } from "../src"

// Jest doesn't honor require.cache, so it's impossible to test this stuff
test("tagFormat", () => {
  expect(tagFormat).toMatch(/^semantic-release-commit-filter-v\$\{version\}$/u)
})
