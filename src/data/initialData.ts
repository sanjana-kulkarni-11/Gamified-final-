/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  CharacterConfig, 
  CharacterSkin, 
  TrailEffect, 
  Mission, 
  Achievement, 
  LearningModule, 
  LeaderboardEntry,
  SyllabusGateChoice,
  CodeEfficiencyComparison
} from '../types/game';

export const INITIAL_CHARACTERS: CharacterConfig[] = [
  {
    id: 'aarav_sprinter',
    name: 'Aarav Tech-Sprint',
    title: 'Eco-Algorithms Pioneer',
    description: 'A third-year BCA student from Neo-Bengaluru specializing in Big-O algorithmic energy optimization and low-latency cache architectures.',
    roleSpecialty: '+15% Speed & +50% Bonus on Optimal Code Gates',
    speedBonus: 1.1,
    unlockedByDefault: true,
    tokenCost: 0,
    primaryColor: '#00e5a3', // Emerald cyan
    accentColor: '#00b4d8',
    modelType: 'sprinter',
  },
  {
    id: 'ananya_engineer',
    name: 'Dr. Ananya Ray',
    title: 'Cloud & Grid Systems Architect',
    description: 'Renewable energy researcher building low-PUE server clusters and carbon-aware batch schedulers for university campus microgrids.',
    roleSpecialty: '+30% Power-Up Duration & Instant Gate Shields',
    speedBonus: 1.0,
    unlockedByDefault: false,
    tokenCost: 150,
    primaryColor: '#ffd166', // Solar Gold
    accentColor: '#f77f00',
    modelType: 'engineer',
  },
  {
    id: 'kabir_botanist',
    name: 'Kabir Forestier',
    title: 'IoT Edge & Circular Tech Specialist',
    description: 'BCA hardware systems innovator utilizing MQTT edge sensors and urban mining techniques to recover precious metals from scrapped servers.',
    roleSpecialty: '+35% Token Magnet Range & Double E-Waste Rewards',
    speedBonus: 1.05,
    unlockedByDefault: false,
    tokenCost: 300,
    primaryColor: '#06d6a0', // Deep Forest Green
    accentColor: '#80ed99',
    modelType: 'botanist',
  },
];

export const INITIAL_SKINS: CharacterSkin[] = [
  {
    id: 'aarav_default',
    characterId: 'aarav_sprinter',
    name: 'Standard Cyber Suit',
    description: 'Lightweight recycled carbon fiber running attire.',
    tokenCost: 0,
    palette: { suit: '#00e5a3', trim: '#0f172a', visor: '#38bdf8' },
  },
  {
    id: 'aarav_solar',
    characterId: 'aarav_sprinter',
    name: 'Photon Speed Suit',
    description: 'Reflective gold-threaded aerogel suit tuned for maximum aerodynamic efficiency.',
    tokenCost: 100,
    palette: { suit: '#facc15', trim: '#1e293b', visor: '#f97316' },
  },
  {
    id: 'ananya_default',
    characterId: 'ananya_engineer',
    name: 'Research Grid Overalls',
    description: 'High-visibility safety suit with built-in solar cell telemetry sensors.',
    tokenCost: 0,
    palette: { suit: '#f59e0b', trim: '#312e81', visor: '#67e8f9' },
  },
  {
    id: 'ananya_cyber',
    characterId: 'ananya_engineer',
    name: 'Neo-Volt Exosuit',
    description: 'Ionized graphene exoskeleton with high-capacity supercapacitor conduits.',
    tokenCost: 180,
    palette: { suit: '#a855f7', trim: '#09090b', visor: '#22d3ee' },
  },
  {
    id: 'kabir_default',
    characterId: 'kabir_botanist',
    name: 'Urban Flora Harness',
    description: 'Water-resistant bio-mesh suit woven with moss and living air filtration spores.',
    tokenCost: 0,
    palette: { suit: '#10b981', trim: '#14532d', visor: '#a7f3d0' },
  },
  {
    id: 'kabir_stealth',
    characterId: 'kabir_botanist',
    name: 'Twilight Canopy Camo',
    description: 'Dark bio-luminescent fiber optics suited for night patrols in urban forests.',
    tokenCost: 200,
    palette: { suit: '#0284c7', trim: '#042f2e', visor: '#34d399' },
  },
];

export const INITIAL_TRAILS: TrailEffect[] = [
  {
    id: 'trail_emerald',
    name: 'Emerald Plasma',
    description: 'A luminous trail of green clean-energy particles following every sprint.',
    tokenCost: 0,
    color: '#10b981',
    glowColor: '#34d399',
  },
  {
    id: 'trail_solar',
    name: 'Solar Flare',
    description: 'Radiant golden photovoltaic streaks that brighten the road.',
    tokenCost: 80,
    color: '#f59e0b',
    glowColor: '#fbbf24',
  },
  {
    id: 'trail_cyclone',
    name: 'Bio-Flora Cyclone',
    description: 'Whirling holographic foliage and aeroponic mist.',
    tokenCost: 140,
    color: '#06d6a0',
    glowColor: '#80ed99',
  },
  {
    id: 'trail_cyber',
    name: 'Neon Quantum Pulse',
    description: 'Electrifying cyan data pulses reflecting algorithmic agility.',
    tokenCost: 220,
    color: '#06b6d4',
    glowColor: '#38bdf8',
  },
];

/**
 * IN-GAME SYLLABUS GATES:
 * During runs, the runner encounters physical dual holographic gates across lanes.
 * Selecting the optimal algorithmic/architectural choice provides an instant turbo boost & +500 points!
 */
