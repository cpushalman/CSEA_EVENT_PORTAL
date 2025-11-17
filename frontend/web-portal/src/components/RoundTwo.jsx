import React, { useState, useEffect } from "react";
import JoyceWall from "./JoyceWall";
import { wordList } from "./wordList";

const RoundTwo = ({
  loggedInYear,
  fragments: parentFragments = [],
  setFragments,
  onComplete,
}) => {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [code, setCode] = useState("");
  const [testResults, setTestResults] = useState({
    visible: [],
    hiddenPassed: 0,
    hiddenDetails: [],
    ran: false,
    details: [],
  });
  const [runOutput, setRunOutput] = useState("");
  const [compilerError, setCompilerError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [fragments, setFragmentsLocal] = useState(parentFragments);
  const [error, setError] = useState("");
  const [puzzleCompleted, setPuzzleCompleted] = useState(new Set());
  const [showJoyceWall, setShowJoyceWall] = useState(false);
  const [triggerWord, setTriggerWord] = useState("");

  // Sync with parent fragments
  useEffect(() => {
    if (parentFragments.length > 0 && fragments.length === 0) {
      setFragmentsLocal(parentFragments);
    }
  }, [parentFragments, fragments.length]);

  const language = loggedInYear === "1st" ? "Python" : "C";

  // Python puzzles for 1st years
  // ---------- PUZZLE DATA (with testcases) ----------

  const pythonPuzzles = [
  // --------------------------------------------------------
  // PUZZLE 1 — COUNT VOWELS
  // --------------------------------------------------------
  {
    id: 1,
    language: "Python",
    code: String.raw`def count_vowels(text)
    vowels = "aeiouAEIOU"
    count = 0
    vowel_list = []

    for ch in txt:       
    if ch in vowels     
        count = count + 1
        vowel_list.append(ch)

    result = 
        "input_string": text,     
        "total_vowels": count,
        "vowels_found": vowel_list
    }

    return results      

user_text = input("Enter a string: ")
output = count_vowel(user_text)   
print("Input String :", output["inputstring"])  
print("Vowel Count  :", output["total_vowels"])
print("Vowels Found :", output["vowel_found"])`,
    
    fixedCode: String.raw`def count_vowels(text):
    vowels = "aeiouAEIOU"
    count = 0
    vowel_list = []

    for ch in text:
        if ch in vowels:
            count += 1
            vowel_list.append(ch)

    result = {
        "input_string": text,
        "total_vowels": count,
        "vowels_found": vowel_list
    }
    return result

user_text = input()
output = count_vowels(user_text)
print("Vowel Count =", output["total_vowels"])`,

    hint: "Fix function name, indentation, variables, and dictionary syntax",
    fragment: "FRAGMENT1",
    testcases: {
      visible: [
        { input: "apple", expectedOutput: "Vowel Count = 2" },
        { input: "HELLO", expectedOutput: "Vowel Count = 2" }
      ],
      hidden: [
        { input: "python", expectedOutput: "Vowel Count = 1" },
        { input: "computer", expectedOutput: "Vowel Count = 3" },
        { input: "STRANGER THINGS", expectedOutput: "Vowel Count = 3" }
      ]
    }
  },

  // --------------------------------------------------------
  // PUZZLE 2 — REVERSE STRING
  // --------------------------------------------------------
  {
    id: 2,
    language: "Python",
    code: String.raw`def reverse_string(text)            
    reversed_text = ''

    idx = len(txt) - 1           
    while idx > 0:                 
        reversed_text += text[idx]
        idx -= 1

    result =                      
        "original": text,
        "reversed": reversed_text
    }                              
    return reslts                  

user_input = input("Enter a string: ")
out = reverseStr(user_input)   
print("Original :", out["orig"])  
print("Reversed :", out["reversed"])`,

    fixedCode: String.raw`def reverse_string(text):
    reversed_text = ""
    index = len(text) - 1
    while index >= 0:
        reversed_text += text[index]
        index -= 1

    result = {
        "original": text,
        "reversed": reversed_text
    }
    return result

user_text = input()
output = reverse_string(user_text)
print("Reversed :", output["reversed"])`,

    hint: "Fix variable names, index range, missing braces, and return",
    fragment: "FRAGMENT2",
    testcases: {
      visible: [
        { input: "hello", expectedOutput: "olleh" },
        { input: "A", expectedOutput: "A" }
      ],
      hidden: [
        { input: "12345", expectedOutput: "54321" },
        { input: "Python Program", expectedOutput: "margorP nohtyP" },
        { input: "racecar", expectedOutput: "racecar" }
      ]
    }
  },

  // --------------------------------------------------------
  // PUZZLE 3 — DIGIT SUM
  // --------------------------------------------------------
  {
    id: 3,
    language: "Python",
    code: String.raw`def digit_sum(num)                
    total = 0
    temp = n                       

    while temp >= 0:               
        digit = temp % 10
        total =+ digit             
        temp = temp / 10           

    result =                   
        "number": num,
        "sum_of_digits": total

    return res                    

number = int(input("Enter a number: "))
output = digit_sum(number)
print("Number:", output["number"])
print("Digit Sum:", output["sum_of_digits"])`,

    fixedCode: String.raw`def digit_sum(num):
    total = 0
    temp = num

    while temp > 0:
        digit = temp % 10
        total += digit
        temp //= 10

    result = {
        "number": num,
        "sum_of_digits": total
    }
    return result

number = int(input())
output = digit_sum(number)
print("Sum =", output["sum_of_digits"])`,

    hint: "Fix temp variable, loop condition, += operator, dict syntax",
    fragment: "FRAGMENT3",
    testcases: {
      visible: [
        { input: "123", expectedOutput: "Sum = 6" },
        { input: "789", expectedOutput: "Sum = 24" }
      ],
      hidden: [
        { input: "5", expectedOutput: "Sum = 5" },
        { input: "1005", expectedOutput: "Sum = 6" },
        { input: "2024", expectedOutput: "Sum = 8" }
      ]
    }
  },

  // --------------------------------------------------------
  // PUZZLE 4 — COUNT WORDS
  // --------------------------------------------------------
  {
    id: 4,
    language: "Python",
    code: String.raw`def count_words(sentence)           
    words = sent.split()            
    total = len(word)                
    result =                        
        "sentence": sentence,
        "word_count": total,
        "words": words
    }                              
    return results                   

s = input("Enter a sentence: ")
output = countwords(s)           
print("Sentence :", output['sentence'])
print("Word Count:", output['word_count'])
print("Words:", output['word'])`,

    fixedCode: String.raw`def count_words(sentence):
    words = sentence.split()
    total = len(words)

    result = {
        "sentence": sentence,
        "word_count": total,
        "words": words
    }
    return result

sen = input()
output = count_words(sen)
print("Word Count:", output["word_count"])
print("Words:", output["words"])`,

    hint: "Fix wrong variable names, dict syntax, function name",
    fragment: "FRAGMENT4",
    testcases: {
      visible: [
        { input: "hello world", expectedOutput: "2" },
        { input: "Python is amazing", expectedOutput: "3" }
      ],
      hidden: [
        { input: "I", expectedOutput: "1" },
        { input: "ChatGPT helps me learn programming", expectedOutput: "5" },
        { input: "Welcome to PSG Tech", expectedOutput: "4" }
      ]
    }
  },

  // --------------------------------------------------------
  // PUZZLE 5 — FIND LARGEST NUMBER
  // --------------------------------------------------------
  {
    id: 5,
    language: "Python",
    code: String.raw`def find_largest(numbers)            
    largest = numbers                

    for n in number:                 
        if n < largest:              
            largest = n

    result =                        
        "numbers": numbers,
        "largest": largest
    }                                

    return lasts                     

text = input("Enter numbers: ")
num_list = [int(x) for x in text.split()]
output = find_largest(num_list)
print("Numbers:", output["numbers"])
print("Largest:", output["largest"])`,

    fixedCode: String.raw`def find_largest(numbers):
    largest = numbers[0]
    for num in numbers:
        if num > largest:
            largest = num

    result = {
        "numbers": numbers,
        "largest": largest
    }
    return result

text = input()
num_list = [int(x) for x in text.split()]
output = find_largest(num_list)
print("Largest=", output["largest"])`,

    hint: "Fix list indexing, loop variable, comparison direction",
    fragment: "FRAGMENT5",
    testcases: {
      visible: [
        { input: "5 10 2 8", expectedOutput: "10" },
        { input: "-5 -1 -7 -3", expectedOutput: "-1" }
      ],
      hidden: [
        { input: "100", expectedOutput: "100" },
        { input: "15 22 1 22 9", expectedOutput: "22" },
        { input: "3 3 3 3", expectedOutput: "3" }
      ]
    }
  }
];

  const cPuzzles = [
    // --------------------------------------------------------
    // PUZZLE 1 — RECURSIVE BINARY SEARCH
    // --------------------------------------------------------
    {
      id: 1,
      language: "C",
      code: String.raw`#include <stdio.h>
#include <stdlib.h> 

int recursiveBS(int arr[], int low, int high, int target) {
    if (low > high) {
        return 0; 
    }
    int mid = (low + high) / 2;

    if (arr[mid] == target) {
        return mid;
    }

    if (arr[mid] < target) {
        return recursiveBS(arr, mid + 1, high, target);
    } else {
        return recursiveBS(arr, low, mid, target);
    }
}

int main() {
    int n, target;
    scanf("%d", &n);
    int *arr = malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }
    scanf("%d", &target); 
    int result = recursiveBS(arr, 0, n - 1, target);
    printf("%d\n", result);
    free(arr);
    return 0;
}`,
      fixedCode: String.raw`#include <stdio.h>
#include <stdlib.h> 

int recursiveBS(int arr[], int low, int high, int target) {
    if (low > high) {
        return -1;
    }
    int mid = low + (high - low) / 2;

    if (arr[mid] == target) return mid;

    if (arr[mid] < target)
        return recursiveBS(arr, mid + 1, high, target);
    else
        return recursiveBS(arr, low, mid - 1, target);
}

int main() {
    int n, target;
    scanf("%d", &n);
    int *arr = malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
    scanf("%d", &target);
    printf("%d\n", recursiveBS(arr, 0, n - 1, target));
    free(arr);
    return 0;
}`,
      hint: "Base case & mid recursion step are incorrect.",
      fragment: "FRAGMENT1",
      testcases: {
        visible: [
          { input: "5\n10 20 30 40 50\n30\n", expectedOutput: "2" },
          { input: "5\n10 20 30 40 50\n10\n", expectedOutput: "0" },
        ],
        hidden: [
          { input: "5\n10 20 30 40 50\n99\n", expectedOutput: "-1" },
          { input: "7\n2 8 12 15 19 25 30\n19\n", expectedOutput: "4" },
          { input: "7\n2 8 12 15 19 25 30\n5\n", expectedOutput: "-1" },
        ],
      },
    },

    // --------------------------------------------------------
    // PUZZLE 2 — SELECTION SORT
    // --------------------------------------------------------
    {
      id: 2,
      language: "C",
      code: String.raw`#include <stdio.h>
#include <stdlib.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
}

void selectionSort(int arr[], int n) {
    int i, j, min_idx;
    for (i = 0; i < n - 1; i++) {
        min_idx = i;
        for (j = i + 1; j <= n; j++) { 
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }
        swap(&arr[min_idx], &arr[i]);
    }
}

int main() {
    int n;
    scanf("%d", &n);
    int *arr = malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }
    selectionSort(arr, n);
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\n");
    free(arr);
    return 0;
}`,
      fixedCode: String.raw`#include <stdio.h>
#include <stdlib.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIndex = i;
        for (int j = i + 1; j < n; j++)
            if (arr[j] < arr[minIndex])
                minIndex = j;
        swap(&arr[minIndex], &arr[i]);
    }
}

int main() {
    int n;
    scanf("%d", &n);
    int *arr = malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
    selectionSort(arr, n);
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\n");
    free(arr);
    return 0;
}`,
      hint: "swap() incomplete & j loop goes out of bounds.",
      fragment: "FRAGMENT2",
      testcases: {
        visible: [
          { input: "5\n5 4 3 2 1\n", expectedOutput: "1 2 3 4 5 " },
          {
            input: "6\n64 25 12 22 11 90\n",
            expectedOutput: "11 12 22 25 64 90 ",
          },
        ],
        hidden: [
          { input: "4\n1 2 3 4\n", expectedOutput: "1 2 3 4 " },
          { input: "5\n4 1 4 2 1\n", expectedOutput: "1 1 2 4 4 " },
          { input: "1\n42\n", expectedOutput: "42 " },
        ],
      },
    },

    // --------------------------------------------------------
    // PUZZLE 3 — STACK PUSH/POP
    // --------------------------------------------------------
    {
      id: 3,
      language: "C",
      code: String.raw`#include <stdio.h>
#define MAX_SIZE 5

int stack_arr[MAX_SIZE];
int top = 0; 

void push(int val) {
    if (top > MAX_SIZE) {
        return;
    }
    stack_arr[top] = val;
    top++;
}

int pop() {
    if (top == -1) { 
        return -999; 
    }
    return stack_arr[top--];
}

int main() {
    int num_push, num_pop, val;
    scanf("%d", &num_push);
    for (int i = 0; i < num_push; i++) {
        scanf("%d", &val);
        push(val);
    }
    scanf("%d", &num_pop);
    for (int i = 0; i < num_pop; i++) {
        printf("%d ", pop());
    }
    return 0;
}`,
      fixedCode: String.raw`#include <stdio.h>
#define MAX_SIZE 5

int stack_arr[MAX_SIZE];
int top = 0; 

void push(int val) {
    if (top >= MAX_SIZE) return;
    stack_arr[top++] = val;
}

int pop() {
    if (top == 0) return -999;
    return stack_arr[--top];
}

int main() {
    int num_push, num_pop, val;
    scanf("%d", &num_push);
    for (int i = 0; i < num_push; i++) {
        scanf("%d", &val);
        push(val);
    }
    scanf("%d", &num_pop);
    for (int i = 0; i < num_pop; i++) {
        printf("%d ", pop());
    }
    return 0;
}`,
      hint: "top condition wrong in push; pop checks wrong empty state.",
      fragment: "FRAGMENT3",
      testcases: {
        visible: [
          { input: "3\n10 20 30\n2\n", expectedOutput: "30 20 " },
          { input: "1\n100\n1\n", expectedOutput: "100 " },
        ],
        hidden: [
          { input: "2\n10 20\n3\n", expectedOutput: "20 10 -999 " },
          { input: "6\n1 2 3 4 5 6\n2\n", expectedOutput: "5 4 " },
          { input: "0\n\n1\n", expectedOutput: "-999 " },
        ],
      },
    },

    // --------------------------------------------------------
    // PUZZLE 4 — FIND MIDDLE IN LINKED LIST
    // --------------------------------------------------------
    {
      id: 4,
      language: "C",
      code: String.raw`#include <stdio.h>
#include <stdlib.h>

struct Node { int data; struct Node *next; };

struct Node* insertAtEnd(struct Node* head, int data) {
    struct Node *newNode = malloc(sizeof(struct Node));
    newNode->data = data; newNode->next = NULL;
    if (head == NULL) return newNode;
    struct Node *temp = head;
    while (temp->next != NULL) temp = temp->next;
    temp->next = newNode;
    return head;
}

int findMiddle(struct Node *head) {
    struct Node *slow = head;
    struct Node *fast = head->next; 

    while (fast != NULL) { 
        slow++; 
        fast = fast->next->next;
    }
    return slow->data;
}

int main() {
    struct Node *head = NULL;
    int n, val;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &val);
        head = insertAtEnd(head, val);
    }
    
    if (n == 0) {
        printf("-1\n");
    } else {
        int middleVal = findMiddle(head);
        printf("%d\n", middleVal);
    }
    return 0;
}`,
      fixedCode: String.raw`#include <stdio.h>
#include <stdlib.h>

struct Node { int data; struct Node *next; };

struct Node* insertAtEnd(struct Node* head, int data) {
    struct Node *newNode = malloc(sizeof(struct Node));
    newNode->data = data; newNode->next = NULL;
    if (!head) return newNode;
    struct Node *temp = head;
    while (temp->next) temp = temp->next;
    temp->next = newNode;
    return head;
}

int findMiddle(struct Node *head) {
    struct Node *slow = head;
    struct Node *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow->data;
}

int main() {
    struct Node *head = NULL;
    int n, val;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &val);
        head = insertAtEnd(head, val);
    }
    if (n == 0) printf("-1\n");
    else printf("%d\n", findMiddle(head));
    return 0;
}`,
      hint: "Incorrect pointer movement; slow++ is invalid.",
      fragment: "FRAGMENT4",
      testcases: {
        visible: [
          { input: "5\n1 2 3 4 5\n", expectedOutput: "3" },
          { input: "4\n1 2 3 4\n", expectedOutput: "3" },
        ],
        hidden: [
          { input: "1\n10\n", expectedOutput: "10" },
          { input: "0\n", expectedOutput: "-1" },
          { input: "2\n10 20\n", expectedOutput: "20" },
        ],
      },
    },

    // --------------------------------------------------------
    // PUZZLE 5 — REVERSE LINKED LIST
    // --------------------------------------------------------
    {
      id: 5,
      language: "C",
      code: String.raw`#include <stdio.h>
#include <stdlib.h>

struct Node { int data; struct Node *next; };

struct Node* insertAtEnd(struct Node* head, int data) {
    struct Node *newNode = malloc(sizeof(struct Node));
    newNode->data = data; newNode->next = NULL;
    if (head == NULL) return newNode;
    struct Node *temp = head;
    while (temp->next != NULL) temp = temp->next;
    temp->next = newNode;
    return head;
}
void printList(struct Node *head) {
    while (head != NULL) {
        printf("%d -> ", head->data);
        head = head->next;
    }
    printf("NULL\n");
}

struct Node* reverseList(struct Node *head) {
    struct Node *prev = NULL;
    struct Node *current = head;
    struct Node *next = NULL;

    while (current != NULL) { 
        next = current->next;   
        current->next = prev;   
        
        prev = current;
        current = next;
    }
    return prev;
}

int main() {
    struct Node *head = NULL;
    int n, val;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &val);
        head = insertAtEnd(head, val);
    }
    head = reverseList(head);
    printList(head);
    return 0;
}`,
      fixedCode: String.raw`#include <stdio.h>
#include <stdlib.h>

struct Node { int data; struct Node *next; };

struct Node* insertAtEnd(struct Node* head, int data) {
    struct Node *newNode = malloc(sizeof(struct Node));
    newNode->data = data; newNode->next = NULL;
    if (!head) return newNode;
    struct Node *temp = head;
    while (temp->next) temp = temp->next;
    temp->next = newNode;
    return head;
}
void printList(struct Node *head) {
    while (head) {
        printf("%d -> ", head->data);
        head = head->next;
    }
    printf("NULL\n");
}

struct Node* reverseList(struct Node *head) {
    struct Node *prev = NULL, *curr = head, *next;
    while (curr) {
        next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}

int main() {
    struct Node *head = NULL;
    int n, val;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &val);
        head = insertAtEnd(head, val);
    }
    head = reverseList(head);
    printList(head);
    return 0;
}`,
      hint: "Reverse logic is correct but tests require exact format.",
      fragment: "FRAGMENT5",
      testcases: {
        visible: [
          { input: "3\n10 20 30\n", expectedOutput: "30 -> 20 -> 10 -> NULL" },
          {
            input: "5\n1 2 3 4 5\n",
            expectedOutput: "5 -> 4 -> 3 -> 2 -> 1 -> NULL",
          },
        ],
        hidden: [
          { input: "2\n10 20\n", expectedOutput: "20 -> 10 -> NULL" },
          { input: "1\n42\n", expectedOutput: "42 -> NULL" },
          { input: "0\n", expectedOutput: "NULL" },
        ],
      },
    },
  ];

  const puzzles = loggedInYear === "1st" ? pythonPuzzles : cPuzzles;
  const currentPuzzleData = puzzles[currentPuzzle];

  // Helpers to find next/prev incomplete puzzle indices
  const getNextIncompleteIndex = (start) => {
    for (let i = start; i < puzzles.length; i += 1) {
      if (!puzzleCompleted.has(i)) return i;
    }
    return -1;
  };

  const getPrevIncompleteIndex = (start) => {
    for (let i = start; i >= 0; i -= 1) {
      if (!puzzleCompleted.has(i)) return i;
    }
    return -1;
  };

  // Initialize code editor with the buggy code to debug in place
  useEffect(() => {
    setCode(currentPuzzleData.code || "");
  }, [currentPuzzle]);

  // No local runtimes; we use Piston API for real execution

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsRunning(true);
    setCompilerError("");
    setError("");
    setTestResults({
      visible: [],
      hiddenPassed: 0,
      hiddenDetails: [],
      ran: false,
      details: [],
    });

    const puzzle = currentPuzzleData;

    // Combine 2 visible + 3 hidden testcases
    const allTests = [...puzzle.testcases.visible, ...puzzle.testcases.hidden];

    const endpoint = loggedInYear === "1st" ? "/submit-python" : "/submit-c";

    try {
      const response = await fetch(`${import.meta.env.VITE_COMPILER}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code,
          testCases: allTests,
          submissionid: "sub_" + Date.now(),
        }),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        // Use the detailed compiler message if available
        const errorMessage =
          data.compilerMessage ||
          data.details ||
          data.message ||
          data.error ||
          "Execution error.";
        setCompilerError(errorMessage);
        setIsRunning(false);
        return;
      }

      const results = data.results || [];

      // First 2 are visible testcases, next 3 are hidden
      const visible = results.slice(0, 2);
      const hidden = results.slice(2);

      const visibleFormatted = visible.map((t, i) => ({
        name: `Testcase ${i + 1}`,
        expected: t.expectedOutput,
        actual: t.actualOutput,
        passed: t.passed,
        input: t.input,
      }));

      const hiddenFormatted = hidden.map((t, i) => ({
        name: `Hidden Testcase ${i + 1}`,
        passed: t.passed,
      }));

      setTestResults({
        visible: visible.map((v) => v.passed),
        hiddenPassed: hidden.filter((v) => v.passed).length,
        hiddenDetails: hiddenFormatted,
        details: visibleFormatted,
        ran: true,
      });

      // Check if all tests passed
      const allPassed = results.every((r) => r.passed);

      if (allPassed) {
        if (!fragments.includes(puzzle.fragment)) {
          const newFrags = [...fragments, puzzle.fragment];
          setFragmentsLocal(newFrags);
          if (setFragments) setFragments(newFrags);
        }

        setError("Correct! All tests passed. Fragment collected.");

        const newCompleted = new Set(puzzleCompleted);
        newCompleted.add(currentPuzzle);
        setPuzzleCompleted(newCompleted);

        // auto move forward after a short delay
        setTimeout(() => {
          const next = puzzles.findIndex((_, i) => !newCompleted.has(i));
          if (next !== -1) {
            setCurrentPuzzle(next);
            setError("");
            setCompilerError("");
            setTestResults({
              visible: [],
              hiddenPassed: 0,
              hiddenDetails: [],
              ran: false,
              details: [],
            });
          }
        }, 1500);
      } else {
        setError("Some tests failed. Fix and retry.");
      }
    } catch (err) {
      setCompilerError("Server error. Try again.");
    }

    setIsRunning(false);
  };

  const nextPuzzle = () => {
    // Find next uncompleted puzzle
    const nextIdx = getNextIncompleteIndex(currentPuzzle + 1);
    if (nextIdx !== -1) {
      setCurrentPuzzle(nextIdx);
      setCode("");
      setError("");
      setCompilerError("");
      setTestResults({
        visible: [],
        hiddenPassed: 0,
        hiddenDetails: [],
        ran: false,
        details: [],
      });
    }
  };

  const prevPuzzle = () => {
    // Find previous uncompleted puzzle
    const prevIdx = getPrevIncompleteIndex(currentPuzzle - 1);
    if (prevIdx !== -1) {
      setCurrentPuzzle(prevIdx);
      setCode("");
      setError("");
      setCompilerError("");
      setTestResults({
        visible: [],
        hiddenPassed: 0,
        hiddenDetails: [],
        ran: false,
        details: [],
      });
    }
  };

  // Check if there are uncompleted puzzles ahead
  const hasNextUncompleted = getNextIncompleteIndex(currentPuzzle + 1) !== -1;

  // Check if there are uncompleted puzzles behind
  const hasPrevUncompleted = getPrevIncompleteIndex(currentPuzzle - 1) !== -1;

  const allPuzzlesCompleted = puzzleCompleted.size === puzzles.length;

  // Trigger Joyce Wall when all puzzles are completed
  useEffect(() => {
    if (
      allPuzzlesCompleted &&
      !showJoyceWall &&
      puzzleCompleted.size === puzzles.length
    ) {
      // Small delay to ensure UI is ready
      setTimeout(() => {
        // Pick a random word and jumble it
        const word = wordList[Math.floor(Math.random() * wordList.length)];
        const jumbled = word
          .split("")
          .sort(() => Math.random() - 0.5)
          .join("");
        setTriggerWord(jumbled);
        setShowJoyceWall(true);
      }, 500);
    }
  }, [
    allPuzzlesCompleted,
    showJoyceWall,
    puzzleCompleted.size,
    puzzles.length,
  ]);

  // Ensure we start with the first uncompleted puzzle on mount
  useEffect(() => {
    const firstIncomplete = getNextIncompleteIndex(0);
    if (
      firstIncomplete !== -1 &&
      firstIncomplete !== currentPuzzle &&
      puzzleCompleted.size === 0
    ) {
      setCurrentPuzzle(firstIncomplete);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle Joyce Wall completion
  const handleJoyceWallComplete = () => {
    setShowJoyceWall(false);
    if (onComplete) {
      onComplete();
    }
  };

  // Show Joyce Wall if all puzzles completed
  if (showJoyceWall) {
    return (
      <JoyceWall
        triggerWord={triggerWord}
        onComplete={handleJoyceWallComplete}
        fragments={fragments}
        loggedInYear={loggedInYear}
      />
    );
  }

  return (
    <div
      className="round-two-fixed"
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        background: "#000",
        overflow: "hidden",
      }}
    >
      {/* Top bar - centered title and right challenge info */}
      <div
        style={{
          flex: "0 0 auto",
          padding: "0.9rem 1.25rem",
          borderBottom: "2px solid rgba(230,25,75,0.35)",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          position: "relative",
        }}
      >
        <div />
        <h2
          className="round-title"
          style={{ margin: 0, textAlign: "center", letterSpacing: "2px" }}
        >
          ROUND 2: THE GLITCH BETWEEN WORLDS
        </h2>
        <div
          style={{
            justifySelf: "end",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "rgba(255,255,255,0.8)",
          }}
        />
        {/* Top-left absolute navigation buttons */}
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 12,
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button
              onClick={prevPuzzle}
              disabled={!hasPrevUncompleted}
              className="nav-button-small"
            >
              ← PREV
            </button>
            <button
              onClick={nextPuzzle}
              disabled={!hasNextUncompleted}
              className="nav-button-small"
            >
              NEXT →
            </button>
          </div>
          <span
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "0.85rem",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            PUZZLE {currentPuzzle + 1} OF {puzzles.length} (
            {puzzleCompleted.size} COMPLETED)
          </span>
        </div>
      </div>

      {/* Two-column body */}
      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
          padding: "1rem",
        }}
      >
        {/* Left: Editor only */}
        <div
          className="editor-pane"
          style={{
            width: "50%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            gap: "0.75rem",
            overflow: "hidden",
            paddingRight: "0.5rem",
          }}
        >
          <div
            className="panel hover-glow"
            style={{
              flex: 1,
              padding: "0.85rem 1rem",
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            <div className="panel-title">Editor</div>
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                minHeight: 0,
                flex: 1,
              }}
            >
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`Fix the ${language} code here...`}
                className="code-input"
                style={{ flex: 1, resize: "none" }}
                required
              />
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={isRunning}
                >
                  {isRunning ? (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span className="spinner-red" /> Running...
                    </span>
                  ) : (
                    "Run & Submit"
                  )}
                </button>
              </div>
            </form>
            {error && (
              <div
                className={`message ${
                  error.includes("Correct") ? "success" : "error"
                }`}
              >
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Right: Tests */}
        <div
          className="tests-pane"
          style={{
            width: "50%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            gap: "0.75rem",
            overflow: "hidden",
            paddingLeft: "0.5rem",
            borderLeft: "2px solid rgba(230,25,75,0.25)",
          }}
        >
          {/* Compiler Message Section */}
          {compilerError && (
            <div
              className="panel compiler-message-panel"
              style={{ padding: "0.85rem 1rem", flex: "0 0 auto" }}
            >
              <h3
                className="panel-title"
                style={{ margin: 0, marginBottom: "0.75rem" }}
              >
                Compiler Message
              </h3>
              <div
                className="compiler-error-content"
                style={{
                  background: "rgba(20, 20, 20, 0.9)",
                  border: "1px solid rgba(230,25,75,0.3)",
                  borderRadius: "6px",
                  padding: "0.75rem",
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                  fontSize: "0.9rem",
                  color: "#ffffff",
                  maxHeight: "150px",
                  overflowY: "auto",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {compilerError}
              </div>
            </div>
          )}

          {/* Sample Testcase Section - Expanded to full height */}
          <div
            className="panel"
            style={{
              padding: "0.85rem 1rem",
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <h3
              className="panel-title"
              style={{ margin: 0, marginBottom: "0.75rem" }}
            >
              Sample Testcase
            </h3>
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {testResults.ran && testResults.details.length > 0 ? (
                testResults.details.map((testCase, idx) => (
                  <div
                    key={idx}
                    className="testcase-container"
                    style={{
                      background: "rgba(30, 30, 30, 0.6)",
                      border: "1px solid rgba(230,25,75,0.25)",
                      borderRadius: "8px",
                      padding: "0.75rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        padding: "0.5rem 0.75rem",
                        background: testCase.passed
                          ? "rgba(41, 204, 106, 0.15)"
                          : "rgba(255, 77, 79, 0.15)",
                        borderRadius: "6px",
                        color: "#ffffff",
                        fontWeight: 500,
                        fontSize: "0.95rem",
                      }}
                    >
                      {testCase.name} - {testCase.passed ? "Passed" : "Failed"}
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "0.75rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.35rem",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: "bold",
                            color: "#ffffff",
                            fontSize: "0.9rem",
                          }}
                        >
                          Expected Output
                        </div>
                        <div
                          className="output-panel"
                          style={{
                            background: "rgba(10, 10, 10, 0.8)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "6px",
                            padding: "0.6rem",
                            fontFamily:
                              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                            fontSize: "0.85rem",
                            color: "#ffffff",
                            minHeight: "60px",
                            maxHeight: "150px",
                            overflowY: "auto",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                        >
                          {testCase.expected || "(empty)"}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.35rem",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: "bold",
                            color: "#ffffff",
                            fontSize: "0.9rem",
                          }}
                        >
                          Output
                        </div>
                        <div
                          className="output-panel"
                          style={{
                            background: "rgba(10, 10, 10, 0.8)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "6px",
                            padding: "0.6rem",
                            fontFamily:
                              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                            fontSize: "0.85rem",
                            color: "#ffffff",
                            minHeight: "60px",
                            maxHeight: "150px",
                            overflowY: "auto",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                        >
                          {testCase.actual || "(empty)"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontStyle: "italic",
                    textAlign: "center",
                    padding: "2rem",
                  }}
                >
                  {testResults.ran
                    ? "No test cases to display"
                    : "Run your code to see test results"}
                </div>
              )}

              {/* Hidden Test Cases */}
              {testResults.ran &&
                testResults.hiddenDetails &&
                testResults.hiddenDetails.length > 0 && (
                  <div
                    style={{
                      marginTop: "0.5rem",
                      paddingTop: "0.75rem",
                      borderTop: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        color: "#ffffff",
                        marginBottom: "0.5rem",
                        fontSize: "0.95rem",
                      }}
                    >
                      Hidden Testcases
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                      }}
                    >
                      {testResults.hiddenDetails.map((hidden, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: "0.5rem 0.75rem",
                            background: hidden.passed
                              ? "rgba(41, 204, 106, 0.15)"
                              : "rgba(255, 77, 79, 0.15)",
                            borderRadius: "6px",
                            color: "#ffffff",
                            fontSize: "0.9rem",
                          }}
                        >
                          {hidden.name} - {hidden.passed ? "Passed" : "Failed"}
                        </div>
                      ))}
                    </div>
                    <div
                      style={{
                        marginTop: "0.75rem",
                        padding: "0.5rem",
                        background: "rgba(20, 20, 20, 0.5)",
                        borderRadius: "6px",
                        color: "rgba(255,255,255,0.8)",
                        fontSize: "0.85rem",
                      }}
                    >
                      Hidden tests passed: {testResults.hiddenPassed} /{" "}
                      {testResults.hiddenDetails.length}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundTwo;
