export interface EngineInfo {
  id: string;
  name: string;
  status: string;
  description: string;
}

export const engines: EngineInfo[] = [
  { id: "control_plane", name: "Control Plane", status: "implemented", description: "Tenancy, auth realms, billing, support" },
  { id: "asset_engine", name: "Asset Engine", status: "implemented", description: "Attack-surface inventory and discovery" },
  { id: "scanner_engine", name: "Scanner Engine", status: "implemented", description: "Nmap and Nuclei orchestration" },
  { id: "vapt_engine", name: "VAPT Engine", status: "implemented", description: "Campaigns, correlation, web scanner" },
  { id: "risk_engine", name: "Risk Engine", status: "implemented", description: "Hybrid risk scores and prioritization" },
  { id: "ai_engine", name: "AI Engine", status: "implemented", description: "Governed narratives that never change scores" },
  { id: "compliance_engine", name: "Compliance Engine", status: "implemented", description: "Frameworks, assessments, evidence" },
  { id: "reporting_engine", name: "Reporting Engine", status: "implemented", description: "Reports in many formats that contain verified findings only" },
  { id: "alert_engine", name: "Alert Engine", status: "implemented", description: "Severity-routed client alerts" },
  { id: "audit_engine", name: "Audit Engine", status: "implemented", description: "Immutable dual-control trail" },
  { id: "operations_engine", name: "Operations Engine", status: "implemented", description: "Server operations, logs, and search" },
];
