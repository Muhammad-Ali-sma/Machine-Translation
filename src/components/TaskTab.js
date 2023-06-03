import React, { useEffect, useState } from "react";
import { Button, Dropdown, Modal, Row } from "react-bootstrap";
import {
  ArrowRight,
  ChevronDown,
  ThreeDotsVertical,
  ChevronUp,
  ChevronRight,
} from "react-bootstrap-icons";
import { useTable, usePagination } from "react-table";
import { statusGenerator } from "../utils/config";
import PaginationControl from "./PaginationControl";
import { setRework, toggleTab } from "../Redux/Slices/GlobalSlice";
import { useDispatch, useSelector } from "react-redux";
import { approveTask, closeTask, deleteTask, rejectTask, setTask } from "../Services/CommonService";
import ChangeHistoryTable from "./ChangeHistoryTable";
import DownloadFileBtn from "./DownloadFileBtn";

function TaskTableRow({ cellData, handleShow, reloadTasks }) {
  const [expandData, setExpandData] = useState(false);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();

  const ToggleMenu = (name) => {
    dispatch(toggleTab(name))
  }
  const handleOnKeyPress = (key, value) => {
    if (key.keyCode === 13 || key.keyCode === 32) {
      setExpandData(value)
    }
  }
  return (
    <>
      <tr>
        <td className="text-left p-3">
          <span tabIndex={'1'}><span className="span-color-blue">Task ID: </span> {cellData?.taskId}{" "}</span>
          <ChevronRight />{" "}
          <span className="me-2">
            <span tabIndex={'1'} className="span-color-green" aria-label={`From ${cellData?.sourceLanguage} language`}>{cellData?.sourceLanguage}</span>{" "}
            <ArrowRight />{" "}
            <span tabIndex={'1'} aria-label={`To ${cellData?.targetLanguage} language`} className="span-color-green">{cellData?.targetLanguage}</span>{" "}
          </span>
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
            <div
              style={{ height: expandData ? "auto" : 25, overflow: "hidden" }}
              tabIndex={'1'}
              aria-label={`Source Language Text: ${cellData?.sourceLanguageContent}`}
            >
              {`${cellData?.sourceLanguageContent?.slice(
                0,
                expandData ? cellData?.sourceLanguageContent.length : 100
              )}${!expandData ? "..." : ""}`}
            </div>
          )}
        </td>
        <td className="p-3" style={{ verticalAlign: "top" }}>
          <div className="d-flex justify-content-end">
            <Dropdown className="tabledropDown">
              <Dropdown.Toggle tabIndex='1' aria-label="Edit/Delete task dropdown">
                <ThreeDotsVertical />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {
                  cellData?.taskStatusCode !== "CLOSED" &&
                  <Dropdown.Item
                    onClick={() => {
                      dispatch(setRework(cellData));
                      if (cellData?.taskType === "doc") {
                        ToggleMenu("document");
                      } else {
                        ToggleMenu("text");
                      }
                    }}
                  >
                    Edit Task
                  </Dropdown.Item>
                }
                {
                  user?.role === "ROLE_SUPERVISOR" &&
                  <>
                    <Dropdown.Item onClick={() => {
                      approveTask(cellData?.taskId).then(res => {
                        if (res.data.status !== "failure") {
                          reloadTasks();
                        }
                      });
                    }}>
                      Approve Task
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => {
                      rejectTask(cellData?.taskId).then(res => {
                        if (res.data.status !== "failure") {
                          reloadTasks();
                        }
                      });
                    }}>
                      Reject Task
                    </Dropdown.Item>
                  </>
                }
                {
                  cellData?.taskStatusCode === "REVIEWED" &&
                  <Dropdown.Item onClick={() => handleShow({ type: "close", taskId: cellData?.taskId })}>
                    Close Task
                  </Dropdown.Item>
                }
                <Dropdown.Item onClick={() => handleShow({ type: "delete", taskId: cellData?.taskId })}> Delete Task </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {expandData === false ? (
              <ChevronDown
                onClick={() => setExpandData(true)}
                className="set-svg cursor-pointer ms-1"
                tabIndex='1'
                aria-label="Open accordion button"
                onKeyDown={(e) => handleOnKeyPress(e, true)}
              />
            ) : (
              <ChevronUp
                onClick={() => setExpandData(false)}
                onKeyDown={(e) => handleOnKeyPress(e, false)}
                tabIndex='1'
                aria-label="Close accordion button"
                className="set-svg cursor-pointer ms-1"

              />
            )}

          </div>
        </td>
      </tr>
      {expandData && (
        <tr>
          <td className="p-3" colSpan={2}>
            <ChangeHistoryTable expandData={cellData} forTask={true} />
          </td>
        </tr>
      )}
    </>
  );
}

function TaskTab({ setLoadingForTaskTab }) {
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [show, setShow] = useState(false);
  const [showFor, setShowFor] = useState(null);

  const toggleShowAlert = () => {
    if (showFor?.type === "close") {
      closeTask(showFor?.taskId).then(res => {
        if (res.data.status !== "failure") {
          postTasks();
        }
      });
    } else if (showFor?.type === "delete") {
      deleteTask(showFor?.taskId).then(res => {
        if (res.data.status !== "failure") {
          postTasks();
        }
      });
    }
    handleClose();
  };



  const handleClose = () => {
    setShow(false);
    setShowFor(null);
  }

  const handleShow = (showFor) => {
    setShow(true)
    setShowFor(showFor);
  }

  const [loading, setLoading] = useState(true);

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
      pageSize: 10,
    },
    usePagination
  );

  const postTasks = () => {
    setLoading(true);
    setTask(pageSize, pageIndex + 1)
      .then((res) => {
        setPageCount(Math.ceil(res?.data?.noOfItems / pageSize));
        setData(res?.data?.data);
        setLoadingForTaskTab(false);
        setLoading(false);
      }).catch(() => {
        setLoadingForTaskTab(false);
        setLoading(false);
      });
  }
  useEffect(() => {
    postTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize]);

  return (
    <>
      {
        !loading &&
        <>
          <Row className="box">
            <table {...getTableProps()} tabIndex='1' aria-label="Pending tasks table">
              <tbody {...getTableBodyProps()}>
                {page.map((row, i) => {
                  prepareRow(row);
                  const cellData = row.original;
                  return (
                    <TaskTableRow
                      key={i.toString()}
                      handleShow={handleShow}
                      cellData={cellData}
                      reloadTasks={postTasks}
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
                gotoPage={gotoPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
                pageIndex={pageIndex}
                canNextPage={canNextPage}
                canPreviousPage={canPreviousPage}
              />
            </div>
          }
        </>
      }

      <Modal tabIndex="1" show={show} onHide={handleClose}>
        <Modal.Body className="modalbody">
          {showFor?.type === "close" ?
            `Are you sure you would like to mark Task ID #${showFor?.taskId} Closed?`
            :
            `Are you sure you want to delete Task ID #${showFor?.taskId}?`
          }

        </Modal.Body>
        <Modal.Footer className="modalfooter">
          <Button variant="secondary" onClick={handleClose}>
            {" "} No{" "}
          </Button>
          <Button variant="danger" onClick={toggleShowAlert}>
            {" "} Yes{" "}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default TaskTab;
