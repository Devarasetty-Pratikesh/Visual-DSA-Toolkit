export interface QuizQuestion {
  question: string;
  options: string[];
  correctIdx: number;
  hint: string;
  explanation: string;
}

export const ALGO_QUIZZES: Record<string, QuizQuestion> = {
  'Bubble Sort': {
    question: 'What is the worst-case time complexity of Bubble Sort?',
    options: ['O(N)', 'O(N log N)', 'O(N²)', 'O(1)'],
    correctIdx: 2,
    hint: 'Think about a completely reversed array where every element needs to bubble to the end.',
    explanation: 'Bubble Sort uses nested loops to compare adjacent elements. In the worst case (reversed array), it performs N * (N - 1) / 2 comparisons, leading to O(N²) time.'
  },
  'Selection Sort': {
    question: 'What is the key advantage of Selection Sort over other quadratic sorts?',
    options: ['It is stable', 'It minimizes array writes/swaps', 'It runs in O(N log N)', 'It is adaptive'],
    correctIdx: 1,
    hint: 'Think about cases where copying elements in memory is extremely expensive.',
    explanation: 'Selection Sort performs at most O(N) swaps (writes) because it only swaps after locating the absolute minimum of the unsorted subarray in each pass.'
  },
  'Insertion Sort': {
    question: 'What is the best-case time complexity of Insertion Sort?',
    options: ['O(N²)', 'O(N)', 'O(N log N)', 'O(1)'],
    correctIdx: 1,
    hint: 'Think about an array that is already fully sorted.',
    explanation: 'If the array is already sorted, the inner shift loop terminates immediately after one comparison per element, yielding O(N) time.'
  },
  'Merge Sort': {
    question: 'Why does Merge Sort require O(N) auxiliary space for arrays?',
    options: ['Because it is recursive', 'Because it is stable', 'To hold temp sub-arrays during merging', 'It does not require space'],
    correctIdx: 2,
    hint: 'Think about how sublists are merged together in sorted order.',
    explanation: 'Merge Sort allocates temporary sub-arrays to copy elements before merging them back in sorted order into the primary array.'
  },
  'Quick Sort': {
    question: 'Which pivot selection strategy completely avoids the worst-case O(N²) on sorted arrays?',
    options: ['First element pivot', 'Last element pivot', 'Randomized or Median-of-Three pivot', 'Always middle element'],
    correctIdx: 2,
    hint: 'Avoiding highly unbalanced 0:N partitions is key.',
    explanation: 'Median-of-three or randomized pivot selection ensures a high probability of balanced splits (N/2 : N/2), guaranteeing O(N log N) performance.'
  },
  'Heap Sort': {
    question: 'For a node at index i in a complete binary heap, what is the index of its left child?',
    options: ['2*i', '2*i + 1', '2*i + 2', 'i / 2'],
    correctIdx: 1,
    hint: 'The root is at index 0, its left child is at index 1.',
    explanation: 'In complete binary heap array representations, the left child of node i is at 2*i + 1, and the right child is at 2*i + 2.'
  },
  'Counting Sort': {
    question: 'Under what condition is Counting Sort highly efficient?',
    options: ['Unbounded numbers range', 'Large size floating-point values', 'Integers within a small, defined range', 'Sorted string arrays'],
    correctIdx: 2,
    hint: 'Counting Sort allocates a count array of size matching the maximum value range.',
    explanation: 'Counting Sort requires O(N + K) where K is the range of values. It is efficient only when K is small relative to array size N.'
  },
  'Radix Sort': {
    question: 'Which sub-sorting algorithm is traditionally used inside Radix Sort?',
    options: ['Quick Sort', 'Stable Counting Sort', 'Selection Sort', 'Merge Sort'],
    correctIdx: 1,
    hint: 'It must be stable so duplicate digit sorting does not scramble earlier sorts.',
    explanation: 'Radix Sort sorts elements digit-by-digit. It requires a stable sorting algorithm like Counting Sort as its digit-level subroutine.'
  },
  'Linear Search': {
    question: 'What is the average number of comparisons in a Linear Search on an array of size N?',
    options: ['N', 'N / 2', 'log N', '1'],
    correctIdx: 1,
    hint: 'The element could be at index 0 (1 comparison) or at index N-1 (N comparisons).',
    explanation: 'On average, the target lies in the middle of the search space, requiring approximately N / 2 comparisons.'
  },
  'Binary Search': {
    question: 'What is the minimum requirement for executing a Binary Search?',
    options: ['Array must be positive integers', 'Array must be pre-sorted', 'Array size must be even', 'Memory must be virtualized'],
    correctIdx: 1,
    hint: 'Pruning half of the intervals relies on value ordering.',
    explanation: 'Binary Search depends on data order to prune half of the search interval. If the array is unsorted, it cannot make branch decisions.'
  },
  'Jump Search': {
    question: 'What is the mathematically optimal block jump step size for Jump Search?',
    options: ['N / 2', '2', '√N', 'log N'],
    correctIdx: 2,
    hint: 'Think about balancing the jump count and the linear scan step count.',
    explanation: 'A block step size of √N balances the maximum jumps (√N) and maximum linear scans (√N), giving an optimal O(√N) runtime.'
  },
  'Interpolation Search': {
    question: 'What is the average time complexity of Interpolation Search on uniformly distributed data?',
    options: ['O(log N)', 'O(log log N)', 'O(N)', 'O(√N)'],
    correctIdx: 1,
    hint: 'Think about how formula estimates positions closer to target values.',
    explanation: 'Interpolation Search uses value ratios to predict indices, yielding ultra-fast O(log log N) lookup speeds under uniform numerical distributions.'
  },
  'Exponential Search': {
    question: 'In what scenario is Exponential Search highly preferred over standard Binary Search?',
    options: ['Small sorted arrays', 'Unsorted arrays', 'Massive or infinite-sized arrays where bounds are unknown', 'Duplicate keys'],
    correctIdx: 2,
    hint: 'Exponential Search finds the upper bound range by repeatedly doubling step indices.',
    explanation: 'Exponential Search doubles indices to locate bounds, then runs standard binary search. It is ideal for search bounds tracking on infinite streams.'
  },
  'Dijkstra': {
    question: 'Why does Dijkstra\'s algorithm fail on negative edge weights?',
    options: ['It causes division by zero', 'It greedily locks visited nodes, missing late improvements', 'It only works on undirected trees', 'Priority queues overflow'],
    correctIdx: 1,
    hint: 'Think about finalization assumption.',
    explanation: 'Dijkstra assumes a node\'s path is final once visited. A negative weight edge could relax a visited node, invalidating calculated optimal path values.'
  },
  'BFS': {
    question: 'Which data structure is utilized internally to manage node visit queues in BFS?',
    options: ['Stack (LIFO)', 'Queue (FIFO)', 'Priority Queue', 'Cylinder array'],
    correctIdx: 1,
    hint: 'First discovered nodes are explored first.',
    explanation: 'BFS explores vertices layer-by-layer, utilizing a standard First In First Out (FIFO) Queue.'
  },
  'DFS': {
    question: 'Which structure is used internally (or via recursive call stacks) in DFS?',
    options: ['Queue', 'Stack (LIFO)', 'Min Heap', 'Double List'],
    correctIdx: 1,
    hint: 'It dives deep into paths before backtracking.',
    explanation: 'DFS tracks traversal branches recursively or explicitly using a Last In First Out (LIFO) Stack.'
  },
  'AVL Tree': {
    question: 'What is the maximum allowed balance factor (BF) deviation in an AVL node before balancing is triggered?',
    options: ['BF differs by at most 1', 'BF differs by at most 2', 'BF is 0', 'BF exceeds tree depth'],
    correctIdx: 0,
    hint: 'The height of the left and right subtrees must differ by at most one.',
    explanation: 'AVL trees enforce strict balancing: height differences between left/right children cannot exceed 1. Rotations trigger if BF becomes +2 or -2.'
  },
  'BST': {
    question: 'What is the average-case time complexity of searching for a key in a Binary Search Tree (BST)?',
    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N²)'],
    correctIdx: 1,
    hint: 'A balanced BST halves the search space at each level, similar to binary search.',
    explanation: 'In a balanced BST, each step down the tree splits the search space roughly in half, leading to a highly efficient average-case time complexity of O(log N).'
  },
  'Tower of Hanoi': {
    question: 'How many total moves are required to solve the Tower of Hanoi with N disks?',
    options: ['2 * N', 'N²', '2ⁿ - 1', '2ⁿ + 1'],
    correctIdx: 2,
    hint: 'Every added disk doubles the number of operations required.',
    explanation: 'The recurrence relation is T(N) = 2*T(N-1) + 1, which expands to T(N) = 2ⁿ - 1 moves.'
  },
  'Factorial': {
    question: 'What is the recursive base case for a standard factorial(n) algorithm to prevent infinite recursion?',
    options: ['n == 100', 'n <= 1', 'n is even', 'n == -1'],
    correctIdx: 1,
    hint: 'Factorial is defined for non-negative integers. We stop multiplying when we reach 1.',
    explanation: 'The factorial of 0 or 1 is 1. The base case n <= 1 stops the recursive calls and begins returning values back up the stack.'
  },
  'Fibonacci': {
    question: 'Why is naive recursive Fibonacci selection extremely slow (running in O(2ⁿ))?',
    options: ['Because it is unstable', 'Because of massive redundant calculations of overlapping subproblems', 'Because it uses too much memory', 'Because it has no base case'],
    correctIdx: 1,
    hint: 'Think about how many times f(2) is calculated in a search for f(5).',
    explanation: 'Naive recursive Fibonacci recalculates identical subtree states (e.g. F(2), F(3)) repeatedly, resulting in an exponential number of total operations.'
  },
  'Stack': {
    question: 'Which retrieval paradigm governs the behavior of a standard Stack data structure?',
    options: ['FIFO (First In First Out)', 'LIFO (Last In First Out)', 'LILO (Last In Last Out)', 'Priority-based'],
    correctIdx: 1,
    hint: 'Think of stacking dinner plates in a pile.',
    explanation: 'A Stack is a Last In First Out (LIFO) structure; the element added last is the first one retrieved when performing a pop operation.'
  },
  'Queue': {
    question: 'In a standard Queue, where do insertions and deletions occur?',
    options: ['Insertions at head, deletions at tail', 'Insertions at tail, deletions at head', 'Both occur at the head', 'Both occur at the tail'],
    correctIdx: 1,
    hint: 'Think of standing in a checkout line at a grocery store.',
    explanation: 'A Queue operates under the First In First Out (FIFO) paradigm: new items enqueue at the tail (rear) and popped items dequeue from the head (front).'
  },
  'Hash Probing': {
    question: 'What is the main drawback of Linear Probing in Hash Tables?',
    options: ['It requires O(N) memory allocation per element', 'It causes primary clustering, leading to longer lookup spans', 'It is unstable', 'It can only store positive integers'],
    correctIdx: 1,
    hint: 'Consecutive keys hash into adjacent slots, forming massive blocks.',
    explanation: 'Linear probing searches sequential indexes, which can lead to clusters of occupied slots. Any collision in this cluster drags down search performance.'
  },
  'Heap': {
    question: 'What is the time complexity of extracting the minimum or maximum element from a Heap containing N items?',
    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
    correctIdx: 1,
    hint: 'Getting the root is O(1), but sifting the bottom element down to restore heap property takes time proportional to height.',
    explanation: 'Removing the root element requires placing the last leaf at the root and calling heapify (siftDown) to restore heap balance, running in O(log N) depth.'
  },
  'Linked List': {
    question: 'What is the time complexity to insert a node at the beginning of a singly Linked List of size N (given the head pointer)?',
    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N²)'],
    correctIdx: 0,
    hint: 'You only need to update the next pointer of the new node and shift the head pointer, which does not require traversing the list.',
    explanation: 'Inserting at the head takes O(1) constant time since we only create the new node, point its next to the current head, and update the head pointer.'
  }
};