export const SYLLABUS_GATES: SyllabusGateChoice[] = [
  {
    prompt: 'DSA: Search 1,000,000 elements in sorted array',
    topic: 'Data Structures & Algorithms',
    leftOption: {
      label: 'Binary Search O(log n)',
      isOptimal: true,
      explanation: 'Takes only ~20 comparisons vs 1,000,000 operations, saving ~99.9% CPU cycles!',
    },
    rightOption: {
      label: 'Linear Scan O(n)',
      isOptimal: false,
      explanation: 'Scans up to 1M items sequentially, burning 50,000x more server electrical power.',
    },
  },
  {
    prompt: 'DBMS: Lookup single user record among 500k rows',
    topic: 'Database Management Systems',
    leftOption: {
      label: 'Full Table Scan',
      isOptimal: false,
      explanation: 'Reads all disk blocks into RAM, causing heavy disk head movement and energy draw.',
    },
    rightOption: {
      label: 'B+ Tree Index Scan',
      isOptimal: true,
      explanation: 'Locates data in 3-4 tree block reads (O(log N)), reducing disk I/O energy by 98%.',
    },
  },
  {
    prompt: 'Java OOP: Concatenate 10,000 strings in a loop',
    topic: 'OOP with Java / C++',
    leftOption: {
      label: 'StringBuilder.append()',
      isOptimal: true,
      explanation: 'Modifies a single resizable char buffer, preventing thousands of heap garbage allocations.',
    },
    rightOption: {
      label: 'String s += str',
      isOptimal: false,
      explanation: 'Allocates a brand new String object each iteration (O(n²)), triggering heavy GC battery drain.',
    },
  },
  {
    prompt: 'Operating Systems: Server idle state power saving',
    topic: 'Operating Systems',
    leftOption: {
      label: 'DVFS & C6 Deep Sleep',
      isOptimal: true,
      explanation: 'Drops CPU voltage & clock frequency dynamically, slashing idle power draw by up to 70%.',
    },
    rightOption: {
      label: 'Constant Turbo Frequency',
      isOptimal: false,
      explanation: 'Runs clock at peak gigahertz even when idle, producing unnecessary thermal dissipation.',
    },
  },
  {
    prompt: 'Networks: IoT smart solar inverter telemetry',
    topic: 'Computer Networks',
    leftOption: {
      label: 'MQTT Pub/Sub (2-byte header)',
      isOptimal: true,
      explanation: 'Minimal protocol packet overhead keeps radio transceivers in low-power sleep states.',
    },
    rightOption: {
      label: 'HTTP REST Polling every 1s',
      isOptimal: false,
      explanation: 'Sends heavy HTTP headers and repeatedly re-establishes TCP 3-way handshakes, draining battery.',
    },
  },
  {
    prompt: 'Cloud Computing: High-density microservices',
    topic: 'Cloud Computing & Sustainable Software',
    leftOption: {
      label: 'Full OS Virtual Machines',
      isOptimal: false,
      explanation: 'Each VM duplicates entire OS kernel and background daemons, wasting gigabytes of RAM.',
    },
    rightOption: {
      label: 'Docker Containers',
      isOptimal: true,
      explanation: 'Shares host OS kernel, boosting server consolidation ratios and server energy efficiency.',
    },
  },
  {
    prompt: 'DSA: Sorting 500,000 student records',
    topic: 'Data Structures & Algorithms',
    leftOption: {
      label: 'Bubble Sort O(n²)',
      isOptimal: false,
      explanation: 'Takes ~250 billion operations! Unacceptable computational and carbon waste.',
    },
    rightOption: {
      label: 'Merge Sort O(n log n)',
      isOptimal: true,
      explanation: 'Divide-and-conquer guarantees O(n log n) comparisons, cutting CPU runtime from hours to seconds.',
    },
  },
  {
    prompt: 'E-Waste: Managing retired campus computer labs',
    topic: 'E-Waste Management & Cyber Law',
    leftOption: {
      label: 'Authorized E-Waste Recycler',
      isOptimal: true,
      explanation: 'Recovers gold/copper and ensures non-leaching disposal of lead and toxic brominated retardants.',
    },
    rightOption: {
      label: 'Scrap Landfill Dumping',
      isOptimal: false,
      explanation: 'Neurotoxic lead and mercury leach into groundwater aquifers, violating E-Waste Rules.',
    },
  },
];

/**
 * INTERACTIVE CODE EFFICIENCY WORKBENCH
 * Concrete side-by-side BCA code examples demonstrating algorithmic energy savings.
 */
