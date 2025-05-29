import { useDocumentContext } from '@/context/DocumentContext';


export const PitchDeck = () => {
    const { documentStorage } = useDocumentContext();

    if (documentStorage.documentUrl === null) {
      return (
        <div>No PDF uploaded</div>
      )
    }

    return (
      <iframe src={documentStorage.documentUrl} width="100%" height="445px"></iframe>
    )
  }