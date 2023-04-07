import { render, screen } from "@testing-library/react";
import App from "./App";

test("Renders h1 with 'Navimap'", () => {
  render(<App />);
  const heading = screen.getByRole("heading", { name: /navimap/i });
  expect(heading).toBeInTheDocument();
});
