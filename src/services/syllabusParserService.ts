/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LearningModule, QuizQuestion, SyllabusRoadmapStation, TopicNoteSection } from '../types/game';

export interface ParsedSyllabusResult {
  syllabusTitle: string;
  modules: LearningModule[];
  stations: SyllabusRoadmapStation[];
}

export interface SyllabusPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  sampleText: string;
}

export const PRESET_SYLLABUSES: SyllabusPreset[] = [
  {
    id: 'bca_core',
    name: 'BCA Core Curriculum (DSA, OS, DBMS, Networks)',
    description: 'Comprehensive 5-station roadmap covering foundations of computing, Big-O efficiency, relational databases, and low-latency networking.',
    icon: '🎓',
    sampleText: `UNIT 1: Data Structures and Algorithmic Efficiency
- Linear vs Non-Linear Structures (Arrays, Linked Lists, Stacks, Queues)
- Divide and Conquer Sorting: Merge Sort and Quick Sort
- Asymptotic Analysis: Big-O notation, Time vs Energy Tradeoffs
- Cache Locality and Dynamic Memory Allocation in C

UNIT 2: Operating Systems and Process Concurrency
- Process Scheduling Algorithms: Round Robin, Priority, and Multi-Level Queues
- Synchronization Primitives: Semaphores, Mutexes, and Deadlock Prevention
- Virtual Memory Architecture: Paging, TLB Cache, and Page Replacement (LRU)
- Green OS Scheduling: Dynamic Voltage and Frequency Scaling (DVFS)

UNIT 3: Database Management Systems and Query Tuning
- Relational Schema Design: 1NF, 2NF, 3NF, and BCNF Normalization
- Indexing Data Structures: B-Trees and B+ Trees for Disk I/O Reduction
- Transaction Management: ACID Properties and Serializability
- SQL Query Optimizer Execution Plans and Full Table Scan Elimination

UNIT 4: Computer Networks and Distributed Protocols
- The OSI Model and TCP/IP Protocol Stack
- Congestion Control: TCP Slow Start, Fast Retransmit, and Window Sizing
- Lightweight IoT Messaging: MQTT Pub/Sub vs Heavy HTTP REST Polling
- Network Routing Algorithms: Dijkstra Link-State and Distance Vector

UNIT 5: Cloud Computing and Sustainable Green IT
- Containerization vs Virtual Machines: Docker Kernel Isolation
- Serverless Architectures: Scale-to-Zero and Idle Resource Reclaiming
- Data Center Power Usage Effectiveness (PUE) and Carbon Metrics
- E-Waste Lifecycle: Safe Campus Computer Recycling and Urban Mining`
  },
  {
    id: 'full_stack',
    name: 'Full-Stack Web Engineering (React, Node, DBs, DevOps)',
    description: 'Industry-ready curriculum navigating modern frontend frameworks, RESTful APIs, caching, database indexing, and CI/CD containers.',
    icon: '💻',
    sampleText: `UNIT 1: Modern Frontend Architecture and React
- Virtual DOM Reconciliation, Component Lifecycle, and Hooks (useState, useEffect, useMemo)
- State Management Patterns and Component Re-render Optimization
- Responsive CSS Grid, Flexbox, and Modern Tailwind Layouts
- Client-Side Performance: Bundle Splitting and Image Lazy-Loading

UNIT 2: Backend REST APIs and Microservices with Node.js
- Event Loop Architecture: Asynchronous I/O, Callbacks, and Promises
- Express.js Middleware Pipeline and Error Handling Best Practices
- JWT Authentication, Refresh Tokens, and Role-Based Access Control (RBAC)
- Microservice Inter-Communication: Message Queues and gRPC

UNIT 3: Relational and NoSQL Database Engineering
- Schema Design for High Throughput: PostgreSQL vs MongoDB
- Read Replicas, Sharding, and Distributed Query Execution
- Redis In-Memory Caching Strategies (Cache-Aside, Write-Through)
- Database Connection Pooling and Slow Query Analysis

UNIT 4: Cloud Deployment, Docker, and CI/CD Automation
- Multi-Stage Docker Builds for Ultra-Compact Container Images
- GitHub Actions CI/CD: Automated Linting, Unit Testing, and Production Release
- Reverse Proxies with Nginx, TLS Termination, and Rate Limiting
- Serverless Edge Functions and Global CDN Distribution`
  },
  {
    id: 'ai_ml',
    name: 'Artificial Intelligence & Machine Learning Foundations',
    description: 'From linear algebra and gradient descent to deep neural networks, transformers, and green model quantization.',
    icon: '🤖',
    sampleText: `UNIT 1: Mathematics of Machine Learning and Python Foundations
- Linear Algebra: Vectors, Matrices, Eigenvalues, and SVD
- Multivariate Calculus: Gradients, Partial Derivatives, and Chain Rule
- NumPy and Pandas for High-Throughput Vectorized Data Processing
- Exploratory Data Analysis and Feature Engineering Pipelines

UNIT 2: Supervised Learning Algorithms
- Linear Regression, Logistic Regression, and Cost Functions
- Decision Trees, Random Forests, and Gradient Boosted Trees (XGBoost)
- Regularization Techniques (L1 Lasso, L2 Ridge) to Counter Overfitting
- Cross-Validation, ROC-AUC, Precision-Recall, and F1-Score Metrics

UNIT 3: Deep Learning and Neural Networks
- Perceptrons, Multi-Layer Perceptrons (MLP), and Backpropagation
- Activation Functions: ReLU, GELU, Softmax, and Vanishing Gradient Solutions
- Convolutional Neural Networks (CNNs) for Computer Vision and Image Processing
- Recurrent Neural Networks (RNNs) and Long Short-Term Memory (LSTM)

UNIT 4: Modern Transformers, LLMs, and Green AI
- Attention Mechanisms: Scaled Dot-Product and Multi-Head Self-Attention
- Transformer Architecture: Encoders, Decoders, and Positional Embeddings
- Model Fine-Tuning: LoRA (Low-Rank Adaptation) and Quantization (INT8/INT4)
- Sustainable AI: Reducing GPU Compute Hours and Carbon Footprint`
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity, Ethical Hacking & Network Defense',
    description: 'Master offensive vulnerability testing, cryptographic ciphers, zero-trust authentication, and secure code audits.',
    icon: '🛡️',
    sampleText: `UNIT 1: Cryptography and Information Security Foundations
- Symmetric vs Asymmetric Encryption: AES-256 vs RSA and ECC
- Hashing Algorithms: SHA-256, Salted Passwords, and bcrypt/Argon2
- Public Key Infrastructure (PKI), Digital Certificates, and TLS Handshakes
- Zero-Trust Security Architecture and Principle of Least Privilege

UNIT 2: Network Vulnerabilities and Packet Analysis
- Wireshark Deep Packet Inspection and Protocol Dissection
- Common Network Exploits: ARP Spoofing, DNS Poisoning, and MITM
- Firewalls, Intrusion Detection Systems (IDS), and Snort Rule Configuration
- Port Scanning and Reconnaissance with Nmap

UNIT 3: Web Application Security and OWASP Top 10
- SQL Injection (SQLi) and Prepared Statement Defense
- Cross-Site Scripting (XSS) and Content Security Policy (CSP)
- Cross-Site Request Forgery (CSRF) and SameSite Cookie Protections
- Insecure Direct Object References (IDOR) and Broken Authentication

UNIT 4: Incident Response, Forensics, and Cyber Law
- Digital Evidence Collection, Memory Dumping, and Chain of Custody
- Malware Analysis: Static Disassembly vs Dynamic Sandboxing
- Indian IT Act 2000, Section 66 Cyber Offenses, and Global GDPR Compliance
- Secure Code Auditing and Automated Static Code Analysis (SAST)`
  }
];

