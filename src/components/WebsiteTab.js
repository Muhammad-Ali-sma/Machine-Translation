import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Download } from "react-bootstrap-icons";
import { ArrowRight } from "react-feather";
import { useSelector } from "react-redux";
import LangDropdown from "./LangDropdown";

function WebsiteTab() {
  const [sourceLanguage, setSourceLanguage] = useState([]);
  const [targetLanguage, setTargetLanguage] = useState([]);
  const sourceLanguages = useSelector(state => state.global.sourceLanguage);
  const targetLanguages = useSelector(state => state.global.targetLanguages);
  const [downloadAvailable, setDownloadAvailable] = useState(false);
  const activeTab = useSelector(state => state.global.activeTab);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setSourceLanguage(sourceLanguages?.length > 0 ? sourceLanguages[0] : {});
  }, [sourceLanguages]);

  useEffect(() => {
    setTargetLanguage(targetLanguages?.length > 0 ? targetLanguages[0] : {});
  }, [targetLanguages]);

  useEffect(() => {
    setSearch("");
  }, [activeTab])

  return (
    <Row className="box">
      <Col md="6">
        <Row className="row-bottom d-flex align-items-center">
          <Col sm="2">
            <p className="box-txt pt-3">From</p>
          </Col>
          <Col sm="2">
            <LangDropdown
              currentlanguage={sourceLanguage}
              setLanguage={setSourceLanguage}
              languages={sourceLanguages}
              type={"sourceLanguage"}
            />
          </Col>
        </Row>
      </Col>
      <Col md="6">
        <Row className="row-bottom d-flex align-items-center">
          <Col sm="2">
            <p className="box-txt pt-3">To</p>
          </Col>
          <Col sm="2">
            <LangDropdown
              currentlanguage={targetLanguage}
              setLanguage={setTargetLanguage}
              disabledLanguage={sourceLanguage?.sourceLanguage}
              languages={targetLanguages}
              type={"targetLanguage"}
            />
          </Col>
        </Row>
      </Col>
      <Col md="12" className="d-flex justify-content-center pb-5 mt-5 mb-5">
        <div className="input-group md-form form-sm form-1 pt-5 pb-5">
          <input
            className="form-control search-input my-0 py-1"
            type="text"
            placeholder="Search"
            aria-label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="input-group-prepend">
            <Button
              className="btn-download"
              onClick={() => {
                setDownloadAvailable(!downloadAvailable);
              }}
            >
              {downloadAvailable ? (
                <Download style={{ width: "30px", height: "28px" }} />
              ) : (
                <ArrowRight />
              )}
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  );
}
export default WebsiteTab;
