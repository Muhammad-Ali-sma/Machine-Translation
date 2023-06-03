import { downloadDoc } from "../Services/CommonService";

const DownloadFileBtn = ({ link = null, tabIndex = '-1', ariaLabel = '' }) => {
    const handleOnKeyPress = (key) => {
        if (key.keyCode === 13 || key.keyCode === 32) {
            downloadDoc(link)
        }
    }

    return (
        <>
            {
                (link && link !== null) ?
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    <a tabIndex={tabIndex} aria-label={ariaLabel} className="btn btn-outline-primary" href="#" onKeyDown={handleOnKeyPress} onClick={() => downloadDoc(link)}> {link} </a>
                    :
                    <span style={{ color: 'green' }}>Document has been submitted for translation. Please head over to Tasks tab in about 15 minutes to view the translated document.</span>
            }
        </>

    );
};

export default DownloadFileBtn;