export const CODE_COMPARISONS: CodeEfficiencyComparison[] = [
  {
    id: 'code_dsa_search',
    title: 'Linear Search vs Binary Search in Sorted Datasets',
    subject: 'Data Structures & Algorithms',
    problemStatement: 'Search for a target Roll Number in an array of 1,000,000 sorted BCA student records.',
    naiveCode: {
      title: 'Linear Search (Iterative scan)',
      code: `// Worst case: 1,000,000 iterations
int linearSearch(int arr[], int n, int x) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == x)
            return i;
    }
    return -1;
}`,
      complexity: 'Time: O(n) | Space: O(1)',
      cpuCycles: '~3,000,000 CPU instructions',
      estimatedEnergy: '18.4 mJ per query',
      explanation: 'Iterates through every array memory block one by one, triggering numerous cache misses.',
    },
    optimizedCode: {
      title: 'Binary Search (Divide & Conquer)',
      code: `// Worst case: log2(1,000,000) ≈ 20 iterations!
int binarySearch(int arr[], int l, int r, int x) {
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (arr[m] == x) return m;
        if (arr[m] < x) l = m + 1;
        else r = m - 1;
    }
    return -1;
}`,
      complexity: 'Time: O(log n) | Space: O(1)',
      cpuCycles: '~90 CPU instructions',
      estimatedEnergy: '0.0006 mJ per query',
      explanation: 'Halves the search space each step. 20 comparisons vs 1,000,000 means ~99.99% energy savings.',
    },
    energySavedPercent: 99.9,
    bcaTakeaway: 'Always choose O(log n) over O(n) on large sorted datasets to minimize hyperscale data center compute bills.',
  },
  {
    id: 'code_java_strings',
    title: 'Java String Immutability & Heap Allocation Waste',
    subject: 'OOP with Java / C++',
    problemStatement: 'Build a formatted CSV log file string with 20,000 environmental telemetry entries.',
    naiveCode: {
      title: 'String Concatenation in Loop (+)',
      code: `String log = "";
for (int i = 0; i < 20000; i++) {
    // Creates a NEW String and copies buffer each time!
    log = log + "Data point: " + i + "\\n";
}`,
      complexity: 'Time: O(n²) | Space: O(n²)',
      cpuCycles: '~400,000,000 cycles + Heavy Garbage Collection',
      estimatedEnergy: '142.5 mJ',
      explanation: 'String is immutable in Java. Every loop generates a new heap object and copies old bytes, thrashing GC.',
    },
    optimizedCode: {
      title: 'StringBuilder Mutable Buffer',
      code: `StringBuilder sb = new StringBuilder(20000 * 30);
for (int i = 0; i < 20000; i++) {
    sb.append("Data point: ").append(i).append("\\n");
}
String log = sb.toString();`,
      complexity: 'Time: O(n) | Space: O(n)',
      cpuCycles: '~1,200,000 cycles (Zero intermediate GC churn)',
      estimatedEnergy: '3.1 mJ',
      explanation: 'Reuses a contiguous internal character array, eliminating memory fragmentation and battery drain.',
    },
    energySavedPercent: 97.8,
    bcaTakeaway: 'In mobile Android and server microservices, mutable StringBuilder preserves battery and prevents Stop-the-World GC pauses.',
  },
  {
    id: 'code_db_indexes',
    title: 'Database Query Optimization: Table Scan vs B+ Tree Index',
    subject: 'Database Management Systems',
    problemStatement: 'Query active student login records in a PostgreSQL table with 800,000 records.',
    naiveCode: {
      title: 'Unindexed Query (Sequential Scan)',
      code: `-- Query runs without index on email column
SELECT * FROM students 
WHERE email = 'priya.bca@campus.edu';

-- EXPLAIN ANALYZE:
-- Seq Scan on students (cost=0.00..18450.00 rows=1 width=128)`,
      complexity: 'O(N) Disk Block Reads',
      cpuCycles: 'Reads 12,000 disk pages into buffer pool',
      estimatedEnergy: '85.0 mJ per query',
      explanation: 'Forces storage controllers to stream hundreds of megabytes of raw disk data across PCI-e bus.',
    },
    optimizedCode: {
      title: 'B+ Tree Index Scan',
      code: `-- Create B-Tree index on lookup key
CREATE INDEX idx_students_email ON students(email);

SELECT * FROM students 
WHERE email = 'priya.bca@campus.edu';

-- EXPLAIN ANALYZE:
-- Index Scan using idx_students_email (cost=0.42..8.44 rows=1)`,
      complexity: 'O(log N) Tree Traversal (3 IOPS)',
      cpuCycles: 'Reads only 3 disk pages (already in L2 cache)',
      estimatedEnergy: '0.8 mJ per query',
      explanation: 'Directly jumps to the target row address in milliseconds, keeping cloud storage in low-power idle.',
    },
    energySavedPercent: 99.1,
    bcaTakeaway: 'Strategic B+ Tree indexing reduces server storage IOPS and data center storage power consumption exponentially.',
  },
];

/**
 * SEMESTER-WISE BCA CURRICULUM MODULES
 * Structured by official university BCA syllabus with deep engineering notes and comprehensive quizzes.
 */
