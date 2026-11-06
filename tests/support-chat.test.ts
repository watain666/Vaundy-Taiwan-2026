// @vitest-environment jsdom
/* VAWS 交流區 chat window: the server is woken at idle, returning visitors get
   the board mounted behind the hidden panel, the board survives close/open, and
   reopening reloads only when the comment count grew or the earlier load failed. */
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const { init } = vi.hoisted(() => ({
  init: vi.fn((options: Record<string, unknown>) => ({ options, update: vi.fn(), destroy: vi.fn() }))
}));
vi.mock("@waline/client", () => ({ init }));
vi.mock("@waline/client/style", () => ({}));

const OPENED_KEY = "horo-support-chat-opened";
const WAKE_URL = "https://vaundy-waline.vercel.app/api/token";

let count = 5;
let idle: (() => void) | null = null;
const fetchMock = vi.fn((input: RequestInfo | URL) => {
  const url = String(input);
  const body = url.includes("type=count") ? { data: [count] } : {};
  return Promise.resolve({ ok: true, json: () => Promise.resolve(body) } as Response);
});

function urls() { return fetchMock.mock.calls.map(call => String(call[0])); }
function countCalls() { return urls().filter(url => url.includes("type=count")).length; }
async function flush() { for (let i = 0; i < 5; i++) await new Promise(resolve => setTimeout(resolve, 0)); }
async function load() { return (await import("../src/ui/support-chat.js")).syncSupportChat; }

function launcher() { return document.querySelector<HTMLButtonElement>(".support-chat-launcher")!; }
function closeButton() { return document.querySelector<HTMLButtonElement>(".support-chat-close")!; }
function panel() { return document.querySelector<HTMLElement>("#support-chat")!; }
function host() { return document.querySelector<HTMLElement>("[data-support-board]")!; }
/* The mocked client renders nothing; these stand in for Waline's list states. */
function renderList() {
  const cards = document.createElement("div");
  cards.className = "wl-cards";
  cards.innerHTML = '<div class="wl-card-item"></div>';
  host().replaceChildren(cards);
}
function renderState(className: string) {
  const el = document.createElement("div");
  el.className = className;
  host().replaceChildren(el);
}
async function openAndRender(sync: (visible: boolean) => void) {
  sync(true);
  launcher().click();
  await vi.waitFor(() => expect(init).toHaveBeenCalledTimes(1));
  renderList();
  await vi.waitFor(() => expect(countCalls()).toBe(1));
}

beforeEach(() => {
  vi.resetModules();
  init.mockClear();
  fetchMock.mockClear();
  count = 5;
  idle = null;
  localStorage.clear();
  document.body.replaceChildren();
  vi.stubGlobal("fetch", fetchMock);
  const requestIdle = (callback: IdleRequestCallback) => {
    idle = () => callback({ didTimeout: false, timeRemaining: () => 50 });
    return 1;
  };
  vi.stubGlobal("requestIdleCallback", requestIdle);
  window.requestIdleCallback = requestIdle as typeof window.requestIdleCallback;
  Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true });
});
afterEach(() => {
  // Close an open panel so its poll interval and keydown listener do not leak.
  if (panel() && !panel().hidden) closeButton().click();
  delete (navigator as { connection?: unknown }).connection;
  vi.unstubAllGlobals();
});

