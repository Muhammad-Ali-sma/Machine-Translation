import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { Mic, X } from "react-feather";
import LangDropdown from "./LangDropdown";
import ClipboardWordIcon from "../utils/ClipboardWordIcon";
import { getTranslation, postSendText4Review } from "../Services/CommonService";
import { useDispatch, useSelector } from "react-redux";
import { setRework } from "../Redux/Slices/GlobalSlice";
import { setNotification } from "../Redux/Slices/NotificationSlice";

function TextTab() {

  const [activeReview, setActiveReview] = useState(false);
  const [disableReview, setDisableReview] = useState(false);
  const [fromText, setFromText] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  const [toText, setToText] = useState("");
  const [taskId, setTaskId] = useState("");
  const [loading, setLoading] = useState(false);
  const sourceLanguages = useSelector(state => state.global.sourceLanguage);
  const targetLanguages = useSelector(state => state.global.targetLanguages);
  const rework = useSelector(state => state.global.rework);
  const clone = useSelector(state => state.global.clone);
  const activeTab = useSelector(state => state.global.activeTab);

  const [sourceLanguage, setSourceLanguage] = useState([]);
  const [targetLanguage, setTargetLanguage] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    setSourceLanguage(sourceLanguages?.length > 0 ? sourceLanguages[0] : {});
    setTargetLanguage(targetLanguages?.length > 0 ? targetLanguages[0] : {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceLanguages, targetLanguages]);


  useEffect(() => {
    setActiveReview(false);
  }, [fromText]);

  useEffect(() => {
    setDisableReview(false);
  }, [toText]);

  useEffect(() => {
    if (rework !== null && rework.taskType === "text") {
      setToText(rework?.targetLanguageContent);
      setFromText(rework?.sourceLanguageContent);
      setCharacterCount(rework?.sourceLanguageContent.length);
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
      setTaskId(rework?.taskId);
    }

    if (clone !== null && clone.taskType === "text") {
      setFromText(clone?.sourceLanguageContent);
      setCharacterCount(clone?.sourceLanguageContent.length);
      var sLangC = sourceLanguages.filter(
        (x) => x.sourceLanguage === clone?.sourceLanguage
      );
      sLangC = sLangC.length > 0 ? sLangC[0] : sourceLanguages[0];
      var tLangC = targetLanguages.filter(
        (x) => x.targetLanguage === clone?.targetLanguage
      );
      tLangC = tLangC.length > 0 ? tLangC[0] : targetLanguages[0];
      setSourceLanguage(sLangC);
      setTargetLanguage(tLangC);
    }

    if (clone === null && rework === null) {
      setToText("");
      setFromText("");
      setCharacterCount(0);
    }
    // eslint-disable-next-line
  }, [rework, clone]);

  const translate = () => {
    setLoading(true);
    let tempId = rework !== null && rework.taskType === "text" ? rework.taskId : null;
    getTranslation(sourceLanguage?.sourceLanguageCode, fromText, targetLanguage?.targetLanguageCode, tempId)
      .then((res) => {
        if (res.status === 200) {
          setToText(res?.data?.data[0] ? res?.data?.data[0]?.targetLanguageContent : "");
          setTaskId(res?.data?.data[0] ? res?.data?.data[0]?.taskId : "");
          setActiveReview(true);
        }
        setLoading(false);
      }).catch(() => setLoading(false));
  };

  const sendForReview = () => {
    setDisableReview(true);
    setLoading(true);
    postSendText4Review(taskId, targetLanguage?.targetLanguageCode, toText, 'text')
      .then((res) => {
        setLoading(false);
      }).catch(() => setLoading(false));
  };

  const handleOnKeyPress = (key) => {
    if (key.keyCode === 13 || key.keyCode === 32) {
      setFromText("");
      setToText("");
      setTaskId("");
      setTargetLanguage(targetLanguages[0]);
      setCharacterCount(0);
    }
  }

  useEffect(() => {
    if (rework?.taskType === "text") {
      dispatch(setNotification({ message: `You are editing Task # ${rework?.taskId}`, type: 'info' }));
    }
    if (clone) {
      dispatch(setNotification({ message: `You have cloned Task # ${clone?.taskId}`, type: 'info' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rework, clone])

  useEffect(() => {

    // re-enable everything that we disabled previously
    // handle.disengage();

    if (activeTab !== "text") {
      setFromText("");
      setToText("");
      setCharacterCount(0);
      dispatch(setNotification({ message: ``, type: '' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  return (
    <>
      <Row className="box mt-2" id='test'>
        <Col sm="6" className="width-set">
          <Row className="row-bottom d-flex align-items-center">
            <Col sm="2">
              <p className="box-txt pt-3">From</p>
            </Col>
            <Col sm="10" className="d-flex align-items-center" style={{ gap: "20px" }} >
              <LangDropdown
                currentlanguage={sourceLanguage}
                setLanguage={setSourceLanguage}
                languages={sourceLanguages}
                type={"sourceLanguage"}
                tabIndex={'1'}
                ariaLabel="From Language"
              />
              {rework && rework?.taskType === "text" && (
                <>
                  {rework?.taskId}
                  <X onClick={() => dispatch(setRework(null))} />
                </>
              )}
            </Col>
          </Row>
          <Container className="box-2 pt-3 pb-1">
            <div>
              <div className="d-flex flex-row-reverse position-relative">
                <Button
                  variant="default"
                  className="position-absolute"
                  style={{ right: -20 }}
                  aria-label="clear text button"
                  tabIndex={'3'}
                  onKeyDown={handleOnKeyPress}
                  onClick={() => {
                    setFromText("");
                    setToText("");
                    setTaskId("");
                    setTargetLanguage(targetLanguages[0]);
                    setCharacterCount(0);
                  }}
                >
                  <X />
                </Button>
              </div>
              <Form style={{ marginRight: '2vw' }}>
                <Form.Group className="mb-3" >
                  <Form.Control
                    tabIndex={'2'}
                    as="textarea"
                    className="border-0 shadow-none"
                    maxLength={5000}
                    placeholder="Start Typing here"
                    value={fromText}
                    onChange={(e) => {
                      setFromText(e.target.value);
                      setToText("");
                      setCharacterCount(e.target.value.length);
                    }}
                    rows={18}
                  />
                </Form.Group>
              </Form>
            </div>
            <div className="d-flex pt-4 pb-3">
              <Col md="6" className="d-flex">
                <Mic className="mic" />
              </Col>
              <Col md="6" className="d-flex justify-content-end">
                <p className="count-txt">{characterCount}/5000</p>
              </Col>
            </div>
          </Container>
        </Col>
        <Col sm="6" className="width-set">
          <Row className="row-bottom d-flex align-items-center">
            <Col sm="2">
              <p className="box-txt pt-3">To</p>
            </Col>
            <Col sm="10" className="d-flex align-items-center" style={{ gap: "20px" }} >
              <LangDropdown
                currentlanguage={targetLanguage}
                setLanguage={setTargetLanguage}
                languages={targetLanguages}
                type={"targetLanguage"}
                disabledLanguage={sourceLanguage?.sourceLanguage}
                ariaLabel="To Language"
                tabIndex={'1'}
              />
            </Col>
          </Row>
          <Container className="pt-3 pb-1">
            <div>
              <ClipboardWordIcon taskId={taskId} toText={toText} />
              <Form style={{ marginRight: '2vw' }}>
                <Form.Group className="mb-3">
                  <Form.Control
                    tabIndex={'4'}
                    as="textarea"
                    className="border-0 shadow-none"
                    maxLength={5000}
                    placeholder="Start Typing here"
                    value={toText}
                    onChange={(e) => {
                      setToText(e.target.value);
                      if (rework !== null && fromText === rework.sourceLanguageContent) {
                        setActiveReview(true);
                      }

                    }}
                    rows={18}
                  />
                </Form.Group>
              </Form>
            </div>
            <div className="float-right pt-4 mb-3 set-flex">
              {activeReview ? (
                <Button tabIndex={'6'} variant="primary" disabled={disableReview} onClick={() => { sendForReview(); }} > Send for Review </Button>
              )
                :
                (
                  <Button tabIndex={'6'} variant="primary" onClick={() => { translate(); }} >
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Translate"
                    )}
                  </Button>
                )
              }
            </div>
          </Container>
        </Col>
      </Row>
    </>
  );
}
export default TextTab;
