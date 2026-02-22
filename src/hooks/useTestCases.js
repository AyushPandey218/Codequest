import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

// Per-quest test cases. Each quest has visible + hidden tests.
// Input format must match what the Piston wrapper script feeds to solution().
const QUEST_TEST_CASES = {
  q1: [
    { id: 1, name: 'Basic sum', input: '[1, 2, 3, 4, 5]', expectedOutput: '15', isHidden: false },
    { id: 2, name: 'Negative numbers', input: '[-3, 0, 7]', expectedOutput: '4', isHidden: false },
    { id: 3, name: 'Empty array', input: '[]', expectedOutput: '0', isHidden: false },
    { id: 4, name: 'Single element', input: '[42]', expectedOutput: '42', isHidden: true },
    { id: 5, name: 'All negatives', input: '[-1, -2, -3]', expectedOutput: '-6', isHidden: true },
  ],
  q2: [
    { id: 1, name: 'Basic reverse', input: 'hello', expectedOutput: 'olleh', isHidden: false },
    { id: 2, name: 'Mixed case', input: 'CodeQuest', expectedOutput: 'tseuQedoC', isHidden: false },
    { id: 3, name: 'Empty string', input: '', expectedOutput: '', isHidden: false },
    { id: 4, name: 'Single char', input: 'a', expectedOutput: 'a', isHidden: true },
    { id: 5, name: 'Palindrome', input: 'racecar', expectedOutput: 'racecar', isHidden: true },
  ],
  q3: [
    { id: 1, name: 'n=5', input: '5', expectedOutput: '1 2 Fizz 4 Buzz', isHidden: false },
    { id: 2, name: 'n=15', input: '15', expectedOutput: '1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz', isHidden: false },
    { id: 3, name: 'n=1', input: '1', expectedOutput: '1', isHidden: false },
    { id: 4, name: 'n=3', input: '3', expectedOutput: '1 2 Fizz', isHidden: true },
    { id: 5, name: 'n=10', input: '10', expectedOutput: '1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz', isHidden: true },
  ],
  q4: [
    { id: 1, name: 'Is palindrome', input: 'racecar', expectedOutput: 'True', isHidden: false },
    { id: 2, name: 'Not palindrome', input: 'hello', expectedOutput: 'False', isHidden: false },
    { id: 3, name: 'Case insensitive', input: 'Madam', expectedOutput: 'True', isHidden: false },
    { id: 4, name: 'Single char', input: 'a', expectedOutput: 'True', isHidden: true },
    { id: 5, name: 'Mixed', input: 'AbcBa', expectedOutput: 'True', isHidden: true },
  ],
  q5: [
    { id: 1, name: 'Basic', input: 'hello', expectedOutput: '2', isHidden: false },
    { id: 2, name: 'All vowels', input: 'aeiou', expectedOutput: '5', isHidden: false },
    { id: 3, name: 'No vowels', input: 'gym', expectedOutput: '0', isHidden: false },
    { id: 4, name: 'Mixed case', input: 'CodeQuest', expectedOutput: '4', isHidden: true },
    { id: 5, name: 'Empty', input: '', expectedOutput: '0', isHidden: true },
  ],
  q6: [
    { id: 1, name: 'Basic', input: '[2,7,11,15] 9', expectedOutput: '[0, 1]', isHidden: false },
    { id: 2, name: 'Middle pair', input: '[3,2,4] 6', expectedOutput: '[1, 2]', isHidden: false },
    { id: 3, name: 'Duplicates', input: '[3,3] 6', expectedOutput: '[0, 1]', isHidden: false },
    { id: 4, name: 'Negative nums', input: '[-1,-2,-3,-4,-5] -8', expectedOutput: '[2, 4]', isHidden: true },
    { id: 5, name: 'Larger', input: '[1,4,5,7,9,10] 14', expectedOutput: '[3, 4]', isHidden: true },
  ],
  q7: [
    { id: 1, name: 'F(0)', input: '0', expectedOutput: '0', isHidden: false },
    { id: 2, name: 'F(1)', input: '1', expectedOutput: '1', isHidden: false },
    { id: 3, name: 'F(6)', input: '6', expectedOutput: '8', isHidden: false },
    { id: 4, name: 'F(10)', input: '10', expectedOutput: '55', isHidden: true },
    { id: 5, name: 'F(20)', input: '20', expectedOutput: '6765', isHidden: true },
  ],
  q8: [
    { id: 1, name: 'Valid simple', input: '()', expectedOutput: 'True', isHidden: false },
    { id: 2, name: 'Valid mixed', input: '()[]{} ', expectedOutput: 'True', isHidden: false },
    { id: 3, name: 'Invalid', input: '(]', expectedOutput: 'False', isHidden: false },
    { id: 4, name: 'Nested valid', input: '{[]}', expectedOutput: 'True', isHidden: true },
    { id: 5, name: 'Wrong order', input: '([)]', expectedOutput: 'False', isHidden: true },
  ],
  q9: [
    { id: 1, name: 'Classic', input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6', isHidden: false },
    { id: 2, name: 'All negative', input: '[-1,-2,-3]', expectedOutput: '-1', isHidden: false },
    { id: 3, name: 'Single', input: '[1]', expectedOutput: '1', isHidden: false },
    { id: 4, name: 'All positive', input: '[1,2,3,4]', expectedOutput: '10', isHidden: true },
    { id: 5, name: 'Mixed', input: '[-2,3,-1,4]', expectedOutput: '6', isHidden: true },
  ],
  q10: [
    { id: 1, name: 'Basic merge', input: '[1,3,5] [2,4,6]', expectedOutput: '[1, 2, 3, 4, 5, 6]', isHidden: false },
    { id: 2, name: 'One empty', input: '[1,2] []', expectedOutput: '[1, 2]', isHidden: false },
    { id: 3, name: 'Both empty', input: '[] []', expectedOutput: '[]', isHidden: false },
    { id: 4, name: 'Overlapping', input: '[1,3,5] [2,3,4]', expectedOutput: '[1, 2, 3, 3, 4, 5]', isHidden: true },
    { id: 5, name: 'Single elems', input: '[1] [2]', expectedOutput: '[1, 2]', isHidden: true },
  ],
  q11: [
    { id: 1, name: 'Classic', input: '[10,9,2,5,3,7,101,18]', expectedOutput: '4', isHidden: false },
    { id: 2, name: 'All same', input: '[7,7,7,7]', expectedOutput: '1', isHidden: false },
    { id: 3, name: 'Already sorted', input: '[0,1,0,3,2,3]', expectedOutput: '4', isHidden: false },
    { id: 4, name: 'Single', input: '[1]', expectedOutput: '1', isHidden: true },
    { id: 5, name: 'Descending', input: '[5,4,3,2,1]', expectedOutput: '1', isHidden: true },
  ],
  q12: [
    { id: 1, name: 'Found', input: '[-1,0,3,5,9,12] 9', expectedOutput: '4', isHidden: false },
    { id: 2, name: 'Not found', input: '[-1,0,3,5,9,12] 2', expectedOutput: '-1', isHidden: false },
    { id: 3, name: 'Single found', input: '[5] 5', expectedOutput: '0', isHidden: false },
    { id: 4, name: 'First elem', input: '[1,2,3,4,5] 1', expectedOutput: '0', isHidden: true },
    { id: 5, name: 'Last elem', input: '[1,2,3,4,5] 5', expectedOutput: '4', isHidden: true },
  ],
  q13: [
    { id: 1, name: 'Anagram', input: 'anagram nagaram', expectedOutput: 'True', isHidden: false },
    { id: 2, name: 'Not anagram', input: 'rat car', expectedOutput: 'False', isHidden: false },
    { id: 3, name: 'Case insensitive', input: 'Listen Silent', expectedOutput: 'True', isHidden: false },
    { id: 4, name: 'Same word', input: 'abc abc', expectedOutput: 'True', isHidden: true },
    { id: 5, name: 'Different lengths', input: 'ab c', expectedOutput: 'False', isHidden: true },
  ],
  q14: [
    { id: 1, name: 'Power of 2', input: '1', expectedOutput: 'True', isHidden: false },
    { id: 2, name: 'Not power', input: '3', expectedOutput: 'False', isHidden: false },
    { id: 3, name: 'Large power', input: '16', expectedOutput: 'True', isHidden: false },
    { id: 4, name: 'Zero', input: '0', expectedOutput: 'False', isHidden: true },
    { id: 5, name: 'Negative', input: '-4', expectedOutput: 'False', isHidden: true },
  ],
  q15: [
    { id: 1, name: 'Basic nested', input: '[1,[2,3],[4,[5,6]]]', expectedOutput: '[1, 2, 3, 4, 5, 6]', isHidden: false },
    { id: 2, name: 'Deep nested', input: '[[1,[2]],[3,[4,[5]]]]', expectedOutput: '[1, 2, 3, 4, 5]', isHidden: false },
    { id: 3, name: 'Flat already', input: '[1,2,3]', expectedOutput: '[1, 2, 3]', isHidden: false },
    { id: 4, name: 'Single nested', input: '[[1]]', expectedOutput: '[1]', isHidden: true },
    { id: 5, name: 'Mixed depth', input: '[1,[2,[3,[4]]]]', expectedOutput: '[1, 2, 3, 4]', isHidden: true },
  ],
}

const FALLBACK_TEST_CASES = [
  { id: 1, name: 'Test 1', input: '[]', expectedOutput: '0', isHidden: false },
]

export const useTestCases = (questId) => {
  const [testCases, setTestCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!questId) {
      setTestCases([])
      setLoading(false)
      return
    }

    // Load local test cases immediately
    const localCases = QUEST_TEST_CASES[questId] || FALLBACK_TEST_CASES
    setTestCases(localCases)
    setLoading(false)

    // Then try Firestore (will override if data exists there)
    const fetchTestCases = async () => {
      try {
        const questDoc = await getDoc(doc(db, 'quests', questId))
        if (questDoc.exists()) {
          const questData = questDoc.data()
          if (questData.testCases && questData.testCases.length > 0) {
            setTestCases(questData.testCases)
          }
        }
      } catch (err) {
        console.warn('Firestore unavailable, using local test cases:', err.message)
        setError(null)
      } finally {
        setLoading(false)
      }
    }

    fetchTestCases()
  }, [questId])

  return { testCases, loading, error }
}

export default useTestCases
