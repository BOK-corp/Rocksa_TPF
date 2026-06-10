// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "@rocksa/ui";

describe("Button", () => {
  it("renders its label", () => {
    render(<Button variant="primary">Explore collection</Button>);

    expect(screen.getByRole("button", { name: /explore collection/i })).toBeInTheDocument();
  });
});
