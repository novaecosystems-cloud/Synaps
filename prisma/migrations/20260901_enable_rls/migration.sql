-- =============================================================================
-- CAUSARIX ENTERPRISE MULTI-TENANT ROW LEVEL SECURITY (RLS) MIGRATION
-- Database: PostgreSQL 14+ with pgvector
-- Version: 20260901_enable_rls
-- =============================================================================

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. INDEX OPTIMIZATION FOR RLS PERFORMANCE
-- ─────────────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS "idx_document_orgid" ON "Document"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_decision_orgid" ON "Decision"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_project_orgid" ON "Project"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_projectmember_orgid" ON "ProjectMember"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_projecttask_orgid" ON "ProjectTask"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_tasknote_orgid" ON "TaskNote"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_docversion_orgid" ON "DocumentVersion"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_procjob_orgid" ON "ProcessingJob"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_procdoc_orgid" ON "ProcessedDocument"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_docmetadata_orgid" ON "DocumentMetadata"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_docchunk_orgid" ON "DocumentChunk"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_requirement_orgid" ON "Requirement"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_gap_orgid" ON "Gap"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_execsummary_orgid" ON "ExecutiveSummary"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_proposal_orgid" ON "Proposal"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_propspot_orgid" ON "ProposalSection"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_approvalreq_orgid" ON "ApprovalRequest"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_approvalcomment_orgid" ON "ApprovalComment"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_auditlog_orgid" ON "AuditLog"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_notification_orgid" ON "Notification"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_notifpref_orgid" ON "NotificationPreference"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_searchhistory_orgid" ON "SearchHistory"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_savedsearch_orgid" ON "SavedSearch"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_exportjob_orgid" ON "ExportJob"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_connector_orgid" ON "Connector"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_chatsession_orgid" ON "ChatSession"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_agent_orgid" ON "Agent"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_prompttemplate_orgid" ON "PromptTemplate"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_workflow_orgid" ON "Workflow"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_modelsetting_orgid" ON "ModelSetting"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_graphentity_orgid" ON "GraphEntity"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_graphrel_orgid" ON "GraphRelationship"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_meeting_orgid" ON "Meeting"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_timeline_orgid" ON "TimelineEvent"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_risk_orgid" ON "EnterpriseRisk"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_pred_orgid" ON "EnterprisePrediction"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_decmem_orgid" ON "DecisionMemoryEntry"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_auditledger_orgid" ON "AuditLedgerEntry"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_domainrisk_orgid" ON "DomainRiskProfile"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_actiontask_orgid" ON "ActionTask"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_pmsmetric_orgid" ON "PmsMetric"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_pmsguest_orgid" ON "PmsGuestLog"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_joinreq_orgid" ON "JoinRequest"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_invitation_orgid" ON "Invitation"("organizationId");

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. HELPER FUNCTIONS FOR RLS POLICY EVALUATION
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION causarix_current_tenant_id() 
RETURNS text 
LANGUAGE sql 
STABLE
AS $$
  SELECT current_setting('app.current_tenant_id', true);
$$;

CREATE OR REPLACE FUNCTION causarix_is_bypass() 
RETURNS boolean 
LANGUAGE sql 
STABLE
AS $$
  SELECT COALESCE(
    current_setting('app.bypass_rls', true) = 'on' OR 
    current_setting('app.is_admin', true) = 'true', 
    false
  );
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. ENABLE AND FORCE RLS ACROSS ALL TENANT TABLES
-- ─────────────────────────────────────────────────────────────────────────────

DO $$ 
DECLARE
  tbl text;
  tenant_tables text[] := ARRAY[
    'Organization', 'User', 'JoinRequest', 'Invitation',
    'Project', 'ProjectMember', 'ProjectTask', 'TaskNote',
    'Document', 'DocumentVersion', 'ProcessingJob', 'ProcessedDocument',
    'DocumentMetadata', 'DocumentChunk', 'Requirement', 'Gap',
    'Decision', 'ExecutiveSummary', 'Proposal', 'ProposalSection',
    'ApprovalRequest', 'ApprovalComment', 'AuditLog', 'Notification',
    'NotificationPreference', 'SearchHistory', 'SavedSearch', 'ExportJob',
    'Connector', 'SyncJob', 'ChatSession', 'ChatMessage', 'MessageCitation',
    'Agent', 'PromptTemplate', 'Workflow', 'WorkflowNode', 'WorkflowEdge',
    'ModelSetting', 'ProjectDocument', 'WorkflowRun', 'WorkflowTrace',
    'GraphEntity', 'GraphRelationship', 'Meeting', 'TimelineEvent',
    'EnterpriseRisk', 'EnterprisePrediction', 'AnonymizedClause',
    'DecisionMemoryEntry', 'AuditLedgerEntry', 'DomainRiskProfile',
    'ActionTask', 'PmsMetric', 'PmsGuestLog'
  ];
