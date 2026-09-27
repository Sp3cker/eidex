import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PartyMons from "../components/Map/TrainerBattleInfo/PartyMons";

const firstGloom = { id: 44, lvl: 201, moves: [72, 78, 73, 235] };
const secondGloom = { id: 44, lvl: 201, moves: [124, 77, 73, 235] };

describe("trainer party moves", () => {
  it("shows each Gloom's own moves when selecting their party buttons", () => {
    const { container } = render(
      <PartyMons party={[firstGloom, secondGloom]} />,
    );
    const buttons = Array.from(container.querySelectorAll("button")).filter(
      (button) => button.querySelector('img[src="/icon/44/icon.webp"]'),
    );
    expect(buttons).toHaveLength(2);
    expect(screen.getByText("Mega Drain")).toBeInTheDocument();

    fireEvent.click(buttons[1]);
    expect(screen.getByText("Sludge")).toBeInTheDocument();
    expect(screen.getByText("Poison Powder")).toBeInTheDocument();
    expect(screen.queryByText("Mega Drain")).not.toBeInTheDocument();

    fireEvent.click(buttons[0]);
    expect(screen.getByText("Mega Drain")).toBeInTheDocument();
    expect(screen.getByText("Stun Spore")).toBeInTheDocument();
    expect(screen.queryByText("Sludge")).not.toBeInTheDocument();
  });
});
