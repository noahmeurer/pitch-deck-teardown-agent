import { ReactNode, createContext, useContext, Dispatch, SetStateAction, useState } from 'react';

interface DocumentProviderProps {
    children: ReactNode;
}

interface DocumentStorageData {
    bucketName: 'pitch-decks';
    bucketPath: string | null;
    documentUrl: string | null;
}

interface DocumentContextType {
    documentStorage: DocumentStorageData;
    setDocumentStorage: Dispatch<SetStateAction<DocumentStorageData>>;
}

const DocumentContext = createContext<DocumentContextType>({
    documentStorage: {
        bucketName: 'pitch-decks',
        bucketPath: null,
        documentUrl: null
    },
    setDocumentStorage: () => {},
});

export const useDocumentContext = () => useContext(DocumentContext);

export default function DocumentProvider({ 
    children 
}: DocumentProviderProps) {
    const [documentStorage, setDocumentStorage] = useState<DocumentStorageData>({
        bucketName: 'pitch-decks',
        bucketPath: null,
        documentUrl: null
    });

    return (
        <DocumentContext.Provider value={{ documentStorage, setDocumentStorage }}>
            {children}
        </DocumentContext.Provider>
    )
}