describe("support chat", () => {
  test("first visit: idle wakes the server without loading the list", async () => {
    const sync = await load();
    sync(true);
    expect(idle).not.toBeNull();
    idle!();
    await flush();
    expect(urls()).toContain(WAKE_URL);
    expect(countCalls()).toBe(0);
    expect(init).not.toHaveBeenCalled();
    expect(panel().hidden).toBe(true);
  });

  test("save-data: idle neither wakes the server nor loads the list", async () => {
    Object.defineProperty(navigator, "connection", { value: { saveData: true }, configurable: true });
    localStorage.setItem(OPENED_KEY, "1");
    const sync = await load();
    sync(true);
    idle!();
    await flush();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(init).not.toHaveBeenCalled();
    launcher().click();
    await vi.waitFor(() => expect(init).toHaveBeenCalledTimes(1));
  });

  test("returning visitor: idle mounts the board behind the hidden panel and opening shows it as is", async () => {
    localStorage.setItem(OPENED_KEY, "1");
    const sync = await load();
    sync(true);
    idle!();
    await vi.waitFor(() => expect(init).toHaveBeenCalledTimes(1));
    expect(init.mock.calls[0][0].el).toBe(host());
    expect(init.mock.calls[0][0].path).toBe("/support-goods");
    expect(panel().hidden).toBe(true);
    expect(urls()).not.toContain(WAKE_URL); // the list request itself wakes the server
    expect(countCalls()).toBe(0); // the baseline waits for the list, not racing it
    renderList();
    await vi.waitFor(() => expect(countCalls()).toBe(1));

    launcher().click();
    expect(panel().hidden).toBe(false);
    await flush();
    expect(init).toHaveBeenCalledTimes(1);
    expect(countCalls()).toBe(2); // opening polls once instead of reloading
  });

  test("an empty board still sets the poll baseline", async () => {
    const sync = await load();
    sync(true);
    launcher().click();
    await vi.waitFor(() => expect(init).toHaveBeenCalledTimes(1));
    renderState("wl-empty");
    await vi.waitFor(() => expect(countCalls()).toBe(1));
  });

  test("closing keeps the board; reopening reloads only when the count grew", async () => {
    const sync = await load();
    await openAndRender(sync);
    expect(localStorage.getItem(OPENED_KEY)).toBe("1");
    const first = init.mock.results[0].value;

    closeButton().click();
    expect(panel().hidden).toBe(true);
    expect(first.destroy).not.toHaveBeenCalled();
    launcher().click();
    await flush();
    expect(init).toHaveBeenCalledTimes(1);
    expect(countCalls()).toBe(2);

    closeButton().click();
    count = 7;
    launcher().click();
    await vi.waitFor(() => expect(init).toHaveBeenCalledTimes(2));
    expect(first.destroy).toHaveBeenCalledTimes(1);
    renderList();
    await vi.waitFor(() => expect(countCalls()).toBe(4)); // the new mount takes 7 as its baseline

    closeButton().click();
    launcher().click();
    await flush();
    expect(init).toHaveBeenCalledTimes(2); // 7 is no longer news
    expect(countCalls()).toBe(5);
  });

  test("a board whose list failed to load is reloaded on the next open", async () => {
    localStorage.setItem(OPENED_KEY, "1");
    const sync = await load();
    sync(true);
    idle!();
    await vi.waitFor(() => expect(init).toHaveBeenCalledTimes(1));
    renderState("wl-loading"); // still loading: opening waits rather than reloading
    launcher().click();
    await flush();
    expect(init).toHaveBeenCalledTimes(1);
    closeButton().click();
    renderState("wl-operation"); // Waline's retry button: the list request failed
    launcher().click();
    await vi.waitFor(() => expect(init).toHaveBeenCalledTimes(2));
  });

  test("a draft defers the reload until focus leaves the chat", async () => {
    const sync = await load();
    await openAndRender(sync);
    const editor = document.createElement("textarea");
    editor.className = "wl-editor";
    editor.value = "還沒送出的草稿";
    host().append(editor);

    closeButton().click();
    count = 9;
    launcher().click();
    await flush();
    expect(init).toHaveBeenCalledTimes(1); // new messages, but the draft stays put

    editor.value = "";
    panel().dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
    await vi.waitFor(() => expect(init).toHaveBeenCalledTimes(2));
  });

  test("Escape closes the panel and returns focus to the launcher", async () => {
    const sync = await load();
    await openAndRender(sync);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(panel().hidden).toBe(true);
    expect(launcher().hidden).toBe(false);
    expect(document.activeElement).toBe(launcher());
  });

  test("a song page hides the launcher but keeps the board for the way back", async () => {
    const sync = await load();
    await openAndRender(sync);
    sync(false);
    expect(launcher().hidden).toBe(true);
    expect(panel().hidden).toBe(true);
    sync(true);
    expect(launcher().hidden).toBe(false);
    launcher().click();
    await flush();
    expect(init).toHaveBeenCalledTimes(1);
    expect(panel().hidden).toBe(false);
  });
});
