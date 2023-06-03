import { Row, Table } from "react-bootstrap";
import { ArrowRight } from "react-bootstrap-icons";

const ViewCustomTermTable = ({ data }) => {
  return (
    <Row className="box mt-2 p-0 overflow-hidden">
      <Table
        striped
        bordered
        hover
        className="text-left w-100 table-inside m-0"
        tabIndex={'1'}
        aria-label='Custom Data Table'
      >
        <thead>
          <tr>
            <th tabIndex={'1'} aria-label='Date Column'>Date</th>
            <th tabIndex={'1'} aria-label='Language Pair Column'>Language Pair</th>
            <th tabIndex={'1'} aria-label='Source Text Column'>Source Text</th>
            <th tabIndex={'1'} aria-label='Customized Text Column'>Customized Text</th>
            <th tabIndex={'1'} aria-label='Original Translated Text Column'>Original Translated Text</th>
          </tr>
        </thead>
        <tbody>
          {data.map((x, i) => (
            <tr key={i.toString()}>
              <td tabIndex={'2'} aria-label={`Date ${x?.createdDate}`}>{x?.createdDate}</td>
              <td tabIndex={'2'} aria-label={`From ${x?.sourceLanguage} Language To ${x?.targetLanguage} Language`}>
                {x?.sourceLanguage} <ArrowRight /> {x?.targetLanguage}
              </td>
              <td tabIndex={'2'} aria-label={`Source Text ${x?.sourceLanguageText}`}>{x?.sourceLanguageText}</td>
              <td tabIndex={'2'} aria-label={`Customized Text ${x?.targetLanguageModifiedText}`}>{x?.targetLanguageModifiedText}</td>
              <td tabIndex={'2'} aria-label={`Original Translated Text ${x?.targetLanguageOriginalText}`}>{x?.targetLanguageOriginalText}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Row>
  );
};

export default ViewCustomTermTable;
