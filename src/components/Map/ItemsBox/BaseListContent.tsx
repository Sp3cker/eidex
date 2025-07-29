import React from "react";

export const EmptyState = React.memo(function EmptyState({
  message,
}: {
  message: string;
}) {
  return (
    <p className="cool-font py-2 text-center text-sm text-gray-500">
      {message}
    </p>
  );
});
/**
 * Basically draws boxes around your render functions.
 */
interface BaseListContentProps<T> {
  items: T[];
  emptyMessage?: string;
  className?: string;
  renderIcon?: (item: T) => React.ReactNode;
  renderContent: (item: T) => React.ReactNode;
  getKey?: (item: T, index: number) => string | number;
}

export function BaseListContent<T>({
  items,
  emptyMessage = "No items here",
  className = "",
  renderIcon,
  renderContent,
  getKey = (_, index) => index,
}: BaseListContentProps<T>) {
  if (items.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div>
      {items.map((item, index) => (
        <div
          key={getKey(item, index)}
          className={`cool-font mb-1 flex cursor-pointer items-center p-2 gap-3 rounded border shadow-sm transition-colors ${className}`}
        >
          {renderIcon && renderIcon(item)}

          <div className="flex min-w-0 flex-1 flex-col">
            {renderContent(item)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default BaseListContent;
