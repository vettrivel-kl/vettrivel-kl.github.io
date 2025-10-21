---
sidebar_position: 2
---

An Operator is a symbol that allows a program to perform certain operation (like arithmetic or logical)
on data and variables
```
1. Arithmetic (*, /, %, +, -, ++, --)
2. Assignment (=, +=, -=, *=, /=, %=)
3. Relational (==, !=, <, >, <=, >=)
4. Instance of (instance of)
5. Logical (&, &&, |, ||, ^, !)
6. Conditional (?:)
```

Depending on the no. of operands ,operator can be of the following three types

1. Unary Operator: It takes one operand, such as ++x, y--. Here x and y are variables, while  ++ and -- are operators.
2. Binary Operator: It takes two operands, such as x + y, x > y. Here x and y are while + and > are operators.
3. Ternary Operator: It takes three operands. z = x > y ? x : y. Here x, y and z are variables while ?: is an operator



### Arithmetic operators
```java
class Demo7{

    public static void main(String[] args){
        int i,j,k;
        i = 30;
        j = 20;
        
        k = i + j;
        System.out.println("Addition of i and j is " + k);

        k = i - j;
        System.out.println("Diff of i and j is " + k);

        k = i * j;
        System.out.println("Product of i and j is " + k);

        k = i / j;
        System.out.println("Division of i and j is " + k);
    }
}
```
```java
class Demo08{
public static void main(String[] args){
int num1 = 18;
int num2 = 4;
int quotient = num1 / num2;
int remainder = num1 % num2;

        System.out.println("num1 / num2 =  " + quotient);
        System.out.println("num1 % num2 =  " + remainder);
    }
}
```

### Assignment operators
The equal(=) symbol is known as the assignment operator. The assignment operator(=) is used to store or assign a value to a variable.

    Eg:
    x = 10; // x stores 10
    x = x + 10; // x stores 20
    x = x + 5 * 20; // x stores 120
    x = (x + 5) * 20; // x stores 2500

    In compound assignment operator we have +=, -=, *=, /= and %=

    Eg:
    i = 10 ; // i is initialized with the value 10
    i += 15; // i is compound assigned with 25 (i = i + 15)
    i -= 5; // i is compound assigned with 20 (i = i - 5)

```java
class Demo9{
    public static void main(String[] args){
        int i=2, j=3, k=4, l=25, m=7;

        i += 25;
        System.out.println(i);

        j *= 6;
        System.out.println(j);

        k /= 2;
        System.out.println(k);

        l -= 10;
        System.out.println(l);

        m %= 5;
        System.out.println(m);
    
    }
}
```

### Relational Operators
```
    operator                Description

    ==                  equal to
    !=                  not equal to
    <                   lesser than
    >                   greater than
    <=                  lesser than or equal to
    >=                  greater than or equal to
```
```java
class Demo10{
    public static void main(String[] args){
        int x = 5;
        int y = 8;
        int z = 10;
        boolean b1 = x >= y;
        boolean b2 = x >= y && z >=y;
        
        System.out.println("b1= " + b1 + " b2= " + b2);
    }
}
```
```java
class Demo11{
    static int i=10;
    static int j=20;

    public static void main(String[] args){
        if(i == j){
            System.out.println("the values " + i + "and " + j + "are equal");
        }
        if(i !=j){
            System.out.println("the values " + i + "and " + j + "are not equal");
        }
        if(i < j){
            System.out.println("the value " + i + " is lesser than " + j);
        }
        if(i > j){
            System.out.println("the value " + i + " is greater than " + j);
        }
    }
}
```
#### Object equality
The relational equality operator (==) and (!=) can also used to compare the reference of the two objects

obj1 == obj2 // means that ob1 and obj2 are equal and have same object reference




### instance of operator

The instance of a operator is a binary operator that checks whether an object is of a particular type(here, type can be class, interface or an array).
It is used for object reference variable only

```java
class Demo12{

    public static void main(String[] args){
        StringBuffer sb = new StringBuffer("Hello world");

        if(sb instanceof StringBuffer){
            System.out.println("sb is an instance of String buffer");
        }else{
            System.out.println("sb is not an instance of String Buffer");
        }
    }
}
```
### Logical operators
Logical operators are  && , ||, !, &, |.
The operators || and && evaluate only boolean values.
The not(!) operator returns the opposite of the current value of the boolean operand.


Conditional operators or ternary operand:
The conditional operator (?:) is a ternary operator that takes three operands. It works similar to if-else statement.

    ex: 
    int i=20, j=25;
    boolean test = false;
    test = i > j ? true : false;

program:
```java
class Demo14{ 
    public static void main(String[] args){
        int i = 20;
        int j = 25;

        boolean test = false;
        test = i > j ? true :false;
        System.out.println(test);
    }
}
```

### Unary Operators

1. ++   increment operator (post increment, pre increment)
2. --   decrement operator (post decrement, pre decrement)

```
    int x = 5;
    int j;
    j = x++;
    j = ++x;
```

```java
class  Demo15{ 
    public static void main(String[] args){
        System.out.println("Main starts");
        int i = 0;
        int j;
        j = i++; // j = i; i=i+1;
        System.out.println("i = " + i);
        System.out.println("j = " + j);
        System.out.println("Main ends");
    }
}
```
```java
class Demo16{
    public static void main(String[] args){
        System.out.println("Main starts");
        int i=0;
        int j=0;
        System.out.println("i = " + i++);
        System.out.println("i = " + i++);
        System.out.println("i = " + i);
        System.out.println("Main ends");
    }
}
```
```java
class Demo17{
    public static void main(String[] args){
        System.out.println("Main starts");
        int i=0;
        int j=0;
        j = i + i++ + i + i++;
        System.out.println("i = " + i);
        System.out.println("j = " + j);
        System.out.println("Main ends");
    }
}
```
```java
class Demo18{
    public static void main(String[] args){
        System.out.println("Main starts");
        int i = 0;
        int j = 0;
        j = ++i;
        System.out.println("i = " + i);
        System.out.println("j = " + j);
        System.out.println("Main ends");
    }
}
```
```java
class Demo19{
    public static void main(String[] args){
        System.out.println("Main starts");
        int i = 0;
        int j = 1;
        int k = i + j++ + ++i + ++j + i++;
        System.out.println("i = " + i);
        System.out.println("j = " + j);
        System.out.println("k = " + k);
        System.out.println("Main ends");
    }
}
```