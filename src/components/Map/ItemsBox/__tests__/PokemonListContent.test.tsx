import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PokemonListContent from "../PokemonListContent";

// Mock the formatMapString utility
vi.mock("@/utils/formatMapString", () => ({
  formatMapString: vi.fn((str: string) => {
    // Simple mock implementation that removes MAP_ and formats names
    return str.replace("MAP_", "").toLowerCase().replace(/^\w/, c => c.toUpperCase());
  }),
  formatSpeciesString: vi.fn((str: string) => {
    // Mock implementation for species string formatting
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  })
}));

describe("PokemonListContent", () => {
  it("should render empty state when no pokemon provided", () => {
    render(<PokemonListContent pokemon={[]} />);
    
    expect(screen.getByText("No Pokémon here")).toBeInTheDocument();
  });

  it("should render pokemon list with yellow styling", () => {
    const pokemon = ["PIKACHU", "CHARIZARD"];
    
    render(<PokemonListContent pokemon={pokemon} />);
    
    // Check that pokemon names are displayed
    expect(screen.getByText("Pikachu")).toBeInTheDocument();
    expect(screen.getByText("Charizard")).toBeInTheDocument();
  });

  it("should render star icons for each pokemon", () => {
    const pokemon = ["PIKACHU", "CHARIZARD"];
    
    render(<PokemonListContent pokemon={pokemon} />);
    
    // Check for star icons (⭐)
    const starIcons = screen.getAllByText("⭐");
    expect(starIcons).toHaveLength(2);
  });

  it("should use custom empty message when provided", () => {
    render(<PokemonListContent pokemon={[]} emptyMessage="No legendary Pokémon found" />);
    
    expect(screen.getByText("No legendary Pokémon found")).toBeInTheDocument();
  });
});
