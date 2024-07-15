// Define a basic conditional type
type IsString<T> = T extends string ? "Yes" : "No";

// Test the conditional type with different types
type Test1 = IsString<string>;  // "Yes"
type Test2 = IsString<number>;  // "No"
type Test3 = IsString<boolean>; // "No"

// Display the results
const test1Result: Test1 = "Yes";
const test2Result: Test2 = "No";
const test3Result: Test3 = "No";

console.log(`Is string: ${test1Result}`);
console.log(`Is number: ${test2Result}`);
console.log(`Is boolean: ${test3Result}`);


// Function examples
function exampleFunction1(): string {
    return "Hello, world!";
  }
  
function exampleFunction2(): number {
  return 42;
}
// inferring with conditional type
type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;

// Using ReturnType conditional type
type ExampleReturnType1 = ReturnType<typeof exampleFunction1>; // string
type ExampleReturnType2 = ReturnType<typeof exampleFunction2>; // number

// Display the return types
const exampleReturnType1: ExampleReturnType1 = "Hello, world!";
const exampleReturnType2: ExampleReturnType2 = 42;

console.log(`Return type of exampleFunction1: ${exampleReturnType1}`);
console.log(`Return type of exampleFunction2: ${exampleReturnType2}`);

// Conditional types with union types
type ToArray<T> = T extends any ? T[] : never;

type StringOrNumberArray = ToArray<string | number>; // string[] | number[]

const stringArray: StringOrNumberArray = ["one", "two", "three"];
const numberArray: StringOrNumberArray = [1, 2, 3];

console.log('String array:', stringArray);
console.log('Number array:', numberArray);