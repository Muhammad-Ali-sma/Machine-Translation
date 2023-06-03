const PaginationControl = ({
  pageOptions,
  gotoPage,
  pageSize,
  setPageSize,
  pageIndex,
  canNextPage,
  canPreviousPage,
}) => {
  const handleOnKeyPress = (key) => {
    if (key.keyCode === 13 || key.keyCode === 32) {
      setPageSize(
        Number(key.target.value === "All" ? 999999 : key.target.value)
      );
    }
  }
  return (
    <div className="pagination pt-2 pb-5 float-right">
      <button
        className="nav-btn"
        onClick={() => gotoPage(pageIndex - 1)}
        disabled={!canPreviousPage}
        tabIndex={pageSize}
        aria-label={`Go to previous page`}
      >
        <span>Prev</span>
      </button>
      <span>
        {pageOptions.slice(0, 10).map((po) => (
          <button
            tabIndex={pageSize}
            key={`page_${po.toString()}`}
            onClick={() => {
              gotoPage(po);
            }}
            className={`navside-btn ${pageIndex === po && "active"}`}
            aria-label={`Page number ${po + 1}`}
          >
            {po + 1}
          </button>
        ))}
      </span>
      <button
        className="nav-btn"
        onClick={() => gotoPage(pageIndex + 1)}
        disabled={!canNextPage}
        tabIndex={pageSize}
        aria-label={`Go to next page`}
      >
        {" "}
        <span>Next</span>
      </button>

      <span className="pagtxt"> | Page size : </span>

      <select
        className="pageInput"
        value={pageSize}
        tabIndex={pageSize}
        aria-label="Select page size dropdown"
        onKeyDown={(e) => handleOnKeyPress(e)}
        onChange={(e) => setPageSize(Number(e.target.value === "All" ? 999999 : e.target.value))}
      >
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            {" "}
            {pageSize}{" "}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PaginationControl;
