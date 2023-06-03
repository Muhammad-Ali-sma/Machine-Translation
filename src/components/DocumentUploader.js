import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import { X } from 'react-bootstrap-icons'
import { useSelector } from 'react-redux'
import { translateDoc, uploadDoc, uploadCustomDoc } from '../Services/CommonService'

const DocumentUploader = ({ setDocuments = () => { }, targetLanguage, tabIndex, sourceLanguage, accept = ".docx", customTab = false }) => {
  const activeTab = useSelector(state => state.global.activeTab);
  const rework = useSelector(state => state.global.rework);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [switchBtn, setSwitchBtn] = useState(false);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const inputRef = useRef();
  useEffect(() => {
    if (activeTab !== "document") {
      setFileName("");
      setSelectedFiles([]);
      setSwitchBtn(false);
      setTaskId(null);
    }
  }, [activeTab])

  useEffect(() => {
    if (activeTab === "document" && rework !== null) {
      setTaskId(rework.taskId);
    }
  }, [activeTab, rework])

  const clearFile = () => {
    setFileName("");
    setSelectedFiles([]);
    setSwitchBtn(false);
  }
  const handleOnKeyPress = (e) => {
    if (e.keyCode === 13 || e.keyCode === 32) {
      inputRef.current.click();
    }
  }
  const selectFile = (event) => {
    setFileName(event.target.files[0].name);
    setSelectedFiles(event.target.files);
    setSwitchBtn(true);
  }

  const upload = () => {
    let curFile = selectedFiles[0];
    setLoading(true)
    setProgress(0);
    setCurrentFile(curFile);

    if (!customTab) {
      if (curFile?.name.includes('_TARGET_')) {
        uploadDoc(curFile, taskId, (event) => { setProgress(Math.round((100 * event.loaded) / event.total)); })
          .then((response) => {
            if (response.data?.status === 'success') {
              setDocuments(response.data.data);
              setTaskId(response.data.data[0]?.taskId);
            }
          })
          .finally((files) => {
            setLoading(false);
            setProgress(0);
            setSwitchBtn(false);
          })

      } else {
        translateDoc(
          curFile,
          'doc',
          sourceLanguage?.sourceLanguageCode,
          targetLanguage?.targetLanguageCode,
          taskId,
          (event) => {
            setProgress(Math.round((100 * event.loaded) / event.total));
          },
        )
          .then((response) => {
            if (response.data?.status === 'success') {
              setDocuments(response.data.data);
              setTaskId(response.data.data[0]?.taskId);
            }
          })
          .finally((files) => {
            setLoading(false);
            setProgress(0);
            setSwitchBtn(false);
          })
      }
    } else {
      uploadCustomDoc(curFile, (event) => { setProgress(Math.round((100 * event.loaded) / event.total)); })
        .then((response) => {
          if (response.data?.status === 'success') {
            setDocuments(response.data.data);
          }
        })
        .finally((files) => {
          setLoading(false);
          setProgress(0);
          setSwitchBtn(false);
        })
    }

    setCurrentFile(null);
    setSelectedFiles([]);
  }

  return (
    <div>
      {currentFile && progress > 0 && progress < 100 && (
        <div className="progress mb-3">
          <div className="progress-bar progress-bar-info progress-bar-striped" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100" style={{ width: progress + '%' }} >
            {progress}%
          </div>
        </div>
      )}

      {switchBtn ? (
        loading ? (
          <Spinner animation="border" role="status" style={{ color: '#00599c' }} >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : (
          <>
            <li className="list-group-item">
              {fileName}
              <X onClick={clearFile} style={{ width: '25px', height: '25px', marginLeft: 10, position: 'relative', top: -2, }} />
            </li>
            <button tabIndex={tabIndex} className="btn btn-success my-3" onClick={upload} style={{ backgroundColor: '#00599c', color: 'white' }} >
              Upload Document
            </button>
          </>
        )
      ) : !switchBtn && (
        <>
          <h3 className="pt-4 pb-3">Choose a Document</h3>
          <p className="mt-2 mb-3">Upload a {accept} file</p>
          <label onKeyDown={(e) => handleOnKeyPress(e)} tabIndex={tabIndex} className="btn btn-success mb-2" style={{ backgroundColor: '#00599c', color: 'white' }} >
            <input ref={inputRef} className="d-none" type="file" onChange={selectFile} accept={accept} />
            Choose Document
          </label>
        </>
      )}

      <div className="d-flex justify-content-end pb-3">
        {showSend && (
          <Button className="float-right" onClick={() => { setCurrentFile(""); setSwitchBtn(false); setShowSend(false); }} >Send For review </Button>
        )}
      </div>
    </div>
  )
}

export default DocumentUploader;
