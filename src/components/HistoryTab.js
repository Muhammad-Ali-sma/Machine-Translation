import React, { useEffect, useState } from "react";
import { Dropdown, Row, Spinner } from "react-bootstrap";
import { ArrowRight, ChevronDown, ChevronUp, ThreeDotsVertical, ChevronRight, } from "react-bootstrap-icons";
import { useTable, usePagination } from "react-table";
import { statusGenerator } from "../utils/config";
import ChangeHistoryTable from "./ChangeHistoryTable";
import PaginationControl from "./PaginationControl";
import { useDispatch } from "react-redux";
import { setClone, toggleTab } from "../Redux/Slices/GlobalSlice";
import { getHistory, setHistory } from "../Services/CommonService";
import FilterRecord from "./FilterRecord";
import DownloadFileBtn from "./DownloadFileBtn";

function HistoryTableRow({ cellData }) {
  const [expandData, setExpandData] = useState(null);
  const [loading, setLoading] = useState(null);
  const dispatch = useDispatch();

  const ToggleMenu = (name) => {
    dispatch(toggleTab(name))
  }
  const handleOnKeyPress = (key) => {
    if (key.keyCode === 13 || key.keyCode === 32) {
      loadHistory(cellData?.taskId)
    }
  }
  const loadHistory = (taskId) => {
    if (expandData === null) {
      setLoading(true);
      setHistory(taskId).then((res) => {
        setExpandData(res?.data?.data);
        setLoading(false);
      });
    } else {
      setExpandData(null);
    }
  };

  return (
    <>
      <tr>
        <td className="text-left p-3">
          <span tabIndex={'1'}> <span className="span-color-blue">Task ID:</span> {cellData?.taskId}{" "}</span>
          <ChevronRight />{" "}
          <span tabIndex={'1'} aria-label={`From ${cellData?.sourceLanguage} language`} className="span-color-green">{cellData?.sourceLanguage}</span>{" "}
          <ArrowRight />{" "}
          <span tabIndex={'1'} aria-label={`To ${cellData?.targetLanguage} language`} className="span-color-green">{cellData?.targetLanguage}</span>{" "}
          <ChevronRight />{" "}
          <span tabIndex={'1'} aria-label={`Status ${cellData?.taskStatus}`}>{statusGenerator(cellData?.taskStatusCode, cellData?.taskStatus)}</span>
          <ChevronRight />{" "}
          <span>
            {" "}
            {cellData?.taskStatusCode === "CLOSED" ? (
              <span>
                <span tabIndex={'1'} aria-label={`Closed By ${cellData?.createdBy}`} className="span-color-blue">Closed By: </span>{" "}
                <span className="span-color-black">{cellData?.createdBy}</span>{" "}
                <span tabIndex={'1'} aria-label={`Closed Date ${cellData?.createdDate}`} className="span-color-blue">Closed Date: </span>{" "}
                <span className="span-color-black">{cellData?.createdDate}</span>
              </span>
            ) : cellData?.taskStatusCode === "REVIEWED" ||
              cellData?.taskStatusCode === "REWORK" ? (
              <span>
                <span tabIndex={'1'} aria-label={`Reviewed By ${cellData?.createdBy}`} className="span-color-blue">Reviewed By: </span>{" "}
                <span className="span-color-black">{cellData?.createdBy}</span>{" "}
                <span tabIndex={'1'} aria-label={`Reviewed Date ${cellData?.createdDate}`} className="span-color-blue">Reviewed Date: </span>{" "}
                <span className="span-color-black">
                  {cellData?.createdDate}
                </span>
              </span>
            ) : (
              <span>
                <span tabIndex={'1'} aria-label={`Submitted By ${cellData?.createdBy}`} className="span-color-blue">Submitted By: </span>{" "}
                <span className="span-color-black">
                  {cellData?.createdBy}
                </span>{" "}
                <span tabIndex={'1'} aria-label={`Submitted Date ${cellData?.createdDate}`} className="span-color-blue">Submitted Date: </span>{" "}
                <span className="span-color-black">
                  {cellData?.createdDate}
                </span>
              </span>
            )}
          </span>{" "}
          <br />
          {cellData?.taskType === "doc" ? (
            <DownloadFileBtn tabIndex='1' ariaLabel={`Download translated file`} link={cellData?.targetLanguageContent !== null ? cellData?.targetLanguageContent : cellData?.sourceLanguageContent} />
          ) : (
            <span tabIndex={'1'} aria-label={`Source Language Text: ${cellData?.sourceLanguageContent}`}>{cellData?.sourceLanguageContent}</span>
          )}
          <br />
        </td>
        <td className="p-3" style={{ verticalAlign: "top" }}>
          <div className="d-flex justify-content-end">
            {cellData?.taskType !== 'doc' &&
              <Dropdown className="tabledropDown">
                <Dropdown.Toggle tabIndex='1' aria-label="Clone task dropdown">
                  <ThreeDotsVertical />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => {
                      dispatch(setClone(cellData))
                      ToggleMenu("text");
                    }}
                  >
                    Clone Task
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            }
            {expandData === null ? (
              <>
                {loading ? (
                  <div className="mt-3">
                    <Spinner animation="border" />
                  </div>
                ) : (
                  <ChevronDown
                    onKeyDown={(e) => handleOnKeyPress(e)}
                    onClick={(e) => loadHistory(cellData?.taskId)}
                    className="set-svg cursor-pointer ms-1"
                    aria-label="open accordion button"
                    tabIndex='1'
                  />
                )}
              </>
            ) : (
              <ChevronUp
                aria-label="close accordion button"
                onKeyDown={(e) => handleOnKeyPress(e)}
                onClick={() => loadHistory(cellData?.taskId)}
                className="set-svg cursor-pointer ms-1"
                tabIndex={'1'}
              />
            )}

          </div>
        </td>
      </tr>
      {expandData !== null && (
        <tr>
          <td className="p-3" colSpan={2}>
            <ChangeHistoryTable expandData={expandData} />
          </td>
        </tr>
      )}
    </>
  );
}

