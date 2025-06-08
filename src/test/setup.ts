import "@testing-library/jest-dom";

// Mock window.location and history API for testing
const mockLocation = {
  href: "http://localhost:3000",
  pathname: "/",
  search: "",
  hash: "",
};

const mockHistory = {
  pushState: vi.fn(),
  replaceState: vi.fn(),
};

// @ts-ignore
global.window = Object.create(window);
Object.defineProperty(window, "location", {
  value: mockLocation,
  writable: true,
});
Object.defineProperty(window, "history", {
  value: mockHistory,
  writable: true,
});

// Mock addEventListener and removeEventListener
window.addEventListener = vi.fn();
window.removeEventListener = vi.fn();

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
  mockLocation.href = "http://localhost:3000";
  mockLocation.pathname = "/";
  mockLocation.search = "";
  mockLocation.hash = "";
});
