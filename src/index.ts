#!/usr/bin/env node

import express, { Request, Response } from "express";
import cors from "cors";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
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

// Express 앱 생성
const app = express();
app.use(cors());

// /messages 엔드포인트는 raw body가 필요하므로 JSON 파싱 제외
app.use((req, res, next) => {
  if (req.path === '/messages') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// 활성 transport 저장
const transports: { [sessionId: string]: SSEServerTransport } = {};

// MCP 서버 생성 함수
function createMCPServer(): Server {
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

  return server;
}

// 헬스체크 엔드포인트
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "senior-life-care-mcp" });
});

// 루트 엔드포인트 - 서비스 정보
app.get("/", (_req: Request, res: Response) => {
  res.json({
    name: "시니어 라이프 케어 MCP",
    version: "1.0.0",
    description: "어르신의 일상을 함께하는 AI 동반자",
    endpoints: {
      sse: "/sse",
      messages: "/messages",
      health: "/health",
    },
    tools: allTools.map((t) => ({ name: t.name, description: t.description })),
  });
});

// SSE 연결 엔드포인트
app.get("/sse", async (req: Request, res: Response) => {
  console.log("SSE 연결 요청 받음");

  // SSE 헤더 설정
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  // SSE Transport 생성
  const transport = new SSEServerTransport("/messages", res);
  const sessionId = transport.sessionId;
  transports[sessionId] = transport;

  console.log(`SSE 세션 생성: ${sessionId}`);

  // MCP 서버 생성 및 연결
  const server = createMCPServer();

  // 연결 종료 시 정리
  res.on("close", () => {
    console.log(`SSE 세션 종료: ${sessionId}`);
    delete transports[sessionId];
  });

  await server.connect(transport);
});

// 메시지 수신 엔드포인트
app.post("/messages", async (req: Request, res: Response) => {
  const sessionId = req.query.sessionId as string;
  console.log(`메시지 수신 - 세션: ${sessionId}`);

  const transport = transports[sessionId];
  if (!transport) {
    console.error(`세션을 찾을 수 없음: ${sessionId}`);
    res.status(404).json({ error: "Session not found" });
    return;
  }

  try {
    await transport.handlePostMessage(req, res);
  } catch (error) {
    console.error("메시지 처리 오류:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Streamable HTTP Transport를 위한 세션 저장소
const httpTransports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

// Streamable HTTP 엔드포인트 (PlayMCP 호환)
app.post("/mcp", async (req: Request, res: Response) => {
  console.log("MCP HTTP 요청 받음");

  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  let transport: StreamableHTTPServerTransport;

  if (sessionId && httpTransports[sessionId]) {
    transport = httpTransports[sessionId];
  } else {
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => crypto.randomUUID(),
      onsessioninitialized: (id) => {
        httpTransports[id] = transport;
        console.log(`HTTP 세션 생성: ${id}`);
      }
    });

    const server = createMCPServer();
    await server.connect(transport);
  }

  await transport.handleRequest(req, res, req.body);
});

// DELETE 요청으로 세션 종료
app.delete("/mcp", async (req: Request, res: Response) => {
  const sessionId = req.headers["mcp-session-id"] as string;
  if (sessionId && httpTransports[sessionId]) {
    await httpTransports[sessionId].close();
    delete httpTransports[sessionId];
    console.log(`HTTP 세션 종료: ${sessionId}`);
  }
  res.status(200).end();
});

// 서버 시작
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🌟 시니어 라이프 케어 MCP 서버가 시작되었습니다!`);
  console.log(`📍 서버 주소: http://localhost:${PORT}`);
  console.log(`🔗 SSE 엔드포인트: http://localhost:${PORT}/sse`);
  console.log(`📨 메시지 엔드포인트: http://localhost:${PORT}/messages`);
  console.log(`❤️ 헬스체크: http://localhost:${PORT}/health`);
});
