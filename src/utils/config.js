export const API = 'https://dd39-104-189-117-104.ngrok.io/mt-service/api';

export const statusGenerator = (statusCode, status) => {
  switch (statusCode) {
    case 'REWORK':
      return <span className="badge bg-danger me-2">{status}</span>;
    case 'DRAFT':
      return <span className="badge bg-dark me-2">{status}</span>;
    case 'SFR':
      return <span className="badge bg-primary me-2">{status}</span>;
    case 'CLOSED':
      return <span className="badge bg-success me-2">{status}</span>;
    case 'REVIEWED':
      return <span className="badge bg-secondary me-2">{status}</span>;

    default:
      return <span className="badge bg-danger me-2">{status}</span>;
  }
};
