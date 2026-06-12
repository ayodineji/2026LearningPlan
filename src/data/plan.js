export const PLAN_START_DEFAULT = '2026-04-21';

// ============================================================
// PHASES — everything in the plan belongs to exactly one phase.
// Phase pages render all of a phase's content as checklists.
// ============================================================

export const PHASES = [
  {
    n: 1, name: 'Core Foundations', months: 'Months 1-3',
    color: '#d4ac2c', accent: '#e8c15a',
    focus: 'C# deep dive · System Design fundamentals · Patterns 1-9 · AWS basics',
    summary: 'A language is the substrate everything else runs on. Build coding fluency, learn how big systems are shaped, and ship your first public project.',
  },
  {
    n: 2, name: 'Systems, Frontend & AI Foundations', months: 'Months 4-6',
    color: '#6b8e74', accent: '#8aaa94',
    focus: 'Modern System Design · TypeScript + React · LLM fundamentals · Patterns 10-18',
    summary: 'The highest-variance interview topic (system design) gets the longest runway. The frontend stack rounds out breadth, and the AI track starts with how LLMs actually work.',
  },
  {
    n: 3, name: 'Data & Applied AI', months: 'Months 7-9',
    color: '#a6614a', accent: '#c17d65',
    focus: 'SQL patterns · Data engineering · RAG · Behavioral prep · Patterns 19-24',
    summary: 'Dense, concentrated content: SQL and pipelines feed directly into RAG — the same data skills power both the data-engineering and AI sides of the plan.',
  },
  {
    n: 4, name: 'Interview Mastery & Forward Look', months: 'Months 10-12',
    color: '#8b5a8c', accent: '#a578a6',
    focus: 'GenAI & Agentic system design · LLD heavy · Mock marathon · Patterns 25-28',
    summary: 'Light on brand-new fundamentals, heavy on rehearsal. GenAI system design is the forward-looking interview category; everything else is consolidation and mocks.',
  },
];

// ============================================================
// COURSES — each belongs to one phase page. `ongoing: true`
// courses span the whole year and appear on every phase page.
// Progress is derived from module checks when modules exist.
// ============================================================