export const INITIAL_LEARNING_MODULES: LearningModule[] = [
  {
    id: 'mod_dsa_green',
    title: 'Data Structures: Time-Space Complexity & Green Algorithms',
    semester: 'Sem 3 (DSA & Operating Systems)',
    subject: 'Data Structures & Algorithms',
    readTime: '6 min read',
    summary: 'Master asymptotic Big-O notations, sorting algorithm energy costs, and cache locality to engineer high-efficiency software.',
    published: true,
    assignedBatches: ['BCA 3rd Sem A', 'BCA 3rd Sem B', 'BCA 5th Sem AI/DS'],
    codeComparisons: [CODE_COMPARISONS[0]],
    content: [
      'In university BCA computer science curriculums, Data Structures and Algorithms (DSA) is foundational. Traditionally, students evaluate algorithms purely through Big-O asymptotic notation for time (CPU clock cycles) and space (RAM bytes). However, in modern cloud data centers, execution time directly converts to electrical energy consumption measured in kilowatt-hours (kWh) and Joules.',
      'Consider sorting an array of N integers. A naive algorithm like Bubble Sort or Selection Sort operates in O(N²) time. For N = 100,000, O(N²) requires roughly 10,000,000,000 operations! In contrast, Merge Sort or Quick Sort operating in O(N log N) requires approximately 1,660,000 operations—a factor of over 6,000x fewer CPU instruction cycles.',
      'Cache Locality: Hardware CPUs feature L1, L2, and L3 caches. Accessing L1 cache takes ~1 nanosecond and fractions of a picojoule. Accessing main RAM takes ~100 nanoseconds and consumes up to 100x more energy per fetch. Contiguous data structures like Arrays exhibit high spatial locality and trigger fewer cache misses than pointer-chasing structures like Linked Lists.',
      'Dynamic Programming & Memoization: When solving overlapping subproblems (e.g. Fibonacci or Knapsack), naive recursion creates an exponential O(2^N) call tree that burns CPU power redundantly. Memoization caches subproblem solutions in O(N) space, reducing compute workload from billions of cycles to a single linear pass.'
    ],
    keyTakeaways: [
      'Algorithmic time complexity correlates directly with server hardware energy draw.',
      'O(N log N) divide-and-conquer sorting cuts CPU power by >95% compared to O(N²) nested loops.',
      'Arrays leverage hardware CPU cache lines better than scattered Linked List nodes, minimizing RAM fetch energy.',
      'Memoization replaces redundant recursive calls with O(1) lookups, saving massive server compute cycles.'
    ],
    quizQuestions: [
      {
        id: 'q_dsa_1',
        semester: 'Sem 3 (DSA & Operating Systems)',
        topic: 'Data Structures & Algorithms',
        question: 'Which sorting algorithm has a worst-case time complexity of O(N log N) and is most predictable for stable, energy-efficient cloud sorting?',
        options: ['Bubble Sort', 'Merge Sort', 'Selection Sort', 'Insertion Sort'],
        correctIndex: 1,
        explanation: 'Merge Sort guarantees O(N log N) time complexity in all cases (best, average, worst) using divide-and-conquer, preventing worst-case CPU energy spikes.',
      },
      {
        id: 'q_dsa_2',
        semester: 'Sem 3 (DSA & Operating Systems)',
        topic: 'Data Structures & Algorithms',
        question: 'Why does an Array generally consume less hardware energy during sequential traversal than a Linked List of the same size?',
        options: [
          'Arrays do not use memory addresses',
          'Arrays store elements in contiguous memory blocks, maximizing CPU cache line hits and avoiding pointer dereferencing',
          'Linked lists run only on the GPU',
          'Arrays compress data using gzip automatically'
        ],
        correctIndex: 1,
        explanation: 'Contiguous array storage triggers CPU hardware pre-fetching into fast L1/L2 caches. Linked list nodes are scattered across heap RAM, causing costly cache misses.',
      },
      {
        id: 'q_dsa_3',
        semester: 'Sem 3 (DSA & Operating Systems)',
        topic: 'Data Structures & Algorithms',
        question: 'What is the time complexity of looking up a key in a well-balanced Hash Table (HashMap)?',
        options: ['O(N²)', 'O(N)', 'O(1) average time', 'O(log N)'],
        correctIndex: 2,
        explanation: 'Hash tables compute an array index directly via a hash function, allowing instant O(1) average retrieval with minimal instruction cycles.',
      }
    ]
  },
  {
    id: 'mod_os_energy',
    title: 'Operating Systems: CPU Scheduling, DVFS & Energy Management',
    semester: 'Sem 3 (DSA & Operating Systems)',
    subject: 'Operating Systems',
    readTime: '5 min read',
    summary: 'How modern operating systems balance preemptive process scheduling with Dynamic Voltage/Frequency Scaling and low-power CPU sleep states.',
    published: true,
    assignedBatches: ['BCA 3rd Sem A', 'BCA 3rd Sem B'],
    content: [
      'In university Operating Systems theory, students learn about process management, CPU scheduling algorithms (Round Robin, Shortest Job First, Priority Scheduling), and virtual memory paging.',
      'Energy-Aware Scheduling (EAS): Modern OS kernels (like Linux and Android) employ energy-aware schedulers that evaluate the energy cost of running a task on different CPU cores (e.g., ARM big.LITTLE architecture: energy-efficient LITTLE cores for background threads vs high-performance big cores for user UI interaction).',
      'Dynamic Voltage and Frequency Scaling (DVFS): The dynamic power consumption of a CMOS processor is given by the formula: P = C · V² · f, where C is capacitance, V is voltage, and f is clock frequency. Because power scales with the square of voltage (V²), reducing clock frequency and voltage during low-workload states produces quadratic energy savings!',
      'CPU C-States & Tickless Kernels: When an operating system enters idle, it transitions the CPU through low-power C-states (C0: active, C1: halt, C6: power gated with cache flushed). Modern OS kernels use "tickless" scheduling (NO_HZ) to avoid waking up the CPU every millisecond for clock interrupts, allowing processors to sleep uninterrupted for seconds.'
    ],
    keyTakeaways: [
      'CMOS processor dynamic power consumption scales quadratically with voltage: P = C · V² · f.',
      'Energy-Aware Scheduling routes background services to high-efficiency low-power CPU cores.',
      'DVFS dynamically steps down voltage and frequency during I/O waits to prevent thermal throttling.',
      'Tickless kernels eliminate periodic hardware timer interrupts to keep processors in deep C-states.'
    ],
    quizQuestions: [
      {
        id: 'q_os_1',
        semester: 'Sem 3 (DSA & Operating Systems)',
        topic: 'Operating Systems',
        question: 'According to the CMOS power equation P = C · V² · f, what happens to processor power consumption if supply voltage (V) is halved?',
        options: [
          'Power increases by 2x',
          'Power stays identical',
          'Dynamic power drops by a factor of 4 (quadratic reduction)',
          'Clock frequency doubles'
        ],
        correctIndex: 2,
        explanation: 'Because power depends on V², halving the voltage drops power to (1/2)² = 1/4 of its original value.',
      },
      {
        id: 'q_os_2',
        semester: 'Sem 3 (DSA & Operating Systems)',
        topic: 'Operating Systems',
        question: 'What is the purpose of CPU "C-States" (e.g. C1, C3, C6) in modern computer operating systems?',
        options: [
          'To overclock the graphic card',
          'To progressively shut down internal processor components and clocks during idle periods to conserve power',
          'To format hard drives in the background',
          'To encrypt user network passwords'
        ],
        correctIndex: 1,
        explanation: 'C-states represent processor power-saving states. Higher numbers (like C6) gate clock signals and cut power to CPU execution cores when idle.',
      }
    ]
  },
  {
    id: 'mod_dbms_indexing',
    title: 'DBMS: Relational Normalization, B+ Tree Indexing & Low-I/O Architecture',
    semester: 'Sem 4 (DBMS & OOP Systems)',
    subject: 'Database Management Systems',
    readTime: '6 min read',
    summary: 'Optimizing SQL execution plans, database normalization, and B+ Tree indexes to prevent excessive storage IOPS and cloud server energy drain.',
    published: true,
    assignedBatches: ['BCA 3rd Sem A', 'BCA 5th Sem AI/DS'],
    codeComparisons: [CODE_COMPARISONS[2]],
    content: [
      'Database Management Systems (DBMS) is a core subject in BCA Semester 4. In enterprise applications, databases often store millions of records. An unoptimized SQL query can cause a full sequential table scan, forcing the storage controller to read gigabytes of disk blocks into RAM buffer pools.',
      'B+ Tree Indexing: Most relational databases (PostgreSQL, MySQL, Oracle) utilize B+ Tree data structures for primary and secondary keys. A B+ Tree keeps records sorted and allows search, sequential access, insertions, and deletions in logarithmic time (O(log N)). Searching 1,000,000 records requires only ~3 or 4 tree level lookups (3 disk IOPS) instead of scanning 50,000 disk pages.',
      'Normalization (1NF to 3NF/BCNF): Normalization decomposes large tables with redundant attributes into smaller, logically connected relations using foreign keys. This eliminates data redundancy, saving storage footprint and preventing costly update anomalies.',
      'Connection Pooling: Establishing a TCP connection to a database involves network latency, authentication, and allocating server memory processes. A connection pool (e.g. HikariCP) reuses a fixed set of open connections, eliminating redundant connection handshakes and server CPU spikes.'
    ],
    keyTakeaways: [
      'B+ Tree indexing allows O(log N) record retrieval, reducing disk I/O operations from thousands to 3-4 reads.',
      'Normalization (3NF) reduces data redundancy and eliminates update anomalies across enterprise tables.',
      'Full table scans force continuous disk spin and PCI-e bus transmission, consuming high server wattage.',
      'Connection pooling reuses open database channels, eliminating the overhead of frequent TCP/SSL handshakes.'
    ],
    quizQuestions: [
      {
        id: 'q_db_1',
        semester: 'Sem 4 (DBMS & OOP Systems)',
        topic: 'Database Management Systems',
        question: 'Why are B+ Trees preferred over standard Binary Search Trees (BST) for relational database disk indexing?',
        options: [
          'B+ trees have a much higher branching factor (fan-out), keeping tree height low and minimizing costly disk I/O reads',
          'BSTs cannot store numbers',
          'B+ trees require no RAM to operate',
          'B+ trees do not support sorting'
        ],
        correctIndex: 0,
        explanation: 'B+ trees have a wide branching factor (often 100+ keys per node), resulting in a short tree (height 3-4) that locates records in very few disk page accesses.',
      },
      {
        id: 'q_db_2',
        semester: 'Sem 4 (DBMS & OOP Systems)',
        topic: 'Database Management Systems',
        question: 'Which Normal Form guarantees that all non-key attributes are fully functionally dependent on the primary key (no partial dependencies)?',
        options: ['1NF', '2NF', '3NF', 'BCNF'],
        correctIndex: 1,
        explanation: 'Second Normal Form (2NF) requires 1NF compliance and mandates that every non-prime attribute depends completely on the whole candidate key.',
      }
    ]
  },
  {
    id: 'mod_oop_java',
    title: 'OOP Systems: Memory Management, JVM Garbage Collection & Clean Code',
    semester: 'Sem 4 (DBMS & OOP Systems)',
    subject: 'OOP with Java / C++',
    readTime: '5 min read',
    summary: 'Mastering Java heap vs stack memory, garbage collection algorithms, and eliminating string concatenation churn in enterprise systems.',
    published: true,
    assignedBatches: ['BCA 3rd Sem B', 'BCA 5th Sem AI/DS'],
    codeComparisons: [CODE_COMPARISONS[1]],
    content: [
      'Object-Oriented Programming (OOP) in Java and C++ teaches core concepts: Encapsulation, Inheritance, Polymorphism, and Abstraction. However, efficient software engineering requires understanding runtime memory architecture.',
      'Heap vs Stack Memory: Stack memory stores primitive variables and method call stack frames; it is lightning fast, thread-safe, and automatically deallocated when a function returns. Heap memory stores dynamically instantiated objects (`new Object()`). Heap allocation requires tracking, synchronization, and eventual Garbage Collection (GC).',
      'Java String Immutability Trap: `java.lang.String` objects are immutable. Performing string concatenation inside a loop (`str = str + i`) instantiates a brand new String object and copies the entire char array on every iteration. For 10,000 iterations, this creates 10,000 temporary objects that instantly fill up the Young Generation heap and trigger frequent "Stop-The-World" GC pauses!',
      'Using `StringBuilder` or `StringBuffer` maintains a single internal resizable buffer, reducing CPU cycles by over 95% and eliminating garbage collection battery drain.'
    ],
    keyTakeaways: [
      'Stack memory deallocates automatically at method return; Heap objects require JVM Garbage Collection.',
      'String concatenation in loops creates O(N²) garbage objects; always use StringBuilder for mutable text.',
      'Generational Garbage Collectors split heap into Eden, Survivor, and Tenured spaces to optimize collection passes.',
      'Object pooling reuses heavy objects (like database connections or byte buffers) to curb memory thrashing.'
    ],
    quizQuestions: [
      {
        id: 'q_oop_1',
        semester: 'Sem 4 (DBMS & OOP Systems)',
        topic: 'OOP with Java / C++',
        question: 'Why does concatenating strings using the "+" operator inside a large loop in Java lead to severe performance and battery degradation?',
        options: [
          'Because Java does not support strings',
          'Because String is immutable, forcing the JVM to allocate a new String object and copy characters on every single loop iteration',
          'Because the loop executes on the graphics card',
          'Because the compiler deletes the loop variable'
        ],
        correctIndex: 1,
        explanation: 'String immutability means every "+" allocates a new heap object and copies old contents (O(N²)), triggering massive garbage collection overhead.',
      },
      {
        id: 'q_oop_2',
        semester: 'Sem 4 (DBMS & OOP Systems)',
        topic: 'OOP with Java / C++',
        question: 'What is the key advantage of Stack memory allocation over Heap memory allocation in C++ and Java?',
        options: [
          'Stack memory is allocated dynamically at runtime without bounds',
          'Stack allocation and deallocation is nearly instantaneous (just moving the stack pointer) with zero garbage collection overhead',
          'Stack memory is shared across all network servers',
          'Stack memory never runs out of space'
        ],
        correctIndex: 1,
        explanation: 'Stack memory allocation is handled directly by adjusting the CPU stack pointer register, requiring zero heap searching or garbage collection.',
      }
    ]
  },
  {
    id: 'mod_cn_protocols',
    title: 'Computer Networks: OSI/TCP-IP Stack & Green IoT Protocols',
    semester: 'Sem 5-6 (Networks & Cloud Computing)',
    subject: 'Computer Networks',
    readTime: '5 min read',
    summary: 'Evaluating transport layer overhead (TCP vs UDP), HTTP/2 vs HTTP/3, and low-energy IoT protocols like MQTT in modern distributed systems.',
    published: true,
    assignedBatches: ['BCA 5th Sem AI/DS'],
    content: [
      'In BCA Semester 5 Computer Networks, students master the 7-Layer OSI Reference Model and the practical 4-layer TCP/IP Internet architecture.',
      'TCP vs UDP in Network Power Draw: Transmission Control Protocol (TCP) provides reliable, connection-oriented data delivery via 3-way handshakes (SYN, SYN-ACK, ACK) and sliding-window flow control. However, transmitting redundant acknowledgments and packet retransmissions keeps mobile LTE/5G cellular radios in high-power states.',
      'HTTP Evolution: Traditional HTTP/1.1 suffered from Head-of-Line (HoL) blocking, opening up to 6 separate TCP connections per domain. HTTP/2 introduced binary framing and multiplexing over a single TCP connection. HTTP/3 builds on QUIC over UDP, eliminating TCP handshake delays and enabling instant connection migration without re-handshaking.',
      'MQTT for Green IoT: Message Queuing Telemetry Transport (MQTT) is a lightweight publish/subscribe protocol designed for low-bandwidth, battery-powered edge devices. An MQTT message header can be as compact as 2 bytes, compared to HTTP request headers that frequently exceed 500 to 1,000 bytes. This drastic reduction in payload size enables solar IoT nodes to operate for years on small batteries.'
    ],
    keyTakeaways: [
      'TCP guarantees ordered delivery through 3-way handshakes; UDP is connectionless with minimal header overhead.',
      'HTTP/2 multiplexes multiple streams over a single connection, reducing socket overhead.',
      'MQTT headers require only 2 bytes, making it the premier protocol for battery-constrained environmental IoT devices.',
      'Reducing network payload size directly reduces cellular radio wake time on mobile devices.'
    ],
    quizQuestions: [
      {
        id: 'q_cn_1',
        semester: 'Sem 5-6 (Networks & Cloud Computing)',
        topic: 'Computer Networks',
        question: 'Which transport layer protocol is connectionless, has an 8-byte header, and avoids acknowledgement round-trips for real-time video and gaming?',
        options: ['TCP', 'UDP', 'HTTP', 'SMTP'],
        correctIndex: 1,
        explanation: 'User Datagram Protocol (UDP) is connectionless with a fixed 8-byte header, providing low-latency transmission without retransmission overhead.',
      },
      {
        id: 'q_cn_2',
        semester: 'Sem 5-6 (Networks & Cloud Computing)',
        topic: 'Computer Networks',
        question: 'Why is MQTT significantly more energy-efficient than HTTP for environmental monitoring sensors transmitting temperature data every minute?',
        options: [
          'MQTT does not use the internet',
          'MQTT has a tiny 2-byte header and maintains a persistent lightweight connection, avoiding hundreds of bytes of repetitive HTTP header overhead',
          'MQTT transmits data faster than the speed of light',
          'MQTT encrypts data with 4096-bit keys by default'
        ],
        correctIndex: 1,
        explanation: 'MQTT headers are as small as 2 bytes, whereas HTTP headers carry cookie, user-agent, and host metadata exceeding 500+ bytes per transmission.',
      }
    ]
  },
  {
    id: 'mod_cloud_sse',
    title: 'Cloud Computing: Virtualization, Data Center PUE & Sustainable Software',
    semester: 'Sem 5-6 (Networks & Cloud Computing)',
    subject: 'Cloud Computing & Sustainable Software',
    readTime: '6 min read',
    summary: 'Architecting carbon-aware cloud systems, calculating Power Usage Effectiveness (PUE), and maximizing server consolidation ratios with containers.',
    published: true,
    assignedBatches: ['BCA 5th Sem AI/DS'],
    content: [
      'Cloud Computing represents the pinnacle of modern enterprise IT. Hyperscale data centers run millions of physical servers. However, computing infrastructure generates substantial greenhouse gas emissions unless managed sustainably.',
      'Power Usage Effectiveness (PUE): The universal standard for measuring data center infrastructure efficiency is: PUE = (Total Facility Energy) / (IT Equipment Energy). An ideal PUE is 1.0, meaning 100% of electricity powers servers, storage, and networking without waste. A legacy data center with PUE = 2.0 burns 1 Watt of cooling/lighting overhead for every 1 Watt of computing power!',
      'Virtualization: Bare-Metal vs Hypervisors vs Containers: Type-1 bare-metal hypervisors (ESXi, KVM) run directly on server hardware. However, Docker containers share the host operating system kernel, using only megabytes of RAM compared to gigabytes for a full OS Virtual Machine. Containers enable server consolidation ratios to reach 70-80% CPU utilization, preventing low-efficiency server idling.',
      'Carbon-Aware Computing: The Green Software Foundation defines Carbon-Aware systems as applications that dynamically modulate their computational intensity based on the real-time carbon intensity of the electrical grid (gCO2eq/kWh). Non-urgent batch workloads—like training AI models or bulk video transcoding—are scheduled when local solar and wind output peaks.'
    ],
    keyTakeaways: [
      'PUE = Total Facility Power / IT Equipment Power; target PUE for world-class green data centers is under 1.2.',
      'Docker containers share the OS kernel, allowing high server density and eliminating idle power waste.',
      'Carbon-aware computing schedules heavy machine learning batch jobs during hours of peak renewable energy surplus.',
      'Modern data centers use liquid immersion cooling to replace energy-hungry air conditioning compressor units.'
    ],
    quizQuestions: [
      {
        id: 'q_cc_1',
        semester: 'Sem 5-6 (Networks & Cloud Computing)',
        topic: 'Cloud Computing & Sustainable Software',
        question: 'If a university cloud data center uses 500 kW of total power, and the IT servers consume 400 kW, what is the facility PUE?',
        options: ['0.8', '1.25', '2.0', '1.8'],
        correctIndex: 1,
        explanation: 'PUE = Total Facility Power / IT Power = 500 / 400 = 1.25. (A score of 1.25 indicates very high cooling and power distribution efficiency).',
      },
      {
        id: 'q_cc_2',
        semester: 'Sem 5-6 (Networks & Cloud Computing)',
        topic: 'Cloud Computing & Sustainable Software',
        question: 'What is the primary architectural difference between a Docker container and a traditional Virtual Machine (VM)?',
        options: [
          'Containers do not run code',
          'Containers share the host OS kernel and isolate user space, whereas VMs virtualize hardware and run an entire guest operating system',
          'VMs are always faster than containers',
          'Containers can only be used on personal laptops'
        ],
        correctIndex: 1,
        explanation: 'Containers share the host kernel and start in seconds with minimal RAM overhead. VMs package a redundant full OS kernel and virtual drivers.',
      }
    ]
  },
  {
    id: 'mod_ewaste_rules',
    title: 'E-Waste Management Rules, RoHS & Urban Mining',
    semester: 'Sem 1-2 (Foundation & E-Waste)',
    subject: 'E-Waste Management & Cyber Law',
    readTime: '5 min read',
    summary: 'The environmental and legal mandates governing discarded IT hardware, hazardous heavy metals, and precious metal recovery.',
    published: true,
    assignedBatches: ['BCA 3rd Sem A', 'BCA 3rd Sem B', 'BCA 5th Sem AI/DS'],
    content: [
      'Electronic waste (E-Waste) is the fastest-growing domestic waste stream in the world. Computer systems contain hazardous neurotoxins alongside valuable precious metals.',
      'Hazardous Materials in Computing Hardware: Discarded cathode ray tubes (CRTs) and solder contain Lead (Pb). Fluorescent backlights in older LCDs contain Mercury (Hg). Rechargeable laptop batteries and semiconductors contain Cadmium (Cd) and Lithium. When dumped into municipal unlined landfills, rainwater leaches these heavy metals into groundwater aquifers, causing severe neurological and kidney damage.',
      'RoHS Directive (Restriction of Hazardous Substances): European and international manufacturing standards mandate strict limits on 10 hazardous materials in electronic products, driving the development of SAC (Tin-Silver-Copper) lead-free solders and halogen-free printed circuit boards.',
      'Urban Mining & Circular Electronics: Discarded printed circuit boards contain up to 350 grams of Gold (Au) per metric ton, alongside Palladium (Pd), Silver (Ag), and Copper (Cu). Urban mining recovers these metals at a fraction of the carbon emissions and water usage required by traditional open-pit ore mining.',
      'Indian E-Waste (Management) Rules 2022 enforce Extended Producer Responsibility (EPR), requiring hardware manufacturers and enterprise IT consumers to meet certified annual recycling targets.'
    ],
    keyTakeaways: [
      'Lead, Mercury, and Cadmium from dumped electronics leach into water tables unless processed in lined recycling facilities.',
      'RoHS directive restricts hazardous heavy metals in commercial electronic hardware assembly.',
      'Urban mining from PCBs yields higher concentrations of gold and rare earths than natural virgin ore mining.',
      'EPR (Extended Producer Responsibility) legally mandates IT hardware manufacturers to recycle retired computing hardware.'
    ],
    quizQuestions: [
      {
        id: 'q_ew_1',
        semester: 'Sem 1-2 (Foundation & E-Waste)',
        topic: 'E-Waste Management & Cyber Law',
        question: 'Under the Indian E-Waste (Management) Rules, what legal framework requires electronics manufacturers to establish take-back mechanisms and meet annual recycling targets?',
        options: [
          'Digital India Act',
          'Extended Producer Responsibility (EPR)',
          'Right to Information',
          'ISO 14001 Optional Guideline'
        ],
        correctIndex: 1,
        explanation: 'Extended Producer Responsibility (EPR) mandates that producers and brand owners are legally responsible for the safe end-of-life recycling of products they sell.',
      },
      {
        id: 'q_ew_2',
        semester: 'Sem 1-2 (Foundation & E-Waste)',
        topic: 'E-Waste Management & Cyber Law',
        question: 'What is "Urban Mining" in the context of computer engineering and hardware recycling?',
        options: [
          'Digging underground subways under major cities',
          'Extracting valuable precious metals (Gold, Silver, Palladium, Copper) from discarded printed circuit boards and electronic scrap',
          'Writing software for mining cryptocurrency',
          'Demolishing old buildings to create parks'
        ],
        correctIndex: 1,
        explanation: 'Urban mining recovers critical minerals and precious metals from discarded tech scrap, preventing environmental destruction caused by traditional mineral mining.',
      }
    ]
  }
];

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'mission_1',
    title: 'Urban Sprint Initiation',
    description: 'Sprint a total distance of 1,000 meters in a single run.',
    targetCount: 1000,
    currentCount: 0,
    type: 'distance',
    rewardTokens: 40,
    rewardXP: 100,
    completed: false,
    claimed: false,
  },
  {
    id: 'mission_2',
    title: 'Syllabus Gate Master',
    description: 'Successfully pass 3 BCA Syllabus Code Gates by choosing optimal algorithms.',
    targetCount: 3,
    currentCount: 0,
    type: 'syllabus_gates',
    rewardTokens: 60,
    rewardXP: 180,
    completed: false,
    claimed: false,
  },
  {
    id: 'mission_3',
    title: 'Circular Economy Drive',
    description: 'Gather 30 Recycling Tokens on the city tracks.',
    targetCount: 30,
    currentCount: 0,
    type: 'tokens',
    rewardTokens: 50,
    rewardXP: 150,
    completed: false,
    claimed: false,
  },
  {
    id: 'mission_4',
    title: 'Clean Energy Harvest',
    description: 'Collect 60 Green Energy Orbs across your runs.',
    targetCount: 60,
    currentCount: 0,
    type: 'orbs',
    rewardTokens: 50,
    rewardXP: 120,
    completed: false,
    claimed: false,
  },
  {
    id: 'mission_5',
    title: 'BCA Knowledge Harvester',
    description: 'Collect 4 Holo-Knowledge fragments on the running track.',
    targetCount: 4,
    currentCount: 0,
    type: 'knowledge',
    rewardTokens: 80,
    rewardXP: 250,
    completed: false,
    claimed: false,
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_first_sprint',
    title: 'First Sprint',
    description: 'Begin your journey as a BCA Eco-Runner and complete your first run.',
    iconName: 'Play',
    requirement: 1,
    currentValue: 0,
    metric: 'runs_played',
    unlocked: false,
    rewardTokens: 25,
  },
  {
    id: 'ach_code_gate_expert',
    title: 'Algorithmic Optimization Master',
    description: 'Clear 5 BCA Syllabus Code Gates with optimal algorithmic choices.',
    iconName: 'Cpu',
    requirement: 5,
    currentValue: 0,
    metric: 'code_gates_passed',
    unlocked: false,
    rewardTokens: 100,
  },
  {
    id: 'ach_energy_collector',
    title: 'Energy Collector',
    description: 'Collect 100 Green Energy Orbs.',
    iconName: 'Zap',
    requirement: 100,
    currentValue: 0,
    metric: 'total_tokens',
    unlocked: false,
    rewardTokens: 50,
  },
  {
    id: 'ach_eco_explorer',
    title: 'Eco Explorer',
    description: 'Accumulate a lifetime distance of 5,000 meters across runs.',
    iconName: 'Compass',
    requirement: 5000,
    currentValue: 0,
    metric: 'total_distance',
    unlocked: false,
    rewardTokens: 100,
  },
  {
    id: 'ach_recycling_champion',
    title: 'Recycling Champion',
    description: 'Collect 150 Recycling Tokens and clean the smart city avenues.',
    iconName: 'Recycle',
    requirement: 150,
    currentValue: 0,
    metric: 'total_tokens',
    unlocked: false,
    rewardTokens: 120,
  },
  {
    id: 'ach_clean_run',
    title: 'Clean Run Master',
    description: 'Achieve a score of at least 15,000 points in a single run.',
    iconName: 'Award',
    requirement: 15000,
    currentValue: 0,
    metric: 'high_score',
    unlocked: false,
    rewardTokens: 150,
  },
  {
    id: 'ach_green_computing',
    title: 'BCA Curriculum Scholar',
    description: 'Score 100% on 3 BCA Environmental & Computing Course Quizzes.',
    iconName: 'BookOpen',
    requirement: 3,
    currentValue: 0,
    metric: 'quizzes_completed',
    unlocked: false,
    rewardTokens: 200,
  },
  {
    id: 'ach_guardian_city',
    title: 'Guardian of the City',
    description: 'Reach City Restoration Stage 5 (Fully Restored Bio-Smart City).',
    iconName: 'ShieldCheck',
    requirement: 5,
    currentValue: 0,
    metric: 'runs_played',
    unlocked: false,
    rewardTokens: 300,
  },
];

