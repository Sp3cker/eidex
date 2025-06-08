import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BaseListContent } from "../BaseListContent";

describe("BaseListContent", () => {
  it("should render empty state when no items provided", () => {
    render(<BaseListContent items={[]} />);
    
    expect(screen.getByText("No items here")).toBeInTheDocument();
  });

  it("should render custom empty message", () => {
    render(<BaseListContent items={[]} emptyMessage="Custom empty message" />);
    
    expect(screen.getByText("Custom empty message")).toBeInTheDocument();
  });

  it("should render items with default content renderer", () => {
    const items = [
      { name: "Item 1", description: "Description 1" },
      { name: "Item 2", description: "Description 2" }
    ];
    
    render(<BaseListContent items={items} />);
    
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Description 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Description 2")).toBeInTheDocument();
  });

  it("should render items with custom content renderer", () => {
    const items = [{ name: "Item 1", value: 42 }];
    const renderContent = vi.fn((item: typeof items[0]) => (
      <div>Custom: {item.name} - {item.value}</div>
    ));
    
    render(<BaseListContent items={items} renderContent={renderContent} />);
    
    expect(screen.getByText("Custom: Item 1 - 42")).toBeInTheDocument();
    expect(renderContent).toHaveBeenCalledWith(items[0]);
  });

  it("should render items with custom icon renderer", () => {
    const items = [{ name: "Item 1" }];
    const renderIcon = vi.fn(() => <span>🎯</span>);
    
    render(<BaseListContent items={items} renderIcon={renderIcon} />);
    
    expect(screen.getByText("🎯")).toBeInTheDocument();
    expect(renderIcon).toHaveBeenCalledWith(items[0]);
  });

  it("should apply custom className", () => {
    const items = [{ name: "Item 1" }];
    
    render(<BaseListContent items={items} className="custom-class test-bg" />);
    
    const itemElement = screen.getByText("Item 1").closest("div");
    expect(itemElement).toHaveClass("custom-class", "test-bg");
  });

  it("should use custom getKey function", () => {
    const items = [
      { id: "unique-1", name: "Item 1" },
      { id: "unique-2", name: "Item 2" }
    ];
    const getKey = vi.fn((item: typeof items[0]) => item.id);
    
    render(<BaseListContent items={items} getKey={getKey} />);
    
    expect(getKey).toHaveBeenCalledWith(items[0], 0);
    expect(getKey).toHaveBeenCalledWith(items[1], 1);
  });

  it("should handle items without description", () => {
    const items = [{ name: "Item without description" }];
    
    render(<BaseListContent items={items} />);
    
    expect(screen.getByText("Item without description")).toBeInTheDocument();
    // Should not render empty description
    expect(screen.queryByText("")).not.toBeInTheDocument();
  });
});
