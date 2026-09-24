"use client";

import React, { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Modal } from "@/components/shared/Modal";
import { DatasetType, FileValidationResult, IngestionJobRecord } from "@/lib/ingestion/types";
import { DATASET_SCHEMAS } from "@/lib/ingestion/schemas";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Check,
  X,
} from "lucide-react";

export default function DataManagementPage() {
  const [selectedType, setSelectedType] = useState<DatasetType>("job_postings");
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [validationResult, setValidationResult] = useState<FileValidationResult | null>(null);
  const [importSummary, setImportSummary] = useState<{
    jobId: string;
    totalRows: number;
    validRows: number;
    invalidRows: number;
    importedRows: number;
    durationMs: number;
    mode: string;
  } | null>(null);

  const [jobHistory, setJobHistory] = useState<IngestionJobRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [errorDetailsModal, setErrorDetailsModal] = useState<FileValidationResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeSchema = DATASET_SCHEMAS[selectedType];

  // Fetch ingestion history on mount
  useEffect(() => {
    loadJobHistory();
  }, []);

  const loadJobHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await fetch("/api/ingestion/import");
      const json = await res.json();
      if (json.jobs) {
        setJobHistory(
          json.jobs.map((j: Record<string, unknown>) => ({
            id: String(j.id),
            datasetType: j.dataset_type as DatasetType,
            filename: String(j.filename),
            fileSizeBytes: Number(j.file_size_bytes || 0),
            status: j.status as IngestionJobRecord["status"],
            totalRows: Number(j.total_rows || 0),
            validRows: Number(j.valid_rows || 0),
            invalidRows: Number(j.invalid_rows || 0),
            importedRows: Number(j.imported_rows || 0),
            processingDurationMs: Number(j.processing_duration_ms || 0),
            errorSummary: j.error_summary ? String(j.error_summary) : undefined,
            createdAt: String(j.created_at || ""),
          }))
        );
      }
    } catch {
      // Fallback
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (uploadedFile: File) => {
    setFile(uploadedFile);
    setValidationResult(null);
    setImportSummary(null);
  };

  const handleValidate = async () => {
    if (!file) return;
    setIsValidating(true);
    setValidationResult(null);
    setImportSummary(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("dataset_type", selectedType);

    try {
      const res = await fetch("/api/ingestion/validate", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.validation) {
        setValidationResult(data.validation);
      } else {
        alert(data.error || "Failed to validate dataset.");
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Validation network error.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleImport = async () => {
    if (!validationResult || validationResult.sanitizedData.length === 0 || !file) return;
    setIsImporting(true);

    try {
      const res = await fetch("/api/ingestion/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dataset_type: selectedType,
          filename: file.name,
          rows: validationResult.sanitizedData,
          total_rows: validationResult.totalRows,
          invalid_rows: validationResult.invalidRows,
          is_demo: false,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setImportSummary(data);
        loadJobHistory();
      } else {
        alert(data.error || "Failed to import records.");
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Import network error.");
    } finally {
      setIsImporting(false);
    }
  };

  const loadSampleDataset = async (type: DatasetType) => {
    setSelectedType(type);
    setValidationResult(null);
    setImportSummary(null);

    const sampleMap: Record<DatasetType, string> = {
      job_postings: "/data/demo/job_postings_sample.csv",
      courses: "/data/demo/courses_sample.csv",
      curriculum: "/data/demo/curriculum_sample.csv",
      trainers: "/data/demo/trainers_sample.csv",
      equipment: "/data/demo/equipment_sample.csv",
      placements: "/data/demo/placements_sample.csv",
      employer_surveys: "/data/demo/employer_surveys_sample.csv",
    };

    try {
      const response = await fetch(sampleMap[type]);
      if (!response.ok) {
        // Fallback demo content if static fetch not routed
        const fallbackText = "title,company_name,district,sector,vacancies,raw_description\nEV Diagnostic Tech,Tata Motors,Pune,automotive_ev,20,Battery diagnostics and CAN bus";
        const dummyFile = new File([fallbackText], `${type}_sample.csv`, { type: "text/csv" });
        setFile(dummyFile);
        return;
      }
      const text = await response.text();
      const demoFile = new File([text], `${type}_sample.csv`, { type: "text/csv" });
      setFile(demoFile);
    } catch {
      alert("Sample file prepared for testing in /data/demo/");
    }
  };

  const historyColumns: Column<IngestionJobRecord>[] = [
    {
      key: "filename",
      header: "Dataset File",
      render: (row) => (
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4 text-emerald-600 shrink-0" />
          <div>
            <p className="font-mono text-xs font-semibold text-slate-900">{row.filename}</p>
            <p className="text-[10px] text-slate-500 capitalize">{row.datasetType.replace("_", " ")}</p>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        if (row.status === "completed") {
          return (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 border border-emerald-200">
              <Check className="h-3 w-3 text-emerald-600" />
              Completed
            </span>
          );
        }
        if (row.status === "failed") {
          return (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-800 border border-red-200">
              <X className="h-3 w-3 text-red-600" />
              Failed
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-800 border border-sky-200">
            <RefreshCw className="h-3 w-3 animate-spin text-sky-600" />
            {row.status}
          </span>
        );
      },
    },
    {
      key: "records",
      header: "Record Counts",
      render: (row) => (
        <div className="text-xs">
          <span className="font-semibold text-slate-900">{row.importedRows}</span>
          <span className="text-slate-400"> / {row.totalRows} imported</span>
          {row.invalidRows > 0 && (
            <span className="text-red-600 ml-1.5 font-medium">({row.invalidRows} invalid)</span>
          )}
        </div>
      ),
    },
    {
      key: "processingDurationMs",
      header: "Duration",
      render: (row) => (
        <span className="font-mono text-xs text-slate-600">{row.processingDurationMs}ms</span>
      ),
    },
    {
      key: "createdAt",
      header: "Ingested At",
      render: (row) => (
        <span className="text-xs text-slate-500">
          {row.createdAt ? new Date(row.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "Just now"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Evidence Ingestion & Data Management Center"
        description="Ingest industry demand signals, course syllabi, equipment inventories, and employer surveys. Validates schemas, detects row-level errors, and idempotently populates the database."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadJobHistory}
              className="flex items-center gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoadingHistory ? "animate-spin" : ""}`} />
              Refresh History
            </Button>
          </div>
        }
      />

      {/* Main Workflow: Upload & Target Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step 1: Select Dataset Type */}
        <Card className="border-slate-200">
          <CardHeader className="p-5 pb-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Step 01
              </span>
              <Badge variant="teal">Select Type</Badge>
            </div>
            <CardTitle className="text-base font-bold text-slate-900 mt-1">
              Dataset Target
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Select the data structure you are uploading
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-2">
            {(Object.keys(DATASET_SCHEMAS) as DatasetType[]).map((typeKey) => {
              const sch = DATASET_SCHEMAS[typeKey];
              const isSelected = selectedType === typeKey;
              return (
                <div
                  key={typeKey}
                  onClick={() => {
                    setSelectedType(typeKey);
                    setValidationResult(null);
                    setImportSummary(null);
                  }}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                    isSelected
                      ? "border-[#0284c7] bg-sky-50/50 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{sch.title}</span>
                    {isSelected && <Check className="h-4 w-4 text-[#0284c7]" />}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    {sch.description}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Step 2: Drag & Drop Upload Container */}
        <Card className="border-slate-200 lg:col-span-2">
          <CardHeader className="p-5 pb-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Step 02 &amp; 03
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Quick Test:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadSampleDataset(selectedType)}
                  className="text-xs text-[#0284c7] border-sky-300 hover:bg-sky-50"
                >
                  Load Sample {DATASET_SCHEMAS[selectedType].title.split(" ")[0]} CSV
                </Button>
              </div>
            </div>
            <CardTitle className="text-base font-bold text-slate-900 mt-1">
              Upload &amp; Validate File (.CSV / .XLSX)
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Target Table: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[11px] text-slate-700">{activeSchema.targetTable}</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-4">
            {/* Drag & Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? "border-[#0284c7] bg-sky-50"
                  : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileChange}
                className="hidden"
              />
              <UploadCloud className="h-10 w-10 text-slate-400 mx-auto mb-2" />
              {file ? (
                <div>
                  <p className="text-xs font-bold text-slate-900">{file.name}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Size: {(file.size / 1024).toFixed(1)} KB &bull; Click or drag to replace
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    Click to browse or drag &amp; drop file here
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Supported: .CSV and .XLSX (Max: 50MB)
                  </p>
                </div>
              )}
            </div>

            {/* Required Columns Guide */}
            <div className="rounded-md border border-slate-100 bg-slate-50/80 p-3 text-xs">
              <span className="font-semibold text-slate-700">Required Columns: </span>
              <span className="font-mono text-slate-600">
                {activeSchema.requiredColumns.join(", ")}
              </span>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-500">
                {file ? `Ready to validate ${file.name}` : "Please select or drop a dataset file"}
              </div>
              <div className="flex items-center gap-2">
                {file && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFile(null);
                      setValidationResult(null);
                      setImportSummary(null);
                    }}
                  >
                    Clear
                  </Button>
                )}
                <Button
                  disabled={!file || isValidating}
                  onClick={handleValidate}
                  size="sm"
                  className="bg-[#0f2744] text-white hover:bg-[#1a3a60]"
                >
                  {isValidating ? (
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      Validating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      Validate &amp; Preview
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Validation Result & Preview Section */}
      {validationResult && (
        <Card className="border-slate-200">
          <CardHeader className="p-5 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {validationResult.isValid ? (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                    <AlertTriangle className="h-4 w-4" />
                  </span>
                )}
                <CardTitle className="text-base font-bold text-slate-900">
                  {validationResult.isValid
                    ? "Dataset Validated Successfully"
                    : "Validation Identified Issues"}
                </CardTitle>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-500">
                  Validated in {validationResult.processingDurationMs}ms
                </span>
                {validationResult.sanitizedData.length > 0 && (
                  <Button
                    disabled={isImporting}
                    onClick={handleImport}
                    size="sm"
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold"
                  >
                    {isImporting ? "Importing to DB..." : `Import ${validationResult.validRows} Valid Rows`}
                  </Button>
                )}
              </div>
            </div>

            {/* Validation Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-100">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">Total Rows</span>
                <span className="text-lg font-bold text-slate-900">{validationResult.totalRows}</span>
              </div>
              <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] uppercase font-semibold text-emerald-700 block">Valid Rows</span>
                <span className="text-lg font-bold text-emerald-900">{validationResult.validRows}</span>
              </div>
              <div className="p-2.5 rounded bg-red-50 border border-red-200">
                <span className="text-[10px] uppercase font-semibold text-red-700 block">Invalid Rows</span>
                <span className="text-lg font-bold text-red-900">{validationResult.invalidRows}</span>
              </div>
              <div className="p-2.5 rounded bg-sky-50 border border-sky-200">
                <span className="text-[10px] uppercase font-semibold text-sky-700 block">Identified Headers</span>
                <span className="text-lg font-bold text-sky-900">{validationResult.headers.length}</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-5 pt-0 space-y-4">
            {/* Structural / File-Level Errors */}
            {validationResult.fileErrors.length > 0 && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-800 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  Structural Errors Prevent Ingestion:
                </p>
                <ul className="list-disc list-inside space-y-0.5 pl-2">
                  {validationResult.fileErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Row-Level Errors Callout */}
            {validationResult.rowErrors.length > 0 && (
              <div className="rounded-md border border-amber-200 bg-amber-50/70 p-3 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    {validationResult.rowErrors.length} Row-Level Validation Issues (Invalid records are never silently discarded)
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setErrorDetailsModal(validationResult)}
                    className="text-xs bg-white text-amber-900 border-amber-300 hover:bg-amber-100"
                  >
                    View Full Error Log
                  </Button>
                </div>
                <div className="text-[11px] text-amber-800 space-y-1 max-h-24 overflow-y-auto pr-2">
                  {validationResult.rowErrors.slice(0, 3).map((err, i) => (
                    <div key={i} className="font-mono">
                      &bull; Row {err.row}: {err.message}
                    </div>
                  ))}
                  {validationResult.rowErrors.length > 3 && (
                    <div className="text-slate-500 italic">
                      + {validationResult.rowErrors.length - 3} more errors... Click &apos;View Full Error Log&apos;
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Data Preview Table */}
            {validationResult.previewRows.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Data Preview (Showing top {validationResult.previewRows.length} rows)
                </h4>
                <div className="overflow-x-auto rounded border border-slate-200">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-100 border-b border-slate-200 font-semibold text-slate-800">
                      <tr>
                        <th className="px-3 py-2">#</th>
                        {validationResult.headers.map((h) => (
                          <th key={h} className="px-3 py-2 font-mono whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white font-mono">
                      {validationResult.previewRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="px-3 py-2 text-slate-400">{idx + 1}</td>
                          {validationResult.headers.map((h) => (
                            <td key={h} className="px-3 py-2 whitespace-nowrap max-w-xs truncate">
                              {String(row[h] ?? "")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Import Success Summary Modal / Notification */}
      {importSummary && (
        <Card className="border-emerald-300 bg-emerald-50/50">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-emerald-100 p-2 text-emerald-700 mt-0.5">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-emerald-950">
                    Dataset Ingestion Completed Successfully
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Job ID: <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">{importSummary.jobId}</code>
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-700">
                    <span>
                      Total Rows: <strong>{importSummary.totalRows}</strong>
                    </span>
                    <span>
                      Imported Rows: <strong>{importSummary.importedRows}</strong>
                    </span>
                    <span>
                      Invalid Rows: <strong>{importSummary.invalidRows}</strong>
                    </span>
                    <span>
                      Duration: <strong>{importSummary.durationMs}ms</strong>
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setImportSummary(null)}
                className="bg-white"
              >
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historical Ingestion Audit Queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Audit Log: Ingestion Jobs
            </h3>
            <p className="text-xs text-slate-500">
              Audit trail of uploaded datasets, validation counts, and processing duration
            </p>
          </div>
        </div>

        <DataTable
          columns={historyColumns}
          data={jobHistory}
          keyExtractor={(row) => row.id}
          isLoading={isLoadingHistory}
          emptyTitle="No Ingestion Jobs Yet"
          emptyDescription="Upload a CSV or XLSX file above to trigger the automated data ingestion pipeline."
        />
      </div>

      {/* Modal: Full Row Error Inspector */}
      {errorDetailsModal && (
        <Modal
          isOpen={Boolean(errorDetailsModal)}
          onClose={() => setErrorDetailsModal(null)}
          title="Row-Level Validation Error Log"
          description={`Showing ${errorDetailsModal.rowErrors.length} validation issues detected in ${file?.name}`}
          size="lg"
          footer={
            <Button size="sm" onClick={() => setErrorDetailsModal(null)}>
              Close Log
            </Button>
          }
        >
          <div className="space-y-2">
            <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 border rounded border-slate-200">
              {errorDetailsModal.rowErrors.map((err, i) => (
                <div key={i} className="p-3 text-xs font-mono space-y-1 bg-white hover:bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-700">Row #{err.row}</span>
                    {err.column && (
                      <span className="text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                        Column: {err.column}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-800">{err.message}</p>
                  {err.rawData && (
                    <div className="text-[10px] text-slate-400 bg-slate-50 p-1.5 rounded truncate">
                      Raw Row: {JSON.stringify(err.rawData)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