export const COURSES = [
  // ---------- Phase 1 ----------
  {
    id: 'csharp',
    name: 'Mastering C# for .NET Developers',
    url: 'https://www.educative.io/courses/c-sharp-for-dot-net-developers',
    hours: 16, phase: 1, track: 'Language', weeklyHours: '3-4h',
    note: 'The foreground course of Phase 1. Reflection & Dynamic Binding are optional — skip if time-pressed.',
    modules: [
      { id: 'cs_m1', name: 'C# basics' },
      { id: 'cs_m2', name: 'Classes & OOP I' },
      { id: 'cs_m3', name: 'Classes & OOP II' },
      { id: 'cs_m4', name: 'Exception handling' },
      { id: 'cs_m5', name: 'Delegates & Events' },
      { id: 'cs_m6', name: 'Interfaces' },
      { id: 'cs_m7', name: 'Collections' },
      { id: 'cs_m8', name: 'LINQ' },
      { id: 'cs_m9', name: 'Strings & Dates' },
      { id: 'cs_m10', name: 'Multithreading & Async' },
      { id: 'cs_m11', name: 'Reflection (optional)' },
      { id: 'cs_m12', name: 'Garbage Collection' },
      { id: 'cs_m13', name: 'Dynamic Binding (optional)' },
    ],
  },
  {
    id: 'sd_fund',
    name: 'Grokking the Fundamentals of System Design',
    url: 'https://www.educative.io/courses/grokking-system-design-fundamentals',
    hours: 8, phase: 1, track: 'System Design', weeklyHours: '2-3h',
    note: 'Finish 100% before Phase 2 — it is the foundation for Modern System Design.',
    modules: [
      { id: 'sdf_1', name: 'Scalability fundamentals' },
      { id: 'sdf_2', name: 'Load balancing & caching' },
      { id: 'sdf_3', name: 'Databases (SQL vs NoSQL)' },
      { id: 'sdf_4', name: 'CAP theorem & consistency' },
      { id: 'sdf_5', name: 'Sharding, replication, partitioning' },
      { id: 'sdf_6', name: 'Messaging & queuing' },
    ],
  },

  // ---------- Phase 2 ----------
  {
    id: 'sd_modern',
    name: 'Grokking Modern System Design Interview',
    url: 'https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers',
    hours: 26, phase: 2, track: 'System Design', weeklyHours: '3h',
    note: 'RESHADED framework + building blocks. The case studies are tracked in the Design sections of Phases 2-4.',
    modules: [
      { id: 'sdm_1', name: 'RESHADED framework' },
      { id: 'sdm_2', name: 'Building blocks deep-dive' },
      { id: 'sdm_3', name: 'Back-of-envelope calculations' },
      { id: 'sdm_4', name: 'Built-in mock interview 1' },
      { id: 'sdm_5', name: 'Built-in mock interview 2' },
      { id: 'sdm_6', name: 'Built-in mock interview 3' },
    ],
  },
  {
    id: 'tsreact',
    name: 'Using TypeScript with React',
    url: 'https://www.educative.io/courses/using-typescript-with-react',
    hours: 9, phase: 2, track: 'Language', weeklyHours: '2h',
    note: 'Modern frontend stack. Feeds directly into the Phase 2 project.',
    modules: [
      { id: 'ts_m1', name: 'TypeScript basics' },
      { id: 'ts_m2', name: 'Type annotations & inference' },
      { id: 'ts_m3', name: 'Creating types' },
      { id: 'ts_m4', name: 'Generic types' },
      { id: 'ts_m5', name: 'Strongly-typed props & state' },
      { id: 'ts_m6', name: 'Events & handlers' },
      { id: 'ts_m7', name: 'Context & refs' },
      { id: 'ts_m8', name: 'Project setup' },
    ],
  },
  {
    id: 'llm_essentials',
    name: 'Essentials of Large Language Models: A Beginner\'s Journey',
    url: 'https://www.educative.io/courses/essentials-of-large-language-models-a-beginners-journey',
    hours: 6, phase: 2, track: 'AI', weeklyHours: '1-2h',
    note: 'The AI track starts here: how LLMs actually work, before you build with them in Phase 3.',
    modules: [
      { id: 'llm_m1', name: 'How LLMs work' },
      { id: 'llm_m2', name: 'Tokenization & embeddings' },
      { id: 'llm_m3', name: 'Transformer architecture' },
      { id: 'llm_m4', name: 'Prompting & in-context learning' },
      { id: 'llm_m5', name: 'Limitations, hallucination & evaluation' },
    ],
  },

  // ---------- Phase 3 ----------
  {
    id: 'sql',
    name: 'Grokking the SQL Interview Patterns',
    url: 'https://www.educative.io/courses/sql-interview-patterns',
    hours: 20, phase: 3, track: 'Data', weeklyHours: '2-3h',
    note: 'Foreground course of Phase 3. The 5 breakout mocks count toward your Phase 3 SQL mock target.',
    modules: [
      { id: 'sql_m1', name: 'SQL Essential Refresher' },
      { id: 'sql_m2', name: 'Tally Count aggregation' },
      { id: 'sql_m3', name: 'Group Bucket aggregation' },
      { id: 'sql_m4', name: 'Rolling Totals' },
      { id: 'sql_m5', name: 'Filtering Patterns' },
      { id: 'sql_m6', name: 'Comparison Patterns' },
      { id: 'sql_m7', name: 'Sequencing & Hierarchical' },
      { id: 'sql_m8', name: 'Transformation Patterns' },
    ],
  },
  {
    id: 'dataeng',
    name: 'Data Engineering Foundations in Python',
    url: 'https://www.educative.io/courses/data-engineering-foundations',
    hours: 7, phase: 3, track: 'Data', weeklyHours: '2h',
    note: 'Pipelines, modeling, orchestration. The Airflow project feeds the Phase 3 RAG project.',
    modules: [
      { id: 'de_m1', name: 'Data engineering life cycle' },
      { id: 'de_m2', name: 'Cloud data architecture' },
      { id: 'de_m3', name: 'Data ingestion & modeling' },
      { id: 'de_m4', name: 'Orchestration (Airflow, dbt)' },
      { id: 'de_m5', name: 'Data quality' },
      { id: 'de_p1', name: 'Mini-project: Airflow ETL pipeline' },
    ],
  },
  {
    id: 'rag_fund',
    name: 'Fundamentals of RAG with LangChain',
    url: 'https://www.educative.io/courses/rag-llm',
    hours: 8, phase: 3, track: 'AI', weeklyHours: '2h',
    note: 'Build retrieval-augmented generation hands-on. Pairs with the data-engineering course — pipelines feed RAG.',
    modules: [
      { id: 'rag_m1', name: 'RAG concepts & architecture' },
      { id: 'rag_m2', name: 'Embeddings & vector stores' },
      { id: 'rag_m3', name: 'Build a RAG pipeline with LangChain' },
      { id: 'rag_m4', name: 'Ship a Streamlit RAG app' },
    ],
  },
  {
    id: 'behavioral',
    name: 'Grokking the Behavioral Interview',
    url: 'https://www.educative.io/courses/grokking-the-behavioral-interview',
    hours: 5, phase: 3, track: 'Career', weeklyHours: '1h',
    note: 'At senior levels the behavioral round is often the differentiator. Start the STAR story bank here.',
    modules: [
      { id: 'bhv_m1', name: 'Self-introduction & narratives' },
      { id: 'bhv_m2', name: 'Prior-experience (STAR) questions' },
      { id: 'bhv_m3', name: 'Hypotheticals & questions to ask' },
    ],
  },

  // ---------- Phase 4 ----------
  {
    id: 'genai_sd',
    name: 'Grokking the Generative AI System Design',
    url: 'https://www.educative.io/courses/generative-ai-system-design',
    hours: 15, phase: 4, track: 'AI', weeklyHours: '2-3h',
    note: 'SCALED framework for GenAI design questions — the forward-looking interview category. The 4 built-in mocks count toward your Phase 4 AI mock target.',
    modules: [
      { id: 'gsd_m1', name: 'GenAI foundations (transformers, inference, RAG, fine-tuning)' },
      { id: 'gsd_m2', name: 'Back-of-envelope for LLM training & serving' },
      { id: 'gsd_m3', name: 'SCALED framework' },
      { id: 'gsd_m4', name: 'Case study: text generation (ChatGPT)' },
      { id: 'gsd_m5', name: 'Case study: image generation (DALL·E)' },
      { id: 'gsd_m6', name: 'Case studies: speech & video' },
      { id: 'gsd_mock1', name: 'GenAI mock interview 1' },
      { id: 'gsd_mock2', name: 'GenAI mock interview 2' },
      { id: 'gsd_mock3', name: 'GenAI mock interview 3' },
      { id: 'gsd_mock4', name: 'GenAI mock interview 4' },
    ],
  },
  {
    id: 'agentic_sd',
    name: 'Agentic System Design',
    url: 'https://www.educative.io/courses/agentic-ai-systems',
    hours: 8, phase: 4, track: 'AI', weeklyHours: '1-2h',
    note: 'Agent architectures, tools, memory, orchestration — feeds the Phase 4 capstone.',
    modules: [
      { id: 'ag_m1', name: 'Agent architectures & patterns' },
      { id: 'ag_m2', name: 'Tools, memory & orchestration' },
      { id: 'ag_m3', name: 'Case study: multi-agent systems' },
      { id: 'ag_m4', name: 'Case study: evaluation & guardrails' },
    ],
  },
  {
    id: 'ai_crash',
    name: 'The AI Engineer Interview Crash Course',
    url: 'https://www.educative.io/courses/ai-interview-crash-course',
    hours: 10, phase: 4, track: 'AI', weeklyHours: '2h',
    note: 'Final-stretch consolidation of the whole AI track: fundamentals, RAG design, agentic architectures.',
    modules: [
      { id: 'aic_m1', name: 'ML & LLM fundamentals refresher' },
      { id: 'aic_m2', name: 'Tokenization, embeddings, attention' },
      { id: 'aic_m3', name: 'RAG system design & evaluation' },
      { id: 'aic_m4', name: 'Agentic architectures' },
    ],
  },
  {
    id: 'lld',
    name: 'Grokking LLD Interview (OOD Principles)',
    url: 'https://www.educative.io/courses/grokking-the-low-level-design-interview-using-ood-principles',
    hours: 20, phase: 4, track: 'LLD', weeklyHours: '2-3h',
    note: 'Theory modules here; the 14 design problems are tracked in the Design sections of Phases 2-4. Start the reading in late Phase 2.',
    modules: [
      { id: 'lld_m1', name: 'OOP basics refresher' },
      { id: 'lld_m2', name: 'SOLID principles' },
      { id: 'lld_m3', name: 'Design patterns overview' },
      { id: 'lld_m4', name: 'UML & class diagrams' },
    ],
  },

  // ---------- Ongoing (every phase page) ----------
  {
    id: 'coding_patterns',
    name: 'Grokking the Coding Interview Patterns (Python)',
    url: 'https://www.educative.io/courses/grokking-coding-interview-in-python',
    hours: 85, phase: 1, track: 'Coding', weeklyHours: '3-4h', ongoing: true,
    note: 'The spine of the year. Progress is derived from the 28 patterns checked off on phase pages.',
    modules: [],
  },
  {
    id: 'pyex',
    name: 'Python Practice Exercises',
    url: 'https://www.educative.io/coding-practice/python-exercises',
    hours: 35, phase: 1, track: 'Coding', weeklyHours: '1h', ongoing: true,
    note: 'Background reps: 1-2 exercises/week, all year. All 63 named problems are listed on the phase pages, matched to each phase\'s patterns.',
    modules: [],
  },
];

