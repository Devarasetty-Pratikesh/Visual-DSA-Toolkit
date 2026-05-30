export interface SortStep {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  comparisons: number;
  swaps: number;
  log: string;
}

// 1. Bubble Sort Generator
export const generateBubbleSortSteps = (input: number[]): SortStep[] => {
  const steps: SortStep[] = [];
  const arr = [...input];
  const n = arr.length;
  let comps = 0;
  let swaps = 0;
  const sorted: number[] = [];

  // Initial step
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    comparisons: 0,
    swaps: 0,
    log: 'Initial array generated.'
  });

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      comps++;
      steps.push({
        array: [...arr],
        comparing: [j, j + 1],
        swapping: [],
        sorted: [...sorted],
        comparisons: comps,
        swaps: swaps,
        log: `Comparing index ${j} (${arr[j]}) and index ${j+1} (${arr[j+1]})`
      });

      if (arr[j] > arr[j + 1]) {
        swaps++;
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;

        steps.push({
          array: [...arr],
          comparing: [],
          swapping: [j, j + 1],
          sorted: [...sorted],
          comparisons: comps,
          swaps: swaps,
          log: `Swapped index ${j} and ${j+1} since ${arr[j+1]} > ${arr[j]}`
        });
      }
    }
    sorted.unshift(n - i - 1);
    if (!swapped) break;
  }

  // All remaining are sorted
  const finalSorted = Array.from({ length: n }, (_, i) => i);
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: finalSorted,
    comparisons: comps,
    swaps: swaps,
    log: 'Bubble Sort complete! Array fully sorted.'
  });

  return steps;
};

// 2. Selection Sort Generator
export const generateSelectionSortSteps = (input: number[]): SortStep[] => {
  const steps: SortStep[] = [];
  const arr = [...input];
  const n = arr.length;
  let comps = 0;
  let swaps = 0;
  const sorted: number[] = [];

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    comparisons: 0,
    swaps: 0,
    log: 'Initial array generated.'
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    steps.push({
      array: [...arr],
      comparing: [i],
      swapping: [],
      sorted: [...sorted],
      comparisons: comps,
      swaps: swaps,
      log: `Setting initial minimum index to index ${i} (value: ${arr[i]})`
    });

    for (let j = i + 1; j < n; j++) {
      comps++;
      steps.push({
        array: [...arr],
        comparing: [j, minIdx],
        swapping: [],
        sorted: [...sorted],
        comparisons: comps,
        swaps: swaps,
        log: `Comparing index ${j} (${arr[j]}) with current minimum at index ${minIdx} (${arr[minIdx]})`
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push({
          array: [...arr],
          comparing: [minIdx],
          swapping: [],
          sorted: [...sorted],
          comparisons: comps,
          swaps: swaps,
          log: `New minimum value found at index ${minIdx} (${arr[minIdx]})`
        });
      }
    }

    if (minIdx !== i) {
      swaps++;
      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;

      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [i, minIdx],
        sorted: [...sorted],
        comparisons: comps,
        swaps: swaps,
        log: `Swapping index ${i} (${temp}) with index ${minIdx} (${arr[i]})`
      });
    }
    sorted.push(i);
  }

  const finalSorted = Array.from({ length: n }, (_, i) => i);
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: finalSorted,
    comparisons: comps,
    swaps: swaps,
    log: 'Selection Sort complete!'
  });

  return steps;
};

// 3. Insertion Sort Generator
export const generateInsertionSortSteps = (input: number[]): SortStep[] => {
  const steps: SortStep[] = [];
  const arr = [...input];
  const n = arr.length;
  let comps = 0;
  let swaps = 0;

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    comparisons: 0,
    swaps: 0,
    log: 'Initial array generated.'
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    
    steps.push({
      array: [...arr],
      comparing: [i],
      swapping: [],
      sorted: Array.from({ length: i }, (_, k) => k),
      comparisons: comps,
      swaps: swaps,
      log: `Holding key value ${key} (index ${i}) for insertion`
    });

    while (j >= 0) {
      comps++;
      steps.push({
        array: [...arr],
        comparing: [j],
        swapping: [],
        sorted: Array.from({ length: i }, (_, k) => k),
        comparisons: comps,
        swaps: swaps,
        log: `Comparing index ${j} (${arr[j]}) with key (${key})`
      });

      if (arr[j] > key) {
        swaps++;
        arr[j + 1] = arr[j];
        j = j - 1;
        steps.push({
          array: [...arr],
          comparing: [],
          swapping: [j + 1, j + 2],
          sorted: Array.from({ length: i }, (_, k) => k),
          comparisons: comps,
          swaps: swaps,
          log: `Shifted index ${j+1} forward since it is larger than key`
        });
      } else {
        break;
      }
    }
    arr[j + 1] = key;
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [j + 1],
      sorted: Array.from({ length: i + 1 }, (_, k) => k),
      comparisons: comps,
      swaps: swaps,
      log: `Inserted key value ${key} into position ${j+1}`
    });
  }

  const finalSorted = Array.from({ length: n }, (_, i) => i);
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: finalSorted,
    comparisons: comps,
    swaps: swaps,
    log: 'Insertion Sort complete!'
  });

  return steps;
};

