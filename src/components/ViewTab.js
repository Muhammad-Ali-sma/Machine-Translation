import React, { useEffect, useState } from "react";
import { useTable, usePagination } from "react-table";
import PaginationControl from "./PaginationControl";
import ViewCustomTermTable from "./ViewCustomTermTable";
import { retrieveCustomTerms } from "../Services/CommonService";
import FilterRecord from "./FilterRecord";
import { Row } from "react-bootstrap";

function ViewTab({ setLoadingForViewTab }) {
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  let isFilteredByBtn = false;

  const columns = React.useMemo(
    () => [
      {
        Header: "Task ID",
        accessor: "taskID",
      },
    ],
    []
  );

  const {
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
      manualPagination: true,
      pageCount: pageCount,
      pageSize: 10,
    },
    usePagination
  );

  const getData = (filterData, index = 0) => {
    setLoading(true);
    retrieveCustomTerms(filterData, pageSize, index + 1)
      .then((res) => {
        if (isFilteredByBtn) {
          gotoPage(0);
          isFilteredByBtn = false;
        }
        setPageCount(Math.ceil(res?.data?.noOfItems / pageSize));
        setData(res?.data?.data);
        setLoadingForViewTab(false);
        setLoading(false);
      }).catch(() => {
        setLoadingForViewTab(false);
        setLoading(false);
      });;
  }
  useEffect(() => {
    getData(filterData, pageIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);


  return (
    <>
      <FilterRecord reloadData={(data) => { isFilteredByBtn = true; setFilterData(data); getData(data, 0); }} />

      {data.length > 0 &&
        <>
          <ViewCustomTermTable data={data} />
          <div className="p-2">
            <PaginationControl
              pageOptions={pageOptions}
              gotoPage={(index) => { gotoPage(index); getData(filterData, index); }}
              pageSize={pageSize}
              setPageSize={setPageSize}
              pageIndex={pageIndex}
              canNextPage={canNextPage}
              canPreviousPage={canPreviousPage}
              data={data}
            />
          </div>
        </>
      }
      {!loading && data.length === 0 &&
        <Row className="box">
          <table>
            <tr>
              <td colSpan={5}><div style={{ color: 'red', textAlign: 'center' }}>No data found!</div></td>
            </tr>
          </table>
        </Row>
      }

    </>
  );
}

export default ViewTab;