// ============================================================
// PYTHON EXERCISES — all 63 named problems from Educative's
// Python practice set, assigned to the phase whose coding
// patterns they reinforce (~1-2/week keeps pace).
// ============================================================

export const PYTHON_EXERCISES = [
  // Phase 1 — two pointers, sliding window, heaps, intervals, linked lists
  { id: 'py_7', phase: 1, name: 'Valid Palindrome', topic: 'Two pointers' },
  { id: 'py_62', phase: 1, name: 'Valid Palindrome II', topic: 'Two pointers' },
  { id: 'py_40', phase: 1, name: 'Count Pairs Whose Sum is Less than Target', topic: 'Two pointers' },
  { id: 'py_2', phase: 1, name: 'Longest Substring without Repeating Characters', topic: 'Sliding window' },
  { id: 'py_1', phase: 1, name: 'Find All Anagrams in a String', topic: 'Sliding window' },
  { id: 'py_12', phase: 1, name: 'Longest Repeating Character Replacement', topic: 'Sliding window' },
  { id: 'py_4', phase: 1, name: 'Minimum Window Substring', topic: 'Sliding window' },
  { id: 'py_60', phase: 1, name: 'Sliding Window Maximum', topic: 'Sliding window' },
  { id: 'py_33', phase: 1, name: 'Moving Average from Data Stream', topic: 'Sliding window' },
  { id: 'py_27', phase: 1, name: 'Sliding Window Median', topic: 'Two heaps' },
  { id: 'py_30', phase: 1, name: 'Find Median from a Data Stream', topic: 'Two heaps' },
  { id: 'py_6', phase: 1, name: 'Task Scheduler', topic: 'Heap / greedy' },
  { id: 'py_21', phase: 1, name: 'Insert Interval', topic: 'Intervals' },
  { id: 'py_46', phase: 1, name: 'Reverse Linked List', topic: 'Linked list' },
  { id: 'py_51', phase: 1, name: 'Majority Element', topic: 'Arrays' },
  { id: 'py_35', phase: 1, name: 'Rearranging Fruits', topic: 'Greedy / hash' },

  // Phase 2 — subsets, backtracking, DP, greedy, cyclic sort, stacks
  { id: 'py_54', phase: 2, name: 'Subsets', topic: 'Subsets' },
  { id: 'py_14', phase: 2, name: 'Permutations', topic: 'Backtracking' },
  { id: 'py_8', phase: 2, name: 'Combination Sum', topic: 'Backtracking' },
  { id: 'py_15', phase: 2, name: 'Generate Parentheses', topic: 'Backtracking' },
  { id: 'py_50', phase: 2, name: 'Find K-Sum Subsets', topic: 'Backtracking' },
  { id: 'py_59', phase: 2, name: 'Restore IP Addresses', topic: 'Backtracking' },
  { id: 'py_53', phase: 2, name: 'Split a String Into the Max Number of Unique Substrings', topic: 'Backtracking' },
  { id: 'py_28', phase: 2, name: 'Sudoku Solver', topic: 'Backtracking' },
  { id: 'py_11', phase: 2, name: 'House Robber', topic: 'Dynamic programming' },
  { id: 'py_16', phase: 2, name: 'Word Break', topic: 'Dynamic programming' },
  { id: 'py_19', phase: 2, name: 'Decode Ways', topic: 'Dynamic programming' },
  { id: 'py_13', phase: 2, name: 'Palindromic Substrings', topic: 'Dynamic programming' },
  { id: 'py_3', phase: 2, name: 'Maximum Subarray', topic: 'DP / Kadane' },
  { id: 'py_31', phase: 2, name: 'Jump Game I', topic: 'Greedy' },
  { id: 'py_48', phase: 2, name: 'Cyclic Sort', topic: 'Cyclic sort' },
  { id: 'py_41', phase: 2, name: 'Daily Temperatures', topic: 'Stack' },

  // Phase 3 — graphs, BFS/DFS, tries, hash maps, tracking
  { id: 'py_5', phase: 3, name: 'Number of Islands', topic: 'Graph BFS/DFS' },
  { id: 'py_17', phase: 3, name: 'Clone Graph', topic: 'Graph' },
  { id: 'py_57', phase: 3, name: 'Flood Fill', topic: 'Graph DFS' },
  { id: 'py_47', phase: 3, name: 'Rotting Oranges', topic: 'BFS' },
  { id: 'py_29', phase: 3, name: 'Word Ladder', topic: 'BFS' },
  { id: 'py_22', phase: 3, name: 'Pacific Atlantic Water Flow', topic: 'Graph DFS' },
  { id: 'py_23', phase: 3, name: 'Evaluate Division', topic: 'Graph' },
  { id: 'py_61', phase: 3, name: 'Path with Maximum Probability', topic: 'Graph / Dijkstra' },
  { id: 'py_20', phase: 3, name: 'Find All Possible Recipes from Given Supplies', topic: 'Topological sort' },
  { id: 'py_38', phase: 3, name: 'Word Search II', topic: 'Trie' },
  { id: 'py_10', phase: 3, name: 'Group Anagrams', topic: 'Hash maps' },
  { id: 'py_9', phase: 3, name: 'Encode and Decode Strings', topic: 'Strings / design' },
  { id: 'py_25', phase: 3, name: 'Product of Array Except Self', topic: 'Arrays / tracking' },
  { id: 'py_42', phase: 3, name: 'Find All Duplicates in an Array', topic: 'Tracking' },
  { id: 'py_63', phase: 3, name: 'Word Break II', topic: 'DP + backtracking' },

  // Phase 4 — bitwise, math, stacks, custom data structures, hard reviews
  { id: 'py_18', phase: 4, name: 'Counting Bits', topic: 'Bitwise' },
  { id: 'py_34', phase: 4, name: 'Number of 1 Bits', topic: 'Bitwise' },
  { id: 'py_36', phase: 4, name: 'Reverse Bits', topic: 'Bitwise' },
  { id: 'py_37', phase: 4, name: 'Sum of Two Integers', topic: 'Bitwise' },
  { id: 'py_52', phase: 4, name: 'Number of Steps to Reduce a Binary Number to One', topic: 'Bitwise / math' },
  { id: 'py_56', phase: 4, name: 'Find the Longest Substring Having Vowels in Even Counts', topic: 'Bitmask' },
  { id: 'py_39', phase: 4, name: 'Basic Calculator', topic: 'Stack / math' },
  { id: 'py_49', phase: 4, name: 'Evaluate Reverse Polish Notation', topic: 'Stack' },
  { id: 'py_55', phase: 4, name: 'Asteroid Collision', topic: 'Stack' },
  { id: 'py_45', phase: 4, name: 'Minimum Remove to Make Valid Parentheses', topic: 'Stack' },
  { id: 'py_58', phase: 4, name: 'Remove All Adjacent Duplicates In String', topic: 'Stack' },
  { id: 'py_43', phase: 4, name: 'Maximum Frequency Stack', topic: 'Custom data structure' },
  { id: 'py_26', phase: 4, name: 'Reorganize String', topic: 'Heap / greedy' },
  { id: 'py_44', phase: 4, name: 'Minimum Operations to Make All Array Elements Equal', topic: 'Math / prefix sums' },
  { id: 'py_32', phase: 4, name: 'Longest Palindromic Substring', topic: 'DP review' },
  { id: 'py_24', phase: 4, name: 'Minimum Window Subsequence', topic: 'Two pointers (hard)' },
];

