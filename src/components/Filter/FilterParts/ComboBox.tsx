const ComboBox = () => {
  <div className="relative inline-flex w-full" data-hs-combo-box="">
    <div className="relative w-full">
      <input
        className="block w-full rounded-lg border-gray-200 px-4 py-2.5 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 sm:py-3 sm:text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
        type="text"
        role="combobox"
        aria-expanded="false"
        value="Argentina"
        data-hs-combo-box-input=""
      />
      <div
        className="absolute end-3 top-1/2 -translate-y-1/2"
        data-hs-combo-box-toggle=""
      >
        <svg
          className="size-3.5 shrink-0 text-gray-500 dark:text-neutral-500"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m7 15 5 5 5-5"></path>
          <path d="m7 9 5-5 5 5"></path>
        </svg>
      </div>
    </div>
    <div
      className="absolute z-50 max-h-72 w-full space-y-0.5 overflow-hidden overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-900"
      style="display: none;"
      data-hs-combo-box-output=""
    >
      <div
        className="focus:outline-hidden w-full cursor-pointer rounded-lg px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        tabindex="0"
        data-hs-combo-box-output-item=""
      >
        <div className="flex w-full items-center justify-between">
          <span
            data-hs-combo-box-search-text="Argentina"
            data-hs-combo-box-value=""
          >
            Argentina
          </span>
          <span className="hs-combo-box-selected:block hidden">
            <svg
              className="size-3.5 shrink-0 text-blue-600 dark:text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
        </div>
      </div>
      <div
        className="focus:outline-hidden w-full cursor-pointer rounded-lg px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        tabindex="1"
        data-hs-combo-box-output-item=""
      >
        <div className="flex w-full items-center justify-between">
          <span
            data-hs-combo-box-search-text="Brazil"
            data-hs-combo-box-value=""
          >
            Brazil
          </span>
          <span className="hs-combo-box-selected:block hidden">
            <svg
              className="size-3.5 shrink-0 text-blue-600 dark:text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
        </div>
      </div>
      <div
        className="focus:outline-hidden w-full cursor-pointer rounded-lg px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        tabindex="2"
        data-hs-combo-box-output-item=""
      >
        <div className="flex w-full items-center justify-between">
          <span
            data-hs-combo-box-search-text="China"
            data-hs-combo-box-value=""
          >
            China
          </span>
          <span className="hs-combo-box-selected:block hidden">
            <svg
              className="size-3.5 shrink-0 text-blue-600 dark:text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
        </div>
      </div>
      <div
        className="focus:outline-hidden w-full cursor-pointer rounded-lg px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        tabindex="3"
        data-hs-combo-box-output-item=""
      >
        <div className="flex w-full items-center justify-between">
          <span data-hs-combo-box-search-text="USA" data-hs-combo-box-value="">
            USA
          </span>
          <span className="hs-combo-box-selected:block hidden">
            <svg
              className="size-3.5 shrink-0 text-blue-600 dark:text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
        </div>
      </div>
      <div
        className="focus:outline-hidden w-full cursor-pointer rounded-lg px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        tabindex="3"
        data-hs-combo-box-output-item=""
      >
        <div className="flex w-full items-center justify-between">
          <span
            data-hs-combo-box-search-text="Italy"
            data-hs-combo-box-value=""
          >
            Italy
          </span>
          <span className="hs-combo-box-selected:block hidden">
            <svg
              className="size-3.5 shrink-0 text-blue-600 dark:text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
        </div>
      </div>
      <div
        className="focus:outline-hidden w-full cursor-pointer rounded-lg px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        tabindex="3"
        data-hs-combo-box-output-item=""
      >
        <div className="flex w-full items-center justify-between">
          <span
            data-hs-combo-box-search-text="France"
            data-hs-combo-box-value=""
          >
            France
          </span>
          <span className="hs-combo-box-selected:block hidden">
            <svg
              className="size-3.5 shrink-0 text-blue-600 dark:text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
        </div>
      </div>
    </div>
  </div>;
};
