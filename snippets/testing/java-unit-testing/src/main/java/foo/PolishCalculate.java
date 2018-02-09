package foo;
import java.util.Stack;

class PolishCalculate {

  static public interface Item {
  }

  static public class NumericItem implements Item {
    public int _value;

    public NumericItem(int value) {
      _value = value;
    }
  }

  static public class OperatorItem implements Item {
    public char _value;

    public OperatorItem(char value) {
      _value = value;
    }
  }

  Item[] polish_;

  public PolishCalculate(Item[] polish) {
    polish_ = polish;
  }

  public int calculate() {
    Stack<Integer> stack = new Stack<Integer>();

    for (Item item : polish_) {
      calculate(stack, item);
    }

    return stack.pop();
  }

  void calculate(Stack<Integer> stack, Item item) {
    if (item instanceof OperatorItem) {
      int left = stack.pop();
      int right = stack.pop();

      switch (((OperatorItem) item)._value) {
      case '+':
        stack.push(left + right);
        break;
      case '-':
        stack.push(left - right);
        break;
      case '*':
        stack.push(left * right);
        break;
      case '/':
        stack.push(left / right);
        break;
      }
    }
    else {
      stack.push(((NumericItem)item)._value);
    }
  }
}
