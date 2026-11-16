import { createContext, useContext, useEffect, useRef, useState, type Dispatch, type ReactNode, type RefObject, type SetStateAction } from "react";
import { useLocation } from "wouter";

export type InquiryDraft = {
  organization: string;
  manager: string;
  phone: string;
  projectType: string;
  region: string;
  timing: string;
  details: string;
  agreement: boolean;
};

const initialDraft: InquiryDraft = { organization: "", manager: "", phone: "", projectType: "", region: "", timing: "", details: "", agreement: false };
const InquiryDraftContext = createContext<{ draft: InquiryDraft; setDraft: Dispatch<SetStateAction<InquiryDraft>>; scrollPosition: RefObject<number | null> } | null>(null);

// This state lives only in the current React app; it is never persisted to storage.
export function InquiryDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<InquiryDraft>(initialDraft);
  const scrollPosition = useRef<number | null>(null);
  const [location] = useLocation();
  useEffect(() => {
    const route = location.replace(/\/+$/, "") || "/";
    if (route !== "/contact" && route !== "/privacy") scrollPosition.current = null;
  }, [location]);
  return <InquiryDraftContext.Provider value={{ draft, setDraft, scrollPosition }}>{children}</InquiryDraftContext.Provider>;
}

export function useInquiryDraft() {
  const context = useContext(InquiryDraftContext);
  if (!context) throw new Error("InquiryDraftProvider is missing");
  return context;
}
