---
layout: post
title: "Existing Knowledge Graphs as Codebase Context for Agents"
date: 2026-05-20
description: "Capstone retrospective. Scaffolding Graphiti for code ingestion and evaluating against subagent exploration."
drop_cap: false
---

*Mirrored from [99P Labs' Medium](https://medium.com/99p-labs/existing-knowledge-graphs-as-codebase-context-for-agents-1c8e3da3a400). Relevant code can be found in [the GitHub repository](https://github.com/jackcml/reboot-mcp).*

## Introduction

This project began with a loose problem statement: Current context solutions (say, RAG) are not adaptive to changing environments, but codebases frequently change and are the main domain area of agentic work. Our first experiment was in aiding navigation of large file trees; we document it briefly in an appendix, despite not panning out as our eventual main focus, since it proved interesting and speaks to an adjacent feature space. Afterwards, we turned to broader codebase context work, settling on exploring the feasibility of leveraging existing knowledge graph solutions for large quantities of code data. The bulk of project time was spent implementing one such utilization. Later, we devised and implemented a basic evaluation harness to test ours against an alternative representing the status quo.

## Approach

Having been pointed towards two open-source technologies in the space of agents and context solutions, [OpenCode](https://opencode.ai/) and [Graphiti](https://www.getzep.com/product/open-source/), respectively, we began exploring how we might bring them together. An existing project ([opencode-graphiti](https://github.com/happycastle114/opencode-graphiti)) ported Supermemory's OpenCode plugin to use a Graphiti backend, providing a more advanced persistent memory mechanism to agents. However, given that our focus was not on memory, we sought to find another way to synthesize this existing software in service of codebase understanding.

Knowledge graphs seem promising for code because they're able to encode relational structures prominent in software: dependencies, inheritance, call graphs. The basic question we then posed was: are existing knowledge graph products feasible for use with raw code data? While a quicker answer might have been found by simply feeding Graphiti a few examples, we felt locked into this direction and started building a solution with a "Yes" in mind. We'd later be able to evaluate its use to get a more specific answer.

We use tree-sitter parsing to extract sub-file units like functions and classes. Graphiti (on top of Neo4j) handles the graph. Agents query via our MCP server. The basic flow looks like:

1. Ingestion: We run parsing over codebase contents, feeding units into Graphiti, forming the basis of the knowledge graph before query time.
2. Query: An agent, given some problem, makes a query via MCP about the codebase, e.g.,  "How does `TokenNormalizer` interact with the parser’s recovery mode when it encounters malformed string literals?" The server calls out to the graph, using hybrid search (semantic + keyword RRF), and returns the results.
3. Implicit feedback gathering: an additional feedback tool call allows an agent to return feedback based on follow-up conversation without direct user intervention. Positive and negative feedback signals, if present, are used to up- or down-weight nodes from the result set.

## Evaluation

### Baseline agent

For comparison purposes, we implement a simple context-gathering solution that represents something close to the status quo: spawning an exploration subagent with `ls`, `grep`, and `read` tools only. Codex, Claude Code, and OpenCode all ship built-in "Explore" subagents. In our evaluation case, moving the work into a subagent won't affect behavior, but the advantage in real use is that exploration results don't bloat main conversation context.

### Methodology

Avoiding choosing test codebases and queries ourselves, we rely on the popular [SWE-bench](https://huggingface.co/datasets/SWE-bench/SWE-bench) dataset of real GitHub issues. While running the SWE-bench end-to-end tests would provide some evaluation results with little effort, we reframe their issues to focus solely on retrieval steps, since we suspect that the bottleneck in agentic coding problems is likely model strength rather than retrieval capability. To achieve isolated context quality, our custom harness takes SWE-bench issues, generates a query for exploration, and utilitzes an LLM judge to measure usefulness given the gold patch.

### Results and Analysis

The baseline exploration agent meaningfully outperformed our knowledge graph approach. Why?

1. The graph created nodes and edges for low-value relationships; most notably, it seemed to hone in on ultra-specific but useless details like string constants in test cases.
2. A conceptual graph can ignore inherent structures present in code. We attempt to account for this using custom entity types (functions, classes, modules), but these are hints, not constraints.
3. Semantic search isn't tuned for code retrieval. When presented with issues, we often know exactly what structures we're looking for; in these cases, simple keyword search excels.

Further, our requirement for a pre-query time ingestion step to lay the knowledge base adds friction and scales poorly with large codebases: thousands of nodes could mean hours of inference. Even implementation changes addressing relationship typing and filtering, or weighing structural relationships more heavily, would not clearly be enough to beat out the simple exploration approach.

## On Process

Given the open-ended nature of the project, much early time was focused on brainstorming, looking for a path towards a solution. After the opportunity arose attempt what we've detailed, we chose to do so, seeing an interesting approach to a relatively new and unsolved problem. Some of the above shortcomings were visible earlier in the implementation phase, but we felt locked into this direction given the limited time frame of a university capstone and thus chose to continue and see what we'd discover rather than attempt to pivot. With a team not equally invested in this approach, a class structure not well suited to open-ended research (e.g., pre-scheduled user demos), and a sunk-cost on setup and ideation, we moved forward. Lastly, we turned our attention solely to evaluation, since we recognized not only its general importance, but that it would be the most valuable output of the project.

## Takeaways and future work

Given our extended continuation of the weak application presented here, we suggest validating against a simple baseline early rather than flesh out solutions prior to evaluation. Building in an explicit pivot checkpoint, not relying on momentum, is another potential aid. On a design level, mass ingestion is a major roadblock; consideration may be turned to deciding what relationships matter before an ingestion step. Further, evaluation of the graph as capturing correct structures may be separated from effective use of the graph by an agent.

Broader research areas not breached, but raised by the project and team include:

- Application of knowledge-base context to multiple repos
- Shared knowledge between multiple users
  - Related: structure for non-local knowledge persistance
- Further categorization of the types of questions we ask about code

## Closing

We began with the question of how agents can better understand code context, and arrived at the more specific: "Can we (just) use knowledge graphs here?" For our simple approach, the answer looks like "no," and moreover, that simple approaches outperform. But we don't cast doubt upon the potential of knowledge graphs in general; we see more clearly why this application is harder than it looks. We should seek to understand which relationships are most important to code understanding and whether pre-query analysis beats discovery during agentic work. Noise, ingestion, and semantic-code retrieval mismatch are structural issues above implementation detail. Future work on this problem should start from those constraints rather than from the appeal of the idea.

---

## Appendix: Recursive file tree description & navigation

Current exploration behavior generally looks like grepping for relevant terms, expanding context with some number of lines around results, etc. This approach seems quite efficient, and we see it adopted in all major agents for good reason. Our idea here was to have agents navigate file structures more like a human might. Rather than guess at contents from names, however, a computer-assisted system could analyze in advance to actually "know," at least on a surface level. We work from the bottom-up, first describing file contents, then their parent directories based on the contents, and so on, recursively. Hierarchical descriptions could help to avoid context bloat; rather than include all of the low-level descriptions, an agent can read the top-level directory description, then the subdirectory descriptions, choosing navigation and narrowing down on a file through as little as just one linear path through the tree. This feels something like pre-computing an explore subagent’s results.

This stayed as an experiment rather than our focus for two reasons:

1. It's relatively simple, and we had time to look into something more complex.
2. Replicating human behavior on search tasks probably isn't a good goal. LLMs are good at acting like humans, but they can also act like computers, and computers are just better here! (similarly so in the main project.)
