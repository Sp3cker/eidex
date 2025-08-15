import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DisclaimerModal from "../Modal/DisclaimerModal";

describe("DisclaimerModal", () => {
  it("should render disclaimer title", () => {
    render(<DisclaimerModal />);
    
    expect(screen.getByText("Disclaimer")).toBeInTheDocument();
  });

  it("should display all disclaimer content sections", () => {
    render(<DisclaimerModal />);
    
    // Check for key sections
    expect(screen.getByText(/Pokémon and all related characters/)).toBeInTheDocument();
    expect(screen.getByText(/Nintendo Co., Ltd./)).toBeInTheDocument();
    expect(screen.getByText(/Game Freak Inc./)).toBeInTheDocument();
    expect(screen.getByText("The Pokémon Company International")).toBeInTheDocument();
    expect(screen.getByText(/Creatures Inc./)).toBeInTheDocument();
  });

  it("should display project information", () => {
    render(<DisclaimerModal />);
    
    expect(screen.getByText(/This project gets the item locations/)).toBeInTheDocument();
    expect(screen.getByText(/Emerald Imperium Github repository/)).toBeInTheDocument();
    expect(screen.getByText(/SporySparser/)).toBeInTheDocument();
    expect(screen.getByText(/LheaRachel's Porydex/)).toBeInTheDocument();
  });

  it("should display official site information", () => {
    render(<DisclaimerModal />);
    
    expect(screen.getByText(/The official site for the project is/)).toBeInTheDocument();
    expect(screen.getByText(/emeraldimperium.net/)).toBeInTheDocument();
  });

  it("should display warning about fake sites", () => {
    render(<DisclaimerModal />);
    
    expect(screen.getByText(/Anyone else claiming to be the official site is/)).toBeInTheDocument();
    expect(screen.getByText(/lying/)).toBeInTheDocument();
  });

  it("should display recommended projects", () => {
    render(<DisclaimerModal />);
    
    expect(screen.getByText(/For projects I'd endorse/)).toBeInTheDocument();
    expect(screen.getByText(/Official Pokédex/)).toBeInTheDocument();
    expect(screen.getByText(/Pokémon Emerald Imperium Homepage/)).toBeInTheDocument();
  });

  it("should display attribution for map image", () => {
    render(<DisclaimerModal />);
    
    expect(screen.getByText(/I got the map image from/)).toBeInTheDocument();
    expect(screen.getByText(/Jamie07's DeviantArt/)).toBeInTheDocument();
  });

  it("should display community information", () => {
    render(<DisclaimerModal />);
    
    expect(screen.getByText(/The source of truth is the Discord and the Pokecommunity post/)).toBeInTheDocument();
    expect(screen.getByText(/If you find an error in the data, please report it in the EI Discord/)).toBeInTheDocument();
  });
});
