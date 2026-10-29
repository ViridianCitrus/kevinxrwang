import { render, act } from "@testing-library/react";
import TypingNotepad from "./TypingNotepad";

const content = (
  <>
    <div>ab</div>
    <hr />
    <ul>
      <li>cd</li>
      <li>ef</li>
    </ul>
  </>
);

const advance = (ticks) => {
  for (let i = 0; i < ticks; i++) {
    act(() => {
      jest.advanceTimersByTime(1);
    });
  }
};

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

test("elements appear only once typing reaches them", () => {
  const { container } = render(<TypingNotepad content={content} />);
  expect(container.querySelectorAll("li")).toHaveLength(0);
  expect(container.querySelector("hr")).toBeNull();

  advance(2);
  expect(container.textContent).toBe("ab");
  expect(container.querySelector("hr")).toBeNull();
  expect(container.querySelectorAll("li")).toHaveLength(0);

  advance(1);
  expect(container.querySelector("hr")).not.toBeNull();
  expect(container.querySelectorAll("li")).toHaveLength(1);

  advance(10);
  expect(container.textContent).toBe("abcdef");
  expect(container.querySelectorAll("li")).toHaveLength(2);
});
