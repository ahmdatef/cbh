# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here
1. Moved hashing responsibility to a separate function. To isolate the hashing responsibilty in a single function, and apply DRY.
2. Replaced `TRIVIAL_PARTITION_KEY` and it's conditions with default value passed to the function, so if the passed event is `null` or `undefined` it will be set to `{ partitionKey: "0" }`. This is easier to read and decreases the lines of code by around 3 lines.
3. Replaced the conditions on `event.partitionKey` by a one liner `let candidate = event.partitionKey || _hash(JSON.stringify(event))`. Again instead of having multiple condition that checks if the event is null and if the event.partitionKey is null, now the event condition is handled by the default value, and the event.paritionKey condition is handled at definition with the or operator.
4. Added `MAX_PARTITION_KEY_LENGTH`, and `HASH_ALGORITHM` environmental variables with default values. This should ease the testing more to be able to test cases like non-string with length when stringified greater than the MAX_PARTITION_KEY, makes the logic configurable, and cleaner since we are removing hard-coded values.
