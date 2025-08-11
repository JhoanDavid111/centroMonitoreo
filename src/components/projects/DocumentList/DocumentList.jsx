// src/components/projects/DocumentList/DocumentList.jsx
import PropTypes from 'prop-types';
import { FileText, Download } from 'react-feather';
import {
  ListContainer,
  DocumentItem,
  DocumentIcon,
  DocumentInfo,
  DocumentName,
  DocumentMeta,
  DownloadButton
} from './DocumentList.styles';

const DocumentList = ({ documents }) => {
  return (
    <ListContainer>
      {documents.map((doc, index) => (
        <DocumentItem key={index}>
          <DocumentIcon>
            <FileText size={18} />
          </DocumentIcon>
          <DocumentInfo>
            <DocumentName>{doc.name}</DocumentName>
            <DocumentMeta>
              {doc.type} • {doc.size} • {doc.date}
            </DocumentMeta>
          </DocumentInfo>
          <DownloadButton>
            <Download size={18} />
          </DownloadButton>
        </DocumentItem>
      ))}
    </ListContainer>
  );
};

DocumentList.propTypes = {
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      size: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired
    })
  ).isRequired
};

DocumentList.defaultProps = {
  documents: []
};

export default DocumentList;