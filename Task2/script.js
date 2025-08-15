(() => {
  
  const STORAGE_KEY = "vanilla_todos_v1";

  /** @type {{id:string,text:string,done:boolean}[]} */
  let todos = [];


  const form = document.getElementById("todo-form");
  const input = document.getElementById("todo-input");
  const list = document.getElementById("todo-list");
  const clearDoneBtn = document.getElementById("clear-done");
  const countAll = document.getElementById("count-all");
  const countActive = document.getElementById("count-active");
  const countDone = document.getElementById("count-done");


  const uid = () => Math.random().toString(36).slice(2, 9);

  const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  const load = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      todos = raw ? JSON.parse(raw) : [];
    } catch {
      todos = [];
    }
  };

  const counts = () => {
    const total = todos.length;
    const done = todos.filter(t => t.done).length;
    const active = total - done;
    countAll.textContent = total;
    countActive.textContent = active;
    countDone.textContent = done;
  };

  const renderItem = (t) => {
    const li = document.createElement("li");
    li.className = "todo-item" + (t.done ? " completed" : "");
    li.dataset.id = t.id;

    
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.className = "todo-check";
    cb.checked = t.done;
    cb.setAttribute("aria-label", `Mark "${t.text}" ${t.done ? "active" : "done"}`);

  
    const p = document.createElement("p");
    p.className = "todo-text";
    p.textContent = t.text;
    p.title = t.text;

    
    const del = document.createElement("button");
    del.className = "btn danger";
    del.type = "button";
    del.textContent = "Delete";
    del.setAttribute("aria-label", `Delete "${t.text}"`);

    li.append(cb, p, del);
    return li;
  };
  
  const render = () => {
    list.innerHTML = "";
    const frag = document.createDocumentFragment();
    todos.forEach(t => frag.appendChild(renderItem(t)));
    list.appendChild(frag);
    counts();
  };

  // --- Actions ---
  const addTodo = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    todos.unshift({ id: uid(), text: trimmed, done: false });
    save();
    render();
  };

  const toggleTodo = (id) => {
    const t = todos.find(x => x.id === id);
    if (!t) return;
    t.done = !t.done;
    save();
    // Update one node for snappy UI
    const li = list.querySelector(`li[data-id="${id}"]`);
    if (li) {
      li.classList.toggle("completed", t.done);
      const cb = li.querySelector("input[type='checkbox']");
      if (cb) cb.checked = t.done;
      counts();
    } else {
      render();
    }
  };

  const deleteTodo = (id) => {
    const idx = todos.findIndex(x => x.id === id);
    if (idx === -1) return;
    todos.splice(idx, 1);
    save();
    const li = list.querySelector(`li[data-id="${id}"]`);
    if (li) li.remove();
    counts();
  };

  const clearCompleted = () => {
    const hasDone = todos.some(t => t.done);
    if (!hasDone) return;
    todos = todos.filter(t => !t.done);
    save();
    render();
  };

  
  load();
  render();


  // Add
  form.addEventListener("submit", (e) => {
    e.preventDefault(); 
    addTodo(input.value);
    input.value = "";
    input.focus();
  });

  
  list.addEventListener("click", (e) => {
    const target = e.target;
    const li = target.closest("li.todo-item");
    if (!li) return;
    const id = li.dataset.id;

    if (target.matches("input[type='checkbox']")) {
      toggleTodo(id);
    } else if (target.matches(".btn.danger")) {
      deleteTodo(id);
    }
  });

  
  list.addEventListener("dblclick", (e) => {
    const text = e.target.closest(".todo-text");
    if (!text) return;
    const li = text.closest("li.todo-item");
    if (li) toggleTodo(li.dataset.id);
  });

  
  clearDoneBtn.addEventListener("click", clearCompleted);

  
  list.addEventListener("keydown", (e) => {
    if (e.key === "Delete") {
      const li = e.target.closest("li.todo-item");
      if (li) deleteTodo(li.dataset.id);
    }
  });
})();
