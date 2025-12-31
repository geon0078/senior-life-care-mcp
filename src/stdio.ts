#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";

import { pensionTools, handlePensionTool } from "./tools/pension/index.js";
import { healthTools, handleHealthTool } from "./tools/health/index.js";
import { careTools, handleCareTool } from "./tools/care/index.js";
import { leisureTools, handleLeisureTool } from "./tools/leisure/index.js";
import { livingTools, handleLivingTool } from "./tools/living/index.js";
import { safetyTools, handleSafetyTool } from "./tools/safety/index.js";
import { transportTools, handleTransportTool } from "./tools/transport/index.js";
import { financeTools, handleFinanceTool } from "./tools/finance/index.js";
import { jobsTools, handleJobsTool } from "./tools/jobs/index.js";
import { legalTools, handleLegalTool } from "./tools/legal/index.js";

// 모든 도구 병합
const allTools: Tool[] = [
  ...pensionTools,
  ...healthTools,
  ...careTools,
  ...leisureTools,
  ...livingTools,
  ...safetyTools,
  ...transportTools,
  ...financeTools,
  ...jobsTools,
  ...legalTools,
];

// MCP 서버 생성
const server = new Server(
  {
    name: "senior-life-care-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 도구 목록 요청 핸들러
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: allTools };
});

// 도구 실행 요청 핸들러
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    // 각 카테고리별 핸들러 호출
    if (pensionTools.some((t) => t.name === name)) {
      return await handlePensionTool(name, args);
    }
    if (healthTools.some((t) => t.name === name)) {
      return await handleHealthTool(name, args);
    }
    if (careTools.some((t) => t.name === name)) {
      return await handleCareTool(name, args);
    }
    if (leisureTools.some((t) => t.name === name)) {
      return await handleLeisureTool(name, args);
    }
    if (livingTools.some((t) => t.name === name)) {
      return await handleLivingTool(name, args);
    }
    if (safetyTools.some((t) => t.name === name)) {
      return await handleSafetyTool(name, args);
    }
    if (transportTools.some((t) => t.name === name)) {
      return await handleTransportTool(name, args);
    }
    if (financeTools.some((t) => t.name === name)) {
      return await handleFinanceTool(name, args);
    }
    if (jobsTools.some((t) => t.name === name)) {
      return await handleJobsTool(name, args);
    }
    if (legalTools.some((t) => t.name === name)) {
      return await handleLegalTool(name, args);
    }

    return {
      content: [
        {
          type: "text",
          text: `알 수 없는 도구입니다: ${name}`,
        },
      ],
      isError: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `오류가 발생했어요: ${errorMessage}\n\n걱정 마세요, 다시 시도해 주시거나 다른 방법으로 도와드릴게요!`,
        },
      ],
      isError: true,
    };
  }
});

// stdio transport로 서버 시작
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