function HistoryTab({
  setLoadingForHistoryTab,
}) {

  const columns = React.useMemo(
    () => [
      {
        Header: "Task ID",
        accessor: "taskID",
      },
    ],
    []
  );

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(1);
  const [filterData, setFilterData] = useState({});
  let isFilteredByBtn = false;

  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    page,
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
      pageSize: 10
    },
    usePagination
  );

  const getData = (filterData, index = 0) => {
    setLoading(true);
    getHistory(filterData, pageSize, index + 1)
      .then((res) => {
        if (isFilteredByBtn) {
          gotoPage(0);
          isFilteredByBtn = false;
        }
        setPageCount(Math.ceil(res?.data?.noOfItems / pageSize));
        setData(res?.data?.data);
        setLoadingForHistoryTab(false);
        setLoading(false);
      }).catch(() => {
        setLoadingForHistoryTab(false);
        setLoading(false);
      });
  }
  useEffect(() => {
    getData(filterData, pageIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);

  return (
    <>
      <FilterRecord taskStatusEnabled={true} reloadData={(data) => { isFilteredByBtn = true; setFilterData(data); getData(data, 0); }} />
      {
        !loading &&
        <>
          <Row className="box" tabIndex='1' aria-label="History tasks table">
            <table {...getTableProps()}>
              <tbody {...getTableBodyProps()}>
                {page.map((row, i) => {
                  prepareRow(row);
                  const cellData = row.original;
                  return (
                    <HistoryTableRow
                      key={i.toString()}
                      cellData={cellData}
                    />
                  );
                })}

                {page.length === 0 &&
                  <tr>
                    <td tabIndex={'1'} colSpan={5}><div style={{ color: 'red', textAlign: 'center' }}>No data found!</div></td>
                  </tr>
                }
              </tbody>
            </table>
          </Row>
          {page.length > 0 &&
            <div className="p-2">
              <PaginationControl
                pageOptions={pageOptions}
                gotoPage={(index) => { gotoPage(index); getData(filterData, index); }}
                pageSize={pageSize}
                setPageSize={setPageSize}
                pageIndex={isFilteredByBtn ? 0 : pageIndex}
                canNextPage={canNextPage}
                canPreviousPage={canPreviousPage}
                isFilteredByBtn={isFilteredByBtn}
              />
            </div>
          }
        </>
      }

    </>
  );
}

export default HistoryTab;