// ============================================================
// CODING PATTERNS — 28 chapters of Grokking the Coding
// Interview Patterns (Python), distributed across phases.
// Each links straight to its chapter in the course.
// ============================================================

const PATTERNS_BASE = 'https://www.educative.io/courses/grokking-coding-interview-in-python/introduction-to-';
const pat = (n, name, phase, slug) => ({ n, name, phase, url: PATTERNS_BASE + slug });

export const CODING_PATTERNS = [
  pat(1, 'Two Pointers', 1, 'two-pointers'),
  pat(2, 'Fast/Slow Pointers', 1, 'fast-and-slow-pointers'),
  pat(3, 'Sliding Window', 1, 'sliding-window'),
  pat(4, 'Intervals', 1, 'intervals'),
  pat(5, 'In-Place LinkedList', 1, 'in-place-manipulation-of-a-linked-list'),
  pat(6, 'Two Heaps', 1, 'two-heaps'),
  pat(7, 'K-way Merge', 1, 'k-way-merge'),
  pat(8, 'Top K Elements', 1, 'top-k-elements'),
  pat(9, 'Modified Binary Search', 1, 'modified-binary-search'),
  pat(10, 'Subsets', 2, 'subsets'),
  pat(11, 'Greedy Techniques', 2, 'greedy-techniques'),
  pat(12, 'Backtracking', 2, 'backtracking'),
  pat(13, 'Dynamic Programming', 2, 'dynamic-programming'),
  pat(14, 'Cyclic Sort', 2, 'cyclic-sort'),
  pat(15, 'Topological Sort', 2, 'topological-sort'),
  pat(16, 'Sort and Search', 2, 'sort-and-search'),
  pat(17, 'Matrices', 2, 'matrices'),
  pat(18, 'Stacks', 2, 'stacks'),
  pat(19, 'Graphs', 3, 'graphs'),
  pat(20, 'Tree DFS', 3, 'tree-depth-first-search'),
  pat(21, 'Tree BFS', 3, 'tree-breadth-first-search'),
  pat(22, 'Trie', 3, 'trie'),
  pat(23, 'Hash Maps', 3, 'hash-maps'),
  pat(24, 'Knowing What to Track', 3, 'knowing-what-to-track'),
  pat(25, 'Union Find', 4, 'union-find'),
  pat(26, 'Custom Data Structures', 4, 'custom-data-structures'),
  pat(27, 'Bitwise Manipulation', 4, 'bitwise-manipulation'),
  pat(28, 'Math and Geometry', 4, 'math-and-geometry'),
];

