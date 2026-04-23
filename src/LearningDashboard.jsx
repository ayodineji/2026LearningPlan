import React, { useState, useEffect, useMemo } from 'react';
import { Check, ChevronRight, ChevronLeft, ExternalLink, Plus, Trash2, X, StickyNote, ArrowUpRight, Sun, Moon, Terminal, Play, Loader2 } from 'lucide-react';

// ============================================================
// THEME — React Context
// ============================================================

const THEMES = {
  light: {
    name: 'light',
    bg: '#f4f0e8',       // warm cream paper
    bgElev: '#ebe4d2',   // slightly darker cream for inputs/hover
    ink: '#1a1814',      // ink black (primary text)
    inkDim: '#3a342a',   // soft ink (body prose)
    rule: '#1a1814',     // hairline rules
    ruleDim: '#9a8f75',  // dotted divider
    muted: '#c4bba9',    // muted bar backgrounds
    invert: '#f4f0e8',   // used for text on dark buttons
    overlay: 'rgba(26,24,20,0.6)',
    grainOpacity: 0.06,
    grainBlend: 'multiply',
    scrollThumb: '#c4bba9',
  },
  dark: {
    name: 'dark',
    bg: '#12110f',       // near-black warm
    bgElev: '#1d1b17',   // elevated panel
    ink: '#f0ead8',      // warm off-white
    inkDim: '#c4bba9',   // softer body
    rule: '#f0ead8',     // hairline rules
    ruleDim: '#55503f',  // dotted divider
    muted: '#2e2a22',    // muted bar backgrounds
    invert: '#12110f',   // text on light buttons
    overlay: 'rgba(0,0,0,0.75)',
    grainOpacity: 0.09,
    grainBlend: 'screen',
    scrollThumb: '#3a342a',
  },
};

const ThemeContext = React.createContext(THEMES.light);
const useTheme = () => React.useContext(ThemeContext);

// ============================================================
// PLAN DATA
// ============================================================

const PLAN_START_DEFAULT = '2026-04-21';

const COURSES = [
  {
    id: 'sd_fund',
    name: 'Grokking the Fundamentals of System Design',
    url: 'https://www.educative.io/courses/grokking-system-design-fundamentals',
    hours: 8, lessons: 40, phase: 1, priority: 3, track: 'System Design',
    weeklyHours: '2-3h',
    note: 'Complete by Week 3. Foundation for everything else.',
    modules: [
      { id: 'sdf_1', name: 'Scalability fundamentals' },
      { id: 'sdf_2', name: 'Load balancing & caching' },
      { id: 'sdf_3', name: 'Databases (SQL vs NoSQL)' },
      { id: 'sdf_4', name: 'CAP theorem & consistency' },
      { id: 'sdf_5', name: 'Sharding, replication, partitioning' },
      { id: 'sdf_6', name: 'Messaging & queuing' },
    ],
  },
  {
    id: 'sd_modern',
    name: 'Grokking Modern System Design Interview',
    url: 'https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers',
    hours: 26, lessons: 204, phase: 2, priority: 3, track: 'System Design',
    weeklyHours: '4-5h',
    note: 'RESHADED framework + 8 built-in mock interviews. Spans Phases 2-4.',
    modules: [
      { id: 'sdm_1', name: 'RESHADED framework' },
      { id: 'sdm_2', name: 'Building blocks deep-dive' },
      { id: 'sdm_3', name: 'Back-of-envelope calculations' },
      { id: 'sdm_4', name: 'Built-in mock interview 1' },
      { id: 'sdm_5', name: 'Built-in mock interview 2' },
      { id: 'sdm_6', name: 'Built-in mock interview 3' },
      { id: 'sdm_7', name: 'Built-in mock interview 4' },
      { id: 'sdm_8', name: 'Built-in mock interview 5' },
    ],
  },
  {
    id: 'coding_patterns',
    name: 'Grokking the Coding Interview Patterns (Python)',
    url: 'https://www.educative.io/courses/grokking-coding-interview-in-python',
    hours: 85, lessons: 1057, phase: 1, priority: 3, track: 'Coding',
    weeklyHours: '3-5h',
    note: 'All 28 patterns tracked on Patterns page. Core coding interview prep.',
    modules: [],
  },
  {
    id: 'lld',
    name: 'Grokking LLD Interview (OOD Principles)',
    url: 'https://www.educative.io/courses/grokking-the-low-level-design-interview-using-ood-principles',
    hours: 70, lessons: 20, phase: 2, priority: 2, track: 'LLD',
    weeklyHours: '2-4h',
    note: 'OOP design principles + 14 real-world problems (tracked on Design page).',
    modules: [
      { id: 'lld_m1', name: 'OOP basics refresher' },
      { id: 'lld_m2', name: 'SOLID principles' },
      { id: 'lld_m3', name: 'Design patterns overview' },
      { id: 'lld_m4', name: 'UML & class diagrams' },
    ],
  },
  {
    id: 'csharp',
    name: 'Mastering C# for .NET Developers',
    url: 'https://www.educative.io/courses/c-sharp-for-dot-net-developers',
    hours: 16, lessons: 208, phase: 1, priority: 3, track: 'Language',
    weeklyHours: '3-4h',
    note: 'Projects: RPG Combat Engine, Cash Flow Manager.',
    modules: [
      { id: 'cs_m1', name: 'Month 1 — C# basics' },
      { id: 'cs_m2', name: 'Month 1 — Classes & OOP I' },
      { id: 'cs_m3', name: 'Month 1 — Classes & OOP II' },
      { id: 'cs_m4', name: 'Month 1 — Exception handling' },
      { id: 'cs_m5', name: 'Month 2 — Delegates & Events' },
      { id: 'cs_m6', name: 'Month 2 — Interfaces' },
      { id: 'cs_m7', name: 'Month 2 — Collections' },
      { id: 'cs_m8', name: 'Month 2 — LINQ' },
      { id: 'cs_m9', name: 'Month 2 — Strings & Dates' },
      { id: 'cs_m10', name: 'Month 3 — Multithreading & Async' },
      { id: 'cs_m11', name: 'Month 3 — Reflection' },
      { id: 'cs_m12', name: 'Month 3 — Garbage Collection' },
      { id: 'cs_m13', name: 'Month 3 — Dynamic Binding' },
      { id: 'cs_p1', name: 'Project: RPG Combat Engine' },
      { id: 'cs_p2', name: 'Project: Cash Flow Manager' },
    ],
  },
  {
    id: 'tsreact',
    name: 'Using TypeScript with React',
    url: 'https://www.educative.io/courses/using-typescript-with-react',
    hours: 9, lessons: 64, phase: 2, priority: 3, track: 'Language',
    weeklyHours: '2-3h',
    note: 'Modern frontend stack mastery.',
    modules: [
      { id: 'ts_m1', name: 'Month 4 — TypeScript basics' },
      { id: 'ts_m2', name: 'Month 4 — Type annotations & inference' },
      { id: 'ts_m3', name: 'Month 4 — Basic types' },
      { id: 'ts_m4', name: 'Month 4 — Creating types' },
      { id: 'ts_m5', name: 'Month 5 — Generic types' },
      { id: 'ts_m6', name: 'Month 5 — Strongly-typed props & state' },
      { id: 'ts_m7', name: 'Month 5 — Class components' },
      { id: 'ts_m8', name: 'Month 6 — Events & handlers' },
      { id: 'ts_m9', name: 'Month 6 — Context' },
      { id: 'ts_m10', name: 'Month 6 — Refs' },
      { id: 'ts_m11', name: 'Month 6 — Project setup (CRA + Webpack)' },
    ],
  },
  {
    id: 'sql',
    name: 'Grokking the SQL Interview Patterns',
    url: 'https://www.educative.io/courses/sql-interview-patterns',
    hours: 20, lessons: 26, phase: 3, priority: 3, track: 'Data',
    weeklyHours: '2-3h',
    note: '5 breakout mock interview sessions included.',
    modules: [
      { id: 'sql_m1', name: 'Month 7 — SQL Essential Refresher' },
      { id: 'sql_m2', name: 'Month 7 — Tally Count aggregation' },
      { id: 'sql_m3', name: 'Month 7 — Group Bucket aggregation' },
      { id: 'sql_m4', name: 'Month 7 — Rolling Totals' },
      { id: 'sql_m5', name: 'Month 8 — Filtering Patterns' },
      { id: 'sql_m6', name: 'Month 8 — Comparison Patterns' },
      { id: 'sql_m7', name: 'Month 8 — Sequencing & Hierarchical' },
      { id: 'sql_m8', name: 'Month 8 — Transformation Patterns' },
      { id: 'sql_b1', name: 'Breakout mock session 1' },
      { id: 'sql_b2', name: 'Breakout mock session 2' },
      { id: 'sql_b3', name: 'Breakout mock session 3' },
      { id: 'sql_b4', name: 'Breakout mock session 4' },
      { id: 'sql_b5', name: 'Breakout mock session 5' },
    ],
  },
  {
    id: 'dataeng',
    name: 'Data Engineering Foundations in Python',
    url: 'https://www.educative.io/courses/data-engineering-foundations',
    hours: 7, lessons: 46, phase: 3, priority: 2, track: 'Data',
    weeklyHours: '2h',
    note: 'Projects: Airflow ETL pipeline, F1 end-to-end data pipeline.',
    modules: [
      { id: 'de_m1', name: 'Data team structure' },
      { id: 'de_m2', name: 'Data engineering life cycle' },
      { id: 'de_m3', name: 'Cloud data architecture' },
      { id: 'de_m4', name: 'Data ingestion' },
      { id: 'de_m5', name: 'Data modeling' },
      { id: 'de_m6', name: 'Data orchestration (Airflow, dbt)' },
      { id: 'de_m7', name: 'Data quality' },
      { id: 'de_p1', name: 'Project: Airflow ETL pipeline' },
      { id: 'de_p2', name: 'Project: F1 end-to-end pipeline' },
    ],
  },
  {
    id: 'pyex',
    name: 'Python Practice Exercises',
    url: 'https://www.educative.io/coding-practice/python-exercises',
    hours: 35, lessons: 63, phase: 1, priority: 2, track: 'Coding',
    weeklyHours: '1-2h',
    note: 'Ongoing throughout. Target: 2-3 exercises/week.',
    modules: [],
  },
];

const CODING_PATTERNS = [
  { n: 1, name: 'Two Pointers', phase: 1 }, { n: 2, name: 'Fast/Slow Pointers', phase: 1 },
  { n: 3, name: 'Sliding Window', phase: 1 }, { n: 4, name: 'Intervals', phase: 1 },
  { n: 5, name: 'In-Place LinkedList', phase: 1 }, { n: 6, name: 'Two Heaps', phase: 1 },
  { n: 7, name: 'K-way Merge', phase: 1 }, { n: 8, name: 'Top K Elements', phase: 1 },
  { n: 9, name: 'Modified Binary Search', phase: 1 }, { n: 10, name: 'Subsets', phase: 2 },
  { n: 11, name: 'Greedy Techniques', phase: 2 }, { n: 12, name: 'Backtracking', phase: 2 },
  { n: 13, name: 'Dynamic Programming', phase: 2 }, { n: 14, name: 'Cyclic Sort', phase: 2 },
  { n: 15, name: 'Topological Sort', phase: 2 }, { n: 16, name: 'Sort and Search', phase: 2 },
  { n: 17, name: 'Matrices', phase: 2 }, { n: 18, name: 'Stacks', phase: 2 },
  { n: 19, name: 'Graphs', phase: 3 }, { n: 20, name: 'Tree DFS', phase: 3 },
  { n: 21, name: 'Tree BFS', phase: 3 }, { n: 22, name: 'Trie', phase: 3 },
  { n: 23, name: 'Hash Maps', phase: 3 }, { n: 24, name: 'Knowing What to Track', phase: 3 },
  { n: 25, name: 'Union Find', phase: 4 }, { n: 26, name: 'Custom Data Structures', phase: 4 },
  { n: 27, name: 'Bitwise Manipulation', phase: 4 }, { n: 28, name: 'Math and Geometry', phase: 4 },
];

