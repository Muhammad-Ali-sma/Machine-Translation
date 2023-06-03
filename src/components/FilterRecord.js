import { useState, useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setTaskStatus } from '../Redux/Slices/GlobalSlice';
import { getTaskStatus } from '../Services/CommonService';
import LangDropdown from './LangDropdown';
import moment from 'moment';
import { Funnel, XCircle } from "react-bootstrap-icons";
import Datepicker from './Datepicker';

const FilterRecord = ({
  taskStatusEnabled = false,
  giveBack = () => { },
  reloadData = () => { },
}) => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [filterData, setFilterData] = useState({});
  const [sourceLanguage, setSourceLanguage] = useState([]);
  const [targetLanguage, setTargetLanguage] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const taskStatusList = useSelector((state) => state.global.taskStatus);
  const sourceLanguages = useSelector((state) => state.global.sourceLanguage);
  const targetLanguages = useSelector((state) => state.global.targetLanguages);


  const resetData = () => {
    setSearch("");
    setEndDate("");
    setFilterData({});
    setStartDate("");
    setSourceLanguage(sourceLanguages?.length > 0 ? { sourceLanguage: "All", sourceLanguageCode: "" } : {});
    setTargetLanguage(targetLanguages?.length > 0 ? { targetLanguage: "All", targetLanguageCode: "" } : {});
    setSelectedStatus({ taskStatusCode: "", taskStatusDesc: "All" });
    reloadData();
  }
  useEffect(() => {
    setSourceLanguage(sourceLanguages?.length > 0 ? { sourceLanguage: "All", sourceLanguageCode: "" } : {});
    setTargetLanguage(targetLanguages?.length > 0 ? { targetLanguage: "All", targetLanguageCode: "" } : {});
  }, [sourceLanguages, targetLanguages]);

  useEffect(() => {
    setSelectedStatus({ taskStatusCode: "", taskStatusDesc: "All" });
    if (taskStatusEnabled && taskStatusList?.length === 0) {
      getTaskStatus().then((res) => {
        if (res?.data?.data) {
          dispatch(setTaskStatus([{ taskStatusCode: "", taskStatusDesc: "All" }, ...res.data.data]));
        }
      }).catch(err => console.log(err))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskStatusEnabled])

  useEffect(() => {
    var jsonBack = {};
    if (search !== undefined && search !== '') {
      jsonBack.searchText = search;
    }
    if (endDate !== undefined && endDate !== '') {
      jsonBack.toDate = moment(endDate).format('MM/DD/YYYY');
    }
    if (startDate !== undefined && startDate !== '') {
      jsonBack.fromDate = moment(startDate).format('MM/DD/YYYY');
    }
    if (sourceLanguage.sourceLanguageCode !== '') {
      jsonBack.sourceLanguageCode = sourceLanguage.sourceLanguageCode;
    }
    if (targetLanguage.targetLanguageCode !== '') {
      jsonBack.targetLanguageCode = targetLanguage.targetLanguageCode;
    }
    if (taskStatusEnabled && selectedStatus.taskStatusCode !== '') {
      jsonBack.taskStatusCode = selectedStatus.taskStatusCode;
    }
    setFilterData(jsonBack);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    endDate,
    search,
    selectedStatus,
    sourceLanguage,
    startDate,
    targetLanguage,
    taskStatusEnabled,
  ]);

  return (
    <Row className="mt-2 mb-2">
      <Col md={3} className="ps-0 mb-3 search-field custom-width">
        <div className="input-group historySearch" style={{ width: '100%' }}>
          <input
            className="form-control my-0 py-1 historySearchInput"
            type="text"
            tabIndex={'1'}
            placeholder="Search"
            aria-label="Search text field"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
      </Col>
      <Col md={3} className="position-relative ps-0  mb-3 custom-width">
        <Datepicker
          onBlur={() => { if (!moment(startDate, 'MM/DD/YYYY', true).isValid() && !moment(startDate, 'yyyy-MM-DD', true).isValid()) { setStartDate('') } }}
          placeholder="Start Date"
          value={moment(startDate, 'MM/DD/YYYY', true).isValid() || moment(startDate, 'yyyy-MM-DD', true).isValid() ? moment(startDate).format('MM/DD/YYYY') : startDate ?? ''}
          onChange={(e) => {
            setStartDate(e.target.value);
          }}
        />
      </Col>
      <Col md={3} className="position-relative ps-0  mb-3 custom-width">
        <Datepicker
          placeholder="End Date"
          onBlur={() => { if (!moment(endDate, 'MM/DD/YYYY', true).isValid() && !moment(endDate, 'yyyy-MM-DD', true).isValid()) { setEndDate('') } }}
          value={moment(endDate, 'MM/DD/YYYY', true).isValid() || moment(endDate, 'yyyy-MM-DD', true).isValid() ? moment(endDate).format('MM/DD/YYYY') : endDate ?? ""}
          onChange={(e) => {
            setEndDate(e.target.value);
          }}
        />
      </Col>
      {taskStatusEnabled && (
        <Col className="ps-0 mb-3 filter">
          <LangDropdown
            setLanguage={setSelectedStatus}
            currentlanguage={selectedStatus}
            tabIndex={'1'}
            label={'Task'}
            languages={taskStatusList}
            type={'taskStatusDesc'}
            ariaLabel="Task Status"
          />
        </Col>
      )}
      <Col className="ps-0 mb-3 filter">
        <LangDropdown
          currentlanguage={sourceLanguage}
          setLanguage={setSourceLanguage}
          tabIndex={'1'}
          label={'From Language'}
          languages={[{ sourceLanguage: 'All', sourceLanguageCode: '' }, ...sourceLanguages ?? []]}
          type={'sourceLanguage'}
          ariaLabel="From Language"
        />
      </Col>
      <Col className="ps-0 mb-3 filter">
        <LangDropdown
          currentlanguage={targetLanguage}
          setLanguage={setTargetLanguage}
          label={'To Language'}
          languages={[{ targetLanguage: 'All', targetLanguageCode: '' }, ...targetLanguages ?? []]}
          tabIndex={'1'}
          disabledLanguage={sourceLanguage?.sourceLanguage}
          ariaLabel="To Language"
          type={'targetLanguage'}
        />
      </Col>
      <Col lg={2} md={3} xs={12} className="mb-3 p-0" style={{ whiteSpace: 'nowrap' }}>
        <Button tabIndex={'1'} className="customBtn" aria-label='Reset button' onClick={resetData}>
          Reset <XCircle />
        </Button>
        <Button tabIndex={'1'} style={{ whiteSpace: 'nowrap' }} aria-label='filter button' onClick={() => reloadData(filterData)}>Filter <Funnel /></Button>
      </Col>
    </Row>
  );
};

export default FilterRecord;
