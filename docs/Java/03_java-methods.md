---
sidebar_position: 3
---

## Syntax

```
    return-type methodName(dataType arg1, dataType arg2){
        ....
        .... // body of method
        ....
        return value;
    }
```

## Notes

* If it is not returning anything use ```void```
* In the method, if it's not returning anything you can skip return or use just ```return;```
* To call the method, use method name
* write methods in class definition block
* If return type is mentioned compulsorily it should return the value of type mentioned
* If return type is mentioned as void and returns something from method, it will return error

## Examples

Ex1:

```java
class Demo20{
    public static void main(String[] args) {
        System.out.println("main starts");
        int i = test();
        System.out.println("i= " + i);
        System.out.println("main ends");
    }
    
    static int test(){
        System.out.println("inside test method");
        return 100;
    }
}
```
output:
```
    main starts
    inside test method
    i= 100
    main ends
```

Ex2:

```java
class Demo21{
    public static void main(String[] args) {
        System.out.println("main starts");
        int i = 0;
        int j;
        j = test(i) + ++i + i++;

        System.out.println("i= " + i);
        System.out.println("j= " + j);
        System.out.println("main ends");
    }
    
    static int test(int a){
        System.out.println("a =" + a++);
        return ++a;
    }
}
```