// ============================================================
// CLOUD LABS — curated from 37 down to 22 (duplicates cut).
// Phase 4 deliberately has none: it adds no new material.
// ============================================================

export const CLOUD_LABS = [
  // Phase 1 — foundational AWS
  { id: 'l1', name: 'Set Up EC2 Web Solution', category: 'Compute', phase: 1, url: 'https://www.educative.io/cloudlabs/aws-ec2-launch-instance' },
  { id: 'l3', name: 'AWS DynamoDB Beginner', category: 'Database', phase: 1, url: 'https://www.educative.io/cloudlabs/working-with-nosql-databases-a-beginner-s-guide-to-aws-dynamodb' },
  { id: 'l4', name: 'AWS RDS Beginner', category: 'Database', phase: 1, url: 'https://www.educative.io/cloudlabs/working-with-relational-databases-a-beginners-guide-to-aws-rds' },
  { id: 'l5', name: 'AWS KMS', category: 'Security', phase: 1, url: 'https://www.educative.io/cloudlabs/getting-started-with-aws-key-management-service-kms' },
  { id: 'l6', name: 'AWS Security Zero to Hero', category: 'Security', phase: 1, url: 'https://www.educative.io/cloudlabs/understanding-aws-security-and-management-from-zero-to-hero' },

  // Phase 2 — serverless & containers
  { id: 'l9', name: 'Getting to Know AWS Lambda', category: 'Serverless', phase: 2, url: 'https://www.educative.io/cloudlabs/aws-lambda' },
  { id: 'l8', name: 'Fanout with SNS/SQS/Lambda', category: 'Serverless', phase: 2, url: 'https://www.educative.io/cloudlabs/build-a-fanout-serverless-architecture-using-sns-sqs-and-lambda' },
  { id: 'l10', name: 'S3 Events + Lambda', category: 'Serverless', phase: 2, url: 'https://www.educative.io/cloudlabs/processing-amazon-s3-events-using-aws-lambda' },
  { id: 'l12', name: 'Event-Driven Serverless', category: 'Serverless', phase: 2, url: 'https://www.educative.io/cloudlabs/getting-started-with-serverless-event-driven-architecture-on-aws' },
  { id: 'l13', name: 'AWS SAM Serverless', category: 'IaC', phase: 2, url: 'https://www.educative.io/cloudlabs/building-and-deploying-serverless-applications-with-aws-sam' },
  { id: 'l14', name: 'Amazon ECS', category: 'Containers', phase: 2, url: 'https://www.educative.io/cloudlabs/getting-started-with-amazon-ecs' },
  { id: 'l15', name: 'ECS Blue/Green Deployment', category: 'Containers', phase: 2, url: 'https://www.educative.io/cloudlabs/creating-an-amazon-ecs-service-using-a-blue-green-deployment' },
  { id: 'l16', name: 'EKS Cluster Deployment', category: 'Containers', phase: 2, url: 'https://educative.io/cloudlabs/create-an-eks-cluster-and-deploy-an-application' },

  // Phase 3 — data, caching, monitoring, HA, AI
  { id: 'l22', name: 'ElastiCache for Redis', category: 'Caching', phase: 3, url: 'https://www.educative.io/cloudlabs/improving-database-performance-with-amazon-elasticache-for-redis' },
  { id: 'l23d', name: 'RDS Proxy', category: 'Database', phase: 3, url: 'https://www.educative.io/cloudlabs/getting-started-with-rds-proxy' },
  { id: 'l23', name: 'Aurora DSQL Multi-region', category: 'Database', phase: 3, url: 'https://www.educative.io/cloudlabs/aurora-dsql' },
  { id: 'l18', name: 'AWS Lake Formation Data Lake', category: 'Data', phase: 3, url: 'https://www.educative.io/cloudlabs/create-a-secure-data-lake-with-aws-lake-formation' },
  { id: 'l19', name: 'CloudWatch EC2 Monitoring', category: 'Monitoring', phase: 3, url: 'https://www.educative.io/cloudlabs/monitoring-ec2-instances-using-aws-cloudwatch' },
  { id: 'l20', name: 'CloudWatch Alarms', category: 'Monitoring', phase: 3, url: 'https://www.educative.io/cloudlabs/setting-up-amazon-cloudwatch-alarms' },
  { id: 'l24', name: 'Multi-AZ RDS Resilience', category: 'HA', phase: 3, url: 'https://www.educative.io/cloudlabs/building-resilient-applications-using-multi-az-rds-and-alb' },
  { id: 'l16b', name: 'EC2 Dynamic Scaling Policies', category: 'Compute', phase: 3, url: 'https://www.educative.io/cloudlabs/mastering-amazon-ec2-dynamic-scaling-policies' },
  { id: 'l17', name: 'GenAI with Bedrock + Lambda', category: 'AI/ML', phase: 3, url: 'https://www.educative.io/cloudlabs/build-a-generative-ai-app-using-amazon-bedrock-and-lambda' },
];