class SyllabusParserService {
  /**
   * Parse either raw text, JSON, or markdown syllabus into structured modules & stations
   */
  public parseSyllabus(rawText: string, customTitle?: string): ParsedSyllabusResult {
    const trimmed = rawText.trim();

    // Check if user uploaded JSON
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        const parsedJson = JSON.parse(trimmed);
        return this.parseFromJson(parsedJson, customTitle);
      } catch {
        // Fallback to text parsing
      }
    }

    return this.parseFromText(trimmed, customTitle);
  }

  private parseFromJson(json: any, customTitle?: string): ParsedSyllabusResult {
    const title = customTitle || json.title || json.syllabusTitle || 'Custom Uploaded Curriculum';
    const rawUnits = Array.isArray(json) ? json : (json.units || json.modules || json.topics || []);

    const modules: LearningModule[] = [];
    const stations: SyllabusRoadmapStation[] = [];

    const STYLES = [
      { color: 'border-purple-500 bg-[#1e1438]', flagColor: '#9333ea', icon: 'file-text' },
      { color: 'border-red-500 bg-[#2b1016]', flagColor: '#ef4444', icon: 'share-2' },
      { color: 'border-amber-500 bg-[#2b1f0c]', flagColor: '#f59e0b', icon: 'link' },
      { color: 'border-emerald-500 bg-[#0f2a1a]', flagColor: '#22c55e', icon: 'shopping-bag' },
      { color: 'border-blue-500 bg-[#0f1f3d]', flagColor: '#3b82f6', icon: 'dollar-sign' },
      { color: 'border-cyan-500 bg-[#092327]', flagColor: '#06b6d4', icon: 'cpu' },
    ];

    rawUnits.forEach((unit: any, idx: number) => {
      const unitNum = idx + 1;
      const unitTitle = unit.title || unit.name || `Unit ${unitNum}: Core Foundations`;
      const moduleId = `mod_uploaded_${unitNum}_${Date.now()}`;
      const style = STYLES[idx % STYLES.length];

      const subtopics: string[] = Array.isArray(unit.topics) 
        ? unit.topics 
        : Array.isArray(unit.subtopics) 
        ? unit.subtopics 
        : [unit.description || 'Foundational principles & implementations'];

      const notesSections: TopicNoteSection[] = unit.notesSections || [
        {
          title: `1. Core Theoretical Foundations of ${unitTitle}`,
          content: [
            `This unit explores fundamental paradigms in ${unitTitle}. Mastery of these concepts is vital for developing high-performance, fault-tolerant software architectures.`,
            `Key subtopics include: ${subtopics.join(', ')}.`,
            'Understanding edge cases, memory layout, and runtime efficiency forms the bedrock of engineering excellence in modern computing environments.'
          ],
          codeSnippet: unit.codeSnippet || `// Sample implementation for ${unitTitle}\n#include <stdio.h>\n\nvoid executeOptimizedRoutine() {\n    printf("Processing ${unitTitle} efficiently...\\n");\n}\n\nint main() {\n    executeOptimizedRoutine();\n    return 0;\n}`,
          examTip: `Focus on comparative analysis: understand why traditional approaches fail under high load, and be ready to write pseudocode for ${subtopics[0] || 'core algorithms'}.`
        },
        {
          title: '2. Algorithmic Complexity & Architecture Analysis',
          content: [
            'System throughput and response time are governed by algorithmic Big-O scaling. Minimizing memory allocations and cache misses reduces hardware degradation.',
            'Always calculate both worst-case and average-case complexity before finalizing system design choices.'
          ],
          examTip: 'State explicit assumptions regarding inputs and memory constraints during examinations.'
        }
      ];

      const quizQuestions: QuizQuestion[] = (unit.quizQuestions && unit.quizQuestions.length > 0)
        ? unit.quizQuestions
        : this.generateQuizQuestionsForTopic(unitTitle, subtopics);

      const mod: LearningModule = {
        id: moduleId,
        title: unitTitle,
        semester: `Unit ${unitNum}`,
        subject: title,
        readTime: `${Math.max(4, subtopics.length * 2)} min read`,
        summary: unit.summary || `Comprehensive syllabus notes and study resources covering ${unitTitle}.`,
        content: notesSections.flatMap(s => s.content),
        keyTakeaways: unit.keyTakeaways || [
          `Master fundamental axioms and trade-offs of ${unitTitle}.`,
          `Optimize runtime execution to reduce energy and hardware resource usage.`,
          `Apply practical implementations in real-world software engineering.`
        ],
        quizQuestions,
        published: true,
        assignedBatches: ['BCA Scholar Cohort'],
        unitNumber: unitNum,
        notesSections,
        greenITImpact: unit.greenITImpact || `${60 + (idx * 6)}% compute resource optimization & reduced server power drain.`
      };

      modules.push(mod);

      stations.push({
        id: unitNum,
        badge: String(unitNum),
        title: unitTitle.toUpperCase(),
        subTitle: `Unit ${unitNum}: ${title}`,
        description: mod.summary,
        color: style.color,
        flagColor: style.flagColor,
        iconName: style.icon,
        semester: `Unit ${unitNum}`,
        topics: subtopics.slice(0, 4),
        energySaving: mod.greenITImpact || '65% Energy Efficiency',
        moduleId
      });
    });

    return { syllabusTitle: title, modules, stations };
  }

  private parseFromText(text: string, customTitle?: string): ParsedSyllabusResult {
    // Detect units by looking for UNIT X, MODULE X, CHAPTER X, or headers
    const lines = text.split('\n');
    let title = customTitle || 'Uploaded Syllabus Curriculum';
    
    // Check if line 1 looks like a title
    if (lines.length > 0 && !lines[0].match(/^(unit|module|chapter|week|\d+\.)/i) && lines[0].trim().length > 3 && lines[0].trim().length < 80) {
      if (!customTitle) title = lines[0].replace(/^[#*=\s]+/, '').replace(/[#*=\s]+$/, '').trim();
    }

    interface RawUnit {
      title: string;
      topics: string[];
      notesText: string[];
    }

    const units: RawUnit[] = [];
    let currentUnit: RawUnit | null = null;

    const unitHeaderRegex = /^(?:unit|module|chapter|week|section|part)\s*([0-9ivx]+)?[:\s\-\.]+(.+)$/i;
    const numberedHeaderRegex = /^(?:[0-9]+)\.\s+([A-Z0-9\s,&/-]{4,})$/;

    lines.forEach((line) => {
      const clean = line.trim();
      if (!clean) return;

      const unitMatch = clean.match(unitHeaderRegex);
      const numMatch = clean.match(numberedHeaderRegex);

      if (unitMatch) {
        if (currentUnit) units.push(currentUnit);
        const unitNumPart = unitMatch[1] ? `Unit ${unitMatch[1]}: ` : `Unit ${units.length + 1}: `;
        currentUnit = {
          title: unitNumPart + unitMatch[2].replace(/^[#*=\s]+/, '').trim(),
          topics: [],
          notesText: []
        };
      } else if (numMatch && (!currentUnit || currentUnit.topics.length > 2)) {
        if (currentUnit) units.push(currentUnit);
        currentUnit = {
          title: `Unit ${units.length + 1}: ${numMatch[1].trim()}`,
          topics: [],
          notesText: []
        };
      } else if (currentUnit) {
        if (clean.startsWith('-') || clean.startsWith('*') || clean.startsWith('•') || clean.match(/^\d+[\.\)]/)) {
          const topicClean = clean.replace(/^[-*•\d\.\)\s]+/, '').trim();
          if (topicClean) {
            currentUnit.topics.push(topicClean);
          }
        } else {
          currentUnit.notesText.push(clean);
          if (currentUnit.topics.length < 5 && clean.length < 90) {
            currentUnit.topics.push(clean);
          }
        }
      } else {
        // Line before any unit header: if it has bullets, treat as first unit
        if (clean.startsWith('-') || clean.startsWith('*') || clean.startsWith('•')) {
          currentUnit = {
            title: `Unit 1: ${title} Foundations`,
            topics: [clean.replace(/^[-*•\s]+/, '').trim()],
            notesText: []
          };
        }
      }
    });

    if (currentUnit) {
      units.push(currentUnit);
    }

    // If no units were detected via regex, chunk the text into logical 4-5 units
    if (units.length === 0) {
      const validLines = lines.map(l => l.trim()).filter(l => l.length > 0);
      const chunkSize = Math.max(3, Math.ceil(validLines.length / 5));
      for (let i = 0; i < validLines.length; i += chunkSize) {
        const slice = validLines.slice(i, i + chunkSize);
        const unitNum = Math.floor(i / chunkSize) + 1;
        units.push({
          title: `Unit ${unitNum}: ${slice[0].replace(/^[-*•#\d\.\)\s]+/, '').slice(0, 50) || 'Core Computing Concepts'}`,
          topics: slice.map(s => s.replace(/^[-*•#\d\.\)\s]+/, '').trim()),
          notesText: slice
        });
      }
    }

    // Limit to max 7 units for optimal roadmap layout
    const finalUnits = units.slice(0, 7);

    const STYLES = [
      { color: 'border-purple-500 bg-[#1e1438]', flagColor: '#9333ea', icon: 'file-text' },
      { color: 'border-red-500 bg-[#2b1016]', flagColor: '#ef4444', icon: 'share-2' },
      { color: 'border-amber-500 bg-[#2b1f0c]', flagColor: '#f59e0b', icon: 'link' },
      { color: 'border-emerald-500 bg-[#0f2a1a]', flagColor: '#22c55e', icon: 'shopping-bag' },
      { color: 'border-blue-500 bg-[#0f1f3d]', flagColor: '#3b82f6', icon: 'dollar-sign' },
      { color: 'border-cyan-500 bg-[#092327]', flagColor: '#06b6d4', icon: 'cpu' },
      { color: 'border-pink-500 bg-[#290d20]', flagColor: '#ec4899', icon: 'shield' },
    ];

    const modules: LearningModule[] = [];
    const stations: SyllabusRoadmapStation[] = [];

    finalUnits.forEach((u, idx) => {
      const unitNum = idx + 1;
      const style = STYLES[idx % STYLES.length];
      const moduleId = `mod_uploaded_${unitNum}_${Date.now()}`;
      const subtopics = u.topics.length > 0 ? u.topics : ['Foundations and Principles', 'Design & Algorithms', 'Real-world Applications'];

      const notesSections = this.buildComprehensiveNotes(u.title, subtopics, u.notesText);
      const quizQuestions = this.generateQuizQuestionsForTopic(u.title, subtopics);

      const mod: LearningModule = {
        id: moduleId,
        title: u.title,
        semester: `Unit ${unitNum}`,
        subject: title,
        readTime: `${Math.max(4, subtopics.length * 2)} min read`,
        summary: `Respected study notes, code implementations, exam tips, and gamified challenges for ${u.title}.`,
        content: notesSections.flatMap(s => s.content),
        keyTakeaways: [
          `Master the primary architectural rules and algorithms of ${u.title}.`,
          `Analyze time-space trade-offs and code optimization strategies.`,
          `Practice exam questions and prepare for syllabus checkpoints.`,
          `Promote sustainable computing through minimal CPU/RAM footprint.`
        ],
        quizQuestions,
        published: true,
        assignedBatches: ['BCA Scholar Cohort'],
        unitNumber: unitNum,
        notesSections,
        greenITImpact: `${55 + (unitNum * 7)}% reduction in computational idle waste & server power.`
      };

      modules.push(mod);

      stations.push({
        id: unitNum,
        badge: String(unitNum),
        title: u.title.toUpperCase(),
        subTitle: `Unit ${unitNum}: ${title}`,
        description: mod.summary,
        color: style.color,
        flagColor: style.flagColor,
        iconName: style.icon,
        semester: `Unit ${unitNum}`,
        topics: subtopics.slice(0, 4),
        energySaving: mod.greenITImpact || '60% Compute Watt Optimization',
        moduleId
      });
    });

    return { syllabusTitle: title, modules, stations };
  }

  private buildComprehensiveNotes(unitTitle: string, topics: string[], rawNotes: string[]): TopicNoteSection[] {
    const mainTopicName = topics[0] || 'Core Subject Foundations';
    const secondTopicName = topics[1] || 'Algorithmic Optimization';
    const thirdTopicName = topics[2] || 'System Integration';

    return [
      {
        title: `1. Overview & Theoretical Framework (${unitTitle})`,
        content: [
          `This topic introduces foundational principles governing ${unitTitle}. In modern computer applications, deep comprehension of ${mainTopicName} is essential for writing robust, bug-free, and scalable code.`,
          rawNotes.length > 0 
            ? `Curriculum Focus: ${rawNotes.slice(0, 3).join(' ')}` 
            : `Key subject objectives include mastering: ${topics.join(', ')}.`,
          `A central theme in this unit is balancing theoretical perfection with practical hardware efficiency. Developers must anticipate edge cases such as memory boundary limits, concurrency races, and cache misses.`
        ],
        codeSnippet: this.generateCodeSnippetForTopic(mainTopicName),
        examTip: `High-Yield Exam Focus: Clearly explain the differences between ${mainTopicName} and traditional naive models. Always illustrate with a diagram and label complexity metrics.`
      },
      {
        title: `2. Deep-Dive: ${secondTopicName} & Execution Architecture`,
        content: [
          `Examining ${secondTopicName} reveals key runtime trade-offs:`,
          `• Space vs. Time Complexity: When datasets grow exponentially, moving from quadratic O(N²) to logarithmic O(log N) or linearithmic O(N log N) models avoids severe server bottlenecks.`,
          `• Memory Locality & Cache Lines: Keeping data structures contiguous in memory prevents costly RAM fetch cycles and maximizes L1/L2/L3 hardware cache hits.`,
          `• Error Handling & Reliability: Always validate inputs, handle null pointers, and ensure graceful fallback states during network or storage interruptions.`
        ],
        examTip: `Numerical & Analytical Tip: Remember standard Big-O bounds and be prepared to write a recurrence relation or execution walk-through for ${secondTopicName}.`
      },
      {
        title: `3. Practical Applications & Sustainable Computing (${thirdTopicName})`,
        content: [
          `Beyond theoretical examinations, ${unitTitle} has direct industrial relevance in high-frequency trading, hyperscale web applications, and embedded IoT systems.`,
          `In green software engineering, every redundant CPU cycle and unindexed database query directly translates to electrical heat dissipation and carbon emissions.`,
          `By applying clean principles learned in this unit, modern engineers achieve significant power reductions while boosting user experience with sub-millisecond latency.`
        ],
        examTip: 'Examiners often ask for a real-world scenario where this concept resolves a system bottleneck. Mention scalability, energy efficiency, and security.'
      }
    ];
  }

  private generateCodeSnippetForTopic(topic: string): string {
    const lower = topic.toLowerCase();

    if (lower.includes('sort') || lower.includes('search') || lower.includes('algorithm') || lower.includes('dsa') || lower.includes('tree') || lower.includes('array')) {
      return `// High-Performance Algorithm Implementation
#include <stdio.h>
#include <stdlib.h>

// Optimized Divide & Conquer implementation: O(N log N)
void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;
    int *L = (int*)malloc(n1 * sizeof(int));
    int *R = (int*)malloc(n2 * sizeof(int));

    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
    free(L); free(R);
}`;
    }

    if (lower.includes('database') || lower.includes('sql') || lower.includes('dbms') || lower.includes('query')) {
      return `-- Database Query & Index Optimization
-- 1. Create B-Tree index to convert Seq Scan to Index Scan:
CREATE INDEX idx_syllabus_lookup ON student_records(student_id, semester);

-- 2. Optimized selective query with EXPLAIN ANALYZE:
EXPLAIN ANALYZE
SELECT student_id, full_name, gpa
FROM student_records
WHERE student_id = 'BCA-2026-441'
  AND status = 'ACTIVE';
-- Result: Cost drops from 12450.00 to 0.42 (3 IOPS vs 8000 disk pages)`;
    }

    if (lower.includes('network') || lower.includes('socket') || lower.includes('tcp') || lower.includes('http') || lower.includes('api')) {
      return `// High-Efficiency Network Client (Node.js/TypeScript)
import http from 'http';

// Reusable HTTP Keep-Alive Agent prevents repeated TCP 3-way handshakes
const keepAliveAgent = new http.Agent({
  keepAlive: true,
  maxSockets: 50,
  keepAliveMsecs: 30000,
});

export async function fetchTopicTelemetry(endpoint: string): Promise<any> {
  const response = await fetch(endpoint, {
    // Reuses established socket conduit
    headers: { 'Connection': 'keep-alive', 'Accept-Encoding': 'gzip' }
  });
  return response.json();
}`;
    }

    if (lower.includes('react') || lower.includes('frontend') || lower.includes('javascript') || lower.includes('web')) {
      return `// React Optimized Topic Component
import React, { useMemo, useCallback, useState } from 'react';

export const OptimizedTopicView: React.FC<{ items: string[] }> = ({ items }) => {
  const [filter, setFilter] = useState('');

  // Memoize costly array filtering to avoid re-running on every render
  const filteredList = useMemo(() => {
    return items.filter(item => item.toLowerCase().includes(filter.toLowerCase()));
  }, [items, filter]);

  return (
    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
      <input 
        value={filter} 
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter topic concepts..."
        className="w-full px-3 py-2 bg-slate-800 rounded-lg text-white"
      />
      <div className="mt-2 text-sm text-cyan-400">Items: {filteredList.length}</div>
    </div>
  );
};`;
    }

    return `// Optimized Production Snippet for ${topic}
#include <iostream>
#include <vector>

class EfficientEngine {
public:
    void execute() {
        // Pre-reserve capacity to avoid repeated memory reallocation
        std::vector<int> buffer;
        buffer.reserve(10000);
        for (int i = 0; i < 10000; ++i) {
            buffer.push_back(i * 2);
        }
        std::cout << "Executed ${topic} with zero memory reallocations." << std::endl;
    }
};`;
  }

  private generateQuizQuestionsForTopic(unitTitle: string, topics: string[]): QuizQuestion[] {
    const topic1 = topics[0] || 'Core Computing';
    const topic2 = topics[1] || 'Algorithmic Optimization';
    const topic3 = topics[2] || 'System Architecture';

    return [
      {
        id: `q_up_${Math.random().toString(36).substring(2, 9)}`,
        question: `In the study of ${unitTitle}, what is the primary computational benefit of ${topic1}?`,
        options: [
          `Optimizes resource consumption and guarantees lower asymptotic runtime`,
          `Guarantees O(1) constant time regardless of data structure size`,
          `Eliminates the requirement for volatile RAM memory entirely`,
          `Requires no hardware instruction execution on modern CPUs`
        ],
        correctIndex: 0,
        explanation: `${topic1} provides superior computational scaling and optimizes processor cycles and memory footprint.`,
        topic: unitTitle,
        semester: 'Unit Exam Review' as any
      },
      {
        id: `q_up_${Math.random().toString(36).substring(2, 9)}`,
        question: `When implementing ${topic2}, which design trade-off is critical for software reliability?`,
        options: [
          `Ignoring edge cases to optimize benchmark throughput`,
          `Validating bounds, memory locality, and exception handling states`,
          `Allocating memory dynamically in an unbounded infinite loop`,
          `Disabling processor cache line pre-fetching`
        ],
        correctIndex: 1,
        explanation: `Robust engineering demands thorough validation of bounds, cache locality, and graceful error recovery.`,
        topic: unitTitle,
        semester: 'Unit Exam Review' as any
      },
      {
        id: `q_up_${Math.random().toString(36).substring(2, 9)}`,
        question: `From a Sustainable Green IT perspective, how does mastering ${unitTitle} affect data center operations?`,
        options: [
          `It increases thermal output by forcing maximum CPU clock speeds`,
          `It decreases battery life in mobile and edge IoT devices`,
          `It slashes unnecessary compute cycles, cutting electrical draw and carbon emissions`,
          `It has no measurable connection to energy consumption`
        ],
        correctIndex: 2,
        explanation: `Efficient algorithms and architectures slash server CPU load, directly reducing electrical power and cooling costs.`,
        topic: unitTitle,
        semester: 'Unit Exam Review' as any
      },
      {
        id: `q_up_${Math.random().toString(36).substring(2, 9)}`,
        question: `In standard university examinations on ${unitTitle}, what is the recommended way to evaluate ${topic3}?`,
        options: [
          `By comparing best, average, and worst-case Big-O complexities`,
          `By counting raw lines of code irrespective of algorithmic logic`,
          `By guessing without mathematical recurrence proofs`,
          `By assuming all input arrays are already pre-sorted in ascending order`
        ],
        correctIndex: 0,
        explanation: `Asymptotic complexity analysis (Big-O, Omega, Theta) provides the formal mathematical foundation for evaluation.`,
        topic: unitTitle,
        semester: 'Unit Exam Review' as any
      }
    ];
  }
}

export const syllabusParserService = new SyllabusParserService();
