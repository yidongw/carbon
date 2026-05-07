-- Template root and template-scoped configuration + engineering method (BOM/BOP).
-- Shapes mirror item-scoped tables but use templateId / templateMakeMethodId / templateMethodOperationId.

CREATE TABLE "template" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "name" TEXT NOT NULL,
  "description" TEXT,
  "companyId" TEXT NOT NULL,
  "createdBy" TEXT,
  "updatedBy" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT "template_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "template_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "template_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON UPDATE CASCADE,
  CONSTRAINT "template_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON UPDATE CASCADE
);

CREATE TABLE "templateConfigurationParameterGroup" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "templateId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 1,
  "isUngrouped" BOOLEAN NOT NULL DEFAULT FALSE,
  "companyId" TEXT NOT NULL,
  CONSTRAINT "templateConfigurationParameterGroup_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "templateConfigurationParameterGroup_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "template"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "templateConfigurationParameterGroup_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "templateConfigurationParameterGroup_name_templateId_unique" UNIQUE ("name", "templateId")
);

CREATE TABLE "templateConfigurationParameter" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "templateId" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 1,
  "dataType" "configurationParameterDataType" NOT NULL,
  "listOptions" TEXT[],
  "companyId" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "updatedBy" TEXT,
  "templateConfigurationParameterGroupId" TEXT,
  "materialFormFilterId" TEXT,
  CONSTRAINT "templateConfigurationParameter_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "templateConfigurationParameter_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "template"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "templateConfigurationParameter_templateConfigurationParameterGroupId_fkey" FOREIGN KEY ("templateConfigurationParameterGroupId") REFERENCES "templateConfigurationParameterGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "templateConfigurationParameter_materialFormFilterId_fkey" FOREIGN KEY ("materialFormFilterId") REFERENCES "materialForm"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "templateConfigurationParameter_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "templateConfigurationParameter_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON UPDATE CASCADE,
  CONSTRAINT "templateConfigurationParameter_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON UPDATE CASCADE,
  CONSTRAINT "templateConfigurationParameter_templateId_key_unique" UNIQUE ("templateId", "key")
);

CREATE INDEX "templateConfigurationParameter_templateId_idx" ON "templateConfigurationParameter" ("templateId");
CREATE INDEX "templateConfigurationParameter_companyId_idx" ON "templateConfigurationParameter" ("companyId");

CREATE TABLE "templateConfigurationRule" (
  "templateId" TEXT NOT NULL,
  "field" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedBy" TEXT,
  CONSTRAINT "templateConfigurationRule_pkey" PRIMARY KEY ("templateId", "field"),
  CONSTRAINT "templateConfigurationRule_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "template"("id") ON DELETE CASCADE,
  CONSTRAINT "templateConfigurationRule_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE,
  CONSTRAINT "templateConfigurationRule_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE INDEX "templateConfigurationRule_templateId_idx" ON "templateConfigurationRule" ("templateId");
CREATE INDEX "templateConfigurationRule_companyId_idx" ON "templateConfigurationRule" ("companyId");

CREATE TABLE "templateMakeMethod" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "templateId" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "updatedBy" TEXT,
  "customFields" JSONB,
  "status" "makeMethodStatus" NOT NULL DEFAULT 'Draft',
  "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "templateMakeMethod_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "templateMakeMethod_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "template"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "templateMakeMethod_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "templateMakeMethod_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON UPDATE CASCADE,
  CONSTRAINT "templateMakeMethod_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON UPDATE CASCADE,
  CONSTRAINT "templateMakeMethod_templateId_version_unique" UNIQUE ("templateId", "version")
);

CREATE TABLE "templateMethodOperation" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "templateMakeMethodId" TEXT NOT NULL,
  "order" DOUBLE PRECISION NOT NULL DEFAULT 1,
  "operationOrder" "methodOperationOrder" NOT NULL DEFAULT 'After Previous',
  "operationType" "operationType" NOT NULL DEFAULT 'Inside',
  "description" TEXT NOT NULL DEFAULT '',
  "processId" TEXT NOT NULL,
  "workCenterId" TEXT,
  "procedureId" TEXT,
  "setupTime" NUMERIC(10,2) NOT NULL DEFAULT 0,
  "setupUnit" "factor" NOT NULL DEFAULT 'Total Hours',
  "laborTime" NUMERIC(10,2) NOT NULL DEFAULT 0,
  "laborUnit" "factor" NOT NULL DEFAULT 'Hours/Piece',
  "machineTime" NUMERIC(10,2) NOT NULL DEFAULT 0,
  "machineUnit" "factor" NOT NULL DEFAULT 'Hours/Piece',
  "operationSupplierProcessId" TEXT,
  "operationMinimumCost" NUMERIC DEFAULT 0,
  "operationUnitCost" NUMERIC DEFAULT 0,
  "operationLeadTime" NUMERIC DEFAULT 0,
  "workInstruction" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "companyId" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "updatedBy" TEXT,
  "customFields" JSONB,
  CONSTRAINT "templateMethodOperation_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "templateMethodOperation_templateMakeMethodId_fkey" FOREIGN KEY ("templateMakeMethodId") REFERENCES "templateMakeMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "templateMethodOperation_processId_fkey" FOREIGN KEY ("processId") REFERENCES "process"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "templateMethodOperation_workCenterId_fkey" FOREIGN KEY ("workCenterId") REFERENCES "workCenter"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "templateMethodOperation_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "procedure"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "templateMethodOperation_operationSupplierProcessId_fkey" FOREIGN KEY ("operationSupplierProcessId") REFERENCES "supplierProcess"("id") ON UPDATE CASCADE,
  CONSTRAINT "templateMethodOperation_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "templateMethodOperation_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON UPDATE CASCADE,
  CONSTRAINT "templateMethodOperation_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON UPDATE CASCADE
);

