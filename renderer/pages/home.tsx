import React from "react";
import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

// Assign Type
interface TextContent {
  text: string;
  fontSize?: number;
  bold?: boolean;
}

interface ListContent {
  ul: string[];
}

type DocumentContent = (TextContent | ListContent | { text: string })[];

interface PdfDocument {
  content: DocumentContent;
}

// Example Document 
const exampleDoc: PdfDocument = {
    content: [
      { text: "Test first paragraph", fontSize: 18, bold: true },
      { text: "\n" },
      { text: "Second P", fontSize: 14 },
      {
        ul: ["List 1", "List 2", "List 3"],
      },
    ],
  };

  
export default function HomePage() {
  
  
  const [saveStatus, setSaveStatus] = useState<string>("");

  useEffect(() => {
    const unsubscribe = window.ipc.on('pdf-saved', (result: {success: boolean, path:string, error?:string }) => {
      if(result.success) {
        setSaveStatus(`PDF saved at : ${result.path}`)
      }else{
        setSaveStatus(`Error : ${result.error}`)
      }
    })

    return () => {
      unsubscribe();
    }
  },[])

  const handleExport = (doc: PdfDocument) => {
    const pdfDocGenerator = pdfMake.createPdf(doc);
    // pdfDocGenerator.download('example.pdf')
    setSaveStatus("Generating PDF...");
    
    pdfDocGenerator.getBase64((pdfData) => {
      window.ipc.send("save-pdf", { pdfBuffer: pdfData });
    });
  };

  return (
    <React.Fragment>
      <Head>
        <title>Project PDF Make/Print</title>
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div>
          <Image
            className="mx-auto"
            src="/images/images.png"
            alt="ECU SHOP Logo"
            width={256}
            height={128}
          />
        </div>
        <button
          className="btn-blue mt-4"
          onClick={() => handleExport(exampleDoc)}
        >
          CLICK HERE TO CREATE PDF
        </button>
        {saveStatus && <div className="mt-4 text-sm">{saveStatus}</div>}
      </div>
    </React.Fragment>
  );
}
