import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { Mic, X } from "react-feather";
import LangDropdown from "./LangDropdown";
import ClipboardWordIcon from "../utils/ClipboardWordIcon";
import { translateCustomTerm, uploadCustomTerm } from "../Services/CommonService";
import { useDispatch, useSelector } from "react-redux";
import DocumentUploader from "./DocumentUploader";
import { setNotification } from "../Redux/Slices/NotificationSlice";

function CustomTab() {
  const [sourceLanguage, setSourceLanguage] = useState([]);
  const [targetLanguage, setTargetLanguage] = useState([]);
  const sourceLanguages = useSelector(state => state.global.sourceLanguage);
  const targetLanguages = useSelector(state => state.global.targetLanguages);
  const activeTab = useSelector(state => state.global.activeTab);

  const [activeReview, setActiveReview] = useState(false);
  const [fromText, setFromText] = useState();
  const [characterCount, setCharacterCount] = useState(0);
  const [toText, setToText] = useState("");
  const [customTermId, setCustomTermId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSourceLanguage(sourceLanguages?.length > 0 ? sourceLanguages[0] : {});
  }, [sourceLanguages]);

  useEffect(() => {
    setTargetLanguage(targetLanguages?.length > 0 ? targetLanguages[0] : {});
  }, [targetLanguages]);

  useEffect(() => {
    setActiveReview(false);
  }, [sourceLanguage, targetLanguage, fromText]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (activeTab !== "view") {
      setFromText("");
      setToText("");
      setCharacterCount(0);
      setCustomTermId("");
      dispatch(setNotification({ message: ``, type: '' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])


  const translate = () => {
    setLoading(true);
    translateCustomTerm(sourceLanguage?.sourceLanguageCode, fromText, targetLanguage?.targetLanguageCode)
      .then((res) => {
        setToText(res.data.data[0] ? res.data.data[0].targetLanguageContent : "");
        setCustomTermId(res.data.data[0] ? res.data.data[0].taskId : "");
        setActiveReview(true);
        setLoading(false);
      })
      .finally((error) => {
        setLoading(false);
      });
  };

  const sendCustomData = () => {
    setLoading(true);
    uploadCustomTerm(customTermId, toText)
      .then((res) => {
        setLoading(false);
      })
      .finally((error) => {
        setLoading(false);
      });
  };

  const handleOnKeyPress = (key) => {
    if (key.keyCode === 13 || key.keyCode === 32) {
      setFromText("");
      setToText("");
      setCustomTermId("");
      setTargetLanguage(targetLanguages[0]);
      setCharacterCount(0);
    }
  }

  return (
    <>
      <Row>
        <Row className="box mt-2 m-0 p-0">
          <Col md="6" className="width-set">
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
                  ariaLabel="From Language"
                  tabIndex={'1'}
                />
              </Col>
            </Row>
            <Container className="box-2 pt-3 pb-1">
              <div>
                <div className="d-flex flex-row-reverse mb-2 position-relative">
                  <Button
                    className="position-absolute"
                    style={{ right: -20 }}
                    variant="default"
                    aria-label="clear text button"
                    tabIndex={'3'}
                    onKeyDown={handleOnKeyPress}
                    onClick={() => {
                      setFromText("");
                      setToText("");
                      setCustomTermId("");
                      setTargetLanguage(targetLanguages[0]);
                      setCharacterCount(0);
                    }}
                  >
                    <X />
                  </Button>
                </div>
                <Form style={{ marginRight: '2vw' }}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      tabIndex={'2'}
                      as="textarea"
                      className="border-0 shadow-none"
                      maxLength={200}
                      placeholder="Start Typing here"
                      value={fromText}
                      onChange={(e) => {
                        setFromText(e.target.value);
                        setToText("");
                        setCharacterCount(e.target.value.length);
                      }}
                      rows={6}
                    />
                  </Form.Group>
                </Form>
              </div>
              <div className="d-flex pt-4 pb-3">
                <Col md="6" className="d-flex">
                  <Mic className="mic" />
                </Col>
                <Col md="6" className="d-flex justify-content-end">
                  <p className="count-txt">{characterCount}/200 </p>
                </Col>
              </div>
            </Container>
          </Col>
          <Col md="6" className="width-set">
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
                  tabIndex={'1'}
                  ariaLabel="To Language"
                />
              </Col>
            </Row>
            <Container className="pt-3 pb-1">
              <div>
                <ClipboardWordIcon customTermId={customTermId} toText={toText} />
                <Form style={{ marginRight: '2vw' }}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      tabIndex={'4'}
                      as="textarea"
                      className="border-0 shadow-none"
                      maxLength={300}
                      placeholder="Start Typing here"
                      value={toText}
                      onChange={(e) => {
                        setToText(e.target.value);
                      }}
                      rows={6}
                    />
                  </Form.Group>
                </Form>
              </div>
              <div className="float-right pt-4 mb-3 set-flex">
                {!activeReview && (
                  <Button
                    tabIndex={'5'}
                    variant="primary"
                    onClick={() => {
                      translate();
                    }}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Translate"
                    )}
                  </Button>
                )}{" "}
                {activeReview && (
                  <Button
                    tabIndex={'5'}
                    variant="primary"
                    onClick={() => {
                      sendCustomData();
                    }}
                  >
                    Transmit Custom Data
                  </Button>
                )}{" "}
              </div>
            </Container>
          </Col>
        </Row>
        <Col md="12">
          <br />
          <a href="/" tabIndex={'5'}>Download a example file</a>
          <br />
          <DocumentUploader tabIndex={'5'} targetLanguage={targetLanguage} sourceLanguage={sourceLanguage} accept={".csv"} customTab={true} />
        </Col>
      </Row>
    </>
  );
}
export default CustomTab;
