import { useDocumentContext } from '@/context/DocumentContext';


export const PitchDeck = () => {
    const { documentUrl, setDocumentUrl } = useDocumentContext();

    if (documentUrl === null) {
      return (
        <div>No PDF uploaded</div>
      )
    }

    return (
      <iframe src={documentUrl} width="100%" height="445px"></iframe>
    )
  }