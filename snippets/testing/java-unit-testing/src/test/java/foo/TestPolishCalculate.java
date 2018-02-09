package foo;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import foo.PolishCalculate;
import static foo.PolishCalculate.NumericItem;
import static foo.PolishCalculate.OperatorItem;
import static foo.PolishCalculate.Item;

class TestPolishCalculate {
  @Test
  void testReturnsTosIfOnlyNumbers() {
    int value = new PolishCalculate(new Item[] {new NumericItem(4), new NumericItem(5)}).calculate();

    assertEquals(5, value);
  }
  @Test
  void testSumCalculation() {
    int value = new PolishCalculate(new Item[] {new NumericItem(4), new NumericItem(5), new OperatorItem('+')}).calculate();

    assertEquals(9, value);
  }
}