const CLOUD_LABS = [
  { id: 'l1', name: 'Set Up EC2 Web Solution', category: 'Compute', phase: 1, url: 'https://www.educative.io/cloudlabs/aws-ec2-launch-instance' },
  { id: 'l2', name: 'Amazon Keyspaces (NoSQL)', category: 'Database', phase: 1, url: 'https://www.educative.io/cloudlabs/getting-started-with-amazon-keyspaces' },
  { id: 'l3', name: 'AWS DynamoDB Beginner', category: 'Database', phase: 1, url: 'https://www.educative.io/cloudlabs/working-with-nosql-databases-a-beginner-s-guide-to-aws-dynamodb' },
  { id: 'l4', name: 'AWS RDS Beginner', category: 'Database', phase: 1, url: 'https://www.educative.io/cloudlabs/working-with-relational-databases-a-beginners-guide-to-aws-rds' },
  { id: 'l5', name: 'AWS KMS', category: 'Security', phase: 1, url: 'https://www.educative.io/cloudlabs/getting-started-with-aws-key-management-service-kms' },
  { id: 'l6', name: 'AWS Security Zero to Hero', category: 'Security', phase: 1, url: 'https://www.educative.io/cloudlabs/understanding-aws-security-and-management-from-zero-to-hero' },
  { id: 'l7', name: 'SNS + Lambda Notifications', category: 'Serverless', phase: 2, url: 'https://www.educative.io/cloudlabs/handling-amazon-sns-notifications-with-aws-lambda' },
  { id: 'l8', name: 'Fanout with SNS/SQS/Lambda', category: 'Serverless', phase: 2, url: 'https://www.educative.io/cloudlabs/build-a-fanout-serverless-architecture-using-sns-sqs-and-lambda' },
  { id: 'l9', name: 'Getting to Know AWS Lambda', category: 'Serverless', phase: 2, url: 'https://www.educative.io/cloudlabs/aws-lambda' },
  { id: 'l9b', name: 'AWS Lambda (alternate)', category: 'Serverless', phase: 2, url: 'https://www.educative.io/cloudlabs/getting-to-know-aws-lambda' },
  { id: 'l10', name: 'S3 Events + Lambda', category: 'Serverless', phase: 2, url: 'https://www.educative.io/cloudlabs/processing-amazon-s3-events-using-aws-lambda' },
  { id: 'l11', name: 'Serverless S3 File Processing', category: 'Serverless', phase: 2, url: 'https://www.educative.io/cloudlabs/serverless-s3-file-processing-with-aws-lambda' },
  { id: 'l12', name: 'Event-Driven Serverless', category: 'Serverless', phase: 2, url: 'https://www.educative.io/cloudlabs/getting-started-with-serverless-event-driven-architecture-on-aws' },
  { id: 'l13', name: 'AWS SAM Serverless', category: 'Serverless', phase: 2, url: 'https://www.educative.io/cloudlabs/building-and-deploying-serverless-applications-with-aws-sam' },
  { id: 'l13b', name: 'AWS Serverless App Repository', category: 'Serverless', phase: 2, url: 'https://www.educative.io/cloudlabs/getting-started-with-aws-serverless-application-repository' },
  { id: 'l13c', name: 'Mastering Serverless on AWS', category: 'Serverless', phase: 3, url: 'https://www.educative.io/cloudlabs/mastering-serverless-on-aws-from-zero-to-hero' },
  { id: 'l14', name: 'Amazon ECS', category: 'Containers', phase: 2, url: 'https://www.educative.io/cloudlabs/getting-started-with-amazon-ecs' },
  { id: 'l15', name: 'ECS Blue/Green Deployment', category: 'Containers', phase: 2, url: 'https://www.educative.io/cloudlabs/creating-an-amazon-ecs-service-using-a-blue-green-deployment' },
  { id: 'l16', name: 'EKS Cluster Deployment', category: 'Containers', phase: 2, url: 'https://educative.io/cloudlabs/create-an-eks-cluster-and-deploy-an-application' },
  { id: 'l16b', name: 'EC2 Dynamic Scaling Policies', category: 'Compute', phase: 3, url: 'https://www.educative.io/cloudlabs/mastering-amazon-ec2-dynamic-scaling-policies' },
  { id: 'l17', name: 'GenAI with Bedrock + Lambda', category: 'AI/ML', phase: 3, url: 'https://www.educative.io/cloudlabs/build-a-generative-ai-app-using-amazon-bedrock-and-lambda' },
  { id: 'l18', name: 'AWS Lake Formation Data Lake', category: 'Data', phase: 3, url: 'https://www.educative.io/cloudlabs/create-a-secure-data-lake-with-aws-lake-formation' },
  { id: 'l19', name: 'CloudWatch EC2 Monitoring', category: 'Monitoring', phase: 3, url: 'https://www.educative.io/cloudlabs/monitoring-ec2-instances-using-aws-cloudwatch' },
  { id: 'l19b', name: 'Getting to Know CloudWatch', category: 'Monitoring', phase: 3, url: 'https://www.educative.io/cloudlabs/getting-to-know-amazon-cloudwatch' },
  { id: 'l20', name: 'CloudWatch Alarms', category: 'Monitoring', phase: 3, url: 'https://www.educative.io/cloudlabs/setting-up-amazon-cloudwatch-alarms' },
  { id: 'l20b', name: 'EC2 Health Check Monitoring', category: 'Monitoring', phase: 3, url: 'https://www.educative.io/cloudlabs/avoid-downtime-by-monitoring-ec2-health-checks-in-cloudwatch' },
  { id: 'l21', name: 'S3 + EBS KMS Encryption', category: 'Security', phase: 3, url: 'https://www.educative.io/cloudlabs/encrypting-s3-buckets-and-ebs-volumes-using-kms' },
  { id: 'l22', name: 'ElastiCache for Redis', category: 'Caching', phase: 3, url: 'https://www.educative.io/cloudlabs/improving-database-performance-with-amazon-elasticache-for-redis' },
  { id: 'l22b', name: 'MemoryDB for Redis', category: 'Caching', phase: 3, url: 'https://www.educative.io/cloudlabs/achieving-ultra-fast-performance-using-amazon-memorydb-for-redis' },
  { id: 'l22c', name: 'ElastiCache Session Persistence', category: 'Caching', phase: 3, url: 'https://www.educative.io/cloudlabs/persisting-sessions-using-aws-elasticache' },
  { id: 'l23', name: 'Aurora DSQL Multi-region', category: 'Database', phase: 3, url: 'https://www.educative.io/cloudlabs/aurora-dsql' },
  { id: 'l23b', name: 'AWS Database Options', category: 'Database', phase: 3, url: 'https://www.educative.io/cloudlabs/understanding-aws-database-options' },
  { id: 'l23c', name: 'DynamoDB Accelerator (DAX)', category: 'Database', phase: 3, url: 'https://www.educative.io/cloudlabs/getting-started-with-dynamodb-accelerator-dax' },
  { id: 'l23d', name: 'RDS Proxy', category: 'Database', phase: 3, url: 'https://www.educative.io/cloudlabs/getting-started-with-rds-proxy' },
  { id: 'l23e', name: 'Athena Federated Query with RDS', category: 'Database', phase: 3, url: 'https://www.educative.io/cloudlabs/athena-federated-query-with-amazon-rds' },
  { id: 'l24', name: 'Multi-AZ RDS Resilience', category: 'HA', phase: 3, url: 'https://www.educative.io/cloudlabs/building-resilient-applications-using-multi-az-rds-and-alb' },
  { id: 'l25', name: 'CloudFormation Helper Scripts', category: 'IaC', phase: 3, url: 'https://www.educative.io/cloudlabs/mastering-aws-cloudformation-helper-scripts' },
];

const LLD_PROBLEMS = [
  { id: 'lld1', name: 'Parking Lot', phase: 2 }, { id: 'lld2', name: 'Vending Machine', phase: 2 },
  { id: 'lld3', name: 'Movie Ticket Booking', phase: 3 }, { id: 'lld4', name: 'Car Rental System', phase: 3 },
  { id: 'lld5', name: 'ATM', phase: 3 }, { id: 'lld6', name: 'Chess Game', phase: 3 },
  { id: 'lld7', name: 'Hotel Management', phase: 4 }, { id: 'lld8', name: 'Amazon Online Shopping', phase: 4 },
  { id: 'lld9', name: 'Stack Overflow', phase: 4 }, { id: 'lld10', name: 'Restaurant Management', phase: 4 },
  { id: 'lld11', name: 'Facebook', phase: 4 }, { id: 'lld12', name: 'Stock Brokerage', phase: 4 },
  { id: 'lld13', name: 'Airline Management', phase: 4 }, { id: 'lld14', name: 'LinkedIn', phase: 4 },
];

const SYSTEM_DESIGN_CASES = [
  { id: 'sd1', name: 'YouTube', phase: 2 }, { id: 'sd2', name: 'Quora', phase: 2 },
  { id: 'sd3', name: 'Google Maps', phase: 2 }, { id: 'sd4', name: 'Uber', phase: 2 },
  { id: 'sd5', name: 'Twitter', phase: 2 }, { id: 'sd6', name: 'Newsfeed System', phase: 2 },
  { id: 'sd7', name: 'Instagram', phase: 2 }, { id: 'sd8', name: 'TinyURL', phase: 2 },
  { id: 'sd9', name: 'Web Crawler', phase: 3 }, { id: 'sd10', name: 'WhatsApp', phase: 3 },
  { id: 'sd11', name: 'Typeahead Suggestion', phase: 3 }, { id: 'sd12', name: 'Google Docs', phase: 3 },
  { id: 'sd13', name: 'Deployment System', phase: 4 }, { id: 'sd14', name: 'Payment System', phase: 4 },
  { id: 'sd15', name: 'ChatGPT System Design', phase: 4 },
];

const OPTIONAL_PROJECTS = [
  { id: 'pr1', name: 'Optimizing Marketing Spending with Python', url: 'https://www.educative.io/projects/optimizing-marketing-spending-with-python' },
  { id: 'pr2', name: 'Stock Market Data Visualization (NIFTY-50)', url: 'https://www.educative.io/projects/stock-market-data-visualization-using-python' },
  { id: 'pr3', name: 'Apriori Algorithm with PySpark', url: 'https://www.educative.io/projects/apriori-algorithm-for-finding-frequent-itemsets-with-pyspark' },
  { id: 'pr4', name: 'Netflix Data Analysis with Danfo.js', url: 'https://www.educative.io/projects/netflix-data-analysis-using-danfojs' },
];

const PHASES = [
  { n: 1, name: 'Core Foundations', months: 'Months 1-3', color: '#d4ac2c', accent: '#e8c15a', focus: 'System Design fundamentals, C# deep dive, Patterns 1-9' },
  { n: 2, name: 'System Design & Frontend', months: 'Months 4-6', color: '#6b8e74', accent: '#8aaa94', focus: 'Modern System Design, TypeScript + React, Patterns 10-18' },
  { n: 3, name: 'Data Skills', months: 'Months 7-9', color: '#a6614a', accent: '#c17d65', focus: 'SQL patterns, Data Engineering, Patterns 19-24' },
  { n: 4, name: 'Interview Mastery', months: 'Months 10-12', color: '#8b5a8c', accent: '#a578a6', focus: 'LLD, Advanced System Design, Mock Marathon' },
];

const MONTHLY_MILESTONES = [
  { month: 1, focus: 'Foundation', items: ['System Design Fundamentals', 'C# basics', 'Patterns 1-3'] },
  { month: 2, focus: 'Deepen C#', items: ['C# OOP', 'Patterns 4-6', '2 mock interviews'] },
  { month: 3, focus: 'C# mastery', items: ['C# async/await', 'Patterns 7-9'] },
  { month: 4, focus: 'Frontend start', items: ['TypeScript basics', 'System Design start', 'Patterns 10-12'] },
  { month: 5, focus: 'React integration', items: ['TypeScript + React', 'Patterns 13-15'] },
  { month: 6, focus: 'TypeScript mastery', items: ['Advanced TS', 'Patterns 16-18', 'LLD start'] },
  { month: 7, focus: 'SQL fundamentals', items: ['SQL Aggregation', 'Patterns 19-21'] },
  { month: 8, focus: 'SQL patterns', items: ['SQL Comparison', 'Patterns 22-24'] },
  { month: 9, focus: 'Data pipelines', items: ['Data Engineering', 'Patterns complete'] },
  { month: 10, focus: 'Design focus', items: ['LLD heavy', 'Final SD cases'] },
  { month: 11, focus: 'Wrap courses', items: ['All patterns done', 'LLD complete'] },
  { month: 12, focus: 'Final prep', items: ['Mock marathon', 'ChatGPT SD'] },
];

const MOCK_INTERVIEW_TARGETS = {
  1: { sd: 1, coding: 1, lld: 0, sql: 0 }, 2: { sd: 1, coding: 1, lld: 0, sql: 0 },
  3: { sd: 2, coding: 2, lld: 0, sql: 0 }, 4: { sd: 2, coding: 2, lld: 0, sql: 0 },
  5: { sd: 3, coding: 2, lld: 1, sql: 0 }, 6: { sd: 3, coding: 2, lld: 1, sql: 0 },
  7: { sd: 2, coding: 2, lld: 2, sql: 1 }, 8: { sd: 3, coding: 2, lld: 1, sql: 1 },
  9: { sd: 3, coding: 2, lld: 1, sql: 0 }, 10: { sd: 4, coding: 3, lld: 2, sql: 0 },
  11: { sd: 4, coding: 3, lld: 2, sql: 0 }, 12: { sd: 5, coding: 3, lld: 2, sql: 0 },
};

// ============================================================
// STORAGE + UTILITIES
// ============================================================

const STORAGE_KEY = 'edu_plan_v2';

const defaultState = {
  startDate: PLAN_START_DEFAULT,
  theme: 'light',
  courseProgress: {}, courseNotes: {}, moduleChecks: {},
  patterns: {}, patternNotes: {},
  labs: {}, labNotes: {},
  lldProblems: {}, lldNotes: {},
  sdCases: {}, sdNotes: {},
  projects: {},
  mockInterviews: {},
  sessions: [],
  customNotes: {},
  weeklyGoalHours: 11,
};

async function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultState, ...JSON.parse(raw) };
  } catch (e) {
    console.warn('Failed to load saved state:', e);
  }
  return defaultState;
}
async function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Save failed:', e);
  }
}

function formatDate(d) {
  if (typeof d === 'string') d = new Date(d + 'T00:00:00');
  return d.toISOString().slice(0, 10);
}
function addDays(d, days) { const r = new Date(d); r.setDate(r.getDate() + days); return r; }
function addMonths(d, months) { const r = new Date(d); r.setMonth(r.getMonth() + months); return r; }
function getPhaseFromMonth(m) { if (m <= 3) return 1; if (m <= 6) return 2; if (m <= 9) return 3; return 4; }

// ============================================================
// ROOT
// ============================================================

