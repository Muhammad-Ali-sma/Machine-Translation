import { useEffect, useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import { X } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { setRework } from "../Redux/Slices/GlobalSlice";
import { getReworkData, postSendDoc4Review } from "../Services/CommonService";
import { statusGenerator } from "../utils/config";
import LangDropdown from "./LangDropdown";
import DocumentUploader from "./DocumentUploader";
import { setNotification } from "../Redux/Slices/NotificationSlice";
import DownloadFileBtn from "./DownloadFileBtn";

function DocumentTab() {
  const [sourceLanguage, setSourceLanguage] = useState([]);
  const [targetLanguage, setTargetLanguage] = useState([]);
  const [data, setData] = useState([]);
  const sourceLanguages = useSelector(state => state.global.sourceLanguage);
  const targetLanguages = useSelector(state => state.global.targetLanguages);
  const activeTab = useSelector(state => state.global.activeTab);
  const rework = useSelector(state => state.global.rework);

  const dispatch = useDispatch();

  const handleOnSend = () => {
    postSendDoc4Review(data.length > 0 ? data[data.length - 1]?.taskId : null, 'doc')
      .then((response) => {
        if (response.data?.status === 'success') {
          setData([]);
          dispatch(setRework(null))
        }
      })
      .catch(() => {
        setData([]);
      })
  }

  useEffect(() => {
    setSourceLanguage(sourceLanguages?.length > 0 ? sourceLanguages[0] : {});
  }, [sourceLanguages]);

  useEffect(() => {
    setTargetLanguage(targetLanguages?.length > 0 ? targetLanguages[0] : {});
  }, [targetLanguages]);

  useEffect(() => {
    if (rework !== null && rework?.taskType === "doc") {
      var sLang = sourceLanguages.filter(
        (x) => x.sourceLanguage === rework?.sourceLanguage
      );
      sLang = sLang.length > 0 ? sLang[0] : sourceLanguages[0];
      var tLang = targetLanguages.filter(
        (x) => x.targetLanguage === rework?.targetLanguage
      );
      tLang = tLang.length > 0 ? tLang[0] : targetLanguages[0];
      setSourceLanguage(sLang);
      setTargetLanguage(tLang);

      if (rework.taskId) {
        getReworkData(rework.taskId).then(res => {
          setData(res.data.data);
        });

      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rework]);

  useEffect(() => {
    if (activeTab !== "document") {
      setData([]);
      dispatch(setNotification({ message: ``, type: '' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  return (
    <>
      <Row className="box mt-2">
        <Col md="6">
          <Row className="row-bottom d-flex align-items-center">
            <Col sm="2">
              <p className="box-txt pt-3">From</p>
            </Col>
            <Col sm="4" className="d-flex align-items-center" style={{ gap: "20px" }} >
              <LangDropdown
                currentlanguage={sourceLanguage}
                setLanguage={setSourceLanguage}
                languages={sourceLanguages}
                ariaLabel="From Language"
                type={"sourceLanguage"}
                tabIndex={'1'}
              />
            </Col>
            <Col sm="6">
              {(data.length > 0) &&
                <span className="fw-bold d-flex align-items-center justify-content-start">
                  Task Id: <span className="fw-normal px-1"> {data[data.length - 1]?.taskId} </span>
                  <X style={{ cursor: 'pointer' }} onClick={() => { setData([]); dispatch(setRework(null)) }} />
                </span>
              }
            </Col>
          </Row>
        </Col>
        <Col md="6">
          <Row className="row-bottom d-flex align-items-center">
            <Col sm="2">
              <p className="box-txt pt-3">To</p>
            </Col>
            <Col sm="10" className="d-flex align-items-center" style={{ gap: "20px" }} >
              <LangDropdown
                currentlanguage={targetLanguage}
                setLanguage={setTargetLanguage}
                languages={targetLanguages}
                disabledLanguage={sourceLanguage?.sourceLanguage}
                ariaLabel="To Language"
                type={"targetLanguage"}
                tabIndex={'1'}
              />
            </Col>
          </Row>
        </Col>
        <Col md="12" className="mt-4 pt-4">
          <DocumentUploader
            tabIndex='2'
            sourceLanguage={sourceLanguage}
            targetLanguage={targetLanguage}
            setDocuments={(e) => { setData([...e, ...data]); }}
          />
        </Col>

        {(data?.length > 0) &&
          <>
            <Table tabIndex={'3'} aria-label='Translated Documents Table' striped bordered hover className="text-left w-100 table-inside m-0 mt-5">
              <thead>
                <tr>
                  <th tabIndex={'3'}>Created Date</th>
                  <th tabIndex={'5'}>Created By</th>
                  <th tabIndex={'7'}>Source Document</th>
                  <th tabIndex={'9'}>Translated Document</th>
                  <th tabIndex={'11'}>Status</th>
                </tr>

              </thead>
              <tbody>
                {data?.map((x, i) => (
                  <tr key={i.toString()}>
                    <td tabIndex={'4'}>{x?.createdDate}</td>
                    <td tabIndex={'6'}>
                      {x?.createdBy}
                    </td>
                    <td tabIndex={'8'}><DownloadFileBtn link={x?.sourceLanguageContent} /></td>
                    <td tabIndex={'10'}><DownloadFileBtn link={x?.targetLanguageContent} /></td>
                    <td tabIndex={'12'}>{statusGenerator(x?.taskStatusCode, x?.taskStatusCode)}</td>
                  </tr>
                ))
                }
              </tbody>
            </Table>
            <div>
              <Button tabIndex={'13'} className="float-right mt-3 mb-2" onClick={handleOnSend}> Send For review </Button>
            </div>
          </>
        }
      </Row>
    </>
  );
}
export default DocumentTab;
