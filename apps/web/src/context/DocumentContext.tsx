import { ReactNode, createContext, useContext, Dispatch, SetStateAction, useState } from 'react';

interface DocumentProviderProps {
    children: ReactNode;
}

interface DocumentContextType {
    documentUrl: string | null;
    setDocumentUrl: Dispatch<SetStateAction<string | null>>;
}

const DocumentContext = createContext<DocumentContextType>({
    documentUrl: null,
    setDocumentUrl: () => {},
});

export const useDocumentContext = () => useContext(DocumentContext);

export default function DocumentProvider({ 
    children 
}: DocumentProviderProps) {
    const [documentUrl, setDocumentUrl] = useState<string | null>(null);

    return (
        <DocumentContext.Provider value={{ documentUrl, setDocumentUrl }}>
            {children}
        </DocumentContext.Provider>
    )
}