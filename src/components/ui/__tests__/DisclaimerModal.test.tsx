import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DisclaimerModal from "../DisclaimerModal";

// Mock the useMapStore
const mockDeselectMap = vi.fn();
vi.mock("../../../stores/useMapStore", () => ({
  useMapStore: vi.fn(() => mockDeselectMap),
}));

// Mock the body scroll lock hook
vi.mock("../../../hooks/useBodyScrollLock", () => ({
  default: vi.fn(),
}));

describe("DisclaimerModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the trigger button", () => {
    render(<DisclaimerModal />);
    
    const triggerButton = screen.getByRole("button", { name: /click here/i });
    expect(triggerButton).toBeInTheDocument();
  });

  it("should open modal when trigger button is clicked", async () => {
    const user = userEvent.setup();
    render(<DisclaimerModal />);
    
    const triggerButton = screen.getByRole("button", { name: /click here/i });
    await user.click(triggerButton);
    
    expect(screen.getByText("Disclaimer")).toBeInTheDocument();
    expect(screen.getByText(/I made this map because Gen-3 is best gen/)).toBeInTheDocument();
  });

  it("should call deselectMap when modal is opened", async () => {
    const user = userEvent.setup();
    render(<DisclaimerModal />);
    
    const triggerButton = screen.getByRole("button", { name: /click here/i });
    await user.click(triggerButton);
    
    expect(mockDeselectMap).toHaveBeenCalledTimes(1);
  });

  it("should close modal when close button is clicked", async () => {
    const user = userEvent.setup();
    render(<DisclaimerModal />);
    
    // Open modal
    const triggerButton = screen.getByRole("button", { name: /click here/i });
    await user.click(triggerButton);
    
    // Close modal
    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);
    
    expect(screen.queryByText("Disclaimer")).not.toBeInTheDocument();
  });

  it("should display all disclaimer content sections", async () => {
    const user = userEvent.setup();
    render(<DisclaimerModal />);
    
    const triggerButton = screen.getByRole("button", { name: /click here/i });
    await user.click(triggerButton);
    
    // Check for key sections
    expect(screen.getByText(/I made this map because Gen-3 is best gen/)).toBeInTheDocument();
    expect(screen.getByText(/Pokémon and all related characters/)).toBeInTheDocument();
    expect(screen.getByText(/Nintendo Co., Ltd./)).toBeInTheDocument();
    expect(screen.getByText(/Game Freak Inc./)).toBeInTheDocument();
    expect(screen.getByText("The Pokémon Company International")).toBeInTheDocument();
  });

  it("should have proper styling classes on trigger button", () => {
    render(<DisclaimerModal />);
    
    const triggerButton = screen.getByRole("button", { name: /click here/i });
    expect(triggerButton).toHaveClass(
      "text-sm/3",
      "text-white",
      "underline",
      "transition-colors",
      "hover:text-emerald-400"
    );
  });

  it("should be scrollable when content overflows", async () => {
    const user = userEvent.setup();
    render(<DisclaimerModal />);
    
    const triggerButton = screen.getByRole("button", { name: /click here/i });
    await user.click(triggerButton);
    
    const scrollableContent = screen.getByText("Disclaimer").closest("div");
    expect(scrollableContent).toHaveClass("overflow-y-auto");
  });
});
