export interface SearchStep {
  index: number;
  low: number;
  high: number;
  visited: number[];
  found: boolean;
  foundIndex: number;
  log: string;
}

// 1. Linear Search
export const generateLinearSearchSteps = (arr: number[], target: number): SearchStep[] => {
  const steps: SearchStep[] = [];
  const visited: number[] = [];
  const n = arr.length;

  steps.push({
    index: -1,
    low: 0,
    high: n - 1,
    visited: [],
    found: false,
    foundIndex: -1,
    log: `Starting Linear Search for target ${target}`
  });

  for (let i = 0; i < n; i++) {
    visited.push(i);
    if (arr[i] === target) {
      steps.push({
        index: i,
        low: 0,
        high: n - 1,
        visited: [...visited],
        found: true,
        foundIndex: i,
        log: `Target ${target} found at index ${i}!`
      });
      return steps;
    }

    steps.push({
      index: i,
      low: 0,
      high: n - 1,
      visited: [...visited],
      found: false,
      foundIndex: -1,
      log: `Inspecting index ${i} (value: ${arr[i]}). Not target.`
    });
  }

  steps.push({
    index: -1,
    low: 0,
    high: n - 1,
    visited: [...visited],
    found: false,
    foundIndex: -1,
    log: `Linear Search complete. Target ${target} not found in array.`
  });

  return steps;
};

// 2. Binary Search
export const generateBinarySearchSteps = (arr: number[], target: number): SearchStep[] => {
  const steps: SearchStep[] = [];
  const visited: number[] = [];
  const sorted = [...arr].sort((a, b) => a - b); // Must be sorted
  const n = sorted.length;

  steps.push({
    index: -1,
    low: 0,
    high: n - 1,
    visited: [],
    found: false,
    foundIndex: -1,
    log: `Starting Binary Search on sorted array for target ${target}`
  });

  let low = 0;
  let high = n - 1;

  while (low <= high) {
    const mid = Math.floor(low + (high - low) / 2);
    visited.push(mid);

    steps.push({
      index: mid,
      low,
      high,
      visited: [...visited],
      found: false,
      foundIndex: -1,
      log: `Computed mid index ${mid} (value: ${sorted[mid]}) with search bounds [${low}, ${high}]`
    });

    if (sorted[mid] === target) {
      steps.push({
        index: mid,
        low,
        high,
        visited: [...visited],
        found: true,
        foundIndex: mid,
        log: `Target ${target} matches mid index value ${sorted[mid]}! Found at index ${mid}.`
      });
      return steps;
    }

    if (sorted[mid] < target) {
      low = mid + 1;
      steps.push({
        index: mid,
        low,
        high,
        visited: [...visited],
        found: false,
        foundIndex: -1,
        log: `${sorted[mid]} < ${target}. Shrinking boundaries: new low = ${low}`
      });
    } else {
      high = mid - 1;
      steps.push({
        index: mid,
        low,
        high,
        visited: [...visited],
        found: false,
        foundIndex: -1,
        log: `${sorted[mid]} > ${target}. Shrinking boundaries: new high = ${high}`
      });
    }
  }

  steps.push({
    index: -1,
    low,
    high,
    visited: [...visited],
    found: false,
    foundIndex: -1,
    log: `Search space exhausted. Target ${target} not found in array.`
  });

  return steps;
};

// 3. Jump Search
export const generateJumpSearchSteps = (arr: number[], target: number): SearchStep[] => {
  const steps: SearchStep[] = [];
  const visited: number[] = [];
  const sorted = [...arr].sort((a, b) => a - b);
  const n = sorted.length;
  const step = Math.floor(Math.sqrt(n));

  steps.push({
    index: -1,
    low: 0,
    high: n - 1,
    visited: [],
    found: false,
    foundIndex: -1,
    log: `Starting Jump Search on sorted array with block size = √N = ${step}`
  });

  let prev = 0;
  let curr = step;

  // Finding the block where element is present
  while (curr < n && sorted[Math.min(curr, n) - 1] < target) {
    visited.push(curr - 1);
    steps.push({
      index: curr - 1,
      low: prev,
      high: Math.min(curr, n) - 1,
      visited: [...visited],
      found: false,
      foundIndex: -1,
      log: `Block boundary value at index ${curr-1} (${sorted[curr-1]}) < target. Jumping to next block.`
    });
    prev = curr;
    curr += step;
  }

  steps.push({
    index: -1,
    low: prev,
    high: Math.min(curr, n) - 1,
    visited: [...visited],
    found: false,
    foundIndex: -1,
    log: `Target must lie between index ${prev} and index ${Math.min(curr, n) - 1}. Initiating linear scan.`
  });

  // Linear scan in the block
  for (let i = prev; i < Math.min(curr, n); i++) {
    visited.push(i);
    steps.push({
      index: i,
      low: prev,
      high: Math.min(curr, n) - 1,
      visited: [...visited],
      found: false,
      foundIndex: -1,
      log: `Linear scanning inside block at index ${i} (value: ${sorted[i]})`
    });

    if (sorted[i] === target) {
      steps.push({
        index: i,
        low: prev,
        high: Math.min(curr, n) - 1,
        visited: [...visited],
        found: true,
        foundIndex: i,
        log: `Target ${target} found at index ${i} during linear scan!`
      });
      return steps;
    }
  }

  steps.push({
    index: -1,
    low: prev,
    high: Math.min(curr, n) - 1,
    visited: [...visited],
    found: false,
    foundIndex: -1,
    log: `Linear scan finished. Target not found.`
  });

  return steps;
};
export const generateInterpolationSearchSteps = (arr: number[], target: number): SearchStep[] => {
  // Mock interpolation search fallback (acts like binary search)
  return generateBinarySearchSteps(arr, target);
};
export const generateExponentialSearchSteps = (arr: number[], target: number): SearchStep[] => {
  // Mock exponential search fallback (acts like binary search)
  return generateBinarySearchSteps(arr, target);
};
export const getSortedSearchArray = (arr: number[]): number[] => {
  return [...arr].sort((a, b) => a - b);
};