// ============================================================
// DESIGN — LLD problems + System Design cases, by phase.
// ============================================================

export const LLD_PROBLEMS = [
  { id: 'lld1', name: 'Parking Lot', phase: 2 }, { id: 'lld2', name: 'Vending Machine', phase: 2 },
  { id: 'lld3', name: 'Movie Ticket Booking', phase: 3 }, { id: 'lld4', name: 'Car Rental System', phase: 3 },
  { id: 'lld5', name: 'ATM', phase: 3 }, { id: 'lld6', name: 'Chess Game', phase: 3 },
  { id: 'lld7', name: 'Hotel Management', phase: 4 }, { id: 'lld8', name: 'Amazon Online Shopping', phase: 4 },
  { id: 'lld9', name: 'Stack Overflow', phase: 4 }, { id: 'lld10', name: 'Restaurant Management', phase: 4 },
  { id: 'lld11', name: 'Facebook', phase: 4 }, { id: 'lld12', name: 'Stock Brokerage', phase: 4 },
  { id: 'lld13', name: 'Airline Management', phase: 4 }, { id: 'lld14', name: 'LinkedIn', phase: 4 },
];

export const SYSTEM_DESIGN_CASES = [
  { id: 'sd8', name: 'TinyURL', phase: 2 }, { id: 'sd1', name: 'YouTube', phase: 2 },
  { id: 'sd2', name: 'Quora', phase: 2 }, { id: 'sd3', name: 'Google Maps', phase: 2 },
  { id: 'sd4', name: 'Uber', phase: 2 }, { id: 'sd5', name: 'Twitter', phase: 2 },
  { id: 'sd6', name: 'Newsfeed System', phase: 2 }, { id: 'sd7', name: 'Instagram', phase: 2 },
  { id: 'sd9', name: 'Web Crawler', phase: 3 }, { id: 'sd10', name: 'WhatsApp', phase: 3 },
  { id: 'sd11', name: 'Typeahead Suggestion', phase: 3 }, { id: 'sd12', name: 'Google Docs', phase: 3 },
  { id: 'sd13', name: 'Deployment System', phase: 4 }, { id: 'sd14', name: 'Payment System', phase: 4 },
  { id: 'sd15', name: 'ChatGPT System Design', phase: 4 },
];