CREATE TABLE "templateMethodMaterial" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "templateMakeMethodId" TEXT NOT NULL,
  "materialMakeMethodId" TEXT,
  "order" DOUBLE PRECISION NOT NULL DEFAULT 1,
  "itemType" TEXT NOT NULL DEFAULT 'Material',
  "methodType" "methodType" NOT NULL DEFAULT 'Pull from Inventory',
  "sourcingType" "sourcingType" NOT NULL,
  "itemId" TEXT NOT NULL,
  "kit" BOOLEAN NOT NULL DEFAULT FALSE,
  "methodOperationId" TEXT,
  "quantity" NUMERIC NOT NULL,
  "scrapQuantity" NUMERIC NOT NULL DEFAULT 0,
  "productionQuantity" NUMERIC GENERATED ALWAYS AS ("quantity" + "scrapQuantity") STORED,
  "unitOfMeasureCode" TEXT NOT NULL,
  "storageUnitIds" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "companyId" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "updatedBy" TEXT,
  "customFields" JSONB,
  "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  CONSTRAINT "templateMethodMaterial_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "templateMethodMaterial_templateMakeMethodId_fkey" FOREIGN KEY ("templateMakeMethodId") REFERENCES "templateMakeMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "templateMethodMaterial_materialMakeMethodId_fkey" FOREIGN KEY ("materialMakeMethodId") REFERENCES "makeMethod"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "templateMethodMaterial_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT "templateMethodMaterial_methodOperationId_fkey" FOREIGN KEY ("methodOperationId") REFERENCES "templateMethodOperation"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "templateMethodMaterial_unitOfMeasureCode_fkey" FOREIGN KEY ("unitOfMeasureCode", "companyId") REFERENCES "unitOfMeasure"("code", "companyId") ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT "templateMethodMaterial_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "templateMethodMaterial_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON UPDATE CASCADE,
  CONSTRAINT "templateMethodMaterial_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON UPDATE CASCADE
);

CREATE TABLE "templateMethodOperationStep" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "operationId" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "updatedBy" TEXT,
  "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 1,
  "name" TEXT NOT NULL,
  "description" JSONB,
  "type" "procedureStepType" NOT NULL,
  "required" BOOLEAN DEFAULT FALSE,
  "minValue" DOUBLE PRECISION,
  "maxValue" DOUBLE PRECISION,
  "listValues" TEXT[],
  "fileTypes" TEXT[],
  "unitOfMeasureCode" TEXT,
  CONSTRAINT "templateMethodOperationStep_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "templateMethodOperationStep_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "templateMethodOperation"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "templateMethodOperationStep_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "templateMethodOperationStep_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON UPDATE CASCADE,
  CONSTRAINT "templateMethodOperationStep_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON UPDATE CASCADE
);

CREATE TABLE "templateMethodOperationParameter" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "operationId" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "updatedBy" TEXT,
  CONSTRAINT "templateMethodOperationParameter_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "templateMethodOperationParameter_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "templateMethodOperation"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "templateMethodOperationParameter_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "templateMethodOperationParameter_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON UPDATE CASCADE,
  CONSTRAINT "templateMethodOperationParameter_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON UPDATE CASCADE
);

CREATE INDEX "templateMethodOperationParameter_companyId_idx" ON "templateMethodOperationParameter"("companyId");
CREATE INDEX "templateMethodOperationParameter_operationId_idx" ON "templateMethodOperationParameter"("operationId");

CREATE TABLE "templateMethodOperationTool" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "operationId" TEXT NOT NULL,
  "toolId" TEXT NOT NULL,
  "quantity" DOUBLE PRECISION NOT NULL DEFAULT 1,
  "companyId" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedBy" TEXT,
  CONSTRAINT "templateMethodOperationTool_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "templateMethodOperationTool_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "templateMethodOperation"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "templateMethodOperationTool_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "templateMethodOperationTool_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "templateMethodOperationTool_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON UPDATE CASCADE,
  CONSTRAINT "templateMethodOperationTool_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON UPDATE CASCADE
);
