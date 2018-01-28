import java.util.Stack;

class PolishCalculate {

  interface Item {}
  class NumericItem {
    public int _value;

    public NumericItem(int value) {
      _value = value;
    }
  }

  class OperatorItem {
    public char _value;

    public NumericItem(char value) {
      _value = value;
    }
  }

  Item[] polish;

  public PolishCalculate(Item[] polish) {
    polish_ = polish;
  }

  public calculate() {
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

      switch (((OperatorItem)item)._value) {
        case '+':
          stack.push(left + right);
          break;
      }
    }
  }
}
