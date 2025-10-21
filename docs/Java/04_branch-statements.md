---
sidebar_position: 4 

---

These Statements allow you to create programs where decisions are taken based on the expression
specified in the statements
1. ```if``` statement
2. ```if else``` statement
3. ```switch``` statement

## ```If``` statement
```if``` block is executed only when the ```if``` expression is true otherwise, the ```if``` 
block is skipped

### Examples
Ex1:

```java
class Demo22{
    public static void main(String[] args) {
        int age = 16;
        if(age < 18){
            System.out.println("not eligible to vote");
        }
    }
}
```

Ex2:
```java
class Demo23{
    public static void main(String[] args) {
        int age =16;
        if(age < 18){
            System.out.println("not eligible to vote");
        }
        age = age + 2;
        System.out.println("Age of the persion is " + age);
    }
}
```
```
Note: In the above case only the block code of if statement
is executed if the experession is true and the other 
statements get executed as usual
```
## ```if else```  statement

### Examples

```java
class Demo24{
    public static void main(String[] args) {
        int a =10, b =20;
        if(a > b){
            System.out.println("a is greater than b");
        }else {
            System.out.println("b is greater than a");
        }
    }
}
```

```java
class Demo27{
    public static void main(String[] args) {
        int a = 10, b=20, c=30;
        if(a > b && a > c){
            System.out.println("a is greater than b and c");
        }else if(b > a && b > c){
            System.out.println("b is greater than a and c");
        } else{
            System.out.println("c is greater than a and b");
        }
    }
}
```

### Notes
1. An ```if``` statement can be used without an ```else``` statement
2. Multiple ```if else``` statements can be used in a program
3. Once an ```if else``` statement causes an action in a program, then the remaining ```if else``` statements will be ignored

## ```switch``` case statement
The ```switch``` case statement is used to select an action from a given set of actions, based on a specified expression

### Syntax
```text
    switch(expression/variables){
        case value1 : statement1;
        case value2 : statement2;
        case value3 : statement3;
        default : default_statement;
    }   
```

the expression/variable in the above syntax can be any expression depicting a 
```char, byte, int or enum``` variable. the switch case also support some wrapper class like
integer, byte and short

### Example
```java
class Demo28{
    public static void main(String[] args) {
        char country='i';
        switch(country){
            case 'b' :
                System.out.println("Brasil");
                break;
            case 'n' :
                System.out.println("New Zealand");
                break;
            case 'i';
                System.out.println("India");
                break;
            default:
                System.out.println("Invalid");
        }
    }
}
```

## Usages of conditional statements
When can we use ```if else``` and ```switch``` case?
    ```if``` Statements are used to evaluate boolean expression. A ``switch`` statement allows
a variable to be tested for equality against a list of values. Each value is called as ```case```
and the variable being switched on is checked for each case
* When we use range of values, relational operators or logical operators then we use ``if else``.
* If we are using only values(list of values) then we go for ``switch`` case.