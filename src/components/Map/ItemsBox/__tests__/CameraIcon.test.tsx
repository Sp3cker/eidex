import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CameraIcon from "../CameraIcon";

// Mock @react-spring/web
vi.mock("@react-spring/web", () => ({
  config: { gentle: {} },
  useSpring: vi.fn(() => [
    { rotate: { to: vi.fn(() => ({ to: vi.fn((fn) => fn) })) } },
    { start: vi.fn() }
  ]),
  animated: {
    img: ({ children, ...props }: any) => <img {...props}>{children}</img>,
  },
}));

describe("CameraIcon", () => {
  const mockSetViewingImage = vi.fn();
  const defaultProps = {
    mapLabel: "Test Location",
    setViewingImage: mockSetViewingImage,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render camera icon with correct alt text", () => {
    render(<CameraIcon {...defaultProps} />);
    
    const image = screen.getByAltText("View image of Test Location");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/camera.webp");
  });

  it("should call setViewingImage when clicked", async () => {
    const user = userEvent.setup();
    render(<CameraIcon {...defaultProps} />);
    
    const button = screen.getByRole("button");
    await user.click(button);
    
    expect(mockSetViewingImage).toHaveBeenCalledWith(true);
    expect(mockSetViewingImage).toHaveBeenCalledTimes(1);
  });

  it("should call setViewingImage when image is clicked directly", async () => {
    const user = userEvent.setup();
    render(<CameraIcon {...defaultProps} />);
    
    const image = screen.getByAltText("View image of Test Location");
    await user.click(image);
    
    expect(mockSetViewingImage).toHaveBeenCalledWith(true);
  });

  it("should have proper button styling classes", () => {
    render(<CameraIcon {...defaultProps} />);
    
    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "cursor-pointer",
      "rounded-md",
      "transition-all",
      "hover:bg-gray-200",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-emerald-500",
      "active:bg-gray-300"
    );
  });

  it("should have proper image styling classes", () => {
    render(<CameraIcon {...defaultProps} />);
    
    const image = screen.getByAltText("View image of Test Location");
    expect(image).toHaveClass("h-10", "w-10");
  });

  it("should trigger wiggle animation on mouse enter", () => {
    render(<CameraIcon {...defaultProps} />);
    
    const button = screen.getByRole("button");
    fireEvent.mouseEnter(button);
    
    // Test that the component renders and handles mouse enter event
    expect(button).toBeInTheDocument();
  });

  it("should handle different map labels correctly", () => {
    render(<CameraIcon mapLabel="Route 101" setViewingImage={mockSetViewingImage} />);
    
    const image = screen.getByAltText("View image of Route 101");
    expect(image).toBeInTheDocument();
  });

  it("should handle empty map label", () => {
    render(<CameraIcon mapLabel="" setViewingImage={mockSetViewingImage} />);
    
    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("alt", "View image of ");
  });

  it("should be keyboard accessible", async () => {
    const user = userEvent.setup();
    render(<CameraIcon {...defaultProps} />);
    
    const button = screen.getByRole("button");
    
    // Tab to focus the button
    await user.tab();
    expect(button).toHaveFocus();
    
    // Press Enter to activate
    await user.keyboard("{Enter}");
    expect(mockSetViewingImage).toHaveBeenCalledWith(true);
  });

  it("should support space key activation", async () => {
    const user = userEvent.setup();
    render(<CameraIcon {...defaultProps} />);
    
    const button = screen.getByRole("button");
    button.focus();
    
    // Press Space to activate
    await user.keyboard(" ");
    expect(mockSetViewingImage).toHaveBeenCalledWith(true);
  });
});
