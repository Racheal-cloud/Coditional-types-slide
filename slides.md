---
# You can also start simply with 'default'
theme: seriph
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://cover.sli.dev
# some information about your slides (markdown enabled)
title: Learning Conditional Types
info: |
  ## Slidev Starter Template
  Learning Conditional Types in Typescript.

  Learn more at [Sli.dev](https://sli.dev)
# apply unocss classes to the current slide
class: text-center
# https://sli.dev/custom/highlighters.html
highlighter: shiki
# https://sli.dev/guide/drawing
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations#slide-transitions
transition: slide-left
# enable MDC Syntax: https://sli.dev/guide/syntax#mdc-syntax
mdc: true
---

# Learning Conditional Types in Typescript


<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Press Space for next page <carbon:arrow-right class="inline"/>
  </span>
</div>

<div class="abs-br m-6 flex gap-2">
  <button @click="$slidev.nav.openInEditor()" title="Open in Editor" class="text-xl slidev-icon-btn opacity-50 !border-none !hover:text-white">
    <carbon:edit />
  </button>
  <a href="https://github.com/Racheal-cloud/Coditional-types-slide" target="_blank" alt="GitHub" title="Open in GitHub"
    class="text-xl slidev-icon-btn opacity-50 !border-none !hover:text-white">
    <carbon-logo-github />
  </a>
</div>

<!--
The last comment block of each slide will be treated as slide notes. It will be visible and editable in Presenter Mode along with the slide. [Read more in the docs](https://sli.dev/guide/syntax.html#notes)
-->

---
transition: fade-out
---

# What is Conditional Types?

Conditional types bring conditional logic to the world of types. They allow you to define something like a function on types that takes a type as an input and based on some condition returns another type.
<br>
At the heart of most useful programs, we have to make decisions based on input. JavaScript programs are no different, but given the fact that values can be easily introspected, those decisions are also based on the types of the inputs. Conditional types help describe the relation between the types of inputs and outputs.

<br>
<br>

```ts
type IsString<T> = T extends string ? "Yes" : "No";
```

<!--
You can have `style` tag in markdown to override the style for the current page.
Learn more: https://sli.dev/guide/syntax#embedded-styles
-->

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Here is another comment.
-->

---
transition: slide-up
level: 2
---

# Table of contents

What we will learn:
<br>
1. Some Examples
<br>
2. Conditional Type Constraint
<br>
3. Inferring Within Conditional Types
<br>
4. Distributive Conditional Types
<br>


---
level: 2
---

# Some Examples

<!-- Powered by [shiki-magic-move](https://shiki-magic-move.netlify.app/), Slidev supports animations across multiple code snippets. -->

Conditional types take a form that looks a little like conditional expressions (condition ? trueExpression : falseExpression) in JavaScript:

````md magic-move {lines: true}
```ts {*|2|*}
// step 1
SomeType extends OtherType ? TrueType : FalseType;
```

```ts {*|1-2|3-4|3-4,8}
// step 2
interface IdLabel {
  id: number /* some fields */;
}
interface NameLabel {
  name: string /* other fields */;
}
 
function createLabel(id: number): IdLabel;
function createLabel(name: string): NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel {
  throw "unimplemented";
}

```

```ts
// step 3
type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel;

```

Non-code blocks are ignored.

```ts
// step 4
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw "unimplemented";
}
 
let a = createLabel("typescript");
   
let a: NameLabel
 
let b = createLabel(2.8);
   
let b: IdLabel
 
let c = createLabel(Math.random() ? "hello" : 42);
let c: NameLabel | IdLabel
```
````

---

# Conditional Type Constraints

Often, the checks in a conditional type will provide us with some new information. Just like narrowing with type guards can give us a more specific type, the true branch of a conditional type will further constrain generics by the type we check against.

For example, let’s take the following:

```ts

type MessageOf<T> = T["message"];
Type '"message"' cannot be used to index type 'T'.

```

---
class: px-20
---

# Conditional Type Constraint Contd

In this example, TypeScript errors because T isn’t known to have a property called message. We could constrain T, and TypeScript would no longer complain:

````md magic-move {lines: true}
```ts {*|2|*}
// step 1

type MessageOf<T extends { message: unknown }> = T["message"];
 
interface Email {
  message: string;
}
 
type EmailMessageContents = MessageOf<Email>;
              
type EmailMessageContents = string

```
```ts {*|1-2|3-4|3-4,8}
// step 2

type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;
 
interface Email {
  message: string;
}
 
interface Dog {
  bark(): void;
}
 
type EmailMessageContents = MessageOf<Email>;
              
type EmailMessageContents = string
 
type DogMessageContents = MessageOf<Dog>;
             
type DogMessageContents = never;

```
````
---

# Another Example

As another example, we could also write a type called Flatten that flattens array types to their element types, but leaves them alone otherwise:
<br>
When Flatten is given an array type, it uses an indexed access with number to fetch out string[]’s element type. Otherwise, it just returns the type it was given.


```ts

type Flatten<T> = T extends any[] ? T[number] : T;
 
// Extracts out the element type.
type Str = Flatten<string[]>;
     
type Str = string
 
// Leaves the type alone.
type Num = Flatten<number>;
     
type Num = number

```
---
level: 2
---

# Inferring Within Conditional Types

We just found ourselves using conditional types to apply constraints and then extract out types. This ends up being such a common operation that conditional types make it easier.

Conditional types provide us with a way to infer from types we compare against in the true branch using the infer keyword. For example, we could have inferred the element type in Flatten instead of fetching it out “manually” with an indexed access type

```ts

type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;

```

---
level: 2
---

# Contd

Here, we used the infer keyword to declaratively introduce a new generic type variable named Item instead of specifying how to retrieve the element type of Type within the true branch. This frees us from having to think about how to dig through and probing apart the structure of the types we’re interested in.

We can write some useful helper type aliases using the infer keyword. For example, for simple cases, we can extract the return type out from function types:

```ts

type GetReturnType<Type> = Type extends (...args: never[]) => infer Return
  ? Return
  : never;
 
type Num = GetReturnType<() => number>;
     
type Num = number
 
type Str = GetReturnType<(x: string) => string>;
     
type Str = string
 
type Bools = GetReturnType<(a: boolean, b: boolean) => boolean[]>;
      
type Bools = boolean[]

```


---

# Contd

When inferring from a type with multiple call signatures (such as the type of an overloaded function), inferences are made from the last signature (which, presumably, is the most permissive catch-all case). It is not possible to perform overload resolution based on a list of argument types.

```ts
declare function stringOrNum(x: string): number;
declare function stringOrNum(x: number): string;
declare function stringOrNum(x: string | number): string | number;
 
type T1 = ReturnType<typeof stringOrNum>;
     
type T1 = string | number
```
---
foo: bar
dragPos:
  square: 691,32,167,_,-16
---

# Distributive Conditional Types

When conditional types act on a generic type, they become distributive when given a union type. For example, take the following:

```ts

type ToArray<Type> = Type extends any ? Type[] : never;

```

---

# Contd

If we plug a union type into ToArray, then the conditional type will be applied to each member of that union.
<br>
What happens here is that ToArray distributes on:
<br>
and maps over each member type of the union, to what is effectively:
<br>
which leaves us with:
<br>
Typically, distributivity is the desired behavior. To avoid that behavior, you can surround each side of the extends keyword with square brackets.

```ts
type ToArray<Type> = Type extends any ? Type[] : never;
 
type StrArrOrNumArr = ToArray<string | number>;
           
type StrArrOrNumArr = string[] | number[]

```
```ts
string | number;
```
```ts
ToArray<string> | ToArray<number>;
```
```ts
string[] | number[];
```
```ts
type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;
 
// 'ArrOfStrOrNum' is no longer a union.
type ArrOfStrOrNum = ToArrayNonDist<string | number>;
          
type ArrOfStrOrNum = (string | number)[]
```
---
layout: center
class: text-center
---

# Thank you


