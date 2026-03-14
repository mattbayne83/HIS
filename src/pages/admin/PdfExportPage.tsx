export default function PdfExportPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl text-text-high">
        PDF Export
      </h1>
      <p className="text-text-muted text-lg">
        Select students and generate sponsorship profile PDFs for printing and mailing.
      </p>
      <div className="bg-surface border border-border rounded-lg p-6">
        <p className="text-text-muted">
          Student selection interface and PDF generation controls will be displayed here.
        </p>
      </div>
    </div>
  );
}

export { PdfExportPage as Component };
