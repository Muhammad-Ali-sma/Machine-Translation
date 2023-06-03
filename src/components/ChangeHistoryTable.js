import { Table } from "react-bootstrap";
import { statusGenerator } from "../utils/config";
import DownloadFileBtn from "./DownloadFileBtn";

const ChangeHistoryTable = ({ expandData, forTask = false }) => {

  return (
    <Table striped bordered hover className="text-left w-100 table-inside m-0" tabIndex={'-1'}>
      <thead>
        {forTask ?
          <tr>
            <th tabIndex={'1'} aria-label={expandData.taskType === 'doc' ? "Source Document Column" : "Source Text Column"}>{expandData.taskType === 'doc' ? "Source Document" : "Source Text"}</th>
            <th tabIndex={'1'} aria-label={expandData.taskType === 'doc' ? "Translated Document Column" : "Translated Text Column"}>{expandData.taskType === 'doc' ? "Translated Document" : "Translated Text"}</th>
          </tr>
          :
          <tr>
            <th tabIndex={'1'} aria-label={"Created Date Column"}>Created Date</th>
            <th tabIndex={'1'} aria-label={"Created By Column"}>Created By</th>
            <th tabIndex={'1'} aria-label={expandData[0]?.taskType === 'doc' ? "Source Document Column" : "Source Text Column"}>{expandData[0]?.taskType === 'doc' ? "Source Document" : "Source Text"}</th>
            <th tabIndex={'1'} aria-label={expandData[0]?.taskType === 'doc' ? "Translated Document Column" : "Translated Text Column"}>{expandData[0]?.taskType === 'doc' ? "Translated Document" : "Translated Text"}</th>
            <th tabIndex={'1'} aria-label="Status Column">Status</th>
          </tr>
        }

      </thead>
      <tbody>
        {forTask ?
          <>
            {expandData?.taskType === 'doc' ?
              <tr>
                <td><DownloadFileBtn tabIndex={'1'} ariaLabel={`Source Language Content ${expandData?.sourceLanguageContent}`} link={expandData?.sourceLanguageContent} /></td>
                <td><DownloadFileBtn tabIndex={'1'} ariaLabel={`Target Language Content ${expandData?.targetLanguageContent}`} link={expandData?.targetLanguageContent} /></td>
              </tr>
              :
              <tr>
                <td tabIndex={'1'} aria-label={`Source Language Content ${expandData?.sourceLanguageContent}`}>{expandData?.sourceLanguageContent}</td>
                <td tabIndex={'1'} aria-label={`Target Language Content ${expandData?.targetLanguageContent}`}>{expandData?.targetLanguageContent}</td>
              </tr>
            }
          </>
          :
          <>
            {expandData.map((x, i) => (
              <tr key={i.toString()}>
                <td tabIndex={'1'} aria-label={`Created Date ${x?.createdDate}`}>{x?.createdDate}</td>
                <td tabIndex={'1'} aria-label={`Created By ${x?.createdBy}`}>
                  {x?.createdBy}
                </td>
                {x?.taskType === 'doc' ?
                  <>
                    <td><DownloadFileBtn tabIndex={'1'} ariaLabel={`Download source language content`} link={x?.sourceLanguageContent} /></td>
                    <td><DownloadFileBtn tabIndex={'1'} ariaLabel={`Download target language content`} link={x?.targetLanguageContent} /></td>
                  </>
                  :
                  <>
                    <td tabIndex={'1'} aria-label={`Source language content ${x?.sourceLanguageContent}`}>{x?.sourceLanguageContent}</td>
                    <td tabIndex={'1'} aria-label={`Target language content ${x?.targetLanguageContent}`}>{x?.targetLanguageContent}</td>
                  </>
                }
                <td tabIndex={'1'} aria-label={`Status ${x?.taskStatus}`}>{statusGenerator(x?.taskStatusCode, x?.taskStatus)}</td>
              </tr>
            ))}
          </>
        }
      </tbody>
    </Table>
  );
};

export default ChangeHistoryTable;
