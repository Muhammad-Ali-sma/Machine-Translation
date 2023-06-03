import { Col, Container, Nav, Row, Tab, Spinner } from "react-bootstrap";
import "../assets/css/index.scss";
import { Check, Clock, FileText, UploadCloud, Type, Eye } from "react-feather";
import TextTab from "../components/TextTab";
import DocumentTab from "../components/DocumentTab";
import CustomTab from "../components/CustomTab";
import TaskTab from "../components/TaskTab";
import HistoryTab from "../components/HistoryTab";
import ViewTab from "../components/ViewTab";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useSelector, useDispatch } from 'react-redux';
import { getSoruceLang, getTargetLang } from '../Services/CommonService';
import { addSourceLanguage, addTargetLanguage, setRework, toggleTab } from '../Redux/Slices/GlobalSlice';
import MessageInfo from "../components/MessageInfo";
import allyMin from "ally.js";

const Home = () => {

  const [loadingForViewTab, setLoadingForViewTab] = useState(false);
  const [loadingForTaskTab, setLoadingForTaskTab] = useState(false);
  const [loadingForHistoryTab, setLoadingForHistoryTab] = useState(false);
  const user = useSelector(state => state.auth.userName);
  const activeTab = useSelector(state => state.global.activeTab);

  const dispatch = useDispatch();


  const getSourceLanguages = () => {
    getSoruceLang().then((res) => {
      dispatch(addSourceLanguage(res?.data?.data));
    }).catch(err => console.log(err))
  }
  const getTargetLanguages = () => {
    getTargetLang().then((res) => {
      dispatch(addTargetLanguage(res?.data?.data));
    }).catch(err => console.log(err))
  }

  const ToggleMenu = (name) => {
    dispatch(setRework(null))
    dispatch(toggleTab(name))
  }
  const handleOnKeyPress = (key, name) => {
    if (key.keyCode === 13 || key.keyCode === 32) {
      dispatch(setRework(null))
      dispatch(toggleTab(name))
    }
  }
  useEffect(() => {
    var handle = allyMin.maintain.disabled({
      filter: '#app',
    });
    handle.disengage();
    getTargetLanguages();
    getSourceLanguages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header showAvatar="true" userName={user} />
      <div className="container mt-2">
        <MessageInfo />
      </div>
      <div className="App mt-5" id="app">
        <Container>
          <Tab.Container
            id="left-tabs-example"
            activeKey={activeTab}
            defaultActiveKey="text"
          >
            <Row>
              <Col md={8}>
                <Nav className="d-flex">
                  <Nav.Item tabIndex={'1'} aria-label="Text Tab" onKeyDown={(e) => handleOnKeyPress(e, 'text')}>
                    <Nav.Link
                      tabIndex={'-1'}
                      eventKey="text"
                      onClick={() => ToggleMenu("text")}
                    >
                      Text <Type />
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item tabIndex={'1'} aria-label="Document Tab" onKeyDown={(e) => handleOnKeyPress(e, 'document')}>
                    <Nav.Link
                      eventKey="document"
                      tabIndex={'-1'}
                      onClick={() => ToggleMenu("document")}
                    >
                      Document <FileText />
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item tabIndex="1" aria-label="Upload Custom Data Tab" onKeyDown={(e) => handleOnKeyPress(e, 'upload')}>
                    <Nav.Link
                      eventKey="upload"
                      tabIndex={'-1'}
                      onClick={() => ToggleMenu("upload")}
                    >
                      Upload Custom Data <UploadCloud />
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item tabIndex="1" aria-label="View Custom Data Tab" onKeyDown={(e) => handleOnKeyPress(e, 'view')}>
                    <Nav.Link
                      tabIndex={'-1'}
                      eventKey="view"
                      onClick={() => {
                        ToggleMenu("view");
                        if (activeTab !== "view") {
                          setLoadingForViewTab(true);
                        }
                      }}
                    >
                      View Custom Data {" "}
                      {loadingForViewTab ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <Eye />
                      )}
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col md={4} className="set-width">
                <Nav className="d-flex justify-content-end space-20">
                  <Nav.Item tabIndex="1" aria-label="Pending Tasks Tab" onKeyDown={(e) => handleOnKeyPress(e, 'task')}>
                    <Nav.Link
                      tabIndex={'-1'}
                      eventKey="task"
                      onClick={() => {
                        ToggleMenu("task");
                        if (activeTab !== "task") {
                          setLoadingForTaskTab(true);
                        }
                      }}
                    >
                      <span>
                        Pending Tasks{" "}
                        {loadingForTaskTab ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          <Check />
                        )}
                      </span>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item tabIndex="1" aria-label="Historical Tasks Tab" onKeyDown={(e) => handleOnKeyPress(e, 'history')}>
                    <Nav.Link
                      tabIndex={'-1'}
                      eventKey="history"
                      onClick={() => {
                        ToggleMenu("history");
                        if (activeTab !== "history") {
                          setLoadingForHistoryTab(true);
                        }
                      }}
                    >
                      <span>
                        Historical Tasks{" "}
                        {loadingForHistoryTab ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          <Clock />
                        )}
                      </span>
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={12}>
                <Tab.Content>
                  <Tab.Pane eventKey="text">
                    <TextTab />
                  </Tab.Pane>
                  <Tab.Pane eventKey="document">
                    <DocumentTab />
                  </Tab.Pane>
                  <Tab.Pane eventKey="upload">
                    <CustomTab />
                  </Tab.Pane>
                  {activeTab === "view" && (
                    <Tab.Pane eventKey="view">
                      <ViewTab setLoadingForViewTab={setLoadingForViewTab} />
                    </Tab.Pane>
                  )}
                  {activeTab === "task" && (
                    <Tab.Pane eventKey="task">
                      <TaskTab
                        setLoadingForTaskTab={setLoadingForTaskTab}
                      />
                    </Tab.Pane>
                  )}
                  {activeTab === "history" && (
                    <Tab.Pane eventKey="history">
                      <HistoryTab
                        setLoadingForHistoryTab={setLoadingForHistoryTab}
                      />
                    </Tab.Pane>
                  )}
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Container>
      </div>
    </>
  );
}

export default Home;
