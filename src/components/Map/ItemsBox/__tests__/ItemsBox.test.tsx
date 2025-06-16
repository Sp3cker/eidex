import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import ItemsBox from "../ItemsBox";

// Mock the useMapStore
const mockStore = {
  selectedMap: null as string | null,
  setViewingImage: vi.fn(),
};

vi.mock("@/stores/useMapStore", () => ({
  useMapStore: vi.fn((selector: (state: typeof mockStore) => unknown) => {
    return selector(mockStore);
  }),
}));
vi.mock("@/utils/formatMapString", () => ({
  formatMapString: vi.fn((mapName: string) => mapName?.replace(/_/g, " ") || ""),
}));

// Mock @react-spring/web
vi.mock("@react-spring/web", () => ({
  useSpring: vi.fn(() => [
    { opacity: 1, translateY: 0 }
  ]),
  animated: {
    nav: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => <nav {...props}>{children}</nav>,
  },
}));

// Mock child components
vi.mock("../ItemsList", () => ({
  default: () => <div data-testid="items-list">Items List</div>,
}));

vi.mock("../CameraIcon", () => ({
  default: ({ mapLabel, setViewingImage }: { mapLabel: string; setViewingImage: (viewing: boolean) => void }) => (
    <button
      data-testid="camera-icon"
      onClick={() => setViewingImage(true)}
    >
      Camera for {mapLabel}
    </button>
  ),
}));

describe("ItemsBox", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.selectedMap = null;
    mockStore.setViewingImage = vi.fn();
  });

  it("should render with basic structure", () => {
    render(<ItemsBox />);
    
    expect(screen.getByTestId("items-list")).toBeInTheDocument();
    expect(screen.getByTestId("camera-icon")).toBeInTheDocument();
  });

  it("should render with map name when map is selected", () => {
    mockStore.selectedMap = "test_map";
    
    render(<ItemsBox />);
    
    const mapLabel = screen.getByText("test map");
    expect(mapLabel).toBeInTheDocument();
  });

  it("should render ItemsList component", () => {
    render(<ItemsBox />);
    
    const itemsList = screen.getByTestId("items-list");
    expect(itemsList).toBeInTheDocument();
  });

  it("should render CameraIcon with correct props", () => {
    mockStore.selectedMap = "test_map";
    
    render(<ItemsBox />);
    
    const cameraIcon = screen.getByTestId("camera-icon");
    expect(cameraIcon).toBeInTheDocument();
    expect(cameraIcon).toHaveTextContent("Camera for test map");
  });

  it("should have proper styling classes", () => {
    const { container } = render(<ItemsBox />);
    const nav = container.firstChild;
    
    expect(nav).toHaveClass(
      "dexnav-grid",
      "dexnav-z",
      "max-h-[70vh]",
      "w-full",
      "overflow-y-auto",
      "rounded-lg"
    );
  });

  it("should show empty map label when no map selected", () => {
    render(<ItemsBox />);
    
    const mapLabel = screen.getByRole("heading", { level: 3 });
    expect(mapLabel).toHaveTextContent("");
  });

  it("should pass setViewingImage to CameraIcon", () => {
    mockStore.selectedMap = "test_map";
    
    render(<ItemsBox />);
    
    const cameraButton = screen.getByTestId("camera-icon");
    cameraButton.click();
    
    expect(mockStore.setViewingImage).toHaveBeenCalledWith(true);
  });
});
