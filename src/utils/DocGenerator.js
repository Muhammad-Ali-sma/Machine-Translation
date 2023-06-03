import { saveAs } from "file-saver";
import { Packer, Document, Paragraph, TextRun } from "docx";

export const generateDoc = (taskId, toText) => {
  const lines = toText;
  const textRuns = lines
    .split("\n")
    .map((line) => new TextRun({ break: 1, text: line, size: 36 }));
  const paragraph = new Paragraph({ children: textRuns });
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [paragraph],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `translated_text_${taskId}.docx`);
  });
};