// ============================================================
// PROJECTS — one shipped, public artifact per phase.
// These are first-class: courses get you skills, projects get
// you hired.
// ============================================================

export const PROJECTS = [
  {
    id: 'proj1', phase: 1,
    name: 'Ship a C# project to GitHub',
    desc: 'RPG Combat Engine or Cash Flow Manager from the C# course — public repo, real README, tests. Done = a stranger could clone and run it.',
  },
  {
    id: 'proj2', phase: 2,
    name: 'TypeScript/React app powered by an LLM API',
    desc: 'A small deployed app that calls an LLM API (chat over a topic, summarizer, etc). Exercises the TS/React course and the LLM fundamentals together.',
  },
  {
    id: 'proj3', phase: 3,
    name: 'Data pipeline + RAG over your own data',
    desc: 'Ingest a dataset with the pipeline skills from the data-engineering course, embed it, and answer questions over it with the RAG stack. Deployed, documented.',
  },
  {
    id: 'proj4', phase: 4,
    name: 'Agentic capstone + portfolio polish',
    desc: 'A small agent that uses tools (e.g. against your Phase 3 data), plus final portfolio pass: pinned repos, READMEs, demo links.',
  },
];

// ============================================================
// REVIEW & CAREER — retention and job-market items per phase.
// ============================================================

export const REVIEW_ITEMS = [
  { id: 'rev_p1_gh', phase: 1, name: 'GitHub profile pass', desc: 'Profile README, pinned repos, green squares from the C# project.' },
  { id: 'rev_p2_pat', phase: 2, name: 'Redo 3 Phase-1 patterns cold', desc: 'No notes, timed. Retention is engineered, not assumed.' },
  { id: 'rev_p3_pat', phase: 3, name: 'Redo 3 Phase-2 patterns cold', desc: 'No notes, timed.' },
  { id: 'rev_p3_star', phase: 3, name: 'STAR story bank — first 4 stories', desc: 'From your own work history, written down, using the behavioral course structure.' },
  { id: 'rev_p4_pat', phase: 4, name: 'Redo 4 random patterns cold', desc: 'Any phase, timed, no notes.' },
  { id: 'rev_p4_star', phase: 4, name: 'STAR story bank — complete (8 stories)', desc: 'Covering conflict, failure, leadership, ambiguity, impact.' },
  { id: 'rev_p4_resume', phase: 4, name: 'Resume + LinkedIn refresh', desc: 'Rewritten around the year\'s projects and skills.' },
  { id: 'rev_p4_apply', phase: 4, name: 'Apply to 5 calibration roles', desc: 'Real applications to calibrate against the actual market before the big swings.' },
];

// ============================================================
// MOCK INTERVIEWS — targets per phase, by type.
// 'ai' mocks are GenAI design mocks (4 are built into the
// Grokking GenAI System Design course).
// ============================================================

export const MOCK_TARGETS = {
  1: { sd: 4, coding: 4 },
  2: { sd: 6, coding: 6, lld: 2 },
  3: { sd: 6, coding: 6, lld: 3, sql: 2 },
  4: { sd: 8, coding: 6, lld: 4, ai: 4 },
};

export const MOCK_TYPE_LABELS = {
  sd: 'Sys Design', coding: 'Coding', lld: 'LLD', sql: 'SQL', ai: 'GenAI',
};

// ============================================================
// EXIT CRITERIA — a phase isn't done because the calendar says
// so. Interpreted by lib/objectives.js against live state.
// ============================================================