BEGIN
  FOREACH tbl IN ARRAY tenant_tables LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', tbl);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY;', tbl);
  END LOOP;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. TENANT ISOLATION POLICIES: DIRECT TENANT MODELS (CATEGORY A)
-- ─────────────────────────────────────────────────────────────────────────────

DO $$ 
DECLARE
  tbl text;
  direct_tenant_tables text[] := ARRAY[
    'Document', 'Decision', 'Project', 'ProjectMember', 'ProjectTask', 
    'TaskNote', 'DocumentVersion', 'ProcessingJob', 'ProcessedDocument', 
    'DocumentMetadata', 'DocumentChunk', 'Requirement', 'Gap', 
    'ExecutiveSummary', 'Proposal', 'ProposalSection', 'ApprovalRequest', 
    'ApprovalComment', 'AuditLog', 'Notification', 'NotificationPreference', 
    'SearchHistory', 'SavedSearch', 'ExportJob', 'Connector', 'ChatSession', 
    'Agent', 'PromptTemplate', 'Workflow', 'ModelSetting', 'GraphEntity', 
    'GraphRelationship', 'Meeting', 'TimelineEvent', 'EnterpriseRisk', 
    'EnterprisePrediction', 'DecisionMemoryEntry', 'AuditLedgerEntry', 
    'DomainRiskProfile', 'ActionTask', 'PmsMetric', 'PmsGuestLog', 
    'JoinRequest', 'Invitation'
  ];
BEGIN
  FOREACH tbl IN ARRAY direct_tenant_tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS tenant_isolation_policy ON %I;', tbl);
    EXECUTE format('
      CREATE POLICY tenant_isolation_policy ON %I
        FOR ALL
        USING (
          ("organizationId" = causarix_current_tenant_id()) 
          OR causarix_is_bypass()
        )
        WITH CHECK (
          ("organizationId" = causarix_current_tenant_id()) 
          OR causarix_is_bypass()
        );
    ', tbl);
  END LOOP;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. TENANT ISOLATION POLICIES: HIERARCHICAL & JOIN TABLES (CATEGORY B)
-- ─────────────────────────────────────────────────────────────────────────────

-- 5.1 SyncJob (Child of Connector)
DROP POLICY IF EXISTS tenant_isolation_policy ON "SyncJob";
CREATE POLICY tenant_isolation_policy ON "SyncJob"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "Connector" c 
      WHERE c."id" = "SyncJob"."connectorId" 
        AND (c."organizationId" = causarix_current_tenant_id() OR causarix_is_bypass())
    ) OR causarix_is_bypass()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "Connector" c 
      WHERE c."id" = "SyncJob"."connectorId" 
        AND (c."organizationId" = causarix_current_tenant_id() OR causarix_is_bypass())
    ) OR causarix_is_bypass()
  );

-- 5.2 ChatMessage (Child of ChatSession)
DROP POLICY IF EXISTS tenant_isolation_policy ON "ChatMessage";
CREATE POLICY tenant_isolation_policy ON "ChatMessage"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "ChatSession" cs 
      WHERE cs."id" = "ChatMessage"."sessionId" 
        AND (cs."organizationId" = causarix_current_tenant_id() OR causarix_is_bypass())
    ) OR causarix_is_bypass()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "ChatSession" cs 
      WHERE cs."id" = "ChatMessage"."sessionId" 
        AND (cs."organizationId" = causarix_current_tenant_id() OR causarix_is_bypass())
    ) OR causarix_is_bypass()
  );

-- 5.3 MessageCitation (Child of ChatMessage)
DROP POLICY IF EXISTS tenant_isolation_policy ON "MessageCitation";
CREATE POLICY tenant_isolation_policy ON "MessageCitation"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "ChatMessage" cm 
      JOIN "ChatSession" cs ON cs."id" = cm."sessionId"
      WHERE cm."id" = "MessageCitation"."messageId" 
        AND (cs."organizationId" = causarix_current_tenant_id() OR causarix_is_bypass())
    ) OR causarix_is_bypass()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "ChatMessage" cm 
      JOIN "ChatSession" cs ON cs."id" = cm."sessionId"
      WHERE cm."id" = "MessageCitation"."messageId" 
        AND (cs."organizationId" = causarix_current_tenant_id() OR causarix_is_bypass())
    ) OR causarix_is_bypass()
  );

-- 5.4 WorkflowNode (Child of Workflow)
DROP POLICY IF EXISTS tenant_isolation_policy ON "WorkflowNode";
CREATE POLICY tenant_isolation_policy ON "WorkflowNode"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "Workflow" w 
      WHERE w."id" = "WorkflowNode"."workflowId" 
        AND (w."organizationId" = causarix_current_tenant_id() OR causarix_is_bypass())
    ) OR causarix_is_bypass()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "Workflow" w 
      WHERE w."id" = "WorkflowNode"."workflowId" 
        AND (w."organizationId" = causarix_current_tenant_id() OR causarix_is_bypass())
    ) OR causarix_is_bypass()
  );