// 4. Merge Sort Generator (Construct recursive animation steps)
export const generateMergeSortSteps = (input: number[]): SortStep[] => {
  const steps: SortStep[] = [];
  const arr = [...input];
  let comps = 0;
  let swaps = 0;

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    comparisons: 0,
    swaps: 0,
    log: 'Initial array generated.'
  });

  const merge = (low: number, mid: number, high: number) => {
    const temp: number[] = [];
    let i = low;
    let j = mid + 1;

    while (i <= mid && j <= high) {
      comps++;
      steps.push({
        array: [...arr],
        comparing: [i, j],
        swapping: [],
        sorted: [],
        comparisons: comps,
        swaps: swaps,
        log: `Comparing left sub-array index ${i} (${arr[i]}) with right sub-array index ${j} (${arr[j]})`
      });

      if (arr[i] <= arr[j]) {
        temp.push(arr[i++]);
      } else {
        temp.push(arr[j++]);
      }
    }

    while (i <= mid) {
      temp.push(arr[i++]);
    }
    while (j <= high) {
      temp.push(arr[j++]);
    }

    for (let k = 0; k < temp.length; k++) {
      swaps++;
      arr[low + k] = temp[k];
      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [low + k],
        sorted: [],
        comparisons: comps,
        swaps: swaps,
        log: `Merging back element ${temp[k]} into index ${low + k}`
      });
    }
  };

  const mergeSort = (low: number, high: number) => {
    if (low >= high) return;
    const mid = Math.floor((low + high) / 2);
    mergeSort(low, mid);
    mergeSort(mid + 1, high);
    merge(low, mid, high);
  };

  mergeSort(0, arr.length - 1);

  const finalSorted = Array.from({ length: arr.length }, (_, idx) => idx);
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: finalSorted,
    comparisons: comps,
    swaps: swaps,
    log: 'Merge Sort complete!'
  });

  return steps;
};

// 5. Quick Sort Generator (Lomuto Partitioning)
export const generateQuickSortSteps = (input: number[]): SortStep[] => {
  const steps: SortStep[] = [];
  const arr = [...input];
  let comps = 0;
  let swaps = 0;

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    comparisons: 0,
    swaps: 0,
    log: 'Initial array generated.'
  });

  const partition = (low: number, high: number): number => {
    const pivot = arr[high];
    steps.push({
      array: [...arr],
      comparing: [high],
      swapping: [],
      sorted: [],
      comparisons: comps,
      swaps: swaps,
      log: `Selected pivot value ${pivot} at index ${high}`
    });

    let i = low - 1;
    for (let j = low; j < high; j++) {
      comps++;
      steps.push({
        array: [...arr],
        comparing: [j, high],
        swapping: [],
        sorted: [],
        comparisons: comps,
        swaps: swaps,
        log: `Comparing index ${j} (${arr[j]}) with pivot (${pivot})`
      });

      if (arr[j] < pivot) {
        i++;
        swaps++;
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;

        steps.push({
          array: [...arr],
          comparing: [],
          swapping: [i, j],
          sorted: [],
          comparisons: comps,
          swaps: swaps,
          log: `Swapped index ${i} and ${j} because ${arr[i]} < pivot`
        });
      }
    }

    swaps++;
    const temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;

    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [i + 1, high],
      sorted: [],
      comparisons: comps,
      swaps: swaps,
      log: `Placed pivot at final position index ${i + 1}`
    });

    return i + 1;
  };

  const quickSort = (low: number, high: number) => {
    if (low < high) {
      const p = partition(low, high);
      quickSort(low, p - 1);
      quickSort(p + 1, high);
    }
  };

  quickSort(0, arr.length - 1);

  const finalSorted = Array.from({ length: arr.length }, (_, idx) => idx);
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: finalSorted,
    comparisons: comps,
    swaps: swaps,
    log: 'Quick Sort complete!'
  });

  return steps;
};