export const EXIT_CRITERIA = {
  1: [
    { id: 'x1_pat', type: 'patterns', label: 'Patterns 1-9 complete' },
    { id: 'x1_cs', type: 'course', course: 'csharp', min: 75, label: 'C# course ≥ 75%' },
    { id: 'x1_sdf', type: 'course', course: 'sd_fund', min: 100, label: 'System Design Fundamentals 100%' },
    { id: 'x1_proj', type: 'project', project: 'proj1', label: 'C# project shipped publicly' },
    { id: 'x1_mocks', type: 'mocks', label: 'Mock targets met (4 SD + 4 coding)' },
  ],
  2: [
    { id: 'x2_pat', type: 'patterns', label: 'Patterns 10-18 complete' },
    { id: 'x2_ts', type: 'course', course: 'tsreact', min: 75, label: 'TypeScript course ≥ 75%' },
    { id: 'x2_llm', type: 'course', course: 'llm_essentials', min: 100, label: 'LLM Essentials complete' },
    { id: 'x2_sd', type: 'design-sd', min: 4, label: '≥ 4 system design cases written up' },
    { id: 'x2_proj', type: 'project', project: 'proj2', label: 'LLM-powered app deployed' },
    { id: 'x2_mocks', type: 'mocks', label: 'Mock targets met' },
  ],
  3: [
    { id: 'x3_pat', type: 'patterns', label: 'Patterns 19-24 complete' },
    { id: 'x3_sql', type: 'course', course: 'sql', min: 100, label: 'SQL course 100%' },
    { id: 'x3_rag', type: 'course', course: 'rag_fund', min: 100, label: 'RAG course complete' },
    { id: 'x3_bhv', type: 'course', course: 'behavioral', min: 100, label: 'Behavioral course + first STAR stories' },
    { id: 'x3_proj', type: 'project', project: 'proj3', label: 'Pipeline + RAG project deployed' },
    { id: 'x3_mocks', type: 'mocks', label: 'Mock targets met' },
  ],
  4: [
    { id: 'x4_pat', type: 'patterns', label: 'All 28 patterns complete' },
    { id: 'x4_gsd', type: 'course', course: 'genai_sd', min: 100, label: 'GenAI System Design complete' },
    { id: 'x4_lld', type: 'design-lld', min: 10, label: '≥ 10 LLD problems written up (cumulative)' },
    { id: 'x4_sd', type: 'design-sd', min: 10, label: '≥ 10 SD cases written up (cumulative)' },
    { id: 'x4_proj', type: 'project', project: 'proj4', label: 'Agentic capstone shipped' },
    { id: 'x4_review', type: 'review', label: 'Career items done (STAR bank, resume, applications)' },
    { id: 'x4_mocks', type: 'mocks', label: 'Mock targets met' },
  ],
};

// ============================================================
// WEEKLY CADENCE & DAILY RHYTHM — per phase.
// ============================================================

export const WEEKLY_CADENCE = {
  1: { coding: 4, language: 3.5, systemDesign: 2.5, labs: 1, mocks: 0.5, total: 11.5 },
  2: { coding: 3.5, systemDesign: 3, frontend: 2, ai: 1.5, labs: 1, mocks: 1, total: 12 },
  3: { coding: 3, data: 3, ai: 2, systemDesign: 1.5, labs: 1, mocks: 1.5, total: 12 },
  4: { coding: 2, lld: 2.5, systemDesign: 2.5, ai: 2, mocks: 3, total: 12 },
};

export const DAILY_RHYTHM = {
  1: [
    { day: 'Mon', plan: 'C# (1.5h) + System Design Fundamentals (1h)' },
    { day: 'Tue', plan: 'Coding Patterns (1.5h) + Python exercises (0.5h)' },
    { day: 'Wed', plan: 'C# (1.5h) + System Design Fundamentals (1h)' },
    { day: 'Thu', plan: 'Coding Patterns (1.5h) + Python exercises (0.5h)' },
    { day: 'Fri', plan: 'Cloud Lab (1h) + C# project work (1h)' },
    { day: 'Sat', plan: 'Mock interview (1h) + review week notes (0.5h)' },
    { day: 'Sun', plan: 'Buffer + light review or off-day' },
  ],
  2: [
    { day: 'Mon', plan: 'Modern System Design (1.5h) + TypeScript (1h)' },
    { day: 'Tue', plan: 'Coding Patterns (1.5h) + Python (0.5h)' },
    { day: 'Wed', plan: 'LLM Essentials (1h) + SD case study (1h)' },
    { day: 'Thu', plan: 'Coding Patterns (1.5h) + TypeScript (0.5h)' },
    { day: 'Fri', plan: 'Cloud Lab (1h) + LLM app project (1h)' },
    { day: 'Sat', plan: 'Mock interview (1h) + notes review (0.5h)' },
    { day: 'Sun', plan: 'Buffer + light review or off-day' },
  ],
  3: [
    { day: 'Mon', plan: 'SQL Patterns (1.5h) + SD case study (1h)' },
    { day: 'Tue', plan: 'Coding Patterns (1.5h, graphs/trees) + Python (0.5h)' },
    { day: 'Wed', plan: 'RAG course (1.5h) + Data Engineering (1h)' },
    { day: 'Thu', plan: 'Coding Patterns (1.5h) + Behavioral course (0.5h)' },
    { day: 'Fri', plan: 'Cloud Lab (1h) + pipeline/RAG project (1h)' },
    { day: 'Sat', plan: 'Mock interview (1h) + notes review (0.5h)' },
    { day: 'Sun', plan: 'Buffer + light review' },
  ],
  4: [
    { day: 'Mon', plan: 'GenAI System Design (1.5h) + LLD problem (1h)' },
    { day: 'Tue', plan: 'Coding Patterns (1.5h) + AI crash course (0.5h)' },
    { day: 'Wed', plan: 'Agentic SD (1h) + SD case study (1.5h)' },
    { day: 'Thu', plan: 'Coding Patterns (1h) + capstone work (1h)' },
    { day: 'Fri', plan: 'Mock interview (1h) + LLD writeup (1h)' },
    { day: 'Sat', plan: 'Mock interview (1h) + review (0.5h)' },
    { day: 'Sun', plan: 'Buffer + light review' },
  ],
};