export const DEMO_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'lead_1',
    nickname: 'Arjun_CodeGreen',
    batch: 'BCA 5th Sem AI/DS',
    highScore: 28450,
    longestDistance: 4320,
    totalTokens: 480,
    quizScore: 98,
    syllabusGatesMastered: 24,
    avatarSeed: 'arjun',
  },
  {
    id: 'lead_2',
    nickname: 'Priya_SolarStack',
    batch: 'BCA 3rd Sem A',
    highScore: 24900,
    longestDistance: 3890,
    totalTokens: 410,
    quizScore: 95,
    syllabusGatesMastered: 19,
    avatarSeed: 'priya',
  },
  {
    id: 'lead_3',
    nickname: 'Rohan_CleanByte',
    batch: 'BCA 3rd Sem B',
    highScore: 21300,
    longestDistance: 3450,
    totalTokens: 350,
    quizScore: 90,
    syllabusGatesMastered: 15,
    avatarSeed: 'rohan',
  },
  {
    id: 'lead_4',
    nickname: 'Sneha_EcoDev',
    batch: 'BCA 5th Sem AI/DS',
    highScore: 19800,
    longestDistance: 3120,
    totalTokens: 290,
    quizScore: 100,
    syllabusGatesMastered: 17,
    avatarSeed: 'sneha',
  },
  {
    id: 'lead_5',
    nickname: 'Aditya_KernelZero',
    batch: 'BCA 1st Sem A',
    highScore: 17600,
    longestDistance: 2780,
    totalTokens: 230,
    quizScore: 85,
    syllabusGatesMastered: 11,
    avatarSeed: 'aditya',
  },
  {
    id: 'lead_6',
    nickname: 'Deepa_BioAlg',
    batch: 'BCA 3rd Sem A',
    highScore: 15400,
    longestDistance: 2420,
    totalTokens: 195,
    quizScore: 92,
    syllabusGatesMastered: 8,
    avatarSeed: 'deepa',
  },
  {
    id: 'lead_7',
    nickname: 'Vikram_CyberSolar',
    batch: 'BCA 1st Sem B',
    highScore: 13200,
    longestDistance: 2110,
    totalTokens: 160,
    quizScore: 88,
    syllabusGatesMastered: 6,
    avatarSeed: 'vikram',
  },
];

