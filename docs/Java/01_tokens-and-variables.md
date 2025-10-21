---
sidebar_position: 1
---

The smallest individual entities in a java program are called tokens. They are classified as

   1. Reserved words (keywords)
   2. Identifiers (classes, methods, variables, objects, packages and interfaces)
   3. literals (values)
   4. Operators (+,-,++,--,etc)
   5. separators ({}, (), [])

## Variables
Variable is a named memory location which can hold value and the value can change
any no. of times during execution.
  1. the first character in a variable should not be a digit. It should start with a letter or $ or _.
  2. A variable name may consist of alphabets, digits, underscore and the dollar character.
  3. A keyword should not be used as a variable name.
  4. There should be no space in a variable name

```
legal:
int _a;
int $c;
int _4;
int a_very_long_variable_name;
```
```
Illegal:
int :a;
int -d;
int .f;
int 7g;
```
```
int i; //Declaration
i = 10; // Initialization

int i = 10; // both Declaration and Initialization
```
### Note:
1. Every statement should end with ;
2. If local variable is not initialized when using it, java throws error (local variable).
3. If you are not using the variable which is not initialized, it does not throw any error (local variable).
4. Whenever a variable is declared within a method, it is a local variable.
5. whenever a variable is declared outside a method and within class definition, it is a global variable/member;
6. global variables have default values, local variables should be initialized before using.
7. The Initialization can be done at the time of declaration or separately or at the time of usage.

   ```java
   class Demo3{
       public static void main(String[] args){
           int i; //declaration of local variable i
           i = 10; // local variable should be initialized before using in one single sentence
           System.out.println("Main starts");
           System.out.println(i);
           System.out.println("Main ends");
       }
   }
   ```

   ```
   Output:
   Main starts
   10
   Main ends
   ```
   ```java
   class Demo4{
       static int i; // global variable declared
   
       public static void main(String[] args){
           System.out.println("Main starts");
           System.out.println(i); 
           System.out.println("Main ends");
       }
   }
   ```
   ```
   Output:
   Main starts
   0
   Main ends
   ```
8. If the global variable has to be initialized, then it can be done at global level like example below

   example:
   static int i = 0; //correct
   static int i;
   i=10;//compile error
9. the global variables are initialized automatically by java compiler at the time of compilation if not initialized.
10. The default values for number data types i.e., int, long, float, double is 0(zero) where as String is null and char is ''(empty character)

There are two types of data types

1) Primitive data types
2) non-primitive data types (reference variables)

```java
class Demo5{

    static byte b;
    static short s;
    static int i;
    static long l;
    static float f;
    static double d;
    static char c;
    static boolean flag;

    public static void main(String[] args){
        System.out.println(b); 
        System.out.println(s); 
        System.out.println(i); 
        System.out.println(l); 
        System.out.println(f); 
        System.out.println(d); 
        System.out.println(c); 
        System.out.println(flag); 
    }
}
```
```
Output:
0
0
0
0
0.0
0.0

false
```

```java
class Demo6{

    static String str; // string  variable
	
    public static void main(String[] args){
            System.out.println(str); 
    }

}
```
```
Output:
null
```