export default function LearningDashboard() {
  const [state, setState] = useState(defaultState);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState('overview');
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);

  useEffect(() => { loadState().then(s => { setState(s); setLoaded(true); }); }, []);
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => saveState(state), 400);
    return () => clearTimeout(t);
  }, [state, loaded]);

  const stats = useMemo(() => {
    const today = new Date();
    const start = new Date(state.startDate + 'T00:00:00');
    const daysElapsed = Math.max(0, Math.floor((today - start) / (1000 * 60 * 60 * 24)));
    const currentMonth = Math.max(1, Math.min(12, Math.floor(daysElapsed / 30) + 1));
    const currentPhase = getPhaseFromMonth(currentMonth);
    const progressPct = Math.min(100, (daysElapsed / 365) * 100);
    const patternsDone = Object.values(state.patterns).filter(Boolean).length;
    const labsDone = Object.values(state.labs).filter(Boolean).length;
    const lldDone = Object.values(state.lldProblems).filter(Boolean).length;
    const sdDone = Object.values(state.sdCases).filter(Boolean).length;
    const totalHoursLogged = state.sessions.reduce((s, x) => s + (x.duration || 0), 0);
    const weekAgo = addDays(today, -7);
    const weekHours = state.sessions.filter(s => new Date(s.date) >= weekAgo).reduce((sum, x) => sum + (x.duration || 0), 0);
    const mockTotal = Object.values(state.mockInterviews).reduce((s, x) => s + (x || 0), 0);
    const mockTargetTotal = Object.values(MOCK_INTERVIEW_TARGETS).reduce((s, m) => s + m.sd + m.coding + m.lld + m.sql, 0);
    const courseAvg = COURSES.reduce((s, c) => s + (state.courseProgress[c.id] || 0), 0) / COURSES.length;
    return { daysElapsed, currentMonth, currentPhase, progressPct, patternsDone, labsDone, lldDone, sdDone, totalHoursLogged, weekHours, mockTotal, mockTargetTotal, courseAvg };
  }, [state]);

  const update = (patch) => setState(s => ({ ...s, ...patch }));
  const toggle = (key, id) => setState(s => ({ ...s, [key]: { ...s[key], [id]: !s[key][id] } }));
  const setCourseProgress = (id, pct) => setState(s => ({ ...s, courseProgress: { ...s.courseProgress, [id]: Math.max(0, Math.min(100, pct)) } }));
  const setCourseNote = (id, text) => setState(s => ({ ...s, courseNotes: { ...s.courseNotes, [id]: text } }));
  const setGenericNote = (key, id, text) => setState(s => ({ ...s, [key]: { ...s[key], [id]: text } }));
  const addSession = (session) => setState(s => ({ ...s, sessions: [...s.sessions, { ...session, id: Date.now().toString() }] }));
  const deleteSession = (id) => setState(s => ({ ...s, sessions: s.sessions.filter(x => x.id !== id) }));
  const setMockInterview = (month, type, count) => setState(s => ({ ...s, mockInterviews: { ...s.mockInterviews, [`${month}-${type}`]: count } }));
  const setDayNote = (date, text) => setState(s => ({ ...s, customNotes: { ...s.customNotes, [date]: text } }));

  const theme = THEMES[state.theme] || THEMES.light;

  if (!loaded) {
    return (
      <div style={{ minHeight: '100vh', background: theme.bg, color: theme.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 11, opacity: 0.6 }}>Loading plan</div>
      </div>
    );
  }
  const toggleTheme = () => update({ theme: state.theme === 'light' ? 'dark' : 'light' });

  return (
    <ThemeContext.Provider value={theme}>
    <div style={{ minHeight: '100vh', background: theme.bg, color: theme.ink, fontFamily: '"Inter", sans-serif', position: 'relative', transition: 'background 0.3s, color 0.3s' }}>
      <GlobalStyles theme={theme} />
      <div className="grain" />

      <Header view={view} setView={setView} stats={stats} theme={theme} toggleTheme={toggleTheme} />

      <main style={{ maxWidth: 920, margin: '0 auto', padding: '0 32px 80px', position: 'relative', zIndex: 2 }}>
        {view === 'overview' && <OverviewView state={state} stats={stats} setView={setView} />}
        {view === 'courses' && <CoursesView state={state} setCourseProgress={setCourseProgress} setCourseNote={setCourseNote} toggleModule={(id) => toggle('moduleChecks', id)} />}
        {view === 'patterns' && <PatternsView state={state} togglePattern={(n) => toggle('patterns', n)} setPatternNote={(n, text) => setGenericNote('patternNotes', n, text)} />}
        {view === 'design' && <DesignView state={state} toggleLLD={(id) => toggle('lldProblems', id)} toggleSD={(id) => toggle('sdCases', id)} setLLDNote={(id, t) => setGenericNote('lldNotes', id, t)} setSDNote={(id, t) => setGenericNote('sdNotes', id, t)} />}
        {view === 'labs' && <LabsView state={state} toggleLab={(id) => toggle('labs', id)} setLabNote={(id, t) => setGenericNote('labNotes', id, t)} />}
        {view === 'mocks' && <MocksView state={state} setMockInterview={setMockInterview} />}
        {view === 'calendar' && <CalendarView state={state} calendarMonth={calendarMonth} setCalendarMonth={setCalendarMonth} selectedDate={selectedDate} setSelectedDate={setSelectedDate} setDayNote={setDayNote} onAddSession={() => setShowSessionModal(true)} deleteSession={deleteSession} />}
        {view === 'compiler' && <CompilerView />}
        {view === 'settings' && <SettingsView state={state} update={update} toggleProject={(id) => toggle('projects', id)} onReset={() => { if (confirm('Reset everything? This cannot be undone.')) setState({ ...defaultState, theme: state.theme }); }} />}
      </main>

      {showSessionModal && (
        <SessionModal
          date={selectedDate || formatDate(new Date())}
          onSave={(s) => { addSession(s); setShowSessionModal(false); }}
          onClose={() => setShowSessionModal(false)}
        />
      )}

      <Footer />
    </div>
    </ThemeContext.Provider>
  );
}

function GlobalStyles({ theme }) {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,700;9..144,900&family=Inter:wght@400;500;600;700&display=swap');
      * { box-sizing: border-box; }
      body { margin: 0; background: ${theme.bg}; }
      .font-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
      .font-mono { font-family: 'JetBrains Mono', monospace; font-feature-settings: "zero"; }
      .serif { font-family: 'Fraunces', serif; }
      .btn-t { transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1); }
      .custom-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
      .custom-scroll::-webkit-scrollbar-track { background: transparent; }
      .custom-scroll::-webkit-scrollbar-thumb { background: ${theme.scrollThumb}; border-radius: 3px; }
      input[type="range"] { accent-color: ${theme.ink}; }
      input, textarea, select { font-family: 'Inter', sans-serif; color: ${theme.ink}; }
      @keyframes slideIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes fadeInScale { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
      @keyframes drawLine { from { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; } }
      .animate-in { animation: slideIn 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
      .spin { animation: spin 0.8s linear infinite; }
      .fade-scale { animation: fadeInScale 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
      .grain::before {
        content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 1000;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E");
        opacity: ${theme.grainOpacity}; mix-blend-mode: ${theme.grainBlend};
      }
      .divider-dotted { border-bottom: 1px dotted ${theme.ruleDim}; }
      .rule-thick { border-bottom: 2px solid ${theme.rule}; }
      .hover-bg:hover { background: ${theme.bgElev}; }
    `}</style>
  );
}

// ============================================================
// HEADER + FOOTER
// ============================================================

function Header({ view, setView, stats, theme, toggleTheme }) {
  const tabs = [
    { id: 'overview', label: 'Overview' }, { id: 'courses', label: 'Courses' },
    { id: 'patterns', label: 'Patterns' }, { id: 'design', label: 'Design' },
    { id: 'labs', label: 'Labs' }, { id: 'mocks', label: 'Mocks' },
    { id: 'calendar', label: 'Calendar' }, { id: 'compiler', label: 'Compiler' },
    { id: 'settings', label: 'Settings' },
  ];
  const currentPhase = PHASES[stats.currentPhase - 1];
  const isDark = theme.name === 'dark';

  return (
    <header style={{ background: theme.bg, borderBottom: `1px solid ${theme.rule}`, position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 920, margin: '0 auto', padding: '24px 32px 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
          <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>
            Educative Premium Plus · 12-month plan
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>
              Vol. 01 · Issue {String(stats.currentMonth).padStart(2, '0')}
            </div>
            <button
              onClick={toggleTheme}
              className="btn-t"
              title={isDark ? 'Switch to light' : 'Switch to dark'}
              aria-label="Toggle theme"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'transparent',
                color: theme.ink,
                border: `1px solid ${theme.rule}`,
                borderRadius: 2,
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em',
              }}
            >
              {isDark ? <Sun size={12} /> : <Moon size={12} />}
              <span className="font-mono">{isDark ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', paddingBottom: 16 }}>
          <h1 className="font-display" style={{ fontSize: 72, fontWeight: 900, letterSpacing: '-0.045em', lineHeight: 0.88, margin: 0 }}>
            The <em style={{ fontWeight: 400, fontStyle: 'italic', color: currentPhase.color }}>Grind</em>
          </h1>
          <div style={{ display: 'flex', gap: 20, paddingBottom: 4 }}>
            <Stat label="Day" value={`${stats.daysElapsed}/365`} />
            <Stat label="Month" value={`${stats.currentMonth}/12`} />
            <Stat label="Phase" value={`0${stats.currentPhase}`} accent={currentPhase.color} />
          </div>
        </div>
        <div className="rule-thick" />
        <nav style={{ display: 'flex', overflowX: 'auto', marginTop: -1 }} className="custom-scroll">
          {tabs.map((t, i) => {
            const active = view === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setView(t.id)}
                className="btn-t font-mono"
                style={{
                  padding: '14px 18px',
                  background: active ? theme.ink : 'transparent',
                  color: active ? theme.invert : theme.ink,
                  fontWeight: active ? 600 : 500,
                  cursor: 'pointer',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  border: 'none',
                  borderRight: i < tabs.length - 1 ? `1px solid ${theme.rule}` : 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {t.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

function Stat({ label, value, accent }) {
  const theme = useTheme();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <span style={{ opacity: 0.5, textTransform: 'uppercase', fontSize: 9, letterSpacing: '0.2em' }} className="font-mono">{label}</span>
      <span style={{ color: accent || theme.ink, fontWeight: 700, fontSize: 14 }} className="font-mono">{value}</span>
    </div>
  );
}

function Footer() {
  const theme = useTheme();
  return (
    <footer style={{ maxWidth: 920, margin: '0 auto', padding: '0 32px 40px', position: 'relative', zIndex: 2 }}>
      <div className="rule-thick" style={{ marginBottom: 12 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5 }} className="font-mono">
        <span>— End of document —</span>
        <span>Progress saved automatically</span>
      </div>
    </footer>
  );
}

// ============================================================
// OVERVIEW
// ============================================================

function OverviewView({ state, stats, setView }) {
  const theme = useTheme();
  const currentPhase = PHASES[stats.currentPhase - 1];
  const currentMilestone = MONTHLY_MILESTONES[stats.currentMonth - 1];
  const nextMilestone = stats.currentMonth < 12 ? MONTHLY_MILESTONES[stats.currentMonth] : null;

  return (
    <div className="animate-in" style={{ paddingTop: 40 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
        <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>§ 01 · Current standing</span>
        <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </span>
      </div>
      <div className="divider-dotted" style={{ marginBottom: 32 }} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 32,
        alignItems: 'start',
        marginBottom: 40,
      }}>
        <div>
          <div className="font-mono" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: 12, color: currentPhase.color }}>
            Phase {currentPhase.n} · {currentPhase.months}
          </div>
          <h2 className="font-display" style={{ fontSize: 56, fontWeight: 400, letterSpacing: '-0.035em', lineHeight: 1.0, margin: '0 0 16px' }}>
            <em style={{ fontStyle: 'italic', fontWeight: 300 }}>You are in</em><br />
            <span style={{ fontWeight: 700 }}>{currentPhase.name}.</span>
          </h2>
          <p className="serif" style={{ fontSize: 20, lineHeight: 1.55, maxWidth: 560, marginTop: 20, color: theme.inkDim }}>
            {currentPhase.focus}. Month {stats.currentMonth} focuses on <strong style={{ color: currentPhase.color, fontWeight: 700 }}>{currentMilestone.focus.toLowerCase()}</strong>.
          </p>
        </div>
        <ProgressRing stats={stats} currentPhase={currentPhase} theme={theme} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: `2px solid ${theme.ink}`, borderBottom: `2px solid ${theme.ink}`, margin: '0 0 40px' }}>
        <BigStat label="Year progress" value={`${stats.progressPct.toFixed(1)}`} unit="%" sub={`${stats.daysElapsed} of 365 days`} />
        <BigStat label="Hours logged" value={stats.totalHoursLogged.toFixed(0)} unit="h" sub={`${stats.weekHours.toFixed(1)}h this week`} border />
        <BigStat label="Mock interviews" value={stats.mockTotal} unit={`/${stats.mockTargetTotal}`} sub="Across all types" border />
      </div>

      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>§ 02 · This month</span>
          <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>M{String(stats.currentMonth).padStart(2, '0')}</span>
        </div>
        <div className="divider-dotted" style={{ marginBottom: 24 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 24 }}>
            <div>
              <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 8 }}>Focus</div>
              <h3 className="font-display" style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.05, color: currentPhase.color, margin: '0 0 16px' }}>
                {currentMilestone.focus}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {currentMilestone.items.map((item, i) => (
                  <li key={i} style={{
                    display: 'flex', gap: 12, padding: '10px 0',
                    borderBottom: i < currentMilestone.items.length - 1 ? `1px dotted ${theme.ruleDim}` : 'none',
                  }}>
                    <span className="font-mono" style={{ fontSize: 10, opacity: 0.4, paddingTop: 4 }}>{String(i + 1).padStart(2, '0')}</span>
                    <span className="serif" style={{ fontSize: 16 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ borderLeft: `1px solid ${theme.ink}`, paddingLeft: 24 }}>
              <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 8 }}>Next up</div>
              {nextMilestone ? (
                <>
                  <div className="font-mono" style={{ fontSize: 10, opacity: 0.5, marginBottom: 4 }}>Month {nextMilestone.month}</div>
                  <h4 className="font-display" style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 12px' }}>
                    {nextMilestone.focus}
                  </h4>
                  <div style={{ fontSize: 14, opacity: 0.7, lineHeight: 1.55 }}>
                    {nextMilestone.items.join(' · ')}
                  </div>
                </>
              ) : (
                <div className="serif" style={{ fontStyle: 'italic', fontSize: 18, opacity: 0.6 }}>Final month. Mock marathon.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>§ 03 · Ledger</span>
          <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>Completion by component</span>
        </div>
        <div className="divider-dotted" style={{ marginBottom: 24 }} />
        <Ledger stats={stats} setView={setView} />
      </div>

      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>§ 04 · Timeline</span>
          <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>12 months at a glance</span>
        </div>
        <div className="divider-dotted" style={{ marginBottom: 24 }} />
        <YearTimeline stats={stats} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <RecentActivity state={state} />
        <WeeklyRhythm state={state} />
      </div>
    </div>
  );
}

function ProgressRing({ stats, currentPhase, theme }) {
  const size = 200;
  const strokeWidth = 2;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = stats.progressPct / 100;

  // Generate tick marks for each month
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * 360 - 90; // -90 to start at top
    const rad = (angle * Math.PI) / 180;
    const innerR = radius - 8;
    const outerR = radius + 2;
    return {
      month: i + 1,
      x1: center + Math.cos(rad) * innerR,
      y1: center + Math.sin(rad) * innerR,
      x2: center + Math.cos(rad) * outerR,
      y2: center + Math.sin(rad) * outerR,
      phase: getPhaseFromMonth(i + 1),
      isPast: i + 1 < stats.currentMonth,
      isCurrent: i + 1 === stats.currentMonth,
    };
  });

  // Calculate current month indicator position (dot)
  const indicatorAngle = (progress * 360) - 90;
  const indicatorRad = (indicatorAngle * Math.PI) / 180;
  const indicatorX = center + Math.cos(indicatorRad) * radius;
  const indicatorY = center + Math.sin(indicatorRad) * radius;

  return (
    <div className="fade-scale" style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ overflow: 'visible' }}>
        {/* Phase arcs as background */}
        {PHASES.map((phase, i) => {
          const startAngle = (i * 3 / 12) * 360 - 90;
          const endAngle = ((i + 1) * 3 / 12) * 360 - 90;
          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;
          const x1 = center + Math.cos(startRad) * radius;
          const y1 = center + Math.sin(startRad) * radius;
          const x2 = center + Math.cos(endRad) * radius;
          const y2 = center + Math.sin(endRad) * radius;
          const largeArc = 0;
          return (
            <path
              key={phase.n}
              d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`}
              fill="none"
              stroke={phase.color}
              strokeWidth={strokeWidth + 1}
              opacity={phase.n === currentPhase.n ? 0.9 : 0.22}
            />
          );
        })}

        {/* Month ticks */}
        {ticks.map(t => (
          <line
            key={t.month}
            x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
            stroke={theme.ink}
            strokeWidth={t.isCurrent ? 2 : 1}
            opacity={t.isCurrent ? 1 : t.isPast ? 0.6 : 0.3}
          />
        ))}

        {/* Progress indicator — filled circle on the ring */}
        <circle
          cx={indicatorX}
          cy={indicatorY}
          r={6}
          fill={currentPhase.color}
          stroke={theme.bg}
          strokeWidth={2}
        />
        <circle
          cx={indicatorX}
          cy={indicatorY}
          r={10}
          fill="none"
          stroke={currentPhase.color}
          strokeWidth={1}
          opacity={0.4}
        />

        {/* Center text */}
        <text
          x={center} y={center - 10}
          textAnchor="middle"
          fontFamily="JetBrains Mono"
          fontSize={9}
          fill={theme.ink}
          opacity={0.55}
          letterSpacing="0.15em"
        >
          YEAR
        </text>
        <text
          x={center} y={center + 18}
          textAnchor="middle"
          fontFamily="Fraunces, serif"
          fontSize={42}
          fontWeight={700}
          fill={theme.ink}
          letterSpacing="-0.03em"
        >
          {stats.progressPct.toFixed(0)}
          <tspan fontSize={24} fontWeight={300} fontStyle="italic" opacity={0.5} dx={2}>%</tspan>
        </text>
        <text
          x={center} y={center + 36}
          textAnchor="middle"
          fontFamily="JetBrains Mono"
          fontSize={9}
          fill={theme.ink}
          opacity={0.45}
          letterSpacing="0.15em"
        >
          M{String(stats.currentMonth).padStart(2, '0')} / 12
        </text>
      </svg>
    </div>
  );
}