export const ENVIRONMENTAL_FACTS = [
  {
    title: 'Algorithmic Complexity & Server Energy',
    fact: 'Replacing an unoptimized O(n²) sorting routine with O(n log n) divide-and-conquer drops server CPU power consumption by over 60%.',
    bcaTakeaway: 'Always choose optimal Big-O algorithms on enterprise backend clusters to prevent unnecessary kilowatt-hour (kWh) power draw.',
  },
  {
    title: 'B+ Tree Indexes vs Storage IOPS',
    fact: 'A B+ Tree index locates records in 3 disk reads (O(log n)), whereas a full table scan can force 50,000+ disk blocks across the bus.',
    bcaTakeaway: 'Index high-frequency WHERE and JOIN columns in PostgreSQL/MySQL to prevent storage hardware overheating.',
  },
  {
    title: 'Urban Gold Mine in Microchips',
    fact: 'One ton of printed circuit boards holds more than 40 times the concentration of gold compared to raw subterranean gold ore.',
    bcaTakeaway: 'Certified e-waste recycling safeguards rare earth elements (neodymium, dysprosium) essential for clean energy tech.',
  },
  {
    title: 'Dynamic Voltage & Frequency Scaling (DVFS)',
    fact: 'Because CMOS power scales with the square of voltage (P = C · V² · f), stepping down voltage during I/O wait states slashes energy quadratically.',
    bcaTakeaway: 'Operating systems utilize Energy-Aware Schedulers to down-clock idle threads and extend battery life.',
  },
  {
    title: 'Dark Mode & OLED Power Efficiency',
    fact: 'On OLED smartphone and tablet screens, true black (#000000) pixels turn completely off, saving up to 45% display battery power.',
    bcaTakeaway: 'Always design dark-mode friendly CSS color palettes for mobile applications to reduce consumer device charge cycles.',
  },
  {
    title: 'MQTT vs HTTP for IoT Telemetry',
    fact: 'MQTT has a compact 2-byte header, compared to HTTP request headers that frequently exceed 500 to 1,000 bytes of overhead.',
    bcaTakeaway: 'Use MQTT for campus solar microgrid sensor telemetry to let battery-powered IoT nodes run for years without maintenance.',
  },
];