-- 5.5 WorkflowEdge (Child of Workflow)
DROP POLICY IF EXISTS tenant_isolation_policy ON "WorkflowEdge";
CREATE POLICY tenant_isolation_policy ON "WorkflowEdge"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "Workflow" w 
      WHERE w."id" = "WorkflowEdge"."workflowId" 
        AND (w."organizationId" = causarix_current_tenant_id() OR causarix_is_bypass())
    ) OR causarix_is_bypass()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "Workflow" w 
      WHERE w."id" = "WorkflowEdge"."workflowId" 
        AND (w."organizationId" = causarix_current_tenant_id() OR causarix_is_bypass())
    ) OR causarix_is_bypass()
  );

-- 5.6 WorkflowRun (Child of Workflow)
DROP POLICY IF EXISTS tenant_isolation_policy ON "WorkflowRun";
CREATE POLICY tenant_isolation_policy ON "WorkflowRun"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "Workflow" w 
      WHERE w."id" = "WorkflowRun"."workflowId" 
        AND (w."organizationId" = causarix_current_tenant_id() OR causarix_is_bypass())
    ) OR causarix_is_bypass()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "Workflow" w 
      WHERE w."id" = "WorkflowRun"."workflowId" 
        AND (w."organizationId" = causarix_current_tenant_id() OR causarix_is_bypass())
    ) OR causarix_is_bypass()
  );

-- 5.7 WorkflowTrace (Child of WorkflowRun)
DROP POLICY IF EXISTS tenant_isolation_policy ON "WorkflowTrace";
CREATE POLICY tenant_isolation_policy ON "WorkflowTrace"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "WorkflowRun" wr 
      JOIN "Workflow" w ON w."id" = wr."workflowId"
      WHERE wr."id" = "WorkflowTrace"."runId" 
        AND (w."organizationId" = causarix_current_tenant_id() OR causarix_is_bypass())
    ) OR causarix_is_bypass()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "WorkflowRun" wr 
      JOIN "Workflow" w ON w."id" = wr."workflowId"
      WHERE wr."id" = "WorkflowTrace"."runId" 
        AND (w."organizationId" = causarix_current_tenant_id() OR causarix_is_bypass())
    ) OR causarix_is_bypass()
  );

-- 5.8 ProjectDocument (Join Table)
DROP POLICY IF EXISTS tenant_isolation_policy ON "ProjectDocument";
CREATE POLICY tenant_isolation_policy ON "ProjectDocument"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "Project" p 
      WHERE p."id" = "ProjectDocument"."projectId" 
        AND (p."organizationId" = causarix_current_tenant_id() OR causarix_is_bypass())
    ) OR causarix_is_bypass()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "Project" p 
      WHERE p."id" = "ProjectDocument"."projectId" 
        AND (p."organizationId" = causarix_current_tenant_id() OR causarix_is_bypass())
    ) OR causarix_is_bypass()
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. ROOT TENANT, USER & ANONYMIZED BENCHMARK POLICIES (CATEGORIES C, D, E)
-- ─────────────────────────────────────────────────────────────────────────────

-- 6.1 Organization (Root Tenant Model)
DROP POLICY IF EXISTS tenant_isolation_policy ON "Organization";
CREATE POLICY tenant_isolation_policy ON "Organization"
  FOR ALL
  USING (
    "id" = causarix_current_tenant_id() OR causarix_is_bypass()
  )
  WITH CHECK (
    "id" = causarix_current_tenant_id() OR causarix_is_bypass()
  );

-- 6.2 User (Identity & Multi-Org Model)
DROP POLICY IF EXISTS tenant_isolation_policy ON "User";
CREATE POLICY tenant_isolation_policy ON "User"
  FOR ALL
  USING (
    "organizationId" = causarix_current_tenant_id() 
    OR "id" = current_setting('app.current_user_id', true)
    OR causarix_is_bypass()
  )
  WITH CHECK (
    "organizationId" = causarix_current_tenant_id() 
    OR "id" = current_setting('app.current_user_id', true)
    OR causarix_is_bypass()
  );

-- 6.3 AnonymizedClause (Cross-Tenant DAAM Benchmark)
DROP POLICY IF EXISTS anonymized_clause_read_policy ON "AnonymizedClause";
DROP POLICY IF EXISTS anonymized_clause_write_policy ON "AnonymizedClause";

CREATE POLICY anonymized_clause_read_policy ON "AnonymizedClause"
  FOR SELECT
  USING (true);

CREATE POLICY anonymized_clause_write_policy ON "AnonymizedClause"
  FOR ALL
  USING (causarix_is_bypass())
  WITH CHECK (causarix_is_bypass());

COMMIT;