// 6. Heap Sort Generator
export const generateHeapSortSteps = (input: number[]): SortStep[] => {
  const steps: SortStep[] = [];
  const arr = [...input];
  const n = arr.length;
  let comps = 0;
  let swaps = 0;

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    comparisons: 0,
    swaps: 0,
    log: 'Initial array generated.'
  });

  const heapify = (size: number, i: number) => {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

    if (l < size) {
      comps++;
      if (arr[l] > arr[largest]) {
        largest = l;
      }
    }

    if (r < size) {
      comps++;
      if (arr[r] > arr[largest]) {
        largest = r;
      }
    }

    if (largest !== i) {
      swaps++;
      const swapVal = arr[i];
      arr[i] = arr[largest];
      arr[largest] = swapVal;

      steps.push({
        array: [...arr],
        comparing: [i, largest],
        swapping: [i, largest],
        sorted: [],
        comparisons: comps,
        swaps: swaps,
        log: `Heapifying: swapped index ${i} (${swapVal}) with index ${largest} (${arr[i]})`
      });

      heapify(size, largest);
    }
  };

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  // Extract from heap
  const sorted: number[] = [];
  for (let i = n - 1; i > 0; i--) {
    swaps++;
    const temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;
    sorted.unshift(i);

    steps.push({
      array: [...arr],
      comparing: [0, i],
      swapping: [0, i],
      sorted: [...sorted],
      comparisons: comps,
      swaps: swaps,
      log: `Extracted heap root ${temp} and swapped with index ${i}`
    });

    heapify(i, 0);
  }

  const finalSorted = Array.from({ length: n }, (_, idx) => idx);
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: finalSorted,
    comparisons: comps,
    swaps: swaps,
    log: 'Heap Sort complete!'
  });

  return steps;
};

// 7. Counting Sort Generator
export const generateCountingSortSteps = (input: number[]): SortStep[] => {
  const steps: SortStep[] = [];
  const arr = [...input];
  const n = arr.length;
  
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    comparisons: 0,
    swaps: 0,
    log: 'Starting Counting Sort.'
  });

  // Find max value
  const max = Math.max(...arr);
  const count = Array(max + 1).fill(0);
  
  // Count elements
  for (let i = 0; i < n; i++) {
    count[arr[i]]++;
    steps.push({
      array: [...arr],
      comparing: [i],
      swapping: [],
      sorted: [],
      comparisons: 0,
      swaps: 0,
      log: `Counted occurrence of value ${arr[i]}`
    });
  }

  // Reconstruct sorted array
  let outIdx = 0;
  for (let val = 0; val <= max; val++) {
    while (count[val] > 0) {
      arr[outIdx] = val;
      count[val]--;
      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [outIdx],
        sorted: Array.from({ length: outIdx + 1 }, (_, k) => k),
        comparisons: 0,
        swaps: 1,
        log: `Re-placed value ${val} into sorted output index ${outIdx}`
      });
      outIdx++;
    }
  }

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, idx) => idx),
    comparisons: 0,
    swaps: 0,
    log: 'Counting Sort completed successfully.'
  });

  return steps;
};

// 8. Radix Sort Generator (Least Significant Digit)
export const generateRadixSortSteps = (input: number[]): SortStep[] => {
  const steps: SortStep[] = [];
  const arr = [...input];
  const n = arr.length;

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    comparisons: 0,
    swaps: 0,
    log: 'Starting Radix Sort.'
  });

  const max = Math.max(...arr);

  const countSortForDigit = (exp: number) => {
    const output = Array(n).fill(0);
    const count = Array(10).fill(0);

    for (let i = 0; i < n; i++) {
      const idx = Math.floor(arr[i] / exp) % 10;
      count[idx]++;
    }

    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    for (let i = n - 1; i >= 0; i--) {
      const idx = Math.floor(arr[i] / exp) % 10;
      output[count[idx] - 1] = arr[i];
      count[idx]--;
    }

    for (let i = 0; i < n; i++) {
      arr[i] = output[i];
      steps.push({
        array: [...arr],
        comparing: [i],
        swapping: [i],
        sorted: [],
        comparisons: 0,
        swaps: 0,
        log: `Sorting digits by place value ${exp}: Placing ${arr[i]} at index ${i}`
      });
    }
  };

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countSortForDigit(exp);
  }

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, idx) => idx),
    comparisons: 0,
    swaps: 0,
    log: 'Radix Sort complete!'
  });

  return steps;
};
