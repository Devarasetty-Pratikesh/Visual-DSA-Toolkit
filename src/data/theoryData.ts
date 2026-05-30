import { TheorySection } from '../types';

export const THEORY_DATA: Record<string, TheorySection> = {
  'Bubble Sort': {
    definition: 'Bubble Sort is a simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
    principle: 'Compare adjacent elements. Swap if the first is larger than the second. Repeat N times. The largest unsorted elements bubble up to the end.',
    pseudocode: `procedure bubbleSort(A : list of items)
    n := length(A)
    repeat
        swapped := false
        for i := 1 to n-1 inclusive do
            if A[i-1] > A[i] then
                swap(A[i-1], A[i])
                swapped := true
            end if
        end for
        n := n - 1
    until not swapped
end procedure`,
    applications: ['Education: explaining core sorting properties', 'Graphics polygon sortings', 'Small arrays sorting'],
    advantages: ['Easy to write and debug', 'In-place O(1) space', 'Stable sort', 'Best case O(N) when sorted'],
    disadvantages: ['Poor worst-case O(N²)', 'High swap counts'],
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    questions: [
      { question: 'When is it optimal?', answer: 'When arrays are already sorted or nearly sorted, executing in O(N).' }
    ]
  },
  'Selection Sort': {
    definition: 'Selection Sort splits arrays into sorted and unsorted zones, repeatedly finding the minimum element from the unsorted zone and swapping it to the beginning.',
    principle: 'Locate minimum unsorted element. Swap with the first index of the unsorted zone. Move bounds forward.',
    pseudocode: `procedure selectionSort(A : list)
    n := length(A)
    for i := 0 to n-2 do
        minIdx := i
        for j := i+1 to n-1 do
            if A[j] < A[minIdx] then
                minIdx := j
            end if
        end for
        if minIdx != i then
            swap(A[i], A[minIdx])
        end if
    end for
end procedure`,
    advantages: ['Performs at most N swaps (excellent for expensive write drives)', 'In-place O(1) space'],
    disadvantages: ['Worst and average complexities are always O(N²)', 'Unstable sort'],
    applications: ['Swapping is highly expensive', 'Micro-embedded buffers'],
    complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    questions: [{ question: 'Is it stable?', answer: 'No, long-distance swaps can scramble identical key pairs.' }]
  },
  'Insertion Sort': {
    definition: 'Insertion Sort builds a sorted array element-by-element by continually inserting unsorted keys into their correct locations in a sorted sublist.',
    principle: 'Hold a key item. Scan backward through the sorted zone, shift larger elements forward, and drop key.',
    pseudocode: `procedure insertionSort(A : list)
    for i := 1 to length(A)-1 do
        key := A[i]
        j := i - 1
        while j >= 0 and A[j] > key do
            A[j+1] := A[j]
            j := j - 1
        end while
        A[j+1] := key
    end for
end procedure`,
    advantages: ['Highly efficient for nearly sorted lists O(N)', 'Stable and adaptive', 'O(1) auxiliary space'],
    disadvantages: ['Inefficient for reverse-sorted lists O(N²)'],
    applications: ['Small datasets sorting', 'Hybrid sorts fallback (e.g. Timsort, Introsort)'],
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    questions: [{ question: 'What is its best case?', answer: 'O(N) when the array is already fully sorted.' }]
  },
  'Merge Sort': {
    definition: 'Merge Sort is a stable, divide-and-conquer algorithm that recursively splits arrays into halves and merges them in sorted order.',
    principle: 'Divide list into single node arrays. Recursively merge sorted sublists.',
    pseudocode: `procedure mergeSort(A : list)
    if length(A) <= 1 return A
    mid := length(A) / 2
    left := mergeSort(left half of A)
    right := mergeSort(right half of A)
    return merge(left, right)
end procedure`,
    advantages: ['Guaranteed O(N log N) worst-case time', 'Highly stable'],
    disadvantages: ['Requires O(N) auxiliary space allocation'],
    applications: ['Sorting linked lists', 'External files too large for RAM'],
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    questions: [{ question: 'Why is it stable?', answer: 'Elements from left sublist are chosen first on equality checks.' }]
  },
  'Quick Sort': {
    definition: 'Quick Sort partition arrays around a selected pivot, placing smaller items left and larger items right.',
    principle: 'Pick a pivot. Partition elements. Recursively sort left and right partitions.',
    pseudocode: `procedure quickSort(A, low, high)
    if low < high then
        pIdx := partition(A, low, high)
        quickSort(A, low, pIdx - 1)
        quickSort(A, pIdx + 1, high)
    end if
end procedure`,
    advantages: ['Cache friendly, in-place, very fast average case O(N log N)'],
    disadvantages: ['Worst case O(N²)', 'Unstable sort'],
    applications: ['Commercial sort databases', 'Standard library sorting utilities'],
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
    questions: [{ question: 'How is worst case avoided?', answer: 'By using randomized pivot selections.' }]
  },
  'Heap Sort': {
    definition: 'Heap Sort is an in-place sorting algorithm that builds a Binary Max Heap from array indexes, repeatedly extracting the maximum element.',
    principle: 'Construct Max Heap. Swap root (max) with end element. Decrease heap size and heapify.',
    pseudocode: `procedure heapSort(A : list)
    buildMaxHeap(A)
    for i := length(A)-1 down to 1 do
        swap(A[0], A[i])
        maxHeapify(A, index=0, size=i)
    end for
end procedure`,
    advantages: ['Guaranteed O(N log N) time, in-place O(1) space'],
    disadvantages: ['Poor cache locality compared to Quick Sort', 'Unstable'],
    applications: ['Priority queue implementations', 'Real-time embedded systems'],
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' },
    questions: [{ question: 'Is it stable?', answer: 'No, heap tree node extractions scramble relative duplicate ordering.' }]
  },
  'Counting Sort': {
    definition: 'Counting Sort is a non-comparison integer sorting algorithm that counts keys frequencies in a known range.',
    principle: 'Tally occurrences of values. Calculate cumulative counts. Place in output array.',
    pseudocode: `procedure countingSort(A, k)
    count := array of size k+1 initialized to 0
    for each x in A do count[x]++
    outIdx := 0
    for i := 0 to k do
        while count[i] > 0 do
            A[outIdx++] := i
            count[i]--
        end while
    end for
end procedure`,
    advantages: ['Linear O(N+K) time complexity'],
    disadvantages: ['Requires large auxiliary arrays if range K is massive', 'Only integers'],
    applications: ['Sorting small key values ranges', 'Sub-routine inside Radix Sort'],
    complexity: { best: 'O(n+k)', average: 'O(n+k)', worst: 'O(n+k)', space: 'O(n+k)' },
    questions: [{ question: 'What is K?', answer: 'K represents the range span (maximum value - minimum value) of the items.' }]
  },
  'Radix Sort': {
    definition: 'Radix Sort is a digit-by-digit non-comparison sorting algorithm that processes digits from Least to Most Significant.',
    principle: 'Group keys by digits using a stable sub-routine (like Counting Sort) repeatedly.',
    pseudocode: `procedure radixSort(A)
    maxVal := getMax(A)
    for exp := 1 while maxVal/exp > 0 do
        stableCountingSortByDigit(A, exp)
    end for
end procedure`,
    advantages: ['Linear O(N*d) scaling for fixed-length keys'],
    disadvantages: ['Not in-place', 'Dependent on digits/characters representation'],
    applications: ['Sorting massive numeric indexes', 'Sorting fixed-length strings like zip codes'],
    complexity: { best: 'O(d*(n+k))', average: 'O(d*(n+k))', worst: 'O(d*(n+k))', space: 'O(n+k)' },
    questions: [{ question: 'Why does it need a stable sub-routine?', answer: 'So that digit sweeps do not override previous sorted digit columns.' }]
  },
  'Linear Search': {
    definition: 'Linear Search sequentially checks every element in a list from start to finish until a match is found.',
    principle: 'Check indices 0 to N-1 sequentially.',
    pseudocode: `procedure linearSearch(A, target)
    for i := 0 to length(A)-1 do
        if A[i] == target return i
    end for
    return -1
end procedure`,
    advantages: ['Simple, works on completely unsorted array lists'],
    disadvantages: ['Slow O(N) scaling'],
    applications: ['Small array lookups', 'Unsorted buffer maps'],
    complexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    questions: [{ question: 'When is it preferred?', answer: 'When data is unsorted and lists are relatively small.' }]
  },
  'Binary Search': {
    definition: 'Binary Search halves the search boundaries recursively on a sorted array.',
    principle: 'Compare target with mid element. Shrink boundaries to left or right half.',
    pseudocode: `procedure binarySearch(A, target)
    low := 0, high := length(A)-1
    while low <= high do
        mid := low + (high-low)/2
        if A[mid] == target return mid
        else if A[mid] < target low := mid + 1
        else high := mid - 1
    end while
    return -1
end procedure`,
    advantages: ['Extremely fast lookup scaling O(log N)'],
    disadvantages: ['Data MUST be pre-sorted'],
    applications: ['Database indexing lookups', 'Git bisect troubleshooting scans'],
    complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
    questions: [{ question: 'Why low + (high-low)/2?', answer: 'To avoid potential integer overflow bounds errors.' }]
  },
  'Jump Search': {
    definition: 'Jump Search jumps ahead by blocks of size √N, then performs a linear scan inside the identified block.',
    principle: 'Jump block-by-block. Backtrack and scan linearly if block boundary exceeds target.',
    pseudocode: `procedure jumpSearch(A, target)
    n := length(A), step := floor(sqrt(n))
    prev := 0, curr := step
    while A[min(curr, n)-1] < target do
        prev := curr
        curr := curr + step
        if prev >= n return -1
    end while
    for i := prev to min(curr, n)-1 do
        if A[i] == target return i
    end for
    return -1
end procedure`,
    advantages: ['Fewer checks than Linear, no high/low jumps like Binary (cache-friendly)'],
    disadvantages: ['Requires sorted arrays, slower than Binary Search'],
    applications: ['Locating blocks on massive sorted disk drives'],
    complexity: { best: 'O(1)', average: 'O(√n)', worst: 'O(√n)', space: 'O(1)' },
    questions: [{ question: 'Optimal block size?', answer: 'Always exactly √N to minimize worst-case checks.' }]
  },
  'Interpolation Search': {
    definition: 'Interpolation Search estimates target positions using data boundaries distributions.',
    principle: 'Calculate mid coordinate using numerical values ratio ratios.',
    pseudocode: `procedure interpolationSearch(A, target)
    low := 0, high := length(A)-1
    while low <= high and target >= A[low] and target <= A[high] do
        pos := low + ((high-low) / (A[high]-A[low])) * (target-A[low])
        if A[pos] == target return pos
        if A[pos] < target low := pos + 1
        else high := pos - 1
    end while
    return -1
end procedure`,
    advantages: ['Blazing-fast O(log log N) on uniform datasets'],
    disadvantages: ['Degrades to O(N) if numerical distribution is heavily skewed'],
    applications: ['Telephone directory indexing lookup systems'],
    complexity: { best: 'O(1)', average: 'O(log log n)', worst: 'O(n)', space: 'O(1)' },
    questions: [{ question: 'What is required?', answer: 'Sorted and uniformly distributed numerical lists.' }]
  },
  'Exponential Search': {
    definition: 'Exponential Search finds lookup bounds by doubling index steps, then runs standard binary search.',
    principle: 'Check index 1, 2, 4, 8... until element is larger. Binary search inside range.',
    pseudocode: `procedure exponentialSearch(A, target)
    if A[0] == target return 0
    i := 1, n := length(A)
    while i < n and A[i] <= target do
        i := i * 2
    end while
    return binarySearch(A, target, range=[i/2, min(i, n-1)])
end procedure`,
    advantages: ['Highly optimized for unbounded or infinite size arrays'],
    disadvantages: ['Requires pre-sorting'],
    applications: ['Streaming database indexes searches'],
    complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
    questions: [{ question: 'How does it start?', answer: 'By doubling search bounds exponentially.' }]
  },
  'Dijkstra': {
    definition: 'Dijkstra finds the absolute shortest paths from a single source node in weighted graphs with non-negative edges.',
    principle: 'Continually visit unvisited node with smallest distance, relax adjacent edges.',
    pseudocode: `procedure dijkstra(Graph, source)
    dist := array filled with infinity
    dist[source] := 0
    Q := PriorityQueue(Graph.nodes)
    while Q is not empty do
        u := Q.extractMin()
        for each neighbor v of u do
            alt := dist[u] + weight(u, v)
            if alt < dist[v] then
                dist[v] := alt
                Q.decreasePriority(v, alt)
            end if
        end for
    end while
end procedure`,
    advantages: ['Guarantees mathematically optimal shortest paths'],
    disadvantages: ['Fails entirely on negative weight edges'],
    applications: ['GPS driving navigation software maps', 'Network routing packets'],
    complexity: { best: 'O(E + V log V)', average: 'O(E + V log V)', worst: 'O(V²)', space: 'O(V)' },
    questions: [{ question: 'Why does it fail on negative edges?', answer: 'Greedy finalization prevents correct revisits of path values.' }]
  },
  'BFS': {
    definition: 'Breadth-First Search traverses graphs level-by-level using a FIFO Queue.',
    principle: 'Enqueue source. Mark visited. Pop, traverse all unvisited neighbors, enqueue.',
    pseudocode: `procedure BFS(Graph, source)
    Q := FIFOQueue()
    visited := set()
    Q.enqueue(source)
    visited.add(source)
    while Q is not empty do
        u := Q.dequeue()
        for each neighbor v of u do
            if v not in visited then
                visited.add(v)
                Q.enqueue(v)
            end if
        end for
    end while
end procedure`,
    advantages: ['Guarantees shortest paths on unweighted graphs'],
    disadvantages: ['High memory requirements O(V) to store all nodes in active queue'],
    applications: ['Social connection circles separations', 'Web crawlers indexing pages'],
    complexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)' },
    questions: [{ question: 'What queue is used?', answer: 'Standard First In First Out (FIFO) queue.' }]
  },
  'DFS': {
    definition: 'Depth-First Search explores graph paths as deep as possible before backtracking.',
    principle: 'Push node. Mark visited. Recursively dive neighbors or stack push.',
    pseudocode: `procedure DFS(Graph, source)
    S := LIFOStack()
    visited := set()
    S.push(source)
    while S is not empty do
        u := S.pop()
        if u not in visited then
            visited.add(u)
            for each neighbor v of u do
                if v not in visited then S.push(v)
            end if
        end if
    end while
end procedure`,
    advantages: ['Low memory footprints, helpful for checking connectivity/cycles'],
    disadvantages: ['Can get stuck in deep paths, does not guarantee shortest route'],
    applications: ['Solving labyrinth mazes', 'Topological sort compiler maps'],
    complexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)' },
    questions: [{ question: 'Internal structure?', answer: 'Last In First Out (LIFO) recursive stack.' }]
  },
  'AVL Tree': {
    definition: 'An AVL Tree is a self-balancing binary search tree keeping height differences bounded by 1.',
    principle: 'Insert/delete nodes. Check BF (Left - Right Height). Rotate LL/RR/LR/RL if balance factor breaks.',
    pseudocode: `procedure insert(node, val)
    // 1. Normal BST insert
    if node is null return Node(val)
    if val < node.val node.left := insert(node.left, val)
    else node.right := insert(node.right, val)
    // 2. Balancing check
    node.height := 1 + max(h(left), h(right))
    bf := h(left) - h(right)
    if bf > 1 and val < left.val return rightRotate(node)
    if bf < -1 and val > right.val return leftRotate(node)
    ... // LR / RL cases
    return node
end procedure`,
    advantages: ['Consistent lookup inserts deletes in O(log N)'],
    disadvantages: ['Frequent rotations on inserts, height metadata cost'],
    applications: ['Consistent database lookups indexing'],
    complexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
    questions: [{ question: 'What is balance factor?', answer: 'Height(Left Subtree) - Height(Right Subtree).' }]
  },
  'BST': {
    definition: 'A Binary Search Tree (BST) is a node-based binary tree data structure where the left subtree contains values less than the parent and the right subtree contains values greater.',
    principle: 'For every node, LeftChild.value < node.value < RightChild.value. Enables efficient search, insertion, and deletion.',
    pseudocode: `procedure search(node, key)
    if node is null or node.key == key return node
    if key < node.key return search(node.left, key)
    else return search(node.right, key)
end procedure

procedure insert(node, val)
    if node is null return Node(val)
    if val < node.val node.left := insert(node.left, val)
    else node.right := insert(node.right, val)
    return node
end procedure`,
    advantages: ['Dynamic sizing', 'Fast lookup, insertion, and deletion when balanced'],
    disadvantages: ['Can degenerate into a linear linked list in the worst case (O(N) search)'],
    applications: ['Database indexing, symbol tables, dictionary lookups'],
    complexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)', space: 'O(n)' },
    questions: [{ question: 'What is its worst case?', answer: 'O(N) when elements are inserted in sorted order (skewed tree).' }]
  },
  'Tower of Hanoi': {
    definition: 'Tower of Hanoi is a classic mathematical recursion game containing three peg shafts and disks of various sizes.',
    principle: 'Move N-1 disks from Source to Aux peg. Move largest disk to Target. Move N-1 disks from Aux to Target.',
    pseudocode: `procedure solveHanoi(n, source, target, aux)
    if n == 1 then
        move disk 1 from source to target
        return
    end if
    solveHanoi(n - 1, source, aux, target)
    move disk n from source to target
    solveHanoi(n - 1, aux, target, source)
end procedure`,
    advantages: ['Perfect recursion paradigm demonstration'],
    disadvantages: ['Exponential O(2ⁿ) complexity triggers extreme runs on high disk counts'],
    applications: ['Backup rotation schemes, teaching recursion'],
    complexity: { best: 'O(2ⁿ)', average: 'O(2ⁿ)', worst: 'O(2ⁿ)', space: 'O(n)' },
    questions: [{ question: 'How many moves for 5 disks?', answer: '2⁵ - 1 = 31 operations.' }]
  },
  'Factorial': {
    definition: 'Factorial represents the product of all positive integers less than or equal to a given number N.',
    principle: 'Solve recursively: N! = N * (N-1)!, with the base case of 0! = 1.',
    pseudocode: `procedure factorial(n)
    if n <= 1 return 1
    return n * factorial(n - 1)
end procedure`,
    advantages: ['Extremely simple recursive structure'],
    disadvantages: ['Can cause Stack Overflow if N is extremely large without optimization'],
    applications: ['Permutations, combinations, probability calculations'],
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    questions: [{ question: 'What is the base case?', answer: 'n <= 1 returning 1, which stops recursive calls.' }]
  },
  'Fibonacci': {
    definition: 'The Fibonacci sequence is a numerical series where each term is the sum of the two preceding terms.',
    principle: 'Recurse: F(N) = F(N-1) + F(N-2), with base cases F(0) = 0, F(1) = 1.',
    pseudocode: `procedure fibonacci(n)
    if n <= 0 return 0
    if n == 1 return 1
    return fibonacci(n - 1) + fibonacci(n - 2)
end procedure`,
    advantages: ['Beautiful demonstration of overlapping subproblems'],
    disadvantages: ['Naive recursion is extremely slow (exponential O(2ⁿ)) due to redundant calculations'],
    applications: ['Financial analysis, population growth models, teaching dynamic programming'],
    complexity: { best: 'O(2ⁿ)', average: 'O(2ⁿ)', worst: 'O(2ⁿ)', space: 'O(n)' },
    questions: [{ question: 'How is it optimized?', answer: 'By storing pre-computed terms in a cache (Memoization) to run in O(N).' }]
  },
  'Stack': {
    definition: 'A Stack is a linear LIFO (Last In First Out) data structure where elements are inserted and retrieved from a single end called the top.',
    principle: 'Push additions to top. Pop removals from top. Peek views the top element without removing.',
    pseudocode: `procedure push(val)
    if top >= max_size return "Stack Overflow"
    stack[++top] := val
end procedure

procedure pop()
    if top < 0 return "Stack Underflow"
    return stack[top--]
end procedure`,
    advantages: ['Ultra-fast O(1) additions and removals', 'Simple memory management'],
    disadvantages: ['No random access (must pop everything to reach bottom)'],
    applications: ['Browser undo history, compiler recursive call stacks, parenthesis matching'],
    complexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' },
    questions: [{ question: 'What is LIFO?', answer: 'Last In First Out, meaning the last added element is the first retrieved.' }]
  },
  'Queue': {
    definition: 'A Queue is a linear FIFO (First In First Out) data structure where insertions occur at the tail (rear) and removals at the head (front).',
    principle: 'Enqueue elements at rear. Dequeue elements from front.',
    pseudocode: `procedure enqueue(val)
    if rear >= max_size return "Queue Full"
    queue[rear++] := val
end procedure

procedure dequeue()
    if front == rear return "Queue Empty"
    return queue[front++]
end procedure`,
    advantages: ['Fast O(1) insertion and removal', 'Ensures fair ordering (first come, first served)'],
    disadvantages: ['No random access (must dequeue preceding items to retrieve intermediate ones)'],
    applications: ['Printer print queues, CPU thread scheduling, Breadth-First Search'],
    complexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' },
    questions: [{ question: 'What is FIFO?', answer: 'First In First Out, meaning the first added element is the first to be removed.' }]
  },
  'Hash Probing': {
    definition: 'Hash Probing is an open-addressing collision resolution strategy in Hash Tables that searches for alternative slots.',
    principle: 'When index h(k) is full, look at consecutive cells: linear probing checks index + i, quadratic probing checks index + i².',
    pseudocode: `procedure hashInsert(hashTable, key)
    idx := hash(key)
    i := 0
    while hashTable[idx] is occupied do
        idx := (hash(key) + i) % table_size  // Linear Probing
        i := i + 1
    end while
    hashTable[idx] := key
end procedure`,
    advantages: ['Saves pointer allocation space compared to chaining (buckets)'],
    disadvantages: ['Prone to clustering (Linear Probing), degrading lookup speeds'],
    applications: ['Database indexing, symbol tables in compilers'],
    complexity: { best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(n)' },
    questions: [{ question: 'What is clustering?', answer: 'Continuous blocks of filled slots that cause subsequent lookups to drag.' }]
  },
  'Heap': {
    definition: 'A Heap is a complete binary tree that maintains the Heap Property: either parent value is >= children (Max Heap) or <= children (Min Heap).',
    principle: 'Insert at the end, then bubble up (sift up). Extract top element, place last element at root, and sift down.',
    pseudocode: `procedure insert(val)
    heap[size] := val
    siftUp(size)
    size := size + 1
end procedure

procedure siftUp(i)
    while i > 0 and heap[parent(i)] > heap[i] do
        swap(heap[parent(i)], heap[i])
        i := parent(i)
    end while
end procedure`,
    advantages: ['Fast retrieval of minimum/maximum element in O(1)', 'Logarithmic inserts and updates'],
    disadvantages: ['Slow lookup for arbitrary elements in the middle of the heap'],
    applications: ['Priority queue implementations, Dijkstra shortest path heaps, Huffman coding'],
    complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
    questions: [{ question: 'How is parent index calculated?', answer: 'For node at index i, parent is at floor((i - 1) / 2).' }]
  },
  'Linked List': {
    definition: 'A Linked List is a linear data structure where elements are stored in nodes, and each node points to the next node in memory via a pointer.',
    principle: 'Nodes are allocated dynamically. Each node contains data and a next pointer. Access is sequential starting from the head node.',
    pseudocode: `procedure traverse(head)
    current := head
    while current is not null do
        print current.data
        current := current.next
    end while
end procedure

procedure insertAtEnd(head, val)
    newNode := Node(val)
    if head is null return newNode
    current := head
    while current.next is not null do
        current := current.next
    end while
    current.next := newNode
    return head
end procedure`,
    advantages: ['Dynamic size allocation (no resizing costs)', 'Fast O(1) insertions and deletions at known pointers'],
    disadvantages: ['No random access (requires O(N) sequential traversal to reach index)', 'Extra memory overhead for pointer storage'],
    applications: ['Hash table chaining buckets, undo/redo states, graph adjacency list representations'],
    complexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    questions: [{ question: 'What is its search complexity?', answer: 'O(N) because you must traverse nodes sequentially starting from the head node.' }]
  }
};

export const THEORY_CATEGORIES = {
  sorting: ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Merge Sort', 'Quick Sort', 'Heap Sort', 'Counting Sort', 'Radix Sort'],
  searching: ['Linear Search', 'Binary Search', 'Jump Search', 'Interpolation Search', 'Exponential Search'],
  graphs: ['BFS', 'DFS', 'Dijkstra'],
  trees: ['AVL Tree', 'BST'],
  recursion: ['Tower of Hanoi', 'Factorial', 'Fibonacci'],
  datastructures: ['Stack', 'Queue', 'Linked List', 'Hash Probing', 'Heap']
};