function BigStat({ label, value, unit, sub, border }) {
  const theme = useTheme();
  return (
    <div style={{ padding: '28px 24px', borderLeft: border ? `1px solid ${theme.ink}` : 'none' }}>
      <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 8 }}>{label}</div>
      <div className="font-display" style={{ fontSize: 64, fontWeight: 400, letterSpacing: '-0.04em', lineHeight: 0.9 }}>
        {value}<span className="serif" style={{ fontStyle: 'italic', opacity: 0.4, fontSize: 32, fontWeight: 300 }}>{unit}</span>
      </div>
      <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.5, marginTop: 8 }}>{sub}</div>
    </div>
  );
}

function Ledger({ stats, setView }) {
  const theme = useTheme();
  const items = [
    { label: 'Courses (avg progress)', val: `${stats.courseAvg.toFixed(0)}%`, fill: stats.courseAvg, view: 'courses' },
    { label: 'Coding Patterns', val: `${stats.patternsDone}/28`, fill: (stats.patternsDone / 28) * 100, view: 'patterns' },
    { label: 'LLD Problems', val: `${stats.lldDone}/${LLD_PROBLEMS.length}`, fill: (stats.lldDone / LLD_PROBLEMS.length) * 100, view: 'design' },
    { label: 'System Design Cases', val: `${stats.sdDone}/${SYSTEM_DESIGN_CASES.length}`, fill: (stats.sdDone / SYSTEM_DESIGN_CASES.length) * 100, view: 'design' },
    { label: 'Cloud Labs', val: `${stats.labsDone}/${CLOUD_LABS.length}`, fill: (stats.labsDone / CLOUD_LABS.length) * 100, view: 'labs' },
    { label: 'Mock Interviews', val: `${stats.mockTotal}/${stats.mockTargetTotal}`, fill: (stats.mockTotal / stats.mockTargetTotal) * 100, view: 'mocks' },
  ];
  return (
    <div>
      {items.map((item, i) => (
        <button
          key={item.label}
          onClick={() => setView(item.view)}
          className="btn-t hover-bg"
          style={{
            display: 'grid', gridTemplateColumns: '24px 1fr 60px 1fr 80px', gap: 16,
            alignItems: 'center', padding: '14px 12px', width: '100%', textAlign: 'left',
            background: 'transparent', border: 'none',
            borderTop: i === 0 ? `1px solid ${theme.ink}` : `1px dotted ${theme.ruleDim}`,
            borderBottom: i === items.length - 1 ? `1px solid ${theme.ink}` : 'none',
            cursor: 'pointer',
          }}
        >
          <span className="font-mono" style={{ fontSize: 12, opacity: 0.4 }}>{String(i + 1).padStart(2, '0')}</span>
          <span className="serif" style={{ fontSize: 16 }}>{item.label}</span>
          <span className="font-mono" style={{ fontSize: 12, opacity: 0.6, textAlign: 'right' }}>{item.val}</span>
          <div style={{ height: 2, background: theme.muted, borderRadius: 1, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${item.fill}%`, background: theme.ink, transition: 'width 0.5s' }} />
          </div>
          <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4, textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
            Open <ArrowUpRight size={10} />
          </span>
        </button>
      ))}
    </div>
  );
}

function YearTimeline({ stats }) {
  const theme = useTheme();
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2 }}>
        {Array.from({ length: 12 }, (_, i) => {
          const month = i + 1;
          const phase = getPhaseFromMonth(month);
          const pObj = PHASES[phase - 1];
          const isCurrent = month === stats.currentMonth;
          const isPast = month < stats.currentMonth;
          return (
            <div key={month} style={{ position: 'relative' }}>
              <div style={{
                height: 44,
                background: isPast ? pObj.color : isCurrent ? pObj.color : pObj.accent + '55',
                opacity: isPast ? 0.8 : 1,
                border: isCurrent ? `2px solid ${theme.ink}` : 'none',
                borderRadius: 2,
              }} />
              <div className="font-mono" style={{ fontSize: 10, textAlign: 'center', marginTop: 8, opacity: 0.6 }}>M{month}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 20 }}>
        {PHASES.map(p => (
          <div key={p.n} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
            <div style={{ width: 10, height: 10, background: p.color, borderRadius: 1 }} />
            <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.7 }}>
              Phase 0{p.n} · {p.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentActivity({ state }) {
  const theme = useTheme();
  const recent = [...state.sessions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  // Last 14 days of hours for sparkline
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (13 - i));
    const key = formatDate(d);
    const hours = state.sessions
      .filter(s => s.date === key)
      .reduce((sum, s) => sum + (s.duration || 0), 0);
    return { date: key, hours, dayOfWeek: d.getDay() };
  });
  const maxHours = Math.max(1, ...days.map(d => d.hours));

  return (
    <div>
      <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 8 }}>§ 05 · Recent sessions</div>
      <div className="divider-dotted" style={{ marginBottom: 14 }} />

      {/* 14-day sparkline */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 40 }}>
          {days.map((d, i) => {
            const isWeekend = d.dayOfWeek === 0 || d.dayOfWeek === 6;
            const isToday = i === days.length - 1;
            return (
              <div
                key={d.date}
                title={`${d.date}: ${d.hours.toFixed(1)}h`}
                style={{
                  flex: 1,
                  height: `${Math.max(2, (d.hours / maxHours) * 100)}%`,
                  background: d.hours > 0 ? (isToday ? '#6b8e74' : theme.ink) : theme.muted,
                  opacity: d.hours > 0 ? (isWeekend ? 0.55 : 1) : 0.35,
                  borderRadius: 1,
                  transition: 'height 0.4s, opacity 0.2s',
                  cursor: 'help',
                }}
              />
            );
          })}
        </div>
        <div className="font-mono" style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.45, marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
          <span>14 days ago</span>
          <span>Today</span>
        </div>
      </div>

      {recent.length === 0 ? (
        <div className="serif" style={{ fontStyle: 'italic', fontSize: 16, opacity: 0.5, padding: '12px 0' }}>
          No sessions logged yet. Head to the calendar to log your first.
        </div>
      ) : (
        <div>
          {recent.map((s, i) => {
            const course = COURSES.find(c => c.id === s.courseId);
            return (
              <div key={s.id} style={{
                display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 12,
                padding: '10px 0',
                borderBottom: i < recent.length - 1 ? `1px dotted ${theme.ruleDim}` : 'none',
                alignItems: 'baseline',
              }}>
                <span className="font-mono" style={{ fontSize: 10, opacity: 0.5 }}>{s.date.slice(5)}</span>
                <div>
                  <div style={{ fontSize: 14 }}>{s.type}</div>
                  {course && <div className="font-mono" style={{ fontSize: 10, opacity: 0.5, marginTop: 2 }}>{course.name}</div>}
                </div>
                <span className="font-mono" style={{ fontSize: 12, fontWeight: 700 }}>{s.duration}h</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function WeeklyRhythm({ state }) {
  const theme = useTheme();
  return (
    <div>
      <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 8 }}>§ 06 · Weekly rhythm</div>
      <div className="divider-dotted" style={{ marginBottom: 12 }} />
      <div className="serif" style={{ fontSize: 14, lineHeight: 1.55, color: theme.inkDim }}>
        {[
          { d: 'Mon', t: '2.5h System Design + 1.5h Language track' },
          { d: 'Wed', t: '2.5h Coding Patterns + 1.5h Python' },
          { d: 'Fri', t: '2h LLD or Data Eng + 1.5h Cloud Lab (alt.)' },
          { d: 'Wknd', t: '2.5h Mock interview + 1h review/hobby' },
        ].map((x, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <strong className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{x.d}</strong>
            <span style={{ marginLeft: 8 }}>{x.t}</span>
          </div>
        ))}
      </div>
      <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.5, marginTop: 16 }}>
        Weekly target: <span style={{ color: theme.ink, fontWeight: 700 }}>{state.weeklyGoalHours}h</span>
      </div>
    </div>
  );
}

// ============================================================
// SHARED COMPONENTS
// ============================================================

function Checkbox({ done, color }) {
  const theme = useTheme();
  return (
    <div style={{
      width: 18, height: 18, minWidth: 18,
      border: `1.5px solid ${done ? color : theme.ink}`,
      background: done ? color : 'transparent',
      borderRadius: 2,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.15s',
    }}>
      {done && <Check size={12} color="#fafaf5" strokeWidth={3} />}
    </div>
  );
}

function FilterChip({ active, onClick, color, children }) {
  const theme = useTheme();
  return (
    <button
      onClick={onClick}
      className="btn-t font-mono"
      style={{
        padding: '5px 10px',
        background: active ? (color || theme.ink) : 'transparent',
        color: active ? theme.invert : theme.ink,
        border: `1px solid ${active ? (color || theme.ink) : theme.ink}`,
        borderRadius: 2,
        cursor: 'pointer',
        fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em',
      }}
    >
      {children}
    </button>
  );
}

function SectionHeader({ num, title, subtitle }) {
  const theme = useTheme();
  return (
    <div style={{ marginBottom: 32 }}>
      <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 8 }}>§ {num}</div>
      <h2 className="font-display" style={{ fontSize: 56, fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1, margin: '0 0 4px' }}>
        {title}
      </h2>
      <p className="serif" style={{ fontStyle: 'italic', fontSize: 18, marginTop: 8, color: theme.inkDim }}>{subtitle}</p>
      <div className="rule-thick" style={{ marginTop: 16 }} />
    </div>
  );
}

function NoteTextarea({ value, onChange, placeholder, rows = 4 }) {
  const theme = useTheme();
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%', background: theme.bgElev, border: `1px solid ${theme.muted}`,
        borderRadius: 2, padding: 12, fontSize: 14, color: theme.ink,
        outline: 'none', resize: 'vertical',
        fontFamily: 'Fraunces, serif', lineHeight: 1.5,
      }}
    />
  );
}

// ============================================================
// COURSES VIEW
// ============================================================

function CoursesView({ state, setCourseProgress, setCourseNote, toggleModule }) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState({});
  const [filterPhase, setFilterPhase] = useState('all');

  const filtered = filterPhase === 'all' ? COURSES : COURSES.filter(c => c.phase === parseInt(filterPhase));

  return (
    <div className="animate-in" style={{ paddingTop: 40 }}>
      <SectionHeader num="01" title="Courses" subtitle="Nine structured courses · expand to check modules" />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginRight: 8 }}>Filter</span>
        <FilterChip active={filterPhase === 'all'} onClick={() => setFilterPhase('all')}>All</FilterChip>
        {PHASES.map(p => (
          <FilterChip key={p.n} active={filterPhase === String(p.n)} onClick={() => setFilterPhase(String(p.n))} color={p.color}>
            P{p.n}
          </FilterChip>
        ))}
      </div>

      <div style={{ borderTop: `2px solid ${theme.ink}` }}>
        {filtered.map((course, i) => (
          <CourseRow
            key={course.id}
            course={course}
            progress={state.courseProgress[course.id] || 0}
            note={state.courseNotes[course.id] || ''}
            moduleChecks={state.moduleChecks}
            expanded={!!expanded[course.id]}
            onToggle={() => setExpanded(e => ({ ...e, [course.id]: !e[course.id] }))}
            onProgressChange={(p) => setCourseProgress(course.id, p)}
            onNoteChange={(t) => setCourseNote(course.id, t)}
            onToggleModule={toggleModule}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}

function CourseRow({ course, progress, note, moduleChecks, expanded, onToggle, onProgressChange, onNoteChange, onToggleModule, index }) {
  const theme = useTheme();
  const phase = PHASES[course.phase - 1];
  const modulesDone = course.modules.filter(m => moduleChecks[m.id]).length;

  return (
    <div style={{ borderBottom: `1px solid ${theme.ink}` }}>
      <button
        onClick={onToggle}
        className="btn-t hover-bg"
        style={{
          display: 'grid',
          gridTemplateColumns: '32px 1fr auto 120px auto',
          gap: 20, alignItems: 'center',
          padding: '20px 16px', width: '100%', textAlign: 'left',
          background: 'transparent', border: 'none', cursor: 'pointer',
        }}
      >
        <span className="font-mono" style={{ fontSize: 12, opacity: 0.5 }}>#{String(index + 1).padStart(2, '0')}</span>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: phase.color }}>
              P{course.phase} · {course.track}
            </span>
            <span style={{ display: 'flex', gap: 2 }}>
              {Array.from({ length: course.priority }).map((_, i) => (
                <span key={i} style={{ color: phase.color }}>⚡</span>
              ))}
            </span>
          </div>
          <h3 className="font-display" style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.1, margin: 0 }}>
            {course.name}
          </h3>
          <div className="font-mono" style={{ fontSize: 10, opacity: 0.5, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            ~{course.hours}h · {course.lessons} lessons · {course.weeklyHours}/wk
            {course.modules.length > 0 && ` · ${modulesDone}/${course.modules.length} modules`}
          </div>
        </div>
        <div className="font-display" style={{ fontSize: 28, fontWeight: 700, color: phase.color, letterSpacing: '-0.02em', textAlign: 'right' }}>
          {progress}<span className="serif" style={{ fontStyle: 'italic', opacity: 0.4, fontSize: 16, fontWeight: 300 }}>%</span>
        </div>
        <div style={{ height: 3, background: theme.muted, borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: phase.color, transition: 'width 0.4s' }} />
        </div>
        <div style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
          <ChevronRight size={18} />
        </div>
      </button>

      {expanded && (
        <div style={{ padding: '0 16px 28px 64px', animation: 'slideIn 0.3s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
            <a
              href={course.url} target="_blank" rel="noopener noreferrer"
              className="btn-t font-mono"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: theme.ink, color: theme.invert,
                padding: '8px 14px', borderRadius: 2, textDecoration: 'none',
                fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em',
              }}
            >
              Open course <ExternalLink size={12} />
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="range" min={0} max={100} value={progress} onChange={e => onProgressChange(parseInt(e.target.value))} style={{ width: 160 }} />
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 25, 50, 75, 100].map(v => (
                  <button
                    key={v} onClick={() => onProgressChange(v)}
                    className="btn-t font-mono"
                    style={{
                      padding: '4px 8px',
                      background: progress === v ? phase.color : 'transparent',
                      color: progress === v ? theme.invert : theme.ink,
                      border: `1px solid ${progress === v ? phase.color : theme.ink}`,
                      borderRadius: 1, cursor: 'pointer',
                      fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em',
                    }}
                  >
                    {v}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {course.note && (
            <div className="serif" style={{
              fontStyle: 'italic', fontSize: 14, marginBottom: 20, paddingLeft: 16,
              borderLeft: `3px solid ${phase.color}`, color: theme.inkDim,
            }}>
              {course.note}
            </div>
          )}

          {course.modules.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.7 }}>Modules</span>
                <span className="font-mono" style={{ fontSize: 10, opacity: 0.5 }}>{modulesDone} / {course.modules.length}</span>
              </div>
              <div style={{ borderTop: `1px dotted ${theme.ruleDim}` }}>
                {course.modules.map((m, mi) => {
                  const done = !!moduleChecks[m.id];
                  return (
                    <button
                      key={m.id} onClick={() => onToggleModule(m.id)}
                      className="btn-t hover-bg"
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '8px 4px', width: '100%', textAlign: 'left',
                        background: 'transparent', border: 'none',
                        borderBottom: `1px dotted ${theme.ruleDim}`, cursor: 'pointer',
                      }}
                    >
                      <Checkbox done={done} color={phase.color} />
                      <span style={{ fontSize: 14, flex: 1, textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.5 : 1 }}>
                        {m.name}
                      </span>
                      <span className="font-mono" style={{ fontSize: 10, opacity: 0.3 }}>{String(mi + 1).padStart(2, '0')}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <StickyNote size={12} style={{ opacity: 0.6 }} />
              <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.7 }}>Notes</span>
            </div>
            <NoteTextarea value={note} onChange={onNoteChange} placeholder="Insights, takeaways, questions, snippets to remember…" />
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PATTERNS VIEW
// ============================================================

function PatternsView({ state, togglePattern, setPatternNote }) {
  const theme = useTheme();
  const [filterPhase, setFilterPhase] = useState('all');
  const [expandedNote, setExpandedNote] = useState({});

  const filtered = filterPhase === 'all' ? CODING_PATTERNS : CODING_PATTERNS.filter(p => p.phase === parseInt(filterPhase));
  const doneCount = CODING_PATTERNS.filter(p => state.patterns[p.n]).length;

  return (
    <div className="animate-in" style={{ paddingTop: 40 }}>
      <SectionHeader num="02" title="Coding Patterns" subtitle={`${doneCount} of 28 complete · Grokking the Coding Interview in Python`} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginRight: 8 }}>Filter</span>
          <FilterChip active={filterPhase === 'all'} onClick={() => setFilterPhase('all')}>All</FilterChip>
          {PHASES.map(p => (
            <FilterChip key={p.n} active={filterPhase === String(p.n)} onClick={() => setFilterPhase(String(p.n))} color={p.color}>P{p.n}</FilterChip>
          ))}
        </div>
        <a
          href="https://www.educative.io/courses/grokking-coding-interview-in-python"
          target="_blank" rel="noopener noreferrer"
          className="btn-t font-mono"
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: theme.ink, color: theme.invert,
            padding: '6px 12px', borderRadius: 2, textDecoration: 'none',
            fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em',
          }}
        >
          Open course <ExternalLink size={10} />
        </a>
      </div>

      <div style={{ borderTop: `2px solid ${theme.ink}` }}>
        {filtered.map(p => {
          const done = !!state.patterns[p.n];
          const phase = PHASES[p.phase - 1];
          const note = state.patternNotes[p.n] || '';
          const noteOpen = !!expandedNote[p.n];
          return (
            <div key={p.n} style={{ borderBottom: `1px solid ${theme.ink}` }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '32px auto 1fr auto auto auto',
                gap: 16, alignItems: 'center',
                padding: '14px 16px',
              }}>
                <span className="font-mono" style={{ fontSize: 12, opacity: 0.4 }}>#{String(p.n).padStart(2, '0')}</span>
                <button onClick={() => togglePattern(p.n)} className="btn-t" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <Checkbox done={done} color={phase.color} />
                </button>
                <div>
                  <div className="font-display" style={{
                    fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em',
                    textDecoration: done ? 'line-through' : 'none',
                    opacity: done ? 0.55 : 1,
                  }}>
                    {p.name}
                  </div>
                  {note && !noteOpen && (
                    <div style={{ fontSize: 12, fontStyle: 'italic', marginTop: 4, opacity: 0.6, color: theme.inkDim, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 400 }}>
                      {note}
                    </div>
                  )}
                </div>
                <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: phase.color }}>
                  P{p.phase}
                </span>
                <button
                  onClick={() => setExpandedNote(e => ({ ...e, [p.n]: !e[p.n] }))}
                  className="btn-t"
                  style={{
                    background: note ? phase.color + '22' : 'transparent',
                    border: `1px solid ${note ? phase.color : theme.muted}`,
                    borderRadius: 2, padding: '4px 8px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}
                >
                  <StickyNote size={11} />
                  <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Note</span>
                </button>
                <div style={{ transform: noteOpen ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s', opacity: 0.4 }}>
                  <ChevronRight size={14} />
                </div>
              </div>
              {noteOpen && (
                <div style={{ padding: '0 16px 16px 64px' }}>
                  <NoteTextarea value={note} onChange={(t) => setPatternNote(p.n, t)} placeholder="Pattern intuition, template, gotchas…" rows={3} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// DESIGN VIEW
// ============================================================

function DesignView({ state, toggleLLD, toggleSD, setLLDNote, setSDNote }) {
  const theme = useTheme();
  const [tab, setTab] = useState('lld');
  const lldDone = Object.values(state.lldProblems).filter(Boolean).length;
  const sdDone = Object.values(state.sdCases).filter(Boolean).length;

  return (
    <div className="animate-in" style={{ paddingTop: 40 }}>
      <SectionHeader num="03" title="Design" subtitle="LLD problems and System Design case studies" />

      <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: `2px solid ${theme.ink}` }}>
        <TabBtn active={tab === 'lld'} onClick={() => setTab('lld')}>
          LLD Problems ({lldDone}/{LLD_PROBLEMS.length})
        </TabBtn>
        <TabBtn active={tab === 'sd'} onClick={() => setTab('sd')}>
          System Design Cases ({sdDone}/{SYSTEM_DESIGN_CASES.length})
        </TabBtn>
      </div>

      {tab === 'lld' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <p className="serif" style={{ fontStyle: 'italic', fontSize: 14, opacity: 0.7 }}>14 real-world OOP design problems across Phases 2-4.</p>
            <a href="https://www.educative.io/courses/grokking-the-low-level-design-interview-using-ood-principles" target="_blank" rel="noopener noreferrer"
              className="btn-t font-mono"
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: theme.ink, color: theme.invert, padding: '6px 12px', borderRadius: 2, textDecoration: 'none', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              Open course <ExternalLink size={10} />
            </a>
          </div>
          <ChecklistWithNotes items={LLD_PROBLEMS} checks={state.lldProblems} notes={state.lldNotes} onToggle={toggleLLD} onNoteChange={setLLDNote} placeholder="Key classes, relationships, design patterns used, tradeoffs…" />
        </>
      )}

      {tab === 'sd' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <p className="serif" style={{ fontStyle: 'italic', fontSize: 14, opacity: 0.7 }}>15 system design case studies from Modern System Design Interview.</p>
            <a href="https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers" target="_blank" rel="noopener noreferrer"
              className="btn-t font-mono"
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: theme.ink, color: theme.invert, padding: '6px 12px', borderRadius: 2, textDecoration: 'none', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              Open course <ExternalLink size={10} />
            </a>
          </div>
          <ChecklistWithNotes items={SYSTEM_DESIGN_CASES} checks={state.sdCases} notes={state.sdNotes} onToggle={toggleSD} onNoteChange={setSDNote} placeholder="Requirements, components, data flow, scaling decisions…" />
        </>
      )}
    </div>
  );
}

function TabBtn({ active, onClick, children }) {
  const theme = useTheme();
  return (
    <button
      onClick={onClick}
      className="btn-t font-mono"
      style={{
        padding: '14px 20px',
        background: active ? theme.ink : 'transparent',
        color: active ? theme.invert : theme.ink,
        border: 'none', cursor: 'pointer',
        fontWeight: active ? 600 : 500,
        fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em',
      }}
    >
      {children}
    </button>
  );
}

function ChecklistWithNotes({ items, checks, notes, onToggle, onNoteChange, placeholder }) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState({});
  return (
    <div style={{ borderTop: `1px solid ${theme.ink}` }}>
      {items.map((item, i) => {
        const done = !!checks[item.id];
        const phase = PHASES[item.phase - 1];
        const note = notes[item.id] || '';
        const isOpen = !!expanded[item.id];
        return (
          <div key={item.id} style={{ borderBottom: `1px solid ${theme.ink}` }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '32px auto 1fr auto auto auto',
              gap: 16, alignItems: 'center',
              padding: '14px 16px',
            }}>
              <span className="font-mono" style={{ fontSize: 12, opacity: 0.4 }}>#{String(i + 1).padStart(2, '0')}</span>
              <button onClick={() => onToggle(item.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                <Checkbox done={done} color={phase.color} />
              </button>
              <div className="font-display" style={{
                fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em',
                textDecoration: done ? 'line-through' : 'none',
                opacity: done ? 0.55 : 1,
              }}>
                {item.name}
              </div>
              <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: phase.color }}>
                P{item.phase}
              </span>
              <button
                onClick={() => setExpanded(e => ({ ...e, [item.id]: !e[item.id] }))}
                className="btn-t"
                style={{
                  background: note ? phase.color + '22' : 'transparent',
                  border: `1px solid ${note ? phase.color : theme.muted}`,
                  borderRadius: 2, padding: '4px 8px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                <StickyNote size={11} />
                <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Note</span>
              </button>
              <div style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s', opacity: 0.4 }}>
                <ChevronRight size={14} />
              </div>
            </div>
            {isOpen && (
              <div style={{ padding: '0 16px 16px 64px' }}>
                <NoteTextarea value={note} onChange={(t) => onNoteChange(item.id, t)} placeholder={placeholder} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// LABS VIEW
// ============================================================

function LabsView({ state, toggleLab, setLabNote }) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState({});
  const [filterPhase, setFilterPhase] = useState('all');

  const categories = [...new Set(CLOUD_LABS.map(l => l.category))];
  const done = Object.values(state.labs).filter(Boolean).length;
  const filtered = filterPhase === 'all' ? CLOUD_LABS : CLOUD_LABS.filter(l => l.phase === parseInt(filterPhase));

  return (
    <div className="animate-in" style={{ paddingTop: 40 }}>
      <SectionHeader num="04" title="Cloud Labs" subtitle={`${done} of ${CLOUD_LABS.length} complete · target 24-32 hands-on labs`} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginRight: 8 }}>Filter</span>
        <FilterChip active={filterPhase === 'all'} onClick={() => setFilterPhase('all')}>All</FilterChip>
        {PHASES.map(p => (
          <FilterChip key={p.n} active={filterPhase === String(p.n)} onClick={() => setFilterPhase(String(p.n))} color={p.color}>P{p.n}</FilterChip>
        ))}
      </div>

      {categories.map(cat => {
        const catLabs = filtered.filter(l => l.category === cat);
        if (catLabs.length === 0) return null;
        const catDone = catLabs.filter(l => state.labs[l.id]).length;
        return (
          <div key={cat} style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 className="font-display" style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.015em', margin: 0 }}>{cat}</h3>
              <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>
                {catDone}/{catLabs.length} done
              </span>
            </div>
            <div style={{ borderTop: `1px solid ${theme.ink}` }}>
              {catLabs.map(lab => {
                const isDone = !!state.labs[lab.id];
                const phase = PHASES[lab.phase - 1];
                const note = state.labNotes[lab.id] || '';
                const isOpen = !!expanded[lab.id];
                return (
                  <div key={lab.id} style={{ borderBottom: `1px solid ${theme.ink}` }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr auto auto auto auto',
                      gap: 12, alignItems: 'center',
                      padding: '12px 12px',
                    }}>
                      <button onClick={() => toggleLab(lab.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                        <Checkbox done={isDone} color={phase.color} />
                      </button>
                      <div style={{ fontSize: 14, textDecoration: isDone ? 'line-through' : 'none', opacity: isDone ? 0.5 : 1 }}>
                        {lab.name}
                      </div>
                      <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: phase.color }}>
                        P{lab.phase}
                      </span>
                      <a href={lab.url} target="_blank" rel="noopener noreferrer"
                        className="btn-t font-mono"
                        style={{ display: 'flex', alignItems: 'center', gap: 4, color: theme.ink, textDecoration: 'none', padding: '4px 8px', border: `1px solid ${theme.ink}`, borderRadius: 2, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Open <ExternalLink size={10} />
                      </a>
                      <button
                        onClick={() => setExpanded(e => ({ ...e, [lab.id]: !e[lab.id] }))}
                        className="btn-t"
                        style={{
                          background: note ? phase.color + '22' : 'transparent',
                          border: `1px solid ${note ? phase.color : theme.muted}`,
                          borderRadius: 2, padding: '4px 8px', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: 4,
                        }}
                      >
                        <StickyNote size={11} />
                      </button>
                      <div style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s', opacity: 0.4 }}>
                        <ChevronRight size={12} />
                      </div>
                    </div>
                    {isOpen && (
                      <div style={{ padding: '0 12px 14px 44px' }}>
                        <NoteTextarea value={note} onChange={(t) => setLabNote(lab.id, t)} placeholder="Lab steps, issues, snippets, learnings…" rows={3} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// MOCKS VIEW
// ============================================================

function MocksView({ state, setMockInterview }) {
  const theme = useTheme();
  const types = [
    { key: 'sd', name: 'Sys Design', color: '#8b5a8c' },
    { key: 'coding', name: 'Coding', color: '#6b8e74' },
    { key: 'lld', name: 'LLD', color: '#a6614a' },
    { key: 'sql', name: 'SQL', color: '#d4ac2c' },
  ];
  return (
    <div className="animate-in" style={{ paddingTop: 40 }}>
      <SectionHeader num="05" title="Mock Interviews" subtitle="45+ across the year · tap to increment" />

      <div style={{ borderTop: `2px solid ${theme.ink}`, borderBottom: `2px solid ${theme.ink}` }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '60px repeat(4, 1fr) 100px',
          gap: 8, padding: '12px 16px',
          borderBottom: `1px solid ${theme.ink}`,
        }}>
          <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>Month</div>
          {types.map(t => (
            <div key={t.key} className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: t.color, fontWeight: 700 }}>
              {t.name}
            </div>
          ))}
          <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, textAlign: 'right' }}>Total</div>
        </div>
        {Object.entries(MOCK_INTERVIEW_TARGETS).map(([month, target], i) => {
          const monthNum = parseInt(month);
          const phase = PHASES[getPhaseFromMonth(monthNum) - 1];
          const monthTotal = types.reduce((s, t) => s + (state.mockInterviews[`${month}-${t.key}`] || 0), 0);
          const monthTarget = target.sd + target.coding + target.lld + target.sql;
          return (
            <div key={month} style={{
              display: 'grid', gridTemplateColumns: '60px repeat(4, 1fr) 100px',
              gap: 8, padding: '12px 16px',
              borderBottom: i < 11 ? `1px dotted ${theme.ruleDim}` : 'none',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 3, height: 20, background: phase.color }} />
                <span className="font-mono" style={{ fontSize: 14, fontWeight: 700 }}>M{String(monthNum).padStart(2, '0')}</span>
              </div>
              {types.map(t => {
                const key = `${month}-${t.key}`;
                const count = state.mockInterviews[key] || 0;
                const targetN = target[t.key];
                const met = count >= targetN && targetN > 0;
                return (
                  <div key={t.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={() => setMockInterview(monthNum, t.key, Math.max(0, count - 1))}
                      className="btn-t font-mono"
                      style={{ width: 24, height: 24, border: `1px solid ${theme.ink}`, background: 'transparent', borderRadius: 2, cursor: 'pointer', fontSize: 14 }}
                    >
                      −
                    </button>
                    <span className="font-mono" style={{ fontSize: 14, fontWeight: 700, width: 48, textAlign: 'center', color: met ? t.color : theme.ink }}>
                      {count}<span style={{ opacity: 0.4 }}>/{targetN}</span>
                    </span>
                    <button
                      onClick={() => setMockInterview(monthNum, t.key, count + 1)}
                      className="btn-t font-mono"
                      style={{ width: 24, height: 24, border: `1px solid ${t.color}`, background: t.color, color: theme.invert, borderRadius: 2, cursor: 'pointer', fontSize: 14 }}
                    >
                      +
                    </button>
                  </div>
                );
              })}
              <div className="font-mono" style={{ fontSize: 14, textAlign: 'right' }}>
                <span style={{ fontWeight: 700 }}>{monthTotal}</span>
                <span style={{ opacity: 0.4 }}>/{monthTarget}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 32 }}>
        <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 8 }}>§ Bonus · Targeted company interviews</div>
        <div className="divider-dotted" style={{ marginBottom: 16 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, borderTop: `1px solid ${theme.ink}`, borderBottom: `1px solid ${theme.ink}` }}>
          {['Meta', 'Google', 'Amazon', 'Apple'].map((co, i) => (
            <div key={co} style={{
              padding: '20px 16px',
              borderLeft: i > 0 ? `1px solid ${theme.ink}` : 'none',
              textAlign: 'center',
            }}>
              <div className="font-display" style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>{co}</div>
              <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.5, marginTop: 4 }}>System Design</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CALENDAR VIEW
// ============================================================

function CalendarView({ state, calendarMonth, setCalendarMonth, selectedDate, setSelectedDate, setDayNote, onAddSession, deleteSession }) {
  const theme = useTheme();
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const cells = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const sessionsByDate = useMemo(() => {
    const map = {};
    state.sessions.forEach(s => {
      if (!map[s.date]) map[s.date] = [];
      map[s.date].push(s);
    });
    return map;
  }, [state.sessions]);

  const selectedDateStr = selectedDate || formatDate(new Date());
  const selectedSessions = sessionsByDate[selectedDateStr] || [];
  const selectedNote = state.customNotes[selectedDateStr] || '';

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="animate-in" style={{ paddingTop: 40 }}>
      <SectionHeader num="06" title="Calendar" subtitle="Log sessions · add notes · build consistency" />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => setCalendarMonth(addMonths(calendarMonth, -1))}
            className="btn-t" style={{ background: 'transparent', border: `1px solid ${theme.ink}`, borderRadius: 2, cursor: 'pointer', padding: 8 }}>
            <ChevronLeft size={14} />
          </button>
          <div className="font-display" style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.015em', minWidth: 200, textAlign: 'center' }}>
            {monthNames[month]} {year}
          </div>
          <button onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}
            className="btn-t" style={{ background: 'transparent', border: `1px solid ${theme.ink}`, borderRadius: 2, cursor: 'pointer', padding: 8 }}>
            <ChevronRight size={14} />
          </button>
        </div>
        <button onClick={() => setCalendarMonth(new Date())}
          className="btn-t font-mono"
          style={{ background: theme.ink, color: theme.invert, padding: '6px 12px', borderRadius: 2, cursor: 'pointer', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', border: 'none' }}>
          Today
        </button>
      </div>

      <div style={{ borderTop: `2px solid ${theme.ink}`, borderBottom: `2px solid ${theme.ink}`, padding: '16px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
            <div key={d} className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5, textAlign: 'center', paddingBottom: 4 }}>
              {d}
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {cells.map((date, i) => {
            if (!date) return <div key={i} />;
            const dateStr = formatDate(date);
            const isToday = dateStr === formatDate(new Date());
            const isSelected = dateStr === selectedDateStr;
            const daysSessions = sessionsByDate[dateStr] || [];
            const hasNote = !!state.customNotes[dateStr];
            const totalHours = daysSessions.reduce((s, x) => s + (x.duration || 0), 0);
            const hasActivity = daysSessions.length > 0;

            return (
              <button
                key={i} onClick={() => setSelectedDate(dateStr)}
                className="btn-t"
                style={{
                  aspectRatio: '1 / 1',
                  background: isSelected ? theme.ink : hasActivity ? '#e6b847' + '33' : 'transparent',
                  color: isSelected ? theme.invert : theme.ink,
                  border: isToday ? `2px solid ${theme.ink}` : `1px solid ${hasActivity ? '#d4ac2c' : theme.muted}`,
                  borderRadius: 2, padding: 6,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'flex-start', justifyContent: 'space-between',
                  position: 'relative', cursor: 'pointer',
                }}
              >
                <span className="font-mono" style={{ fontSize: 14, fontWeight: 700 }}>{date.getDate()}</span>
                {totalHours > 0 && <span className="font-mono" style={{ fontSize: 10 }}>{totalHours}h</span>}
                {hasNote && (
                  <div style={{ position: 'absolute', top: 5, right: 5, width: 5, height: 5, background: '#a6614a', borderRadius: 1 }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6 }}>
            Selected · {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
          <button onClick={onAddSession} className="btn-t font-mono"
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: theme.ink, color: theme.invert, padding: '6px 12px', borderRadius: 2, cursor: 'pointer', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', border: 'none' }}>
            <Plus size={12} /> Log session
          </button>
        </div>
        <div className="divider-dotted" style={{ marginBottom: 16 }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 8 }}>
              Sessions ({selectedSessions.length})
            </div>
            {selectedSessions.length === 0 ? (
              <div className="serif" style={{ fontStyle: 'italic', fontSize: 14, opacity: 0.5, padding: '8px 0' }}>Nothing logged yet.</div>
            ) : (
              <div style={{ borderTop: `1px solid ${theme.ink}` }}>
                {selectedSessions.map(s => {
                  const course = COURSES.find(c => c.id === s.courseId);
                  return (
                    <div key={s.id} style={{ padding: '10px 0', borderBottom: `1px dotted ${theme.ruleDim}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                        <div style={{ fontSize: 14, fontWeight: 500 }}>{s.type}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span className="font-mono" style={{ fontSize: 12, fontWeight: 700 }}>{s.duration}h</span>
                          <button onClick={() => deleteSession(s.id)} className="btn-t"
                            style={{ opacity: 0.4, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                      {course && <div className="font-mono" style={{ fontSize: 10, opacity: 0.6 }}>{course.name}</div>}
                      {s.notes && <div className="serif" style={{ fontStyle: 'italic', fontSize: 12, marginTop: 4, color: theme.inkDim }}>{s.notes}</div>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 8 }}>Day reflection</div>
            <NoteTextarea value={selectedNote} onChange={(t) => setDayNote(selectedDateStr, t)} placeholder="Wins, blockers, what to revisit tomorrow…" rows={8} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SESSION MODAL
// ============================================================

function SessionModal({ date, onSave, onClose }) {
  const theme = useTheme();
  const [type, setType] = useState('Coding Patterns');
  const [duration, setDuration] = useState(1);
  const [courseId, setCourseId] = useState('');
  const [notes, setNotes] = useState('');

  const types = ['System Design', 'Coding Patterns', 'C# / TypeScript', 'SQL', 'Data Engineering', 'LLD', 'Cloud Lab', 'Mock Interview', 'Python Exercises', 'Onyx study', 'Vibe coding', 'Other'];

  const handleSave = () => {
    if (duration <= 0) return;
    onSave({ date, type, duration: parseFloat(duration), courseId: courseId || null, notes });
  };

  const inputStyle = {
    width: '100%', background: theme.bgElev, border: `1px solid ${theme.ink}`,
    borderRadius: 2, color: theme.ink, padding: '8px 10px', fontSize: 14, outline: 'none',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: theme.overlay, backdropFilter: 'blur(4px)',
      zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: theme.invert, border: `2px solid ${theme.ink}`, borderRadius: 2,
        padding: 32, width: '100%', maxWidth: 480, animation: 'slideIn 0.2s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 4 }}>New entry</div>
            <h3 className="font-display" style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>Log session</h3>
          </div>
          <button onClick={onClose} className="btn-t" style={{ opacity: 0.6, background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>
        <div className="rule-thick" style={{ marginBottom: 20 }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ModalField label="Date"><input type="date" value={date} readOnly style={inputStyle} /></ModalField>
          <ModalField label="Activity type">
            <select value={type} onChange={e => setType(e.target.value)} style={inputStyle}>
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </ModalField>
          <ModalField label="Related course (optional)">
            <select value={courseId} onChange={e => setCourseId(e.target.value)} style={inputStyle}>
              <option value="">— None —</option>
              {COURSES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </ModalField>
          <ModalField label="Duration (hours)">
            <input type="number" min={0.25} step={0.25} value={duration} onChange={e => setDuration(e.target.value)} style={inputStyle} />
          </ModalField>
          <ModalField label="Notes (optional)">
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="What you worked on..." rows={3}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'Fraunces, serif' }} />
          </ModalField>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
          <button onClick={onClose} className="btn-t font-mono"
            style={{ flex: 1, padding: '10px 0', background: 'transparent', color: theme.ink, border: `1px solid ${theme.ink}`, borderRadius: 2, cursor: 'pointer', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            Cancel
          </button>
          <button onClick={handleSave} className="btn-t font-mono"
            style={{ flex: 1, padding: '10px 0', background: theme.ink, color: theme.invert, border: 'none', borderRadius: 2, cursor: 'pointer', fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            Save session
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalField({ label, children }) {
  const theme = useTheme();
  return (
    <div>
      <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

// ============================================================
// SETTINGS VIEW
// ============================================================

function SettingsView({ state, update, toggleProject, onReset }) {
  const theme = useTheme();
  const inputStyle = {
    width: '100%', background: theme.bgElev, border: `1px solid ${theme.ink}`,
    borderRadius: 2, color: theme.ink, padding: '8px 10px', fontSize: 14, outline: 'none',
  };

  return (
    <div className="animate-in" style={{ paddingTop: 40 }}>
      <SectionHeader num="07" title="Settings" subtitle="Configure the plan · data tools · optional projects" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div>
          <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 8 }}>§ Plan start date</div>
          <div className="divider-dotted" style={{ marginBottom: 12 }} />
          <input type="date" value={state.startDate}
            onChange={e => update({ startDate: e.target.value })}
            style={{ ...inputStyle, maxWidth: 200 }} />
          <div className="serif" style={{ fontStyle: 'italic', fontSize: 14, marginTop: 8, opacity: 0.7 }}>
            Drives your current month and phase throughout the dashboard.
          </div>
        </div>

        <div>
          <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 8 }}>§ Weekly goal (hours)</div>
          <div className="divider-dotted" style={{ marginBottom: 12 }} />
          <input type="number" min={1} max={40} value={state.weeklyGoalHours}
            onChange={e => update({ weeklyGoalHours: parseInt(e.target.value) || 11 })}
            style={{ ...inputStyle, maxWidth: 120 }} />
          <div className="serif" style={{ fontStyle: 'italic', fontSize: 14, marginTop: 8, opacity: 0.7 }}>
            The plan recommends 10-12 hours/week.
          </div>
        </div>

        <div>
          <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 8 }}>§ Optional projects (vibe coding)</div>
          <div className="divider-dotted" style={{ marginBottom: 12 }} />
          <div style={{ borderTop: `1px solid ${theme.ink}` }}>
            {OPTIONAL_PROJECTS.map(p => {
              const done = !!state.projects[p.id];
              return (
                <div key={p.id} style={{
                  display: 'grid', gridTemplateColumns: 'auto 1fr auto',
                  gap: 12, alignItems: 'center',
                  padding: '12px 8px',
                  borderBottom: `1px solid ${theme.ink}`,
                }}>
                  <button onClick={() => toggleProject(p.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <Checkbox done={done} color="#6b8e74" />
                  </button>
                  <div style={{ fontSize: 14, textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.5 : 1 }}>{p.name}</div>
                  <a href={p.url} target="_blank" rel="noopener noreferrer"
                    className="btn-t font-mono"
                    style={{ display: 'flex', alignItems: 'center', gap: 4, color: theme.ink, textDecoration: 'none', padding: '4px 8px', border: `1px solid ${theme.ink}`, borderRadius: 2, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                    Open <ExternalLink size={10} />
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 8 }}>§ Data</div>
          <div className="divider-dotted" style={{ marginBottom: 12 }} />
          <div className="serif" style={{ fontSize: 14, marginBottom: 12, opacity: 0.8 }}>
            Progress is saved automatically across sessions.
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                const data = JSON.stringify(state, null, 2);
                navigator.clipboard?.writeText(data);
                alert('Progress JSON copied to clipboard');
              }}
              className="btn-t font-mono"
              style={{ background: theme.ink, color: theme.invert, padding: '8px 14px', borderRadius: 2, border: 'none', cursor: 'pointer', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}
            >
              Export JSON
            </button>
            <button
              onClick={onReset}
              className="btn-t font-mono"
              style={{ background: 'transparent', color: '#a6614a', border: '1px solid #a6614a', padding: '8px 14px', borderRadius: 2, cursor: 'pointer', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}
            >
              Reset all progress
            </button>
          </div>
        </div>

        <div>
          <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 8 }}>§ About</div>
          <div className="divider-dotted" style={{ marginBottom: 12 }} />
          <p className="serif" style={{ fontSize: 16, lineHeight: 1.6, color: theme.inkDim }}>
            This tracker covers the full 12-month Educative Premium Plus plan:
            9 courses across {COURSES.reduce((s, c) => s + c.modules.length, 0)} modules, 28 coding patterns,
            {' '}{CLOUD_LABS.length} cloud labs, {LLD_PROBLEMS.length} LLD problems,
            {' '}{SYSTEM_DESIGN_CASES.length} system design cases, and {Object.values(MOCK_INTERVIEW_TARGETS).reduce((s, m) => s + m.sd + m.coding + m.lld + m.sql, 0)} mock interviews
            across 4 phases. Weekly target: 10-12 hours. Total: ~250-260 hours.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COMPILER VIEW — Monaco-powered editor with IntelliSense + syntax highlighting
// Python (Pyodide) · TypeScript (tsc) · C# (syntax-only + .NET Fiddle handoff)
// ============================================================

const COMPILER_EXAMPLES = {
  python: {
    'Sliding Window': `# Sliding Window: longest substring without repeating characters
def longest_unique_substring(s: str) -> int:
    seen: dict[str, int] = {}
    left = result = 0
    for right, ch in enumerate(s):
        if ch in seen and seen[ch] >= left:
            left = seen[ch] + 1
        seen[ch] = right
        result = max(result, right - left + 1)
    return result

print(longest_unique_substring("abcabcbb"))  # 3
print(longest_unique_substring("bbbbb"))     # 1
print(longest_unique_substring("pwwkew"))    # 3
`,
    'Two Pointers': `# Two Pointers: pair with target sum in sorted array
def two_sum_sorted(arr: list[int], target: int) -> list[int] | None:
    left, right = 0, len(arr) - 1
    while left < right:
        s = arr[left] + arr[right]
        if s == target:
            return [left, right]
        elif s < target:
            left += 1
        else:
            right -= 1
    return None

print(two_sum_sorted([2, 7, 11, 15], 9))               # [0, 1]
print(two_sum_sorted([1, 3, 4, 5, 7, 10, 11], 9))       # [1, 5]
`,
    'Binary Search': `# Modified Binary Search: first occurrence of target
def first_occurrence(arr: list[int], target: int) -> int:
    left, right = 0, len(arr) - 1
    result = -1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            result = mid
            right = mid - 1  # keep searching left
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return result

print(first_occurrence([1, 2, 2, 2, 3, 4, 5], 2))  # 1
print(first_occurrence([1, 2, 3, 4, 5], 6))        # -1
`,
  },
  typescript: {
    'Generic Types': `// Generics: type-safe container
interface Container<T> {
  value: T;
  describe(): string;
}

class Box<T> implements Container<T> {
  constructor(public value: T) {}
  describe(): string {
    return \`Box holding: \${JSON.stringify(this.value)}\`;
  }
}

const numberBox = new Box<number>(42);
const stringBox = new Box<string>("hello");
const objBox = new Box<{ id: number; name: string }>({ id: 1, name: "Joseph" });

console.log(numberBox.describe());
console.log(stringBox.describe());
console.log(objBox.describe());
`,
    'Discriminated Unions': `// Discriminated unions for state modeling
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

function render<T>(state: AsyncState<T>): string {
  switch (state.status) {
    case "idle": return "Waiting to start";
    case "loading": return "Loading...";
    case "success": return \`Got: \${JSON.stringify(state.data)}\`;
    case "error": return \`Error: \${state.error}\`;
  }
}

console.log(render({ status: "idle" }));
console.log(render({ status: "loading" }));
console.log(render<{ users: number }>({ status: "success", data: { users: 42 } }));
console.log(render({ status: "error", error: "Network timeout" }));
`,
    'React-style Props': `// Typed React-style component props
interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary" | "ghost";
  onClick: () => void;
  disabled?: boolean;
}

function Button({ label, variant = "primary", onClick, disabled }: ButtonProps): string {
  return \`<button class="btn-\${variant}" \${disabled ? "disabled" : ""}>\${label}</button>\`;
}

console.log(Button({ label: "Save", onClick: () => {} }));
console.log(Button({ label: "Cancel", variant: "ghost", onClick: () => {} }));
console.log(Button({ label: "Submit", variant: "primary", onClick: () => {}, disabled: true }));
`,
  },
  csharp: {
    'LINQ Basics': `using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        var numbers = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

        // Filter, transform, aggregate with LINQ
        var evenSquares = numbers
            .Where(n => n % 2 == 0)
            .Select(n => n * n)
            .ToList();

        Console.WriteLine($"Even squares: {string.Join(", ", evenSquares)}");

        var sum = numbers.Sum();
        var avg = numbers.Average();
        Console.WriteLine($"Sum: {sum}, Average: {avg}");

        // Group by modulo
        var groups = numbers.GroupBy(n => n % 3);
        foreach (var g in groups)
        {
            Console.WriteLine($"Group {g.Key}: {string.Join(",", g)}");
        }
    }
}
`,
    'Async / Await': `using System;
using System.Threading.Tasks;

public class Program
{
    public static async Task Main()
    {
        Console.WriteLine("Starting work...");

        var results = await Task.WhenAll(
            DoWorkAsync("Task A", 100),
            DoWorkAsync("Task B", 50),
            DoWorkAsync("Task C", 75)
        );

        foreach (var r in results)
            Console.WriteLine(r);

        Console.WriteLine("All work complete.");
    }

    static async Task<string> DoWorkAsync(string name, int delayMs)
    {
        await Task.Delay(delayMs);
        return $"{name} finished after {delayMs}ms";
    }
}
`,
    'Interfaces & Generics': `using System;
using System.Collections.Generic;

public interface IRepository<T> where T : class
{
    void Add(T item);
    T? GetById(int id);
    IEnumerable<T> GetAll();
}

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
}

public class UserRepository : IRepository<User>
{
    private readonly Dictionary<int, User> _store = new();

    public void Add(User user) => _store[user.Id] = user;
    public User? GetById(int id) => _store.TryGetValue(id, out var u) ? u : null;
    public IEnumerable<User> GetAll() => _store.Values;
}

public class Program
{
    public static void Main()
    {
        var repo = new UserRepository();
        repo.Add(new User { Id = 1, Name = "Joseph" });
        repo.Add(new User { Id = 2, Name = "Ada" });

        foreach (var u in repo.GetAll())
            Console.WriteLine($"#{u.Id} {u.Name}");
    }
}
`,
  },
};

// ============================================================
// Shared Monaco loader — singleton, loads once per page
// ============================================================

let monacoLoadPromise = null;

function ensureMonaco() {
  if (monacoLoadPromise) return monacoLoadPromise;

  monacoLoadPromise = new Promise((resolve, reject) => {
    // If already loaded
    if (window.monaco) return resolve(window.monaco);

    // Load the AMD loader first
    const loaderScript = document.createElement('script');
    loaderScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.0/min/vs/loader.min.js';
    loaderScript.onload = () => {
      // Configure and load main editor
      window.require.config({
        paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.0/min/vs' },
      });
      window.require(['vs/editor/editor.main'], () => {
        resolve(window.monaco);
      });
    };
    loaderScript.onerror = reject;
    document.head.appendChild(loaderScript);
  });

  return monacoLoadPromise;
}

// Define custom themes matching our dashboard aesthetic
function defineCustomThemes(monaco) {
  monaco.editor.defineTheme('grind-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '9a8f75', fontStyle: 'italic' },
      { token: 'string', foreground: 'a6614a' },
      { token: 'keyword', foreground: '8b5a8c', fontStyle: 'bold' },
      { token: 'number', foreground: 'd4ac2c' },
      { token: 'type', foreground: '6b8e74' },
      { token: 'function', foreground: '3a342a', fontStyle: 'bold' },
    ],
    colors: {
      'editor.background': '#ebe4d2',
      'editor.foreground': '#1a1814',
      'editorLineNumber.foreground': '#9a8f75',
      'editorLineNumber.activeForeground': '#1a1814',
      'editor.selectionBackground': '#d4ac2c55',
      'editor.lineHighlightBackground': '#e0d8c2',
      'editorCursor.foreground': '#1a1814',
      'editor.inactiveSelectionBackground': '#d4ac2c33',
      'editorIndentGuide.background': '#c4bba9',
    },
  });

  monaco.editor.defineTheme('grind-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6a6252', fontStyle: 'italic' },
      { token: 'string', foreground: 'c17d65' },
      { token: 'keyword', foreground: 'a578a6', fontStyle: 'bold' },
      { token: 'number', foreground: 'e8c15a' },
      { token: 'type', foreground: '8aaa94' },
      { token: 'function', foreground: 'f0ead8', fontStyle: 'bold' },
    ],
    colors: {
      'editor.background': '#1d1b17',
      'editor.foreground': '#f0ead8',
      'editorLineNumber.foreground': '#55503f',
      'editorLineNumber.activeForeground': '#f0ead8',
      'editor.selectionBackground': '#d4ac2c44',
      'editor.lineHighlightBackground': '#25221c',
      'editorCursor.foreground': '#f0ead8',
      'editor.inactiveSelectionBackground': '#d4ac2c22',
      'editorIndentGuide.background': '#2e2a22',
    },
  });
}

// ============================================================
// MonacoEditor React wrapper
// ============================================================

function MonacoEditor({ language, value, onChange, theme, height = 320 }) {
  const containerRef = React.useRef(null);
  const editorRef = React.useRef(null);
  const [ready, setReady] = useState(false);

  // Initial mount: load monaco and create editor
  useEffect(() => {
    let disposed = false;
    let resizeObserver;

    ensureMonaco().then(monaco => {
      if (disposed || !containerRef.current) return;
      defineCustomThemes(monaco);

      // Configure TypeScript for better IntelliSense
      if (monaco.languages.typescript) {
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
          target: monaco.languages.typescript.ScriptTarget.ES2020,
          module: monaco.languages.typescript.ModuleKind.ESNext,
          strict: false,
          allowNonTsExtensions: true,
          noEmit: true,
          lib: ['es2020', 'dom'],
        });
        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: false,
          noSyntaxValidation: false,
        });
      }

      editorRef.current = monaco.editor.create(containerRef.current, {
        value,
        language,
        theme: theme.name === 'dark' ? 'grind-dark' : 'grind-light',
        automaticLayout: true,
        fontSize: 13.5,
        fontFamily: '"JetBrains Mono", monospace',
        fontLigatures: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
        lineNumbersMinChars: 3,
        glyphMargin: false,
        folding: true,
        renderLineHighlight: 'line',
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        padding: { top: 12, bottom: 12 },
        scrollbar: {
          vertical: 'auto',
          horizontal: 'auto',
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
        },
        tabSize: 2,
        wordWrap: 'on',
        quickSuggestions: { other: true, comments: false, strings: false },
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: 'on',
        tabCompletion: 'on',
        parameterHints: { enabled: true },
        bracketPairColorization: { enabled: true },
      });

      // Wire up change handler
      const model = editorRef.current.getModel();
      if (model) {
        model.onDidChangeContent(() => {
          if (onChange) onChange(editorRef.current.getValue());
        });
      }

      setReady(true);
    }).catch(err => {
      console.error('Monaco load failed:', err);
    });

    return () => {
      disposed = true;
      if (resizeObserver) resizeObserver.disconnect();
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // create once

  // Update language/model when language prop changes
  useEffect(() => {
    if (!ready || !editorRef.current || !window.monaco) return;
    const monaco = window.monaco;
    const currentModel = editorRef.current.getModel();
    const newModel = monaco.editor.createModel(
      editorRef.current.getValue(),
      language,
    );
    editorRef.current.setModel(newModel);
    if (currentModel) currentModel.dispose();
  }, [language, ready]);

  // Update value when it changes externally (example loaded)
  useEffect(() => {
    if (!ready || !editorRef.current) return;
    const current = editorRef.current.getValue();
    if (current !== value) {
      editorRef.current.setValue(value);
    }
  }, [value, ready]);

  // Update theme when dashboard theme changes
  useEffect(() => {
    if (!ready || !window.monaco) return;
    window.monaco.editor.setTheme(theme.name === 'dark' ? 'grind-dark' : 'grind-light');
  }, [theme.name, ready]);

  return (
    <div style={{ position: 'relative', height }}>
      <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
      {!ready && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: theme.bgElev,
          color: theme.ink,
        }}>
          <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Loader2 size={12} className="spin" />
            Loading VS Code editor…
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// COMPILER VIEW
// ============================================================

function CompilerView() {
  const theme = useTheme();
  const [lang, setLang] = useState('python');

  const langs = [
    { id: 'python', label: 'Python', color: '#6b8e74' },
    { id: 'typescript', label: 'TypeScript', color: '#3b82f6' },
    { id: 'csharp', label: 'C#', color: '#8b5a8c' },
  ];

  return (
    <div className="animate-in" style={{ paddingTop: 40 }}>
      <SectionHeader num="08" title="Compiler" subtitle="Monaco editor · IntelliSense · syntax highlighting · Python & TypeScript run here, C# hands off to .NET Fiddle" />

      <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: `2px solid ${theme.rule}` }}>
        {langs.map(l => {
          const active = lang === l.id;
          return (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              className="btn-t font-mono"
              style={{
                padding: '14px 22px',
                background: active ? theme.ink : 'transparent',
                color: active ? theme.invert : theme.ink,
                fontWeight: active ? 600 : 500,
                cursor: 'pointer',
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span style={{ width: 8, height: 8, background: l.color, borderRadius: 1, display: 'inline-block' }} />
              {l.label}
            </button>
          );
        })}
      </div>

      {lang === 'python' && <PythonRunner theme={theme} />}
      {lang === 'typescript' && <TypeScriptRunner theme={theme} />}
      {lang === 'csharp' && <CSharpRunner theme={theme} />}
    </div>
  );
}

// ============================================================
// PYTHON RUNNER — Monaco + Pyodide
// ============================================================

function PythonRunner({ theme }) {
  const [code, setCode] = useState(COMPILER_EXAMPLES.python['Sliding Window']);
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState('idle');
  const pyodideRef = React.useRef(null);
  const loadingRef = React.useRef(false);

  const loadPyodide = async () => {
    if (pyodideRef.current) return pyodideRef.current;
    if (loadingRef.current) return null;
    loadingRef.current = true;
    setStatus('loading-runtime');

    await new Promise((resolve, reject) => {
      if (window.loadPyodide) return resolve();
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });

    const pyodide = await window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/',
    });
    pyodideRef.current = pyodide;
    setStatus('ready');
    return pyodide;
  };

  const run = async () => {
    setRunning(true);
    setOutput('');
    try {
      const pyodide = await loadPyodide();
      if (!pyodide) return;

      let captured = '';
      pyodide.setStdout({ batched: (s) => { captured += s + '\n'; } });
      pyodide.setStderr({ batched: (s) => { captured += '⚠ ' + s + '\n'; } });

      await pyodide.runPythonAsync(code);
      setOutput(captured || '(no output)');
    } catch (e) {
      setOutput(`Error: ${e.message || e}`);
    } finally {
      setRunning(false);
    }
  };

  return (
    <RunnerShell
      theme={theme}
      language="python"
      filename="main.py"
      examples={COMPILER_EXAMPLES.python}
      onExampleSelect={(name) => setCode(COMPILER_EXAMPLES.python[name])}
      code={code}
      setCode={setCode}
      onRun={run}
      running={running}
      output={output}
      status={status}
      statusLabel={
        status === 'loading-runtime' ? 'Loading Pyodide runtime (~10MB, once)…' :
        status === 'ready' ? 'Pyodide ready · CPython 3.12 via WebAssembly' :
        'Click Run to initialize Pyodide (~10MB, cached after first load)'
      }
    />
  );
}

// ============================================================
// TYPESCRIPT RUNNER — Monaco + tsc
// ============================================================

function TypeScriptRunner({ theme }) {
  const [code, setCode] = useState(COMPILER_EXAMPLES.typescript['Generic Types']);
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState('idle');
  const tsRef = React.useRef(null);
  const loadingRef = React.useRef(false);

  const loadTS = async () => {
    if (tsRef.current) return tsRef.current;
    if (loadingRef.current) return null;
    loadingRef.current = true;
    setStatus('loading-runtime');

    await new Promise((resolve, reject) => {
      if (window.ts) return resolve();
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/typescript@5.4.5/lib/typescript.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });

    tsRef.current = window.ts;
    setStatus('ready');
    return window.ts;
  };

  const run = async () => {
    setRunning(true);
    setOutput('');
    try {
      const ts = await loadTS();
      if (!ts) return;

      const js = ts.transpileModule(code, {
        compilerOptions: {
          target: ts.ScriptTarget.ES2020,
          module: ts.ModuleKind.None,
          strict: false,
        },
      }).outputText;

      const captured = [];
      const originalLog = console.log;
      const originalError = console.error;
      console.log = (...args) => captured.push(
        args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')
      );
      console.error = (...args) => captured.push('⚠ ' + args.map(String).join(' '));

      try {
        // eslint-disable-next-line no-new-func
        new Function(js)();
        setOutput(captured.join('\n') || '(no output)');
      } catch (e) {
        setOutput(`Runtime error: ${e.message}`);
      } finally {
        console.log = originalLog;
        console.error = originalError;
      }
    } catch (e) {
      setOutput(`Compile error: ${e.message || e}`);
    } finally {
      setRunning(false);
    }
  };

  return (
    <RunnerShell
      theme={theme}
      language="typescript"
      filename="main.ts"
      examples={COMPILER_EXAMPLES.typescript}
      onExampleSelect={(name) => setCode(COMPILER_EXAMPLES.typescript[name])}
      code={code}
      setCode={setCode}
      onRun={run}
      running={running}
      output={output}
      status={status}
      statusLabel={
        status === 'loading-runtime' ? 'Loading TypeScript 5.4 compiler (~10MB, once)…' :
        status === 'ready' ? 'TypeScript 5.4 loaded · full IntelliSense active · console.log captured' :
        'Full IntelliSense active in the editor · click Run to load the compiler and execute'
      }
    />
  );
}

// ============================================================
// C# RUNNER — Monaco with C# syntax + copy/handoff to .NET Fiddle
// ============================================================

function CSharpRunner({ theme }) {
  const [code, setCode] = useState(COMPILER_EXAMPLES.csharp['LINQ Basics']);
  const [copied, setCopied] = useState(false);

  const copyAndOpen = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.open('https://dotnetfiddle.net/', '_blank', 'noopener,noreferrer');
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      // Clipboard denied — still open Fiddle
      window.open('https://dotnetfiddle.net/', '_blank', 'noopener,noreferrer');
    }
  };

  const copyOnly = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {}
  };

  return (
    <div>
      <div style={{
        padding: '14px 16px',
        background: theme.bgElev,
        border: `1px solid ${theme.muted}`,
        borderRadius: 2,
        marginBottom: 16,
      }}>
        <div className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginBottom: 6 }}>
          Note on C#
        </div>
        <div className="serif" style={{ fontSize: 14, lineHeight: 1.55, color: theme.inkDim }}>
          Real C# execution in-browser needs the full .NET WebAssembly runtime (~35MB) and Roslyn, which doesn't fit cleanly in an artifact. The editor below is the real Monaco editor with C# syntax highlighting — write and study code here, then hit <strong>Copy & Open .NET Fiddle</strong> to run it on their production Roslyn compiler. Your code goes to the clipboard automatically.
        </div>
      </div>

      {/* Example picker */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginRight: 4 }}>Load example</span>
        {Object.keys(COMPILER_EXAMPLES.csharp).map(name => (
          <button
            key={name}
            onClick={() => setCode(COMPILER_EXAMPLES.csharp[name])}
            className="btn-t font-mono"
            style={{
              padding: '5px 10px',
              background: 'transparent',
              color: theme.ink,
              border: `1px solid ${theme.ruleDim}`,
              borderRadius: 2,
              cursor: 'pointer',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
            }}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div style={{
        border: `1px solid ${theme.rule}`,
        borderRadius: 2,
        overflow: 'hidden',
        background: theme.bgElev,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          background: theme.ink,
          color: theme.invert,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Terminal size={12} />
            <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              Program.cs
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={copyOnly}
              className="btn-t font-mono"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'transparent',
                color: theme.invert,
                border: `1px solid ${theme.invert}55`,
                padding: '4px 10px', borderRadius: 1,
                cursor: 'pointer',
                fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em',
              }}
            >
              {copied ? <Check size={12} /> : null}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={copyAndOpen}
              className="btn-t font-mono"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#8b5a8c',
                color: theme.invert,
                border: '1px solid #8b5a8c',
                padding: '4px 10px', borderRadius: 1,
                cursor: 'pointer',
                fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em',
                fontWeight: 600,
              }}
            >
              <Play size={12} />
              Copy & Run on .NET Fiddle
            </button>
          </div>
        </div>
        <MonacoEditor
          language="csharp"
          value={code}
          onChange={setCode}
          theme={theme}
          height={420}
        />
      </div>

      <div className="font-mono" style={{
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        opacity: 0.55,
        marginTop: 10,
      }}>
        § Monaco editor active · full C# syntax highlighting · tab completion · bracket matching
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
        <a
          href="https://dotnetfiddle.net/"
          target="_blank" rel="noopener noreferrer"
          className="btn-t font-mono"
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'transparent', color: theme.ink,
            border: `1px solid ${theme.ink}`,
            padding: '8px 14px', borderRadius: 2, textDecoration: 'none',
            fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em',
          }}
        >
          Open .NET Fiddle <ExternalLink size={10} />
        </a>
        <a
          href="https://sharplab.io/"
          target="_blank" rel="noopener noreferrer"
          className="btn-t font-mono"
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'transparent', color: theme.ink,
            border: `1px solid ${theme.ink}`,
            padding: '8px 14px', borderRadius: 2, textDecoration: 'none',
            fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em',
          }}
        >
          SharpLab (IL viewer) <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
}

// ============================================================
// SHARED RUNNER SHELL — Monaco-powered editor + run button + output
// ============================================================

function RunnerShell({ theme, language, filename, examples, onExampleSelect, code, setCode, onRun, running, output, status, statusLabel }) {
  return (
    <div>
      {/* Example picker */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, marginRight: 4 }}>Load example</span>
        {Object.keys(examples).map(name => (
          <button
            key={name}
            onClick={() => onExampleSelect(name)}
            className="btn-t font-mono"
            style={{
              padding: '5px 10px',
              background: 'transparent',
              color: theme.ink,
              border: `1px solid ${theme.ruleDim}`,
              borderRadius: 2,
              cursor: 'pointer',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
            }}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div style={{
        border: `1px solid ${theme.rule}`,
        borderRadius: 2,
        overflow: 'hidden',
        background: theme.bgElev,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          background: theme.ink,
          color: theme.invert,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Terminal size={12} />
            <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              {filename}
            </span>
          </div>
          <button
            onClick={onRun}
            disabled={running}
            className="btn-t font-mono"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: running ? 'transparent' : '#6b8e74',
              color: theme.invert,
              border: `1px solid ${running ? theme.invert + '55' : '#6b8e74'}`,
              padding: '4px 10px', borderRadius: 1,
              cursor: running ? 'wait' : 'pointer',
              fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em',
              fontWeight: 600,
            }}
          >
            {running ? <Loader2 size={12} className="spin" /> : <Play size={12} />}
            {running ? 'Running' : 'Run'}
          </button>
        </div>
        <MonacoEditor
          language={language}
          value={code}
          onChange={setCode}
          theme={theme}
          height={360}
        />
      </div>

      {/* Status line */}
      <div className="font-mono" style={{
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        opacity: 0.55,
        marginTop: 8,
        marginBottom: 12,
        color: status === 'ready' ? '#6b8e74' : theme.ink,
      }}>
        {status === 'loading-runtime' && <Loader2 size={10} className="spin" style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />}
        § {statusLabel}
      </div>

      {/* Output */}
      <div style={{
        border: `1px solid ${theme.rule}`,
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '8px 12px',
          background: theme.muted,
          color: theme.ink,
        }}>
          <span className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            Output
          </span>
        </div>
        <pre style={{
          margin: 0,
          padding: '14px 16px',
          background: theme.bgElev,
          color: theme.ink,
          fontSize: 12.5,
          fontFamily: '"JetBrains Mono", monospace',
          lineHeight: 1.55,
          minHeight: 120,
          maxHeight: 300,
          overflow: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}>
          {output || <span style={{ opacity: 0.4, fontStyle: 'italic', fontFamily: 'Fraunces, serif' }}>Output will appear here after you click Run.</span>}
        </pre>
      </div>
    </div>
  );
